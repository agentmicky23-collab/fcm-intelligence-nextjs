import { createHmac, timingSafeEqual } from "node:crypto";
import { rpc } from "@/lib/server/supabase";
import { isAdmin } from "@/lib/server/admin";
import type { FactFindData, FactFindFile } from "@/lib/fact-find";
import { site } from "@/lib/site";

// The client's fact-find link is signed with ORDER_INGEST_KEY, like the report links, so it can't be guessed.
const key = () => process.env.ORDER_INGEST_KEY ?? "";

export const factFindToken = (orderId: string) => createHmac("sha256", key()).update(`factfind:${orderId}`).digest("base64url").slice(0, 32);

export function checkFactFindToken(orderId: string, token: string | null | undefined) {
  if (!key() || !token) return false;
  const want = Buffer.from(factFindToken(orderId));
  const got = Buffer.from(token);
  return got.length === want.length && timingSafeEqual(got, want);
}

export const factFindLink = (orderId: string) => new URL(`/fact-find/${encodeURIComponent(orderId)}?t=${factFindToken(orderId)}`, site.url).toString();

/** Mik (signed in) or the client holding the link. */
export async function factFindAccess(orderId: string, token: string | null | undefined): Promise<"mik" | "client" | null> {
  if (await isAdmin()) return "mik";
  return checkFactFindToken(orderId, token) ? "client" : null;
}

export type FactFind = {
  order: { id: string; status: string; report_tier: string; business_name: string | null; business_postcode: string | null; business_town: string | null; business_url: string | null; business_source: string | null; customer_name: string | null; customer_email: string | null; customer_phone: string | null };
  status: "draft" | "sent" | "submitted";
  data: FactFindData;
  files: FactFindFile[];
  upload_key: string;
  sent_at: string | null;
  submitted_at: string | null;
  submitted_by: string | null;
  updated_at: string;
};

async function call<T>(fn: string, args: Record<string, unknown>): Promise<T | null> {
  try {
    const res = await rpc(fn, { p_key: key(), ...args });
    if (!res.ok) {
      console.error(`fact find: ${fn} failed`, res.body.slice(0, 200));
      return null;
    }
    return JSON.parse(res.body || "null") as T;
  } catch (e) {
    console.error(`fact find: ${fn} failed`, e);
    return null;
  }
}

export const getFactFind = (orderId: string) => call<FactFind>("fact_find_get", { p_order_id: orderId });
export const saveFactFind = (orderId: string, data: FactFindData, submit: boolean, by: string) =>
  call<{ status: string; updated_at: string }>("fact_find_save", { p_order_id: orderId, p_data: data, p_submit: submit, p_by: by });
export const markFactFindSent = (orderId: string) => call<null>("fact_find_mark_sent", { p_order_id: orderId });
export const updateFactFindFiles = (orderId: string, file: FactFindFile | null, remove: string | null) =>
  call<FactFindFile[]>("fact_find_files", { p_order_id: orderId, p_file: file, p_remove: remove });
export const createAdminOrder = (order: Record<string, unknown>) => call<string>("admin_create_order", { p_order: order });

/** Where a fact-find file lives in storage (private bucket; the upload key is in the path). */
export const storagePath = (orderId: string, uploadKey: string, name: string) => `fact-finds/${orderId}/${uploadKey}/${name}`;
export const storageBase = () => `${process.env.SUPABASE_URL ?? "https://dykudrjpcliuyahjuiag.supabase.co"}/storage/v1/object/report-documents`;
export const publishableKey = () => process.env.SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_nuvi3t_j2k7XMv57L1YWhw_wAn1r-lu";

/** Cleans what the form sends: known shape, strings only, sensible lengths. */
export function cleanData(input: unknown): FactFindData | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const out: FactFindData = {};
  for (const [s, v] of Object.entries(input as Record<string, unknown>).slice(0, 20)) {
    if (!v || typeof v !== "object" || Array.isArray(v)) continue;
    out[s.slice(0, 40)] = Object.fromEntries(
      Object.entries(v as Record<string, unknown>)
        .slice(0, 40)
        .filter(([, x]) => typeof x === "string")
        .map(([k, x]) => [k.slice(0, 40), (x as string).slice(0, 4000)]),
    );
  }
  return out;
}
