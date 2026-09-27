import Link from "next/link";
import { mailtoFallback } from "@/lib/enquiry";
import { site } from "@/lib/site";

/** Hidden from people, tempting to bots. Anything typed here marks the enquiry as spam. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this empty
        <input name="company_url" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

/** Shown in place of the form once an enquiry has gone through. */
export function EnquirySent({ reference, name, email, dark = false, onAnother }: {
  reference: string;
  name: string;
  email: string;
  dark?: boolean;
  onAnother?: () => void;
}) {
  return (
    <div role="status" className={dark ? "text-white" : "text-ink"}>
      <span aria-hidden className="block h-5 w-3 -skew-x-[18deg] bg-red" />
      <h3 className={`mt-5 font-display text-2xl font-bold tracking-[-0.02em] ${dark ? "text-white" : "text-navy"}`}>
        Thanks, {name.split(" ")[0]}. Your enquiry is with me.
      </h3>
      <p className={`mt-3 max-w-xl leading-relaxed ${dark ? "text-white/70" : "text-muted"}`}>
        I&apos;ll reply to <span className={dark ? "text-white" : "text-navy"}>{email}</span>. Your reference is{" "}
        <span className={`font-display font-semibold ${dark ? "text-white" : "text-navy"}`}>{reference}</span>.
      </p>
      {onAnother && (
        <button type="button" onClick={onAnother} className={`mt-6 text-sm font-semibold ${dark ? "text-red-light" : "text-red-dark"} hover:text-red`}>
          Send another enquiry
        </button>
      )}
    </div>
  );
}

const messages = {
  invalid: "Something in the form doesn't look right. Please check your name and email address.",
  rate_limited: "That's a lot of enquiries in a short time. Please wait a few minutes and try again.",
  unavailable: "Sorry, your enquiry didn't send. Please try again, or email it to me instead.",
};

/** The error line under a form, with a way to email the enquiry instead. */
export function EnquiryFailed({ error, subject, body, dark = false }: {
  error: keyof typeof messages;
  subject: string;
  body: string;
  dark?: boolean;
}) {
  return (
    <div role="alert" className={`border-l-[3px] border-red px-4 py-3 text-sm ${dark ? "bg-white/5 text-white/80" : "bg-red/5 text-ink"}`}>
      <p>{messages[error]}</p>
      {error === "unavailable" && (
        <a href={mailtoFallback(site.contactEmail, subject, body)} className={`mt-2 inline-block font-semibold ${dark ? "text-red-light" : "text-red-dark"} hover:text-red`}>
          Email it to me instead →
        </a>
      )}
    </div>
  );
}

/** The line under the send button. */
export function PrivacyNote({ dark = false }: { dark?: boolean }) {
  return (
    <p className={`text-xs ${dark ? "text-white/50" : "text-muted"}`}>
      I&apos;ll only use your details to reply to you. See the{" "}
      <Link href="/privacy" className="underline underline-offset-2 hover:text-red">privacy policy</Link>.
    </p>
  );
}
