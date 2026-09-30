import { sendEmail } from "@/lib/server/email";
import { logoAttachment } from "@/lib/server/emails/layout";
import { orderConfirmation, orderNotice } from "@/lib/server/emails/order";
import { verifyWebhook } from "@/lib/server/stripe";
import { site } from "@/lib/site";

// Stripe calls this when a report is paid for. Needs STRIPE_WEBHOOK_SECRET (the endpoint's signing secret).
// Orders live in Stripe; this emails Mikesh the details and sends the customer a confirmation.
const notifyTo = process.env.ENQUIRY_NOTIFY_TO ?? site.contactEmail;

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("not configured", { status: 503 });

  const raw = await req.text();
  const event = verifyWebhook(raw, req.headers.get("stripe-signature"), secret);
  if (!event) return new Response("bad signature", { status: 400 });

  const session = event.data.object;
  // Only report orders from this site; other checkouts on the account are left alone.
  if (event.type !== "checkout.session.completed" || session.metadata?.source !== "fcmintelligence.com") {
    return Response.json({ received: true, ignored: true });
  }
  if (session.payment_status !== "paid") return Response.json({ received: true, pending: true });

  const notice = orderNotice(session);
  const told = await sendEmail({ to: notifyTo, ...notice });
  const confirmation = orderConfirmation(session);
  const confirmed = confirmation.to ? await sendEmail({ ...confirmation, attachments: [logoAttachment] }) : false;
  if (!told) console.error("order: notice to Mikesh failed", session.id);
  if (!confirmed) console.error("order: confirmation to customer failed", session.id);

  // If neither email went, ask Stripe to try again later rather than lose the order.
  if (!told && !confirmed) return new Response("email failed", { status: 500 });
  return Response.json({ received: true });
}
