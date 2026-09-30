// A small Stripe client over the REST API (no SDK needed for the two calls this site makes).
import { createHmac, timingSafeEqual } from "node:crypto";

const api = process.env.STRIPE_API_BASE ?? "https://api.stripe.com/v1"; // overridable for local testing

/** Stripe takes form-encoded bodies with bracketed keys for nested values. */
function encode(value: unknown, prefix = "", out = new URLSearchParams()) {
  if (value === undefined || value === null) return out;
  if (Array.isArray(value)) value.forEach((v, i) => encode(v, `${prefix}[${i}]`, out));
  else if (typeof value === "object") for (const [k, v] of Object.entries(value)) encode(v, prefix ? `${prefix}[${k}]` : k, out);
  else out.append(prefix, String(value));
  return out;
}

async function call<T>(method: "GET" | "POST", path: string, body?: Record<string, unknown>): Promise<T> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  const res = await fetch(`${api}${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: body ? encode(body).toString() : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`stripe ${path}: ${res.status} ${json?.error?.message ?? ""}`);
  return json as T;
}

export type CheckoutSession = {
  id: string;
  url: string | null;
  status: string;
  payment_status: string;
  amount_subtotal: number | null;
  amount_total: number | null;
  total_details?: { amount_tax: number } | null;
  payment_intent: string | null;
  customer_details?: { email: string | null; name: string | null } | null;
  metadata: Record<string, string>;
};

export const createCheckoutSession = (params: Record<string, unknown>) => call<CheckoutSession>("POST", "/checkout/sessions", params);
export const getCheckoutSession = (id: string) => call<CheckoutSession>("GET", `/checkout/sessions/${encodeURIComponent(id)}`);

/** Checks a webhook's Stripe-Signature header. Returns the parsed event, or null if it doesn't verify. */
export function verifyWebhook(raw: string, header: string | null, secret: string, toleranceSeconds = 300) {
  if (!header) return null;
  const parts = header.split(",").map((p) => p.split("=") as [string, string]);
  const t = parts.find(([k]) => k === "t")?.[1];
  const sigs = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!t || !sigs.length) return null;
  if (Math.abs(Date.now() / 1000 - Number(t)) > toleranceSeconds) return null;
  const expected = createHmac("sha256", secret).update(`${t}.${raw}`).digest();
  const ok = sigs.some((s) => {
    const got = Buffer.from(s, "hex");
    return got.length === expected.length && timingSafeEqual(got, expected);
  });
  if (!ok) return null;
  try {
    return JSON.parse(raw) as { id: string; type: string; data: { object: CheckoutSession } };
  } catch {
    return null;
  }
}
