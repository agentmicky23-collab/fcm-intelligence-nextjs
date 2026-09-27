"use client";

import { useState } from "react";
import { stages } from "@/lib/services";
import { site } from "@/lib/site";
import { HealthCheckQuote } from "@/components/HealthCheckQuote";

const allServices = stages.flatMap((s) => s.services);

// Services with a quote builder in the form.
const sizedServices = ["health-check"];

/** Until the enquiry system is built, the form opens the visitor's email app with everything filled in. */
export function ContactForm({ initialService }: { initialService?: string }) {
  const [service, setService] = useState(
    allServices.some((s) => s.slug === initialService) ? initialService! : "general",
  );

  const sized = sizedServices.includes(service);
  const training = service === "operator-training";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const chosen = allServices.find((s) => s.slug === service)?.name ?? "General enquiry";
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone") || "-"}`,
      `Situation: ${data.get("situation")}`,
      ...(sized ? ["", String(data.get("quote") ?? "")] : []),
      ...(training ? ["", `Training location: ${data.get("trainingLocation")}`, `Course length: ${data.get("trainingDays")}`] : []),
      "",
      String(data.get("message") ?? ""),
    ].join("\n");
    window.location.assign(`mailto:${site.contactEmail}?subject=${encodeURIComponent(`Enquiry: ${chosen}`)}&body=${encodeURIComponent(body)}`);
  }

  const field = "mt-2 block w-full border border-line bg-white px-4 py-3 text-ink focus:border-red focus:outline-none focus:ring-2 focus:ring-red/30";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
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
      <button
        type="submit"
        className="inline-flex min-h-11 items-center bg-red px-7 py-3 text-sm font-semibold text-white hover:bg-red-dark"
      >
        Send enquiry
      </button>
      <p className="text-xs text-muted">This opens your email app with your message ready to send.</p>
    </form>
  );
}
