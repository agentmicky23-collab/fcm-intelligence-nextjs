import { sendEmail } from "@/lib/server/email";
import { logSiteEvent } from "@/lib/server/admin";
import { logoAttachment } from "@/lib/server/emails/layout";
import { reportReadyEmail } from "@/lib/server/emails/report";
import { checkToken, getReport, markDelivered, reportPath } from "@/lib/server/reports";
import { isOrderTier } from "@/lib/checkout";
import { normalise, str } from "@/lib/report-data";
import { site } from "@/lib/site";

// Mikesh presses "Approve & send" on a report preview: the customer is emailed their private link.
export async function POST(req: Request, ctx: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await ctx.params;
  const form = await req.formData().catch(() => null);
  const token = String(form?.get("review") ?? "");
  if (!checkToken(orderId, token, "review")) return new Response("Not allowed", { status: 403 });

  const back = new URL(reportPath(orderId, "review"), req.url);
  const stored = await getReport(orderId);
  if (!stored) return new Response("Report not found", { status: 404 });
  if (stored.status === "delivered") return Response.redirect(back, 303); // already sent; don't email twice

  const report = normalise(stored.report);
  const tier = isOrderTier(stored.tier) ? stored.tier : "insight";
  const email = reportReadyEmail({
    to: stored.customer_email,
    name: str(report.order.customer_name),
    business: str(report.meta.business_name) || str(report.order.business_name) || "the branch",
    tier,
    url: new URL(reportPath(orderId, "view"), site.url).toString(),
  });
  const sent = await sendEmail({ ...email, replyTo: site.contactEmail, attachments: [logoAttachment] });
  await logSiteEvent({ order_id: orderId, agent: "mik", stage: "delivered", kind: sent ? "done" : "error", message: sent ? "Mik approved: report emailed to the customer" : "Mik approved but the email to the customer failed" });
  if (!sent) return new Response("The email to the customer failed, so the report wasn't marked as sent. Please try again.", { status: 502 });

  await markDelivered(orderId, null);
  return Response.redirect(back, 303);
}
