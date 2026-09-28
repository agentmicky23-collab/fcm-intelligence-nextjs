import { randomBytes } from "node:crypto";
import type { JoinResult } from "@/lib/member";
import { situations } from "@/lib/member";
import { escapeHtml, sendEmail } from "@/lib/server/email";
import { emailPattern, oneLine, senderHash, text } from "@/lib/server/request";
import { rpc } from "@/lib/server/supabase";
import { site } from "@/lib/site";

// Free membership sign-up: saves the member as pending, then emails a link to confirm (double opt-in).
const reply = (body: JoinResult, status = 200) => Response.json(body, { status });

function confirmationEmail(name: string, link: string) {
  const first = name.split(" ")[0];
  const text = [
    `Hi ${first},`,
    "",
    "Thanks for joining FCM Intelligence. Please confirm your email address so I can send you the checklists and guides:",
    "",
    link,
    "",
    "If you didn't ask to join, ignore this email and you won't hear from me again.",
    "",
    `${site.owner}`,
    `${site.name}`,
  ].join("\n");
  const html = `<!doctype html><html><body style="margin:0;background:#f6f4f0;font-family:Helvetica,Arial,sans-serif;color:#16202e">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-top:4px solid #e0241b">
<tr><td style="padding:32px">
<p style="margin:0 0 16px;font-size:16px">Hi ${escapeHtml(first)},</p>
<p style="margin:0 0 24px;font-size:16px;line-height:1.6">Thanks for joining FCM Intelligence. Please confirm your email address so I can send you the checklists and guides.</p>
<p style="margin:0 0 24px"><a href="${escapeHtml(link)}" style="display:inline-block;background:#e0241b;color:#ffffff;text-decoration:none;font-weight:bold;padding:14px 24px">Confirm my email</a></p>
<p style="margin:0 0 24px;font-size:13px;line-height:1.6;color:#5b6475">If you didn't ask to join, ignore this email and you won't hear from me again.</p>
<p style="margin:0;font-size:15px">${escapeHtml(site.owner)}<br><span style="color:#5b6475">${escapeHtml(site.name)}</span></p>
</td></tr></table></td></tr></table></body></html>`;
  return { text, html };
}

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

  const token = randomBytes(32).toString("base64url");
  let status: string;
  try {
    const res = await rpc("join_member", {
      p_name: name,
      p_email: email,
      p_situation: situation || null,
      p_source_path: text(p.sourcePath, 300),
      p_ip_hash: senderHash(req),
      p_token: token,
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

  // Existing members and very recent sign-ups get the same answer, so the form can't be used to
  // find out who's on the list, and nobody gets flooded with confirmation emails.
  if (status !== "pending") return reply({ ok: true });

  const link = `${new URL(req.url).origin}/account/confirm?token=${token}`;
  const sent = await sendEmail({ to: email, subject: "Confirm your FCM Intelligence membership", ...confirmationEmail(name, link) });
  if (!sent) return reply({ ok: false, error: "unavailable" }, 502);
  return reply({ ok: true });
}
