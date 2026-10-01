import { sendEmail } from "@/lib/server/email";
import { logoAttachment } from "@/lib/server/emails/layout";
import { pipelineAlertEmail } from "@/lib/server/emails/report";
import { reportPath, reportsEnabled, staleOrders } from "@/lib/server/reports";
import { site } from "@/lib/site";

// The backup check: runs daily at 12:00 UTC (see vercel.json), after OpenClaw's 07:00 run should be done.
// If any order hasn't been started, is stuck, failed, or is waiting on Mikesh, he gets one email listing them.
// Vercel sends CRON_SECRET as a bearer token; without it set, the check refuses to run.
const notifyTo = process.env.ENQUIRY_NOTIFY_TO ?? site.contactEmail;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Not allowed", { status: 401 });
  if (!reportsEnabled()) return Response.json({ ok: false, error: "ORDER_INGEST_KEY not set" }, { status: 503 });

  const orders = await staleOrders();
  if (!orders.length) return Response.json({ ok: true, alerts: 0 });

  const email = pipelineAlertEmail(
    orders.map((o) => ({
      id: o.id,
      business: [o.business_name, o.business_postcode].filter(Boolean).join(", "),
      tier: o.report_tier,
      hours: o.hours_since_paid,
      problem: o.problem,
      error: o.error_message ?? "",
      reviewUrl: o.problem === "awaiting_approval" ? new URL(reportPath(o.id, "review"), site.url).toString() : null,
    })),
  );
  const sent = await sendEmail({ to: notifyTo, ...email, attachments: [logoAttachment] });
  return Response.json({ ok: sent, alerts: orders.length }, { status: sent ? 200 : 502 });
}
