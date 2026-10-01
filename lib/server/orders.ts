import { haveOptions, isOrderTier } from "@/lib/checkout";
import { rpc } from "@/lib/server/supabase";
import type { CheckoutSession } from "@/lib/server/stripe";

// Paid report orders are saved to the Supabase orders table, where the OpenClaw report agents pick them up.
// The database only accepts them with ORDER_INGEST_KEY, so nobody else can add orders.
const key = () => process.env.ORDER_INGEST_KEY;
export const ordersEnabled = () => Boolean(key());

export type RecordedOrder = { id: string; created: boolean; notified: boolean };

/** Saves a paid checkout as an order. Safe to call again for the same session: it returns the existing order. */
export async function recordOrder(s: CheckoutSession): Promise<RecordedOrder> {
  const m = s.metadata ?? {};
  const order = {
    stripe_session_id: s.id,
    stripe_payment_intent: s.payment_intent ?? "",
    customer_email: s.customer_details?.email ?? "",
    customer_name: s.customer_details?.name || m.customer_name || "",
    customer_phone: m.customer_phone ?? "",
    business_name: m.business_name ?? "",
    business_postcode: m.postcode ?? "",
    business_town: m.town_city ?? "",
    business_source: m.listing_source ?? "",
    business_url: m.listing_url ?? "",
    report_tier: isOrderTier(m.tier) ? m.tier : "",
    report_price: Math.round((s.amount_subtotal ?? 0) / 100),
    customer_message: m.message ?? "",
    checkboxes: Object.fromEntries(haveOptions.map((h) => [h.key, m[h.key] === "true"])),
  };
  const res = await rpc("record_order", { p_key: key(), p_order: order });
  if (!res.ok) throw new Error(`record_order failed: ${res.body.slice(0, 200)}`);
  return JSON.parse(res.body) as RecordedOrder;
}

export async function markOrderNotified(id: string) {
  const res = await rpc("mark_order_notified", { p_key: key(), p_id: id });
  if (!res.ok) console.error("order: could not mark notified", id, res.body.slice(0, 200));
}
