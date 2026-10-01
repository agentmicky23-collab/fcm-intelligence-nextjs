import { createHmac, timingSafeEqual } from "node:crypto";
import { rpc } from "@/lib/server/supabase";
import type { StoredReport } from "@/lib/report-data";

// Finished reports live in the Supabase reports table, written there by the OpenClaw report agents.
// The site reads them with the same ORDER_INGEST_KEY that saves orders, and signs its report links with it.
const key = () => process.env.ORDER_INGEST_KEY ?? "";
export const reportsEnabled = () => Boolean(key());

/** "view" links go to the customer; "review" links let Mikesh preview, approve and send. */
export type Access = "view" | "review";

export function reportToken(orderId: string, access: Access) {
  return createHmac("sha256", key()).update(`report:${access}:${orderId}`).digest("base64url").slice(0, 32);
}

export function checkToken(orderId: string, token: string | undefined, access: Access) {
  if (!key() || !token) return false;
  const want = Buffer.from(reportToken(orderId, access));
  const got = Buffer.from(token);
  return got.length === want.length && timingSafeEqual(got, want);
}

export const reportPath = (orderId: string, access: Access) =>
  `/report/${encodeURIComponent(orderId)}?${access === "review" ? "review" : "t"}=${reportToken(orderId, access)}`;

export async function getReport(orderId: string): Promise<StoredReport | null> {
  const res = await rpc("get_report", { p_key: key(), p_order_id: orderId });
  if (!res.ok) throw new Error(`get_report failed: ${res.body.slice(0, 200)}`);
  const v = JSON.parse(res.body) as StoredReport | null;
  return v && v.report ? v : null;
}

export async function markDelivered(orderId: string, emailId: string | null) {
  const res = await rpc("mark_report_delivered", { p_key: key(), p_order_id: orderId, p_email_id: emailId });
  if (!res.ok) throw new Error(`mark_report_delivered failed: ${res.body.slice(0, 200)}`);
}

/** OpenClaw proves who it is with OPENCLAW_OPS_KEY: a value Mikesh chooses and sets both in Vercel and in OpenClaw. */
export function checkOpsKey(header: string | null) {
  const want = process.env.OPENCLAW_OPS_KEY ?? "";
  const got = (header ?? "").replace(/^Bearer\s+/i, "");
  return want.length >= 24 && got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}
