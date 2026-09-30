import { haveOptions, isOrderTier, orderLimits, orderTiers, type OrderResult } from "@/lib/checkout";
import { emailPattern, oneLine, text } from "@/lib/server/request";
import { createCheckoutSession } from "@/lib/server/stripe";

// Starts a Stripe Checkout for a report. VAT is added by Stripe Tax on its own line.
const reply = (body: OrderResult, status = 200) => Response.json(body, { status });
const haveKeys = new Set<string>(haveOptions.map((h) => h.key));

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) return reply({ ok: false, error: "not_enabled" }, 503);
  if (Number(req.headers.get("content-length") ?? 0) > 16_000) return reply({ ok: false, error: "invalid" }, 413);

  let p: Record<string, unknown>;
  try {
    p = (await req.json()) as Record<string, unknown>;
  } catch {
    return reply({ ok: false, error: "invalid" }, 400);
  }
  const line = (k: string, max = orderLimits.text) => oneLine(text(p[k], max));
  const report = p.report;
  const email = line("email").toLowerCase();
  const name = line("name");
  const business = line("business_name");
  const postcode = line("postcode").toUpperCase();
  let listing = line("listing_url", orderLimits.url);
  if (listing && !/^https?:\/\//i.test(listing)) listing = `https://${listing}`;
  if (!isOrderTier(report) || !name || !emailPattern.test(email) || !business || !postcode || p.terms !== true) {
    return reply({ ok: false, error: "invalid" }, 400);
  }
  if (text(p.company_url, 200)) return reply({ ok: false, error: "invalid" }, 400); // honeypot

  const have = Array.isArray(p.have) ? p.have.filter((h): h is string => typeof h === "string" && haveKeys.has(h)) : [];
  const tier = orderTiers[report];
  const metadata: Record<string, string> = {
    tier: report,
    customer_name: name,
    customer_phone: line("phone", 40),
    business_name: business,
    postcode,
    town_city: line("town"),
    listing_url: listing,
    listing_source: line("listing_source"),
    message: text(p.message, 480),
    ...Object.fromEntries([...haveKeys].map((k) => [k, String(have.includes(k))])),
    source: "fcmintelligence.com",
  };

  const origin = new URL(req.url).origin;
  try {
    const session = await createCheckoutSession({
      mode: "payment",
      line_items: [{ price: tier.priceId, quantity: 1 }],
      automatic_tax: { enabled: true },
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      customer_email: email,
      customer_creation: "always",
      invoice_creation: { enabled: true, invoice_data: { description: `${tier.name}: ${business}, ${postcode}`, metadata: { tier: report } } },
      metadata,
      payment_intent_data: { description: `${tier.name}: ${business}, ${postcode}`, metadata },
      success_url: `${origin}/reports/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/reports/order?report=${report}&cancelled=1`,
    });
    if (!session.url) return reply({ ok: false, error: "unavailable" }, 502);
    return reply({ ok: true, url: session.url });
  } catch (err) {
    console.error("checkout: could not start", err);
    return reply({ ok: false, error: "unavailable" }, 502);
  }
}
