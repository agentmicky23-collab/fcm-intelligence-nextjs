import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { rpc } from "@/lib/server/supabase";
import { site } from "@/lib/site";

// The control room (/admin) is for Mikesh only. He signs in from a link emailed to his own address;
// the link and the session cookie are signed with the site's ORDER_INGEST_KEY, so there's no password to leak.

const secret = () => process.env.ORDER_INGEST_KEY ?? "";
export const adminEnabled = () => secret().length >= 24;
export const adminEmail = () => process.env.ADMIN_EMAIL ?? process.env.ENQUIRY_NOTIFY_TO ?? site.contactEmail;

export const adminCookie = "fcm_admin";
const LINK_MINUTES = 20;
const SESSION_DAYS = 30;

const sign = (purpose: string, expires: number) => createHmac("sha256", secret()).update(`admin:${purpose}:${expires}`).digest("base64url");

function valid(purpose: string, expires: number, sig: string) {
  if (!adminEnabled() || !Number.isFinite(expires) || expires < Date.now() || !sig) return false;
  const want = Buffer.from(sign(purpose, expires));
  const got = Buffer.from(sig);
  return got.length === want.length && timingSafeEqual(got, want);
}

/** A one-time-style sign-in link, valid for 20 minutes. */
export function signInLink() {
  const e = Date.now() + LINK_MINUTES * 60_000;
  return new URL(`/api/admin/open?e=${e}&s=${sign("link", e)}`, site.url).toString();
}
export const checkLink = (e: string | null, s: string | null) => valid("link", Number(e), s ?? "");

/** The session cookie value and options, after a valid link. */
export function newSession() {
  const e = Date.now() + SESSION_DAYS * 86_400_000;
  return {
    value: `${e}.${sign("session", e)}`,
    options: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/", maxAge: SESSION_DAYS * 86_400 },
  };
}

export async function isAdmin() {
  const v = (await cookies()).get(adminCookie)?.value ?? "";
  const [e, s] = v.split(".");
  return valid("session", Number(e), s ?? "");
}

export type AdminOrder = {
  id: string;
  status: string;
  report_tier: string;
  business_name: string | null;
  business_postcode: string | null;
  business_town: string | null;
  customer_name: string | null;
  customer_email: string | null;
  error_message: string | null;
  timeline: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  delivered_at: string | null;
  report_status: string | null;
  report_updated_at: string | null;
  report_bytes: number | null;
  overall_score: number | null;
  overall_grade: string | null;
  overall_verdict: string | null;
  approval_summary: Record<string, unknown> | null;
};

export type PipelineEvent = {
  id: number;
  order_id: string;
  at: string;
  agent: string;
  stage: string | null;
  item: string | null;
  kind: string;
  round: number | null;
  message: string;
  detail: Record<string, unknown> | null;
};

async function call<T>(fn: string, args: Record<string, unknown>, fallback: T): Promise<T> {
  try {
    const res = await rpc(fn, { p_key: secret(), ...args });
    if (!res.ok) {
      console.error(`admin: ${fn} failed`, res.body.slice(0, 200));
      return fallback;
    }
    return (JSON.parse(res.body) as T) ?? fallback;
  } catch (e) {
    console.error(`admin: ${fn} failed`, e);
    return fallback;
  }
}

export const adminOrders = () => call<AdminOrder[]>("admin_orders", {}, []);
export const adminEvents = (orderId?: string, limit = 300) => call<PipelineEvent[]>("admin_events", { p_order_id: orderId ?? null, p_limit: limit }, []);

const agents = new Set(["runner", "scout", "sage", "sentinel", "oracle", "website", "mik"]);
const kinds = new Set(["start", "progress", "pass", "fail", "retry", "gap", "done", "error", "info", "waiting"]);

/** Checks and trims events sent by OpenClaw (or written by the site) before they're stored. */
export function cleanEvents(input: unknown): Record<string, unknown>[] | string {
  const list = Array.isArray(input) ? input : [input];
  if (!list.length || list.length > 200) return "send 1 to 200 events";
  const out: Record<string, unknown>[] = [];
  for (const [i, raw] of list.entries()) {
    if (!raw || typeof raw !== "object") return `event ${i}: not an object`;
    const e = raw as Record<string, unknown>;
    const order_id = typeof e.order_id === "string" ? e.order_id.trim() : "";
    if (!/^[\w-]{1,64}$/.test(order_id)) return `event ${i}: order_id missing or invalid`;
    if (!agents.has(String(e.agent))) return `event ${i}: agent must be one of ${[...agents].join(", ")}`;
    if (!kinds.has(String(e.kind))) return `event ${i}: kind must be one of ${[...kinds].join(", ")}`;
    if (typeof e.message !== "string" || !e.message.trim()) return `event ${i}: message is required`;
    out.push({
      order_id,
      agent: e.agent,
      kind: e.kind,
      message: e.message.slice(0, 600),
      ...(typeof e.stage === "string" && { stage: e.stage.slice(0, 40) }),
      ...(typeof e.item === "string" && { item: e.item.slice(0, 80) }),
      ...(Number.isInteger(e.round) && { round: e.round }),
      ...(typeof e.at === "string" && !Number.isNaN(Date.parse(e.at)) && { at: e.at }),
      ...(e.detail !== null && typeof e.detail === "object" && !Array.isArray(e.detail) ? { detail: e.detail as Record<string, unknown> } : {}),
    });
  }
  return out;
}

export async function logEvents(events: Record<string, unknown>[]) {
  return call<number>("log_pipeline_events", { p_events: events }, 0);
}

/** For the site's own steps (the automatic check, Mik's review email, approval). Never throws. */
export async function logSiteEvent(e: { order_id: string; agent: "website" | "mik"; stage: string; kind: string; message: string; detail?: Record<string, unknown> }) {
  try {
    await logEvents([e]);
  } catch {}
}

/** The time of this request (read once per page, outside render). */
export async function requestTime() {
  return Date.now();
}
