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
  requested: RequestedItem[];
  requested_at: string | null;
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
export const requestInfo = (orderId: string, items: RequestedItem[]) => call<null>("request_info", { p_order_id: orderId, p_items: items });
export const adminProceed = (orderId: string) => call<null>("admin_proceed", { p_order_id: orderId });
export const createAdminOrder = (order: Record<string, unknown>) => call<string>("admin_create_order", { p_order: order });

/** Where a fact-find file lives in storage (private bucket; the upload key is in the path). */
export const storagePath = (orderId: string, uploadKey: string, name: string) => `fact-finds/${orderId}/${uploadKey}/${name}`;
export const storageBase = () => `${process.env.SUPABASE_URL ?? "https://dykudrjpcliuyahjuiag.supabase.co"}/storage/v1/object/report-documents`;
export const publishableKey = () => process.env.SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_nuvi3t_j2k7XMv57L1YWhw_wAn1r-lu";

export type RequestedItem = { item: string; label: string; why?: string; section?: string };

/** Checks the list of missing items the agents send. */
export function cleanRequested(input: unknown): RequestedItem[] | null {
  if (!Array.isArray(input) || !input.length || input.length > 40) return null;
  const out: RequestedItem[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") return null;
    const r = raw as Record<string, unknown>;
    if (typeof r.label !== "string" || !r.label.trim()) return null;
    out.push({
      item: typeof r.item === "string" ? r.item.slice(0, 60) : "other",
      label: r.label.slice(0, 200),
      ...(typeof r.why === "string" && { why: r.why.slice(0, 400) }),
      ...(typeof r.section === "string" && { section: r.section.slice(0, 40) }),
    });
  }
  return out;
}

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

/** Days after a report is delivered that its fact find (answers and documents) is deleted. */
export const RETENTION_DAYS = 90;

/**
 * Deletes fact-find documents and answers for orders delivered more than RETENTION_DAYS ago.
 * The storage policy only lets the site delete files that have expired, so nothing newer can go.
 * Run daily by the cron. Returns what was deleted, by order.
 */
export async function purgeExpiredFactFinds() {
  const due = (await call<{ order_id: string; paths: string[] }[]>("expired_fact_finds", {})) ?? [];
  const done: { order: string; files: number; ok: boolean }[] = [];
  for (const d of due) {
    let ok = true;
    if (d.paths.length) {
      const res = await fetch(storageBase(), {
        method: "DELETE",
        headers: { apikey: publishableKey(), "Content-Type": "application/json" },
        body: JSON.stringify({ prefixes: d.paths }),
        cache: "no-store",
      }).catch(() => null);
      const deleted = res?.ok ? ((await res.json().catch(() => [])) as unknown[]).length : 0;
      ok = deleted === d.paths.length;
    }
    if (ok) ok = (await call<boolean>("fact_find_purge", { p_order_id: d.order_id })) !== null;
    done.push({ order: d.order_id, files: d.paths.length, ok });
  }
  return done;
}
