import { isAdmin, logSiteEvent } from "@/lib/server/admin";
import { createAdminOrder } from "@/lib/server/fact-find";
import { site } from "@/lib/site";

// Mik starts a report from an address. The order waits for its fact find before the agents pick it up.
export async function POST(req: Request) {
  if (!(await isAdmin())) return new Response("Not allowed", { status: 403 });
  const f = await req.formData();
  const v = (k: string) => String(f.get(k) ?? "").trim().slice(0, 300);
  const order = {
    business_name: v("business_name"),
    business_postcode: v("business_postcode").toUpperCase(),
    business_town: v("business_town"),
    business_url: v("business_url"),
    business_source: v("business_source"),
    customer_name: v("customer_name"),
    customer_email: v("customer_email"),
    customer_phone: v("customer_phone"),
    report_tier: v("report_tier") === "intelligence" ? "intelligence" : "insight",
    report_price: v("report_price").replace(/[^\d]/g, ""),
    fact_find: {
      client: { name: v("customer_name"), email: v("customer_email"), phone: v("customer_phone") },
      business: { name: v("business_name"), address: [v("business_address"), v("business_town"), v("business_postcode").toUpperCase()].filter(Boolean).join(", "), listing_url: v("business_url") },
    },
  };
  if (!order.business_name || !order.business_postcode) return Response.redirect(new URL("/admin/new?missing=1", site.url), 303);
  const id = await createAdminOrder(order);
  if (!id) return Response.redirect(new URL("/admin/new?failed=1", site.url), 303);
  await logSiteEvent({ order_id: id, agent: "mik", stage: "claim", kind: "start", message: `New report started for ${order.business_name}: waiting for the fact find` });
  return Response.redirect(new URL(`/admin/orders/${id}/fact-find`, site.url), 303);
}
