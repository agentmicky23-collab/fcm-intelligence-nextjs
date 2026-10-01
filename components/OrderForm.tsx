"use client";

import Link from "next/link";
import { useState } from "react";
import { Honeypot } from "@/components/EnquiryStatus";
import { haveOptions, listingSources, orderTiers, type OrderResult, type OrderTier } from "@/lib/checkout";

const field = "mt-2 block w-full border border-line bg-white px-4 py-3 text-ink focus:border-red focus:outline-none focus:ring-2 focus:ring-red/30";
const label = "block text-sm font-medium text-navy";

/** Collects the branch details, then hands over to Stripe for payment. */
export function OrderForm({ initialTier, cancelled }: { initialTier: OrderTier; cancelled: boolean }) {
  const [tier, setTier] = useState<OrderTier>(initialTier);
  const [state, setState] = useState<"idle" | "sending" | "failed">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    setState("sending");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report: tier,
          name: get("name"),
          email: get("email"),
          phone: get("phone"),
          business_name: get("business_name"),
          postcode: get("postcode"),
          town: get("town"),
          listing_url: get("listing_url"),
          listing_source: get("listing_source"),
          message: get("message"),
          have: data.getAll("have").map(String),
          terms: data.get("terms") === "on",
          company_url: get("company_url"),
        }),
      });
      const body = (await res.json()) as OrderResult;
      if (body.ok) {
        window.location.assign(body.url);
        return;
      }
      setState("failed");
    } catch {
      setState("failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-6">
      <Honeypot />
      {cancelled && (
        <p className="border-l-[3px] border-red bg-light px-4 py-3 text-sm text-ink" role="status">
          Payment was cancelled, so nothing has been charged. Your details are below if you&apos;d like to try again.
        </p>
      )}
      <fieldset>
        <legend className={label}>Which report?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(Object.keys(orderTiers) as OrderTier[]).map((t) => (
            <label key={t} className={`flex cursor-pointer items-baseline justify-between gap-3 border px-4 py-3 ${tier === t ? "border-red bg-red/5" : "border-line bg-white"}`}>
              <span className="flex items-center gap-3">
                <input type="radio" name="report" value={t} checked={tier === t} onChange={() => setTier(t)} className="accent-red" />
                <span className="font-display font-semibold text-navy">{orderTiers[t].name}</span>
              </span>
              <span className="text-sm text-muted">{orderTiers[t].price} + VAT</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Branch or business name
          <input name="business_name" required maxLength={200} className={field} />
        </label>
        <label className={label}>
          Postcode
          <input name="postcode" required maxLength={10} autoComplete="off" className={`${field} uppercase`} />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Town <span className="font-normal text-muted">(optional)</span>
          <input name="town" maxLength={200} className={field} />
        </label>
        <label className={label}>
          Where did you find it?
          <select name="listing_source" defaultValue="" className={field}>
            <option value="">Select…</option>
            {listingSources.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <label className={label}>
        Link to the listing <span className="font-normal text-muted">(if there is one)</span>
        <input name="listing_url" type="text" inputMode="url" maxLength={500} placeholder="https://" className={field} />
      </label>

      <fieldset>
        <legend className={label}>
          What do you already have? <span className="font-normal text-muted">(tick any)</span>
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {haveOptions.map((h) => (
            <label key={h.key} className="flex items-center gap-3 text-[15px] text-ink">
              <input type="checkbox" name="have" value={h.key} className="h-4 w-4 accent-red" />
              {h.label}
            </label>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted">You don&apos;t need to send anything now. I&apos;ll ask for it by email once you&apos;ve ordered.</p>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Your name
          <input name="name" required autoComplete="name" maxLength={200} className={field} />
        </label>
        <label className={label}>
          Email
          <input name="email" type="email" required autoComplete="email" maxLength={200} className={field} />
        </label>
      </div>
      <label className={label}>
        Phone <span className="font-normal text-muted">(optional)</span>
        <input name="phone" type="tel" autoComplete="tel" maxLength={40} className={field} />
      </label>
      <label className={label}>
        Anything I should know? <span className="font-normal text-muted">(optional)</span>
        <textarea name="message" rows={4} maxLength={480} className={field} />
      </label>

      <label className="flex items-start gap-3 text-[15px] text-ink">
        <input type="checkbox" name="terms" required className="mt-1 h-4 w-4 accent-red" />
        <span>
          I agree to the{" "}
          <Link href="/terms#reports" className="font-medium text-red-dark underline underline-offset-4">terms</Link> and have read the{" "}
          <Link href="/privacy" className="font-medium text-red-dark underline underline-offset-4">privacy policy</Link>. I&apos;m buying
          this report for a business purpose, not as a private consumer. I understand work starts straight away and{" "}
          <strong>there are no refunds</strong>.
        </span>
      </label>

      {state === "failed" && (
        <p className="border-l-[3px] border-red bg-light px-4 py-3 text-sm text-ink" role="alert">
          Sorry, the payment page didn&apos;t open. Please try again, or{" "}
          <Link href={`/contact?service=${orderTiers[tier].service}`} className="font-medium text-red-dark underline underline-offset-4">send me the details instead</Link>{" "}
          and I&apos;ll send you a payment link.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex min-h-11 items-center bg-red px-7 py-3 text-sm font-semibold text-white hover:bg-red-dark disabled:opacity-60"
        >
          {state === "sending" ? "Opening secure payment…" : `Continue to payment · ${orderTiers[tier].price} + VAT`}
        </button>
        <p className="text-sm text-muted">VAT is added at checkout. Payment is taken on a secure checkout page.</p>
      </div>
    </form>
  );
}
