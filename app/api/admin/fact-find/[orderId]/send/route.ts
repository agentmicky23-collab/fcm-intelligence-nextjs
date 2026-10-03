import { escapeHtml, sendEmail } from "@/lib/server/email";
import { brandedEmail, html, logoAttachment } from "@/lib/server/emails/layout";
import { isAdmin, logSiteEvent } from "@/lib/server/admin";
import { factFindLink, getFactFind, markFactFindSent } from "@/lib/server/fact-find";
import { site } from "@/lib/site";

// Emails the client their private fact-find link.
export async function POST(_req: Request, ctx: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await ctx.params;
  if (!(await isAdmin())) return new Response("Not allowed", { status: 403 });
  const ff = await getFactFind(orderId);
  const back = (q: string) => Response.redirect(new URL(`/admin/orders/${orderId}${ff?.order.status === "needs_info" ? "" : "/fact-find"}?${q}`, site.url), 303);
  const to = ff?.data.client?.email || ff?.order.customer_email;
  if (!ff || !to) return back("noemail=1");
  const first = (ff.data.client?.name || ff.order.customer_name || "").split(" ")[0] || "there";
  const business = ff.data.business?.name || ff.order.business_name || "the business";
  const url = factFindLink(orderId);
  const content = [
    html.kicker("Your FCM report"),
    html.heading(`A few questions about ${business}`),
    html.para(`Hi ${escapeHtml(first)}, to make your report as accurate as possible I need what you've been given by the seller or broker: the asking price, figures, staff and costs. It takes about 10 minutes, and you can upload any documents you have (accounts, Post Office statements, the lease, the sales pack).`),
    html.para("Leave blank anything you don't have. I never guess missing figures; the report will say what's still needed instead."),
    ...(ff.order.status === "needs_info" && ff.requested?.length
      ? [html.para("To finish your report, I still need:"), html.list(ff.requested.map((r) => r.label))]
      : []),
    html.button("Fill in the fact find", url),
    html.small("Your answers save as you go, so you can come back to it. The link is private to you."),
    html.signoff(),
  ].join("\n");
  const sent = await sendEmail({
    to,
    subject: `Your FCM report on ${business}: a few questions`,
    text: `Hi ${first},\n\nTo make your report on ${business} as accurate as possible, please fill in this short fact find (about 10 minutes, and you can upload documents):\n${url}${ff.order.status === "needs_info" && ff.requested?.length ? `\n\nStill needed to finish your report:\n${ff.requested.map((r) => `- ${r.label}`).join("\n")}` : ""}\n\nMikesh`,
    html: brandedEmail({ preheader: "About 10 minutes, and you can upload documents.", content, footer: `You're getting this because you asked for a report from ${site.url.replace("https://", "")}.` }),
    replyTo: site.contactEmail,
    attachments: [logoAttachment],
  });
  if (!sent) return back("failed=1");
  await markFactFindSent(orderId);
  await logSiteEvent({ order_id: orderId, agent: "mik", stage: "claim", kind: "waiting", message: `Fact find emailed to the client (${to.replace(/(.).+(@.+)/, "$1…$2")})` });
  return back("sent=1");
}
