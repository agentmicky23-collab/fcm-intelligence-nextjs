import { escapeHtml, sendEmail } from "@/lib/server/email";
import { brandedEmail, html, logoAttachment } from "@/lib/server/emails/layout";
import { logSiteEvent } from "@/lib/server/admin";
import { cleanRequested, getFactFind, requestInfo } from "@/lib/server/fact-find";
import { checkOpsKey } from "@/lib/server/reports";
import { site } from "@/lib/site";

// OpenClaw calls this when a report can't be finished well without information only the client or seller has.
// The run pauses (status needs_info) instead of looping, and Mikesh sees exactly what's missing.
// POST { items: [{ item, label, why?, section? }] }
export async function POST(req: Request, ctx: { params: Promise<{ orderId: string }> }) {
  if (!checkOpsKey(req.headers.get("authorization"))) return Response.json({ ok: false, error: "unauthorised" }, { status: 401 });
  const { orderId } = await ctx.params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "body must be JSON" }, { status: 400 });
  }
  const items = cleanRequested(body.items);
  if (!items) return Response.json({ ok: false, error: "items must be 1 to 40 objects with a label" }, { status: 400 });
  const done = await requestInfo(orderId, items);
  if (done === null && !(await getFactFind(orderId))) return Response.json({ ok: false, error: "order not found" }, { status: 404 });
  await logSiteEvent({ order_id: orderId, agent: "website", stage: "review", kind: "waiting", message: `Paused: needs ${items.length} item${items.length === 1 ? "" : "s"} only the client or seller can provide`, detail: { items: items.map((i) => i.label) } });
  const ff = await getFactFind(orderId);
  const url = new URL(`/admin/orders/${orderId}`, site.url).toString();
  const business = ff?.order.business_name ?? orderId;
  await sendEmail({
    to: process.env.ENQUIRY_NOTIFY_TO ?? site.contactEmail,
    subject: `Report needs information: ${business}`,
    text: `The report on ${business} needs:\n${items.map((i) => `- ${i.label}`).join("\n")}\n\nOpen it: ${url}`,
    html: brandedEmail({
      preheader: `${items.length} item${items.length === 1 ? "" : "s"} needed to finish the report.`,
      content: [
        html.kicker("Needs information"),
        html.heading(`${business}: what's needed to finish`),
        html.para("The agents have done everything they can. To finish the report properly they need:"),
        html.list(items.map((i) => `${i.label}${i.why ? ` (${i.why})` : ""}`)),
        html.para("From the control room you can type it in or upload it, email the client for it, or finish the report without it."),
        html.button("Open in the control room", url),
      ].join("\n"),
      footer: `Order ${escapeHtml(orderId)}`,
    }),
    attachments: [logoAttachment],
  });
  return Response.json({ ok: true, status: "needs_info", items: items.length });
}
