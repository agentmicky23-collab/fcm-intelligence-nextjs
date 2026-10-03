import { sendEmail } from "@/lib/server/email";
import { brandedEmail, html, logoAttachment } from "@/lib/server/emails/layout";
import { adminEmail, adminEnabled, signInLink } from "@/lib/server/admin";
import { site } from "@/lib/site";

// Emails Mikesh a sign-in link for the control room. It only ever goes to his own address.
export async function POST() {
  const back = new URL("/admin?sent=1", site.url);
  if (!adminEnabled()) return Response.redirect(new URL("/admin?off=1", site.url), 303);
  const url = signInLink();
  const content = [
    html.kicker("Control room"),
    html.heading("Your sign-in link"),
    html.para("Open the control room with the button below. The link works for 20 minutes and keeps you signed in on this device for 30 days."),
    html.button("Open the control room", url),
    html.small("If you didn't ask for this, ignore it: nobody else can use the link without access to this inbox."),
  ].join("\n");
  await sendEmail({
    to: adminEmail(),
    subject: "Your FCM control room sign-in link",
    text: `Open the control room (link works for 20 minutes):\n${url}`,
    html: brandedEmail({ preheader: "Your sign-in link for the control room.", content, footer: "Sent because someone asked to sign in to the FCM control room." }),
    attachments: [logoAttachment],
  });
  return Response.redirect(back, 303);
}
