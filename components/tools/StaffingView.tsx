"use client";

import type { Breakdown, Service, Statement } from "@/lib/remuneration";

const gbp = (n: number, dp = 0) => `£${n.toLocaleString("en-GB", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
const hrs = (h: number) => (h < 1 ? `${Math.round(h * 60)} min` : `${h.toFixed(1)} h`);

export type StaffSettings = { rate: number; hoursPerDay: number; daysPerWeek: number; daysOpen: number };
export type ServiceSettings = Record<string, { minutes: number; extra?: number }>;

function Num({ label, value, onChange, step = 1, min = 0, max = 1000, prefix }: { label: string; value: number; onChange: (v: number) => void; step?: number; min?: number; max?: number; prefix?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.12em] text-white/50">{label}</span>
      <span className="mt-1 flex items-center rounded-md border border-white/15 bg-white/[0.04] px-3 focus-within:border-white/40">
        {prefix && <span className="text-white/50">{prefix}</span>}
        <input type="number" inputMode="decimal" value={value} step={step} min={min} max={max} onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || 0)))} className="w-full bg-transparent py-2 pl-1 text-white outline-none" />
      </span>
    </label>
  );
}

export function StaffingView({
  s,
  b,
  svcs,
  staff,
  setStaff,
  svc,
  setSvc,
  costPerHour,
}: {
  s: Statement;
  b: Breakdown;
  svcs: Service[];
  staff: StaffSettings;
  setStaff: (v: StaffSettings) => void;
  svc: ServiceSettings;
  setSvc: (v: ServiceSettings) => void;
  costPerHour: number;
}) {
  const dayCost = costPerHour * staff.hoursPerDay;
  const openDays = s.weeks * staff.daysOpen;
  const perDay = b.total / openDays;

  const rows = svcs
    .map((x) => {
      const minutes = svc[x.id]?.minutes ?? x.minutes;
      const extra = svc[x.id]?.extra ?? x.extra?.value ?? 0;
      const pay = x.pay(extra);
      const perHour = minutes > 0 ? (pay * 60) / minutes : 0;
      const itemsForDay = pay > 0 ? Math.ceil(dayCost / pay) : Infinity;
      const hoursNeeded = (itemsForDay * minutes) / 60;
      const flatOut = perHour * staff.hoursPerDay;
      return { x, minutes, extra, pay, perHour, itemsForDay, hoursNeeded, flatOut, pays: perHour >= costPerHour };
    })
    .sort((a, b) => b.perHour - a.perHour);
  const top = Math.max(costPerHour * 1.15, ...rows.map((r) => r.perHour));

  return (
    <div>
      {/* Settings */}
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-4">
        <Num label="Hourly pay" prefix="£" step={0.01} max={60} value={staff.rate} onChange={(rate) => setStaff({ ...staff, rate })} />
        <Num label="Hours a day" step={0.5} max={14} value={staff.hoursPerDay} onChange={(hoursPerDay) => setStaff({ ...staff, hoursPerDay })} />
        <Num label="Days a week (staff)" step={1} min={1} max={7} value={staff.daysPerWeek} onChange={(daysPerWeek) => setStaff({ ...staff, daysPerWeek })} />
        <Num label="Days you open a week" step={1} min={1} max={7} value={staff.daysOpen} onChange={(daysOpen) => setStaff({ ...staff, daysOpen })} />
      </div>

      {/* Headline */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">One staff day costs</p>
          <p className="mt-1 font-display text-3xl font-bold">{gbp(dayCost, 2)}</p>
          <p className="text-xs text-white/45">{gbp(costPerHour, 2)} an hour with holiday pay, employer NI and pension, for {staff.hoursPerDay} hours</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">Your average day brings in</p>
          <p className="mt-1 font-display text-3xl font-bold">{gbp(perDay, 2)}</p>
          <p className="text-xs text-white/45">Remuneration before VAT over {openDays} opening days</p>
        </div>
        <div className={`rounded-2xl border p-5 ${perDay >= dayCost ? "border-emerald-400/40 bg-emerald-400/[0.07]" : "border-red/50 bg-red/[0.1]"}`}>
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">After one staff day</p>
          <p className="mt-1 font-display text-3xl font-bold">{gbp(perDay - dayCost, 2)}</p>
          <p className="text-xs text-white/45">Your remuneration pays for {(perDay / dayCost).toFixed(1)} staff days a day</p>
        </div>
      </div>

      {/* The ranking */}
      <section className="mt-8">
        <h2 className="font-display text-xl font-bold">What each service earns for an hour behind the counter</h2>
        <p className="mt-1 max-w-3xl text-sm text-white/55">
          Pay per item from your statement, divided by how long each one takes. The white line is what an hour of staff time costs you. Above it, the service pays for the seat; below it, it doesn&apos;t, however busy you are. Set the minutes to what your counter really takes.
        </p>

        <ul className="mt-5 space-y-3">
          {rows.map((r) => (
            <li key={r.x.id} className={`rounded-xl border p-4 ${r.pays ? "border-emerald-400/25 bg-emerald-400/[0.04]" : "border-white/10 bg-white/[0.03]"}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="font-semibold">{r.x.label}</p>
                <p className="text-right">
                  <span className={`font-display text-xl font-bold ${r.pays ? "text-emerald-300" : "text-white/80"}`}>{gbp(r.perHour, 2)}</span>
                  <span className="text-xs text-white/50"> an hour</span>
                </p>
              </div>
              <div className="relative mt-2 h-3 overflow-hidden rounded-full bg-white/5">
                <span className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${r.pays ? "bg-emerald-400/80" : "bg-red/80"}`} style={{ width: `${Math.min(100, (r.perHour / top) * 100)}%` }} />
                <span aria-hidden className="absolute inset-y-[-2px] w-[2px] bg-white" style={{ left: `${(costPerHour / top) * 100}%` }} />
              </div>
              <div className="mt-3 grid gap-3 text-xs text-white/60 sm:grid-cols-[1fr_auto_auto]">
                <p className="leading-relaxed">
                  Pays {gbp(r.pay, r.pay < 1 ? 3 : 2)} a {r.x.item} ({r.x.how}).{" "}
                  {r.pays ? (
                    <b className="text-white">To pay for one staff day: {r.itemsForDay.toLocaleString("en-GB")} {r.x.item}s, about {hrs(r.hoursNeeded)} of the {staff.hoursPerDay} h.</b>
                  ) : (
                    <b className="text-white">
                      Can&apos;t pay for a staff day on its own: {r.itemsForDay === Infinity ? "it pays nothing" : `it would take ${r.itemsForDay.toLocaleString("en-GB")} ${r.x.item}s (${hrs(r.hoursNeeded)})`}. Flat out all day it earns {gbp(r.flatOut)} of the {gbp(dayCost)}.
                    </b>
                  )}
                </p>
                {r.x.extra && (
                  <label className="flex items-center gap-2 whitespace-nowrap">
                    {r.x.extra.label} £
                    <input type="number" step={r.x.extra.step} min={r.x.extra.min} max={r.x.extra.max} value={r.extra} onChange={(e) => setSvc({ ...svc, [r.x.id]: { minutes: r.minutes, extra: Math.max(0, Number(e.target.value) || 0) } })} className="w-20 rounded border border-white/15 bg-white/[0.04] px-2 py-1 text-white" />
                  </label>
                )}
                <label className="flex items-center gap-2 whitespace-nowrap">
                  Minutes each
                  <input type="number" step={0.5} min={0.5} max={60} value={r.minutes} onChange={(e) => setSvc({ ...svc, [r.x.id]: { minutes: Math.max(0.5, Number(e.target.value) || 0.5), extra: r.extra || undefined } })} className="w-16 rounded border border-white/15 bg-white/[0.04] px-2 py-1 text-white" />
                </label>
              </div>
            </li>
          ))}
        </ul>
        {!rows.length && <p className="text-sm text-white/50">Add a statement to see your services.</p>}
      </section>

      {/* Where the day's money comes from */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">Your average day, by service</h2>
        <p className="mt-1 text-sm text-white/55">What each stream brings in on an average opening day, and how much of one staff day it covers.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-white/45">
                <th className="py-2 font-medium">Stream</th>
                <th className="py-2 text-right font-medium">A day</th>
                <th className="py-2 text-right font-medium">An hour open</th>
                <th className="py-2 text-right font-medium">Of one staff day</th>
              </tr>
            </thead>
            <tbody>
              {b.streams.map((x) => {
                const d = x.exc / openDays;
                return (
                  <tr key={x.name} className="border-t border-white/10">
                    <td className="py-2">{x.name}</td>
                    <td className="py-2 text-right tabular-nums">{gbp(d, 2)}</td>
                    <td className="py-2 text-right tabular-nums text-white/70">{gbp(d / staff.hoursPerDay, 2)}</td>
                    <td className="py-2 text-right tabular-nums text-white/70">{Math.round((d / dayCost) * 100)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-8 text-xs leading-relaxed text-white/45">
        Staff cost uses this year&apos;s rates: holiday pay, employer NI above the threshold and the minimum workplace pension, spread over the hours actually worked; the Employment Allowance isn&apos;t taken off. Minutes per item are your estimates: the defaults are a starting point. Some services bring customers who buy other things (and some, like banking, keep the branch in the community): this shows only what each transaction pays the branch.
      </p>
    </div>
  );
}
