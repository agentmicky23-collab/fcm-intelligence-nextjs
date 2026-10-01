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

const problems: Record<string, string> = {
  not_started: "Not started: OpenClaw hasn't picked it up",
  stuck: "Stuck part-way through the report",
  failed: "Failed: OpenClaw reported an error",
  awaiting_approval: "Finished: waiting for your approval",
};

/** The daily check's email to Mikesh when orders need attention. */
export function pipelineAlertEmail(orders: { id: string; business: string; tier: string; hours: number; problem: string; error: string; reviewUrl: string | null }[]) {
  const late = orders.filter((o) => o.problem !== "awaiting_approval");
  const rows = orders.map((o) =>
    [
      `${o.id} · ${o.business} (${o.tier}) · paid ${o.hours} hours ago`,
      problems[o.problem] ?? o.problem,
      o.error && `Error: ${o.error}`,
      o.reviewUrl && `Review and approve: ${o.reviewUrl}`,
    ].filter(Boolean).join("\n"),
  );
  const content = [
    html.kicker("Report pipeline check"),
    html.heading(late.length ? `${late.length} report order${late.length > 1 ? "s" : ""} need${late.length > 1 ? "" : "s"} attention` : "Reports waiting for your approval"),
    ...orders.map((o) =>
      html.note(
        `<strong>${escapeHtml(o.business)}</strong> (${escapeHtml(o.id)}, ${escapeHtml(o.tier)})<br>${escapeHtml(problems[o.problem] ?? o.problem)} · paid ${o.hours} hours ago` +
          (o.error ? `<br>Error: ${escapeHtml(o.error)}` : "") +
          (o.reviewUrl ? `<br><a href="${escapeHtml(o.reviewUrl)}">Review and approve</a>` : ""),
      ),
    ),
    late.length
      ? html.para("Reports are promised within 48 hours. If OpenClaw isn't running, restart it and tell it \"run orders now\". If it can't be fixed in time, ask Claude to make the report from the runbook in the vault (08-REPORT-AGENTS/runbooks/FCM-PIPELINE-v3.md).")
      : "",
  ].join("\n");
  const text = [late.length ? "Report orders need attention:" : "Reports waiting for your approval:", "", ...rows.map((r) => `${r}\n`)].join("\n");
  return {
    subject: late.length ? `Action needed: ${late.length} report order${late.length > 1 ? "s" : ""} behind` : `${orders.length} report${orders.length > 1 ? "s" : ""} waiting for your approval`,
    text,
    html: brandedEmail({ preheader: "The daily report pipeline check found orders that need you.", content, footer: "Sent by the daily report pipeline check on fcmintelligence.com." }),
  };
}
