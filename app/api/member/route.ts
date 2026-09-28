import type { JoinResult } from "@/lib/member";
import { situations } from "@/lib/member";
import { sendEmail } from "@/lib/server/email";
import { confirmationEmail } from "@/lib/server/emails/confirmation";
import { libraryEmail } from "@/lib/server/emails/library";
import { newToken } from "@/lib/server/member";
import { logoAttachment } from "@/lib/server/emails/layout";
import { emailPattern, oneLine, senderHash, text } from "@/lib/server/request";
import { rpc } from "@/lib/server/supabase";
import { site } from "@/lib/site";

// Free membership sign-up: saves the member as pending, then emails a link to confirm (double opt-in).
const reply = (body: JoinResult, status = 200) => Response.json(body, { status });

export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > 8_000) return reply({ ok: false, error: "invalid" }, 413);
  let p: Record<string, unknown>;
  try {
    p = await req.json();
  } catch {
    return reply({ ok: false, error: "invalid" }, 400);
  }

  const name = oneLine(text(p.name, 120));
  const email = text(p.email, 200).toLowerCase();
  const situation = text(p.situation, 80);
  if (!name || !emailPattern.test(email) || p.consent !== true) return reply({ ok: false, error: "invalid" }, 400);
  if (situation && !(situations as readonly string[]).includes(situation)) return reply({ ok: false, error: "invalid" }, 400);

  // Bots fill in the hidden field or submit instantly: tell them it worked and do nothing.
  const elapsed = typeof p.elapsedMs === "number" ? p.elapsedMs : 0;
  if (text(p.company_url, 200) !== "" || elapsed < 2000) return reply({ ok: true });

  const token = newToken();
  const accessToken = newToken();
  let status: string;
  try {
    const res = await rpc("join_member", {
      p_name: name,
      p_email: email,
      p_situation: situation || null,
      p_source_path: text(p.sourcePath, 300),
      p_ip_hash: senderHash(req),
      p_token: token,
      p_access_token: accessToken,
    });
    if (!res.ok) {
      if (res.body.includes("rate_limited")) return reply({ ok: false, error: "rate_limited" }, 429);
      console.error("member: join failed", res.body.slice(0, 300));
      return reply({ ok: false, error: "unavailable" }, 502);
    }
    status = JSON.parse(res.body) as string;
  } catch (err) {
    console.error("member: join failed", err);
    return reply({ ok: false, error: "unavailable" }, 502);
  }

  // A very recent sign-up gets the same answer and no email, so nobody gets flooded.
  if (status === "recent") return reply({ ok: true });

  // Someone who's already a member gets a fresh library link instead of a confirmation.
  const origin = new URL(req.url).origin;
  const message =
    status === "resend"
      ? libraryEmail(name, `${origin}/api/member/open?key=${accessToken}`)
      : confirmationEmail(name, `${origin}/api/member/confirm?token=${token}`);
  const sent = await sendEmail({ to: email, replyTo: site.contactEmail, attachments: [logoAttachment], ...message });
  if (!sent) return reply({ ok: false, error: "unavailable" }, 502);
  return reply({ ok: true });
}
