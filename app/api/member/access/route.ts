import { sendEmail } from "@/lib/server/email";
import { libraryEmail } from "@/lib/server/emails/library";
import { logoAttachment } from "@/lib/server/emails/layout";
import { newToken } from "@/lib/server/member";
import { emailPattern, senderHash, text } from "@/lib/server/request";
import { rpc } from "@/lib/server/supabase";
import { site } from "@/lib/site";

// "Email me my library link". Always answers the same way, so it can't reveal who is a member.
export async function POST(req: Request) {
  let email = "";
  try {
    email = text(((await req.json()) as Record<string, unknown>).email, 200).toLowerCase();
  } catch {}
  if (!emailPattern.test(email)) return Response.json({ ok: false, error: "invalid" }, { status: 400 });

  const key = newToken();
  try {
    const res = await rpc("refresh_member_access", { p_email: email, p_access_token: key, p_ip_hash: senderHash(req) });
    if (!res.ok) {
      if (res.body.includes("rate_limited")) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
      console.error("member: access refresh failed", res.body.slice(0, 300));
      return Response.json({ ok: false, error: "unavailable" }, { status: 502 });
    }
    if (JSON.parse(res.body) === true) {
      const link = `${new URL(req.url).origin}/api/member/open?key=${key}`;
      await sendEmail({ to: email, replyTo: site.contactEmail, attachments: [logoAttachment], ...libraryEmail(null, link) });
    }
  } catch (err) {
    console.error("member: access refresh failed", err);
    return Response.json({ ok: false, error: "unavailable" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
