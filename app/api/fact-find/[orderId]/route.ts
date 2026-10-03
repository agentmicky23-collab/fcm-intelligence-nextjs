import { documentKinds, type FactFindFile } from "@/lib/fact-find";
import { logSiteEvent } from "@/lib/server/admin";
import { sendEmail } from "@/lib/server/email";
import { brandedEmail, html, logoAttachment } from "@/lib/server/emails/layout";
import { cleanData, factFindAccess, getFactFind, saveFactFind, storagePath, updateFactFindFiles } from "@/lib/server/fact-find";
import { site } from "@/lib/site";

// Saves the fact find as it's filled in (by Mik on a call, or by the client from their link),
// records uploaded documents, and on submit puts the order in the queue for the next run.
export async function POST(req: Request, ctx: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await ctx.params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad request" }, { status: 400 });
  }
  const who = await factFindAccess(orderId, typeof body.t === "string" ? body.t : null);
  if (!who) return Response.json({ ok: false, error: "not allowed" }, { status: 403 });
  const ff = await getFactFind(orderId);
  if (!ff) return Response.json({ ok: false, error: "not found" }, { status: 404 });

  const action = String(body.action);
  if (action === "save" || action === "submit") {
    const data = cleanData(body.data);
    if (!data) return Response.json({ ok: false, error: "bad data" }, { status: 400 });
    if (who === "client" && ff.status === "submitted" && ff.order.status !== "needs_info" && action === "save") return Response.json({ ok: false, error: "already submitted" }, { status: 409 });
    const saved = await saveFactFind(orderId, data, action === "submit", who);
    if (!saved) return Response.json({ ok: false, error: "save failed" }, { status: 502 });
    if (action === "submit") {
      await logSiteEvent({ order_id: orderId, agent: who === "mik" ? "mik" : "website", stage: "claim", kind: "done", message: who === "mik" ? "Mik completed the fact find: order queued for the next run" : "The client submitted the fact find: order queued for the next run" });
      if (who === "client") {
        const url = new URL(`/admin/orders/${orderId}/fact-find`, site.url).toString();
        const content = [html.kicker("Fact find"), html.heading(`Fact find received: ${ff.order.business_name ?? orderId}`), html.para(`${ff.order.customer_name ?? "The client"} has submitted the fact find${ff.files.length ? ` with ${ff.files.length} document${ff.files.length === 1 ? "" : "s"}` : ""}. The order is queued for the next run.`), html.button("Open it", url)].join("\n");
        await sendEmail({ to: process.env.ENQUIRY_NOTIFY_TO ?? site.contactEmail, subject: `Fact find received: ${ff.order.business_name ?? orderId}`, text: `Fact find received for ${orderId}: ${url}`, html: brandedEmail({ preheader: "A client has submitted their fact find.", content, footer: "Sent by the FCM control room." }), attachments: [logoAttachment] });
      }
    }
    return Response.json({ ok: true, ...saved });
  }

  if (action === "add-file") {
    const f = (body.file ?? {}) as Record<string, unknown>;
    const name = typeof f.name === "string" ? f.name : "";
    if (!/^[\w.-]{1,160}$/.test(name)) return Response.json({ ok: false, error: "bad file name" }, { status: 400 });
    const file: FactFindFile = {
      name,
      size: Number(f.size) || 0,
      type: typeof f.type === "string" ? f.type.slice(0, 100) : "",
      kind: documentKinds.includes(String(f.kind)) ? String(f.kind) : "Other",
      by: who,
      uploaded_at: new Date().toISOString(),
      path: storagePath(orderId, ff.upload_key, name),
    };
    const files = await updateFactFindFiles(orderId, file, null);
    return files ? Response.json({ ok: true, files }) : Response.json({ ok: false, error: "save failed" }, { status: 502 });
  }

  if (action === "remove-file") {
    const files = await updateFactFindFiles(orderId, null, String(body.name ?? ""));
    return files ? Response.json({ ok: true, files }) : Response.json({ ok: false, error: "save failed" }, { status: 502 });
  }

  return Response.json({ ok: false, error: "unknown action" }, { status: 400 });
}
