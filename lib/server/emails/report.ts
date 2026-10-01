import { escapeHtml } from "@/lib/server/email";
import { brandedEmail, html } from "@/lib/server/emails/layout";
import type { Tier } from "@/lib/report";
import { site } from "@/lib/site";

const reportName = (tier: Tier) => (tier === "intelligence" ? "Intelligence Report" : "Insight Report");

/** To the customer once Mikesh has approved the report. */
export function reportReadyEmail(o: { to: string; name: string; business: string; tier: Tier; url: string }) {
  const first = o.name.split(" ")[0] || "there";
  const name = reportName(o.tier);
  const content = [
    html.kicker(name),
    html.heading(`Your report on ${o.business} is ready`),
    html.para(`Hi ${escapeHtml(first)}, your ${escapeHtml(name)} is finished and I've checked it. Open it with the button below. The link is private to you, so please don't share it.`),
    html.button("Open your report", o.url),
    html.small("You can save it as a PDF from the report page with the Print / Save PDF button."),
    html.note("If anything in the report raises a question, or the seller gives you new information, just reply to this email."),
    html.signoff(),
  ].join("\n");
  const text = [
    `Hi ${first},`,
    "",
    `Your ${name} on ${o.business} is ready. Open it here (the link is private to you):`,
    o.url,
    "",
    "If anything raises a question, just reply to this email.",
    "",
    "Mikesh",
  ].join("\n");
  return {
    to: o.to,
    subject: `Your ${name} on ${o.business} is ready`,
    text,
    html: brandedEmail({ preheader: `Your ${name} is ready to read.`, content, footer: `You're getting this because you ordered a report from ${site.url.replace("https://", "")}.` }),
  };
}

/** To Mikesh when the agents have finished a report and it's waiting for his approval. */
export function reportReviewEmail(o: { orderId: string; business: string; tier: Tier; customer: string; grade: string; verdict: string; url: string }) {
  const name = reportName(o.tier);
  const content = [
    html.kicker(`Ready for review · ${o.orderId}`),
    html.heading(`${o.business}`),
    html.para(`The ${escapeHtml(name)} for <strong>${escapeHtml(o.customer)}</strong> has passed the agents' checks${o.grade ? ` with an overall grade of <strong>${escapeHtml(o.grade)}</strong>` : ""}.${o.verdict ? ` Verdict: ${escapeHtml(o.verdict)}.` : ""}`),
    html.button("Review and approve", o.url),
    html.small("Nothing goes to the customer until you press Approve &amp; send on the report page."),
  ].join("\n");
  const text = [`${name} ready for review: ${o.business} (${o.orderId})`, `Customer: ${o.customer}`, o.grade && `Grade: ${o.grade}`, o.verdict && `Verdict: ${o.verdict}`, "", `Review and approve: ${o.url}`].filter((l) => l !== "").join("\n");
  return { subject: `Review: ${name}, ${o.business} (${o.orderId})`, text, html: brandedEmail({ preheader: `${o.business} is ready for your approval.`, content, footer: "Sent by the FCM Intelligence report pipeline." }) };
}
