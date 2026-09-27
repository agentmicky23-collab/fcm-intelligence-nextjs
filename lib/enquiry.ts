// What the enquiry forms send to /api/enquiry, and what they get back.

export type EnquiryKind = "general" | "service" | "insurance-review";

export type EnquiryPayload = {
  kind: EnquiryKind;
  service?: string; // service slug, when the enquiry is about one
  subject: string; // what it's about, e.g. "Branch Health Check"
  name: string;
  email: string;
  phone?: string;
  message?: string;
  details?: string; // plain-text breakdown: a quote, review answers
  fields?: Record<string, string>; // short structured answers, e.g. situation or renewal date
  sourcePath: string;
  company_url?: string; // honeypot: people never see it, bots fill it in
  elapsedMs: number; // time between the form appearing and being sent
};

export type EnquiryResult =
  | { ok: true; reference: string }
  | { ok: false; error: "invalid" | "rate_limited" | "unavailable" };

export const limits = {
  name: 120,
  email: 200,
  phone: 40,
  subject: 120,
  message: 5000,
  details: 20000,
  fieldCount: 40,
  fieldValue: 1000,
} as const;

/** The same enquiry as a pre-filled email, for when sending through the site fails. */
export function mailtoFallback(to: string, subject: string, body: string) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.slice(0, 1800))}`;
}
