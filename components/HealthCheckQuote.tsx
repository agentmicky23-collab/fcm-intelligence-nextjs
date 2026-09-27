"use client";

import { useState } from "react";
import { branchLines, checks, gbp, minimumMonths, perLabel, subscriptionDiscount, type BranchSize, type Frequency } from "@/lib/health-check";

type Row = { id: number; name: string; counters: string; staff: string };
const field = "mt-1.5 block w-full border border-line bg-white px-3 py-2.5 text-ink focus:border-red focus:outline-none focus:ring-2 focus:ring-red/30";
const whole = (v: string) => Math.max(0, Math.floor(Number(v) || 0));

/** Branch Health Check builder: branches, the checks wanted, and an estimate for each branch. */
export function HealthCheckQuote() {
  const [rows, setRows] = useState<Row[]>([{ id: 1, name: "", counters: "", staff: "" }]);
  const [picked, setPicked] = useState<string[]>(checks.map((c) => c.name));
  const [frequency, setFrequency] = useState<Frequency>("one-off");
  const off = `${subscriptionDiscount * 100}%`;
  const subscribed = frequency !== "one-off";

  const chosen = checks.filter((c) => picked.includes(c.name));
  const needsStaff = chosen.some((c) => c.per === "staff");
  const branches: BranchSize[] = rows.map((r, i) => ({ label: r.name.trim() || `Branch ${i + 1}`, counters: whole(r.counters), staff: whole(r.staff) }));
  const quote = branches.map((b) => {
    const lines = branchLines(b, chosen);
    return { branch: b, lines, subtotal: lines.reduce((a, l) => a + (l.cost ?? 0), 0) };
  });
  const total = quote.reduce((a, q) => a + q.subtotal, 0);
  const discounted = total * (1 - subscriptionDiscount);
  const separate = chosen.filter((c) => c.price === null);

  const update = (id: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const toggle = (name: string) => setPicked((p) => (p.includes(name) ? p.filter((x) => x !== name) : [...p, name]));

  // Plain-text version for the enquiry email.
  const summary = [
    "BRANCH HEALTH CHECK ESTIMATE",
    `Frequency: ${subscribed ? `monthly subscription (${off} off, ${minimumMonths}-month minimum term)` : "one-off"}`,
    ...quote.flatMap((q) => [
      "",
      `${q.branch.label} (${q.branch.counters} counters${needsStaff ? `, ${q.branch.staff} staff` : ""})`,
      ...q.lines.map((l) => `- ${l.check.name}: ${l.cost === null ? "quoted separately" : `${l.check.per !== "branch" ? `${l.qty} x ${gbp(l.check.price!)} = ` : ""}${gbp(l.cost)}`}`),
      `Branch subtotal: ${gbp(q.subtotal)}`,
    ]),
    "",
    subscribed
      ? `ESTIMATED TOTAL: monthly subscription, ${gbp(discounted)} + VAT per month (${gbp(total)} less ${off}), minimum ${minimumMonths} months`
      : `ESTIMATED TOTAL: one-off, ${gbp(total)} + VAT`,
    ...(separate.length ? [`Quoted separately: ${separate.map((c) => c.name).join(", ")}`] : []),
  ].join("\n");

  return (
    <>
      <fieldset className="border border-line bg-white p-5">
        <legend className="px-1 text-sm font-medium text-navy">1. Which checks do you want?</legend>
        <p className="text-xs text-muted">Untick anything you don&apos;t need. Prices are plus VAT.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {checks.map((c) => (
            <label key={c.name} className="flex cursor-pointer items-start gap-3 border border-line px-3 py-2.5 text-sm has-[:checked]:border-navy">
              <input type="checkbox" checked={picked.includes(c.name)} onChange={() => toggle(c.name)} className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-red)]" />
              <span>
                <span className="block text-ink">{c.name}</span>
                <span className="block text-xs text-muted">{perLabel(c)}{c.note ? ` · ${c.note}` : ""}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border border-line bg-white p-5">
        <legend className="px-1 text-sm font-medium text-navy">2. Your branches</legend>
        <p className="text-xs text-muted">One row per branch, so the estimate shows the cost for each.</p>
        <div className="mt-4 space-y-4">
          {rows.map((r, i) => (
            <div key={r.id} className={`grid grid-cols-[1fr_1fr_auto] items-end gap-3 ${needsStaff ? "sm:grid-cols-[1fr_110px_110px_auto]" : "sm:grid-cols-[1fr_110px_auto]"}`}>
              <label className="order-1 col-span-2 block text-xs font-medium text-navy sm:col-span-1">
                Branch {i + 1} <span className="font-normal text-muted">(name optional)</span>
                <input value={r.name} onChange={(e) => update(r.id, { name: e.target.value })} className={field} />
              </label>
              <label className={`order-3 block text-xs font-medium text-navy sm:order-2 ${needsStaff ? "" : "col-span-2 sm:col-span-1"}`}>
                Counters
                <input value={r.counters} onChange={(e) => update(r.id, { counters: e.target.value })} type="number" min={1} required inputMode="numeric" className={field} />
              </label>
              {needsStaff && (
                <label className="order-4 block text-xs font-medium text-navy sm:order-3">
                  Staff
                  <input value={r.staff} onChange={(e) => update(r.id, { staff: e.target.value })} type="number" min={1} required inputMode="numeric" className={field} />
                </label>
              )}
              <button
                type="button"
                onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}
                disabled={rows.length === 1}
                aria-label={`Remove branch ${i + 1}`}
                className="order-2 mb-0.5 h-11 w-9 text-lg text-muted hover:text-red disabled:invisible sm:order-4"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setRows((rs) => [...rs, { id: Math.max(...rs.map((x) => x.id)) + 1, name: "", counters: "", staff: "" }])}
          className="mt-4 text-sm font-semibold text-red-dark hover:text-red"
        >
          + Add another branch
        </button>
      </fieldset>

      <fieldset className="border border-line bg-white p-5">
        <legend className="px-1 text-sm font-medium text-navy">3. How often?</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {([
            { value: "one-off", title: "One-off", line: "A single Health Check." },
            { value: "monthly", title: `Monthly, ${off} off`, line: `Every month, at ${off} off the total. ${minimumMonths}-month minimum.` },
          ] as const).map((o) => (
            <label key={o.title} className="flex cursor-pointer items-start gap-3 border border-line px-3 py-2.5 text-sm has-[:checked]:border-navy">
              <input type="radio" name="frequency" checked={frequency === o.value} onChange={() => setFrequency(o.value)} className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-red)]" />
              <span><span className="block font-medium text-ink">{o.title}</span><span className="block text-xs text-muted">{o.line}</span></span>
            </label>
          ))}
        </div>
        {subscribed && <p className="mt-3 text-xs text-muted">The monthly subscription runs for at least {minimumMonths} months. Cancel any time after that.</p>}
      </fieldset>

      <div className="bg-night p-5 text-white sm:p-6" aria-live="polite">
        <p className="text-sm font-medium text-white/60">4. Your estimate</p>
        <div className="mt-4 space-y-5">
          {quote.map((q) => (
            <div key={q.branch.label + q.branch.counters}>
              <div className="flex items-baseline justify-between gap-4 border-b border-white/15 pb-2">
                <p className="font-display font-semibold">{q.branch.label}</p>
                <p className="font-display font-semibold">{gbp(q.subtotal)}</p>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-white/70">
                {q.lines.map((l) => (
                  <li key={l.check.name} className="flex justify-between gap-4">
                    <span>
                      {l.check.name}
                      {l.check.per !== "branch" && l.cost !== null && <span className="text-white/45"> · {l.qty} × {gbp(l.check.price!)}</span>}
                    </span>
                    <span className="shrink-0">{l.cost === null ? "Quoted" : gbp(l.cost)}</span>
                  </li>
                ))}
                {q.lines.length === 0 && <li>No checks selected.</li>}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-baseline justify-between border-t-2 border-red pt-4">
          <p className="text-sm text-white/70">{subscribed ? "Total before discount" : "Estimated total"}</p>
          <p className={`font-display font-bold ${subscribed ? "text-lg text-white/60 line-through decoration-red decoration-2" : "text-2xl"}`}>
            {gbp(total)} {!subscribed && <span className="text-sm font-normal text-white/60">+ VAT</span>}
          </p>
        </div>
        {subscribed && (
          <div className="mt-1 flex items-baseline justify-between">
            <p className="text-sm text-white/70">Monthly, {off} off</p>
            <p className="font-display text-2xl font-bold">{gbp(discounted)} <span className="text-sm font-normal text-white/60">+ VAT a month</span></p>
          </div>
        )}
        {separate.length > 0 && <p className="mt-2 text-xs text-white/50">{separate.map((c) => c.name).join(", ")} quoted separately.</p>}
        {subscribed && <p className="mt-2 text-xs text-white/50">Minimum {minimumMonths} months ({gbp(discounted * minimumMonths)} + VAT), then cancel any time.</p>}
        <p className="mt-2 text-xs text-white/50">An estimate from what you&apos;ve entered. I&apos;ll confirm the final quote with you.</p>
      </div>

      <textarea name="quote" value={summary} readOnly hidden />
    </>
  );
}
