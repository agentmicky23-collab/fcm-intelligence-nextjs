"use client";

import { useState } from "react";
import { stages } from "@/lib/services";
import { site } from "@/lib/site";

const allServices = stages.flatMap((s) => s.services);

// Services quoted on the branches, counters and checks chosen, so the form asks for them up front.
const sizedServices = ["health-check"];
type BranchRow = { id: number; name: string; counters: string };

/** Until the enquiry system is built, the form opens the visitor's email app with everything filled in. */
export function ContactForm({ initialService }: { initialService?: string }) {
  const [service, setService] = useState(
    allServices.some((s) => s.slug === initialService) ? initialService! : "general",
  );

  const sized = sizedServices.includes(service);
  const [branches, setBranches] = useState<BranchRow[]>([{ id: 1, name: "", counters: "" }]);
  const sizes = branches.map((b, i) => ({ label: b.name.trim() || `Branch ${i + 1}`, counters: Math.max(0, Math.floor(Number(b.counters) || 0)) }));
  const checklist = allServices.find((x) => x.slug === service)?.includes ?? [];
  const update = (id: number, patch: Partial<BranchRow>) => setBranches((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const chosen = allServices.find((s) => s.slug === service)?.name ?? "General enquiry";
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone") || "-"}`,
      `Situation: ${data.get("situation")}`,
      ...(sized
        ? [
            "",
            `BRANCHES (${sizes.length})`,
            ...sizes.map((b) => `${b.label}: ${b.counters} counters`),
            `Total counters: ${sizes.reduce((a, b) => a + b.counters, 0)}`,
            "",
            "CHECKS WANTED",
            ...data.getAll("checks").map((c) => `- ${c}`),
          ]
        : []),
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
      {sized && (
        <fieldset className="border border-line bg-white p-5">
          <legend className="px-1 text-sm font-medium text-navy">Your branches</legend>
          <p className="text-xs text-muted">Add each branch and its number of counters, so the quote can show the cost for each one.</p>
          <div className="mt-4 space-y-3">
            {branches.map((b, i) => (
              <div key={b.id} className="grid grid-cols-[1fr_96px_auto] items-end gap-3 sm:grid-cols-[1fr_120px_auto]">
                <label className="block text-xs font-medium text-navy">
                  Branch {i + 1} <span className="font-normal text-muted">(name optional)</span>
                  <input value={b.name} onChange={(e) => update(b.id, { name: e.target.value })} className={field} />
                </label>
                <label className="block text-xs font-medium text-navy">
                  Counters
                  <input value={b.counters} onChange={(e) => update(b.id, { counters: e.target.value })} type="number" min={1} required inputMode="numeric" className={field} />
                </label>
                <button
                  type="button"
                  onClick={() => setBranches((rows) => rows.filter((r) => r.id !== b.id))}
                  disabled={branches.length === 1}
                  aria-label={`Remove branch ${i + 1}`}
                  className="mb-1 h-11 w-9 text-lg text-muted hover:text-red disabled:invisible"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setBranches((rows) => [...rows, { id: Math.max(...rows.map((r) => r.id)) + 1, name: "", counters: "" }])}
            className="mt-4 text-sm font-semibold text-red-dark hover:text-red"
          >
            + Add another branch
          </button>
          <p className="mt-4 border-t border-line pt-4 text-sm text-muted">
            {sizes.length} {sizes.length === 1 ? "branch" : "branches"}, {sizes.reduce((a, b) => a + b.counters, 0)} counters in total
          </p>
        </fieldset>
      )}
      {sized && (
        <fieldset className="border border-line bg-white p-5">
          <legend className="px-1 text-sm font-medium text-navy">Which checks do you want?</legend>
          <p className="text-xs text-muted">Tick everything you&apos;d like included. Not sure? Leave them all ticked and we&apos;ll talk it through.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {checklist.map((c) => (
              <label key={c} className="flex cursor-pointer items-center gap-3 border border-line px-3 py-2.5 text-sm has-[:checked]:border-navy">
                <input type="checkbox" name="checks" value={c} defaultChecked className="h-4 w-4 accent-[var(--color-red)]" />
                {c}
              </label>
            ))}
          </div>
        </fieldset>
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
