import { sendEmail } from "@/lib/server/email";
import { purgeExpiredFactFinds } from "@/lib/server/fact-find";
import { logoAttachment } from "@/lib/server/emails/layout";
import { pipelineAlertEmail } from "@/lib/server/emails/report";
import { reportPath, reportsEnabled, staleOrders } from "@/lib/server/reports";
import { site } from "@/lib/site";

// Daily at 12:00 UTC: deletes fact finds 90 days after delivery, then the backup check (see vercel.json), after OpenClaw's 07:00 run should be done.
// If any order hasn't been started, is stuck, failed, or is waiting on Mikesh, he gets one email listing them.
// Vercel sends CRON_SECRET as a bearer token; without it set, the check refuses to run.
const notifyTo = process.env.ENQUIRY_NOTIFY_TO ?? site.contactEmail;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Not allowed", { status: 401 });
  if (!reportsEnabled()) return Response.json({ ok: false, error: "ORDER_INGEST_KEY not set" }, { status: 503 });

  // Housekeeping first: fact finds (answers and documents) are deleted 90 days after delivery.
  const purged = await purgeExpiredFactFinds().catch((e) => {
    console.error("fact find purge failed", e);
    return [];
  });
  if (purged.some((p) => !p.ok)) console.error("fact find purge incomplete", purged.filter((p) => !p.ok));

  const orders = await staleOrders();
  if (!orders.length) return Response.json({ ok: true, alerts: 0, purged });

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
  return Response.json({ ok: sent, alerts: orders.length, purged }, { status: sent ? 200 : 502 });
}
