import { createHash, randomInt } from "node:crypto";
import { limits, type EnquiryPayload, type EnquiryResult } from "@/lib/enquiry";
import { stages } from "@/lib/services";
import { site } from "@/lib/site";

// Enquiries are saved to Supabase (fcm-intelligence project, table public.enquiries), then emailed.
// The URL and publishable key are public by design: the key can only call submit_enquiry() and
// mark_enquiry_notified(); it can't read the table.
const supabaseUrl = process.env.SUPABASE_URL ?? "https://dykudrjpcliuyahjuiag.supabase.co";
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_nuvi3t_j2k7XMv57L1YWhw_wAn1r-lu";
const resendKey = process.env.RESEND_API_KEY;
const notifyTo = process.env.ENQUIRY_NOTIFY_TO ?? site.contactEmail;
const notifyFrom = process.env.ENQUIRY_FROM ?? "FCM Intelligence <reports@fcmreport.com>";

const services = new Set(stages.flatMap((s) => s.services.map((x) => x.slug)));
const kinds = new Set(["general", "service", "insurance-review"]);
const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const referenceAlphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

type Clean = Omit<EnquiryPayload, "company_url" | "elapsedMs"> & { suspect: boolean };

const reply = (body: EnquiryResult, status = 200) => Response.json(body, { status });
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();
const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function clean(input: unknown): Clean | null {
  if (!input || typeof input !== "object") return null;
  const p = input as Record<string, unknown>;
  const name = oneLine(text(p.name, limits.name));
  const email = text(p.email, limits.email).toLowerCase();
  const kind = text(p.kind, 40);
  const service = text(p.service, 120);
  if (!name || !emailPattern.test(email) || !kinds.has(kind)) return null;
  if (service && !services.has(service)) return null;

  const fields: Record<string, string> = {};
  if (p.fields && typeof p.fields === "object") {
    for (const [k, v] of Object.entries(p.fields as Record<string, unknown>).slice(0, limits.fieldCount)) {
      if (typeof v === "string" && v.trim()) fields[oneLine(k).slice(0, 60)] = oneLine(v).slice(0, limits.fieldValue);
    }
  }

  // Bots fill in the hidden field or submit instantly. Keep their enquiry, but don't email it.
  const elapsed = typeof p.elapsedMs === "number" ? p.elapsedMs : 0;
  const suspect = text(p.company_url, 200) !== "" || elapsed < 2500;

  return {
    kind: kind as Clean["kind"],
    service: service || undefined,
    subject: oneLine(text(p.subject, limits.subject)) || "General enquiry",
    name,
    email,
    phone: oneLine(text(p.phone, limits.phone)) || undefined,
    message: text(p.message, limits.message) || undefined,
    details: text(p.details, limits.details) || undefined,
    fields,
    sourcePath: text(p.sourcePath, 300),
    suspect,
  };
}

/** A daily-salted hash of the sender's IP, so repeat submissions can be limited without storing the IP. */
function senderHash(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.ENQUIRY_HASH_SALT ?? "fcm-enquiries";
  return createHash("sha256").update(`${ip}|${day}|${salt}`).digest("hex").slice(0, 32);
}

const newReference = () => Array.from({ length: 6 }, () => referenceAlphabet[randomInt(referenceAlphabet.length)]).join("");

async function rpc(fn: string, args: Record<string, unknown>) {
  const headers: Record<string, string> = { apikey: supabaseKey, "Content-Type": "application/json" };
  // Legacy anon keys are JWTs and go in Authorization too; new publishable keys don't.
  if (!supabaseKey.startsWith("sb_")) headers.Authorization = `Bearer ${supabaseKey}`;
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers,
    body: JSON.stringify(args),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  return { ok: res.ok, body: await res.text() };
}

/** Saves the enquiry. Returns its id, "rate_limited", or null if the database couldn't be reached. */
async function save(e: Clean, reference: string, ipHash: string): Promise<string | "rate_limited" | null> {
  const args = {
    p_reference: reference,
    p_kind: e.suspect ? "suspected-spam" : e.kind,
    p_service: e.service ?? null,
    p_name: e.name,
    p_email: e.email,
    p_phone: e.phone ?? null,
    p_message: e.message ?? null,
    p_details: e.details ?? null,
    p_fields: { subject: e.subject, ...e.fields },
    p_source_path: e.sourcePath,
    p_ip_hash: ipHash,
  };
  try {
    const res = await rpc("submit_enquiry", args);
    if (res.ok) return JSON.parse(res.body) as string;
    if (res.body.includes("rate_limited")) return "rate_limited";
    console.error("enquiry: save failed", reference, res.body.slice(0, 300));
  } catch (err) {
    console.error("enquiry: save failed", reference, err);
  }
  return null;
}

function emailBody(e: Clean, reference: string) {
  return [
    `New enquiry through ${site.url.replace("https://", "")}`,
    "",
    `Reference: ${reference}`,
    `About: ${e.subject}`,
    "",
    `Name: ${e.name}`,
    `Email: ${e.email}`,
    `Phone: ${e.phone ?? "-"}`,
    ...Object.entries(e.fields ?? {}).map(([k, v]) => `${k}: ${v}`),
    ...(e.message ? ["", "Message:", e.message] : []),
    ...(e.details ? ["", e.details] : []),
    "",
    `Sent from ${e.sourcePath || "the website"}. Reply to this email to answer ${e.name.split(" ")[0]} directly.`,
  ].join("\n");
}

/** Emails the enquiry to Mikesh. Returns whether it was accepted for delivery. */
async function notify(e: Clean, reference: string) {
  if (!resendKey) {
    console.error("enquiry: RESEND_API_KEY is not set, so no email was sent", reference);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: notifyFrom,
        to: [notifyTo],
        reply_to: e.email,
        subject: `Enquiry ${reference}: ${e.subject} from ${e.name}`,
        text: emailBody(e, reference),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("enquiry: email failed", reference, res.status, (await res.text()).slice(0, 300));
    return res.ok;
  } catch (err) {
    console.error("enquiry: email failed", reference, err);
    return false;
  }
}

export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > 64_000) return reply({ ok: false, error: "invalid" }, 413);

  let input: unknown;
  try {
    input = await req.json();
  } catch {
    return reply({ ok: false, error: "invalid" }, 400);
  }
  const e = clean(input);
  if (!e) return reply({ ok: false, error: "invalid" }, 400);

  const ipHash = senderHash(req);
  let reference = newReference();
  let saved = await save(e, reference, ipHash);
  if (saved === null) {
    // A clashing reference is the likeliest one-off failure; try once more with a new one.
    reference = newReference();
    saved = await save(e, reference, ipHash);
  }
  if (saved === "rate_limited") return reply({ ok: false, error: "rate_limited" }, 429);

  // Suspected bots get a normal-looking answer but no email.
  if (e.suspect) return reply({ ok: true, reference });

  const emailed = await notify(e, reference);
  if (saved && emailed) await rpc("mark_enquiry_notified", { p_id: saved }).catch(() => undefined);

  if (!saved && !emailed) return reply({ ok: false, error: "unavailable" }, 502);
  return reply({ ok: true, reference });
}
