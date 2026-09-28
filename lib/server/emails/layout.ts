import { escapeHtml } from "@/lib/server/email";
import { logoPng, logoSize } from "@/lib/server/emails/logo";
import { site } from "@/lib/site";

// The site's look, rebuilt for email clients: tables and inline styles only.
const c = { night: "#081427", navy: "#0B1D3A", red: "#E0241B", light: "#F6F4F0", ink: "#16202E", muted: "#5B6475", line: "#E5E1D8" };
const font = "'Schibsted Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif";

/** The logo travels inside the email, so it shows even though the preview site is private. */
export const logoAttachment = { filename: "fcm-logo.png", content: logoPng, content_id: "fcm-logo", content_type: "image/png" };

export const html = {
  kicker: (label: string) =>
    `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="width:8px;height:14px;background:${c.red}"></td><td style="padding-left:10px;font:500 13px ${font};color:${c.muted}">${escapeHtml(label)}</td></tr></table>`,
  heading: (s: string) =>
    `<h1 style="margin:18px 0 0;font:700 28px/1.2 ${font};letter-spacing:-0.5px;color:${c.navy}">${escapeHtml(s)}</h1>`,
  para: (s: string) => `<p style="margin:16px 0 0;font:400 16px/1.65 ${font};color:${c.ink}">${s}</p>`,
  small: (s: string) => `<p style="margin:12px 0 0;font:400 13px/1.6 ${font};color:${c.muted}">${s}</p>`,
  button: (label: string, url: string) =>
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px"><tr><td style="background:${c.red}"><a href="${escapeHtml(url)}" style="display:inline-block;padding:16px 28px;font:700 15px ${font};color:#ffffff;text-decoration:none">${escapeHtml(label)}</a></td></tr></table>`,
  list: (items: string[]) =>
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:14px">${items
      .map(
        (i) =>
          `<tr><td valign="top" style="padding:7px 12px 0 0"><div style="width:6px;height:12px;background:${c.red}"></div></td><td style="padding:4px 0;font:400 15px/1.55 ${font};color:${c.ink}">${escapeHtml(i)}</td></tr>`,
      )
      .join("")}</table>`,
  subheading: (s: string) => `<p style="margin:32px 0 0;font:700 16px ${font};color:${c.navy}">${escapeHtml(s)}</p>`,
  rule: () => `<div style="margin:32px 0 0;border-top:1px solid ${c.line};font-size:0;line-height:0">&nbsp;</div>`,
  note: (s: string) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px"><tr><td style="border-left:3px solid ${c.red};background:${c.light};padding:18px 20px;font:400 15px/1.65 ${font};color:${c.ink}">${s}</td></tr></table>`,
  signoff: () =>
    `<p style="margin:28px 0 0;font:700 17px ${font};color:${c.navy}">Mikesh</p><p style="margin:2px 0 0;font:400 13px ${font};color:${c.muted}">${escapeHtml(site.owner)} · Operator of 43 Post Office branches</p>`,
};

/** Wraps email content in the FCM header and footer. */
export function brandedEmail({ preheader, content, footer }: { preheader: string; content: string; footer: string }) {
  return `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${escapeHtml(site.name)}</title></head>
<body style="margin:0;padding:0;background:${c.light}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${c.light}"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px">
  <tr><td style="background:${c.night};padding:26px 32px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><a href="${site.url}"><img src="cid:fcm-logo" width="${logoSize.width}" height="${logoSize.height}" alt="FCM Intelligence" style="display:block;border:0"></a></td>
      <td align="right" style="font:500 13px ${font};color:#c9ced8">${escapeHtml(site.owner)}</td>
    </tr></table>
  </td></tr>
  <tr><td style="font-size:0;line-height:0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:4px;background:${c.red}"></td><td style="width:34%;height:4px;background:${c.navy}"></td></tr></table></td></tr>
  <tr><td style="background:#ffffff;padding:36px 32px 40px">${content}</td></tr>
  <tr><td style="background:${c.night};padding:24px 32px;font:400 12px/1.6 ${font};color:#9aa3b2">${footer}<br><br>${escapeHtml(site.name)} · ${escapeHtml(site.company)}</td></tr>
</table>
</td></tr></table>
</body></html>`;
}
