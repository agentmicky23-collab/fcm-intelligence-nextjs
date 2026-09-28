// Sends email through Resend. Needs RESEND_API_KEY in the environment.
export const fromAddress = process.env.ENQUIRY_FROM ?? "FCM Intelligence <reports@fcmreport.com>";

export async function sendEmail(message: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  headers?: Record<string, string>;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("email: RESEND_API_KEY is not set, so nothing was sent:", message.subject);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromAddress,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        ...(message.html && { html: message.html }),
        ...(message.replyTo && { reply_to: message.replyTo }),
        ...(message.headers && { headers: message.headers }),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("email: send failed", res.status, (await res.text()).slice(0, 300));
    return res.ok;
  } catch (err) {
    console.error("email: send failed", err);
    return false;
  }
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
