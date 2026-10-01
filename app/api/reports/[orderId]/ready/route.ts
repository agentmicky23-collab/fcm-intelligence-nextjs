import { sendEmail } from "@/lib/server/email";
import { logoAttachment } from "@/lib/server/emails/layout";
import { reportReviewEmail } from "@/lib/server/emails/report";
import { checkOpsKey, getReport, reportPath } from "@/lib/server/reports";
import { isOrderTier } from "@/lib/checkout";
import { normalise, str } from "@/lib/report-data";
import { site } from "@/lib/site";

// OpenClaw calls this when the agents have written a report to Supabase and it has passed Sentinel and Oracle.
// Mikesh gets an email with the private preview link and the Approve & send button.
const notifyTo = process.env.ENQUIRY_NOTIFY_TO ?? site.contactEmail;

export async function POST(req: Request, ctx: { params: Promise<{ orderId: string }> }) {
  if (!checkOpsKey(req.headers.get("authorization"))) return Response.json({ ok: false, error: "unauthorised" }, { status: 401 });
  const { orderId } = await ctx.params;
  const stored = await getReport(orderId);
  if (!stored) return Response.json({ ok: false, error: "no report in Supabase for this order" }, { status: 404 });

  const report = normalise(stored.report);
  const reviewUrl = new URL(reportPath(orderId, "review"), site.url).toString();
  const email = reportReviewEmail({
    orderId,
    business: str(report.meta.business_name) || str(report.order.business_name) || orderId,
    tier: isOrderTier(stored.tier) ? stored.tier : "insight",
    customer: [str(report.order.customer_name), stored.customer_email].filter(Boolean).join(", "),
    grade: str(report.meta.overall_grade),
    verdict: str(report.meta.overall_verdict),
    url: reviewUrl,
  });
  const sent = await sendEmail({ to: notifyTo, ...email, attachments: [logoAttachment] });
  return Response.json({ ok: sent, review_url: reviewUrl, status: stored.status }, { status: sent ? 200 : 502 });
}
