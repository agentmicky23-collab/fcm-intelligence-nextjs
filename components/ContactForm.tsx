"use client";

import { useState } from "react";
import { EnquiryFailed, EnquirySent, Honeypot, PrivacyNote } from "@/components/EnquiryStatus";
import { HealthCheckQuote } from "@/components/HealthCheckQuote";
import { useEnquiry } from "@/components/useEnquiry";
import { stages } from "@/lib/services";

const allServices = stages.flatMap((s) => s.services);

// Services with a quote builder in the form.
const sizedServices = ["health-check"];

/** The main enquiry form. Enquiries are saved and emailed to Mikesh through /api/enquiry. */
export function ContactForm({ initialService }: { initialService?: string }) {
  const [service, setService] = useState(
    allServices.some((s) => s.slug === initialService) ? initialService! : "general",
  );

  const sized = sizedServices.includes(service);
  const training = service === "operator-training";

  const { state, send, reset } = useEnquiry();
  const [draft, setDraft] = useState({ subject: "", body: "" });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    const chosen = allServices.find((s) => s.slug === service)?.name ?? "General enquiry";
    const fields: Record<string, string> = { Situation: get("situation") };
    if (training) {
      fields["Training location"] = get("trainingLocation");
      fields["Course length"] = get("trainingDays");
    }
    const details = sized ? get("quote") : "";

    // The same enquiry as plain text, in case it has to be emailed by hand.
    setDraft({
      subject: `Enquiry: ${chosen}`,
      body: [
        `Name: ${get("name")}`,
        `Email: ${get("email")}`,
        `Phone: ${get("phone") || "-"}`,
        ...Object.entries(fields).map(([k, v]) => `${k}: ${v}`),
        ...(details ? ["", details] : []),
        "",
        get("message"),
      ].join("\n"),
    });

    void send({
      kind: service === "general" ? "general" : "service",
      service: service === "general" ? undefined : service,
      subject: chosen,
      name: get("name"),
      email: get("email"),
      phone: get("phone"),
      message: get("message"),
      details,
      fields,
      company_url: get("company_url"),
    });
  }

  if (state.status === "sent") return <EnquirySent {...state} onAnother={reset} />;

  const field = "mt-2 block w-full border border-line bg-white px-4 py-3 text-ink focus:border-red focus:outline-none focus:ring-2 focus:ring-red/30";

  return (
    <form onSubmit={onSubmit} className="relative space-y-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-navy">
          Name
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="block text-sm font-medium text-navy">
          Email
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-navy">
          Phone <span className="font-normal text-muted">(optional)</span>
          <input name="phone" type="tel" autoComplete="tel" className={field} />
        </label>
        <label className="block text-sm font-medium text-navy">
          Where are you now?
          <select name="situation" className={field} defaultValue="Researching">
            <option>Researching</option>
            <option>Actively looking to buy</option>
            <option>Found a branch</option>
            <option>New operator (1-2 branches)</option>
            <option>Established operator (3+ branches)</option>
            <option>Other</option>
          </select>
        </label>
      </div>
      <label className="block text-sm font-medium text-navy">
        What can I help with?
        <select value={service} onChange={(e) => setService(e.target.value)} className={field}>
          <option value="general">General enquiry</option>
          {stages.map((stage) => (
            <optgroup key={stage.id} label={stage.title}>
              {stage.services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      {sized && <HealthCheckQuote />}
      {training && (
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-navy">
            Where would you like the training?
            <select name="trainingLocation" required defaultValue="" className={field}>
              <option value="" disabled>Select…</option>
              <option>At one of your branches (£100 + VAT a day)</option>
              <option>At my branch (£200 + VAT a day, plus travel)</option>
              <option>Not sure yet</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-navy">
            How many days?
            <select name="trainingDays" required defaultValue="" className={field}>
              <option value="" disabled>Select…</option>
              {[1, 3, 5, 10].map((d) => (
                <option key={d} value={`${d} ${d === 1 ? "day" : "days"}`}>{d} {d === 1 ? "day" : "days"}</option>
              ))}
              <option value="not sure">Not sure yet</option>
            </select>
          </label>
        </div>
      )}
      <label className="block text-sm font-medium text-navy">
        Tell me a bit more
        <textarea name="message" rows={6} required className={field} />
      </label>
      {state.status === "failed" && <EnquiryFailed error={state.error} subject={draft.subject} body={draft.body} />}
      <button
        type="submit"
        disabled={state.status === "sending"}
        className="inline-flex min-h-11 items-center bg-red px-7 py-3 text-sm font-semibold text-white hover:bg-red-dark disabled:opacity-60"
      >
        {state.status === "sending" ? "Sending…" : "Send enquiry"}
      </button>
      <PrivacyNote />
    </form>
  );
}
