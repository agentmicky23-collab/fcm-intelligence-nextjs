import { escapeHtml } from "@/lib/server/email";
import { brandedEmail, html } from "@/lib/server/emails/layout";
import type { CheckoutSession } from "@/lib/server/stripe";
import { haveOptions, isOrderTier, orderTiers } from "@/lib/checkout";
import { site } from "@/lib/site";

const pounds = (pence: number | null | undefined) => `£${((pence ?? 0) / 100).toFixed(2)}`;

export function orderSummary(s: CheckoutSession) {
  const m = s.metadata ?? {};
  const tier = isOrderTier(m.tier) ? orderTiers[m.tier] : null;
  return {
    reportName: tier?.name ?? "Report",
    name: s.customer_details?.name || m.customer_name || "",
    email: s.customer_details?.email || "",
    business: m.business_name || "the branch",
    postcode: m.postcode || "",
    has: haveOptions.filter((h) => m[h.key] === "true").map((h) => h.label),
    m,
  };
}

/** The email to Mikesh for each paid order, with everything needed to start. */
export function orderNotice(s: CheckoutSession) {
  const o = orderSummary(s);
  const pi = s.payment_intent ?? "";
  const subject = `Paid order: ${o.reportName}, ${o.business} ${o.postcode} (${pounds(s.amount_total)})`;
  const text = [
    `A ${o.reportName} has been paid for on ${site.url.replace("https://", "")}.`,
    "",
    `Branch: ${o.business}`,
    `Postcode: ${o.postcode}`,
    `Town: ${o.m.town_city || "-"}`,
    `Listing: ${o.m.listing_url || "-"}`,
    `Found through: ${o.m.listing_source || "-"}`,
    `They have: ${o.has.length ? o.has.join(", ") : "nothing extra yet"}`,
    "",
    `Customer: ${o.name}`,
    `Email: ${o.email}`,
    `Phone: ${o.m.customer_phone || "-"}`,
    ...(o.m.message ? ["", "Their note:", o.m.message] : []),
    "",
    `Paid: ${pounds(s.amount_total)} (${pounds(s.amount_subtotal)} + ${pounds(s.total_details?.amount_tax)} VAT)`,
    `Stripe payment: https://dashboard.stripe.com/payments/${pi}`,
    "",
    `Reply to this email to write to ${o.name.split(" ")[0] || "the customer"} directly.`,
  ].join("\n");
  return { subject, text, replyTo: o.email };
}

/** The customer's confirmation. Stripe sends the receipt and VAT invoice separately. */
export function orderConfirmation(s: CheckoutSession) {
  const o = orderSummary(s);
  const first = o.name.split(" ")[0] || "there";
  const next = [
    "I start the research on the branch and the area around it.",
    o.reportName === "Intelligence Report"
      ? "If you have the accounts, the remuneration figure or staff details, reply to this email with them. They make the financial sections sharper."
      : "If you have anything from the seller, such as the asking price, reply with it and I'll use it.",
    "I'll email you the finished report, and you can reply with any questions about it.",
  ];
  const content = [
    html.kicker(o.reportName),
    html.heading(`Thanks, ${first}. I'm on it.`),
    html.para(`Your ${escapeHtml(o.reportName)} on <strong>${escapeHtml(o.business)}${o.postcode ? `, ${escapeHtml(o.postcode)}` : ""}</strong> is paid for. Your receipt and VAT invoice come separately from our payment provider.`),
    html.subheading("What happens next"),
    html.list(next),
    html.note("If anything about the branch changes, such as a new asking price or another viewing, just reply and tell me."),
    html.signoff(),
  ].join("\n");
  const footer = `You're getting this because you ordered a report from ${site.url.replace("https://", "")}.`;
  const text = [
    `Thanks, ${first}. I'm on it.`,
    "",
    `Your ${o.reportName} on ${o.business}${o.postcode ? `, ${o.postcode}` : ""} is paid for. Your receipt and VAT invoice come separately from our payment provider.`,
    "",
    "What happens next:",
    ...next.map((n) => `- ${n}`),
    "",
    "If anything about the branch changes, just reply and tell me.",
    "",
    "Mikesh",
  ].join("\n");
  return {
    to: o.email,
    subject: `Your ${o.reportName} on ${o.business}`,
    text,
    html: brandedEmail({ preheader: `Your ${o.reportName} is paid for. Here's what happens next.`, content, footer }),
  };
}
