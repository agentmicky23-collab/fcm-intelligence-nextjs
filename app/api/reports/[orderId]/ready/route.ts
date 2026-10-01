import { sendEmail } from "@/lib/server/email";
import { logoAttachment } from "@/lib/server/emails/layout";
import { reportReviewEmail } from "@/lib/server/emails/report";
import { checkOpsKey, getReport, reportPath } from "@/lib/server/reports";
import { isOrderTier } from "@/lib/checkout";
import { checkReport } from "@/lib/report-check";
import { normalise, rec, str, strs } from "@/lib/report-data";
import { site } from "@/lib/site";

// OpenClaw calls this when the agents have written a report to Supabase and it has passed Sentinel and Oracle.
// Mikesh gets an email with the private preview link and the Approve & send button.
// With ?notify=0 it only returns the preview link (for Oracle to review the live page) and sends nothing.
const notifyTo = process.env.ENQUIRY_NOTIFY_TO ?? site.contactEmail;

export async function POST(req: Request, ctx: { params: Promise<{ orderId: string }> }) {
  if (!checkOpsKey(req.headers.get("authorization"))) return Response.json({ ok: false, error: "unauthorised" }, { status: 401 });
  const { orderId } = await ctx.params;
  const stored = await getReport(orderId);
  if (!stored) return Response.json({ ok: false, error: "no report in Supabase for this order" }, { status: 404 });

  const report = normalise(stored.report);
  const tier = isOrderTier(stored.tier) ? stored.tier : "insight";
  const reviewUrl = new URL(reportPath(orderId, "review"), site.url).toString();
  const check = checkReport(stored.report, { orderId, tier });
  if (new URL(req.url).searchParams.get("notify") === "0") return Response.json({ ok: true, review_url: reviewUrl, status: stored.status, check });
  // Mikesh only hears about reports that pass every critical check.
  if (!check.ok) return Response.json({ ok: false, error: "report has critical issues; fix them and call /ready again", check }, { status: 409 });
  const email = reportReviewEmail({
    orderId,
    business: str(report.meta.business_name) || str(report.order.business_name) || orderId,
    tier,
    customer: [str(report.order.customer_name), stored.customer_email].filter(Boolean).join(", "),
    grade: str(report.meta.overall_grade),
    verdict: str(report.meta.overall_verdict),
    url: reviewUrl,
    warnings: check.warnings.map((w) => `${w.where}: ${w.problem}`),
    summary: approvalSummary(stored.report),
  });
  const sent = await sendEmail({ to: notifyTo, ...email, attachments: [logoAttachment] });
  return Response.json({ ok: sent, review_url: reviewUrl, status: stored.status }, { status: sent ? 200 : 502 });
}

/** The agents' notes for Mikesh, written into report_json.qa.approval_summary by Sentinel and Oracle. */
function approvalSummary(raw: Record<string, unknown>) {
  const a = rec(rec(raw.qa).approval_summary);
  return {
    dataGaps: strs(a.data_gaps),
    estimates: strs(a.estimates),
    needsJudgement: strs(a.needs_mik_judgement),
    pendingDocuments: strs(a.documents_pending),
    retries: str(a.retries_used),
  };
}
