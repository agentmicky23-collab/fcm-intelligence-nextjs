"use client";

// Branch Check: the staffing planner (from transactions by hour) and the growth planner.
// Built only from the member's own exports and the rates on their own remuneration statement.

import { useMemo, useState } from "react";
import type { BranchData } from "@/lib/branch-hub";
import { services, type Statement } from "@/lib/remuneration";
import { employerCost } from "@/lib/employer-cost";
import { ukRates } from "@/lib/uk-rates";

const gbp = (n: number, dp = 0) => `${n < 0 ? "−" : ""}£${Math.abs(n).toLocaleString("en-GB", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
const int = (n: number) => Math.round(n).toLocaleString("en-GB");
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const peopleColour = (n: number) => (n <= 1 ? "rgb(55,138,221)" : n === 2 ? "rgb(214,218,226)" : "rgb(224,36,27)");

function Num({ label, value, onChange, step = 1, min = 0, max = 1000, prefix, suffix }: { label: string; value: number; onChange: (v: number) => void; step?: number; min?: number; max?: number; prefix?: string; suffix?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.12em] text-white/50">{label}</span>
      <span className="mt-1 flex items-center rounded-md border border-white/15 bg-white/[0.04] px-3 focus-within:border-white/40">
        {prefix && <span className="text-white/50">{prefix}</span>}
        <input type="number" inputMode="decimal" value={value} step={step} min={min} max={max} onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || 0)))} className="w-full bg-transparent py-2 pl-1 text-white outline-none" />
        {suffix && <span className="text-xs text-white/50">{suffix}</span>}
      </span>
    </label>
  );
}

const defaultMinutes = (category: string) => (/customer/i.test(category) ? 2 : /mail/i.test(category) ? 2.5 : /bank/i.test(category) ? 2 : 1.5);

export function StaffingPlanner({ data }: { data: BranchData }) {
  const hasCustomers = (data.hourSessions?.length ?? 0) > 0;
  const [source, setSource] = useState<"customers" | "transactions">(hasCustomers ? "customers" : "transactions");
  const useCustomers = source === "customers" && hasCustomers;
  const rows = useMemo(
    () => (useCustomers ? (data.hourSessions ?? []).map((s) => ({ category: "Customer", hour: s.hour, weekday: s.weekday, transactions: s.sessions })) : (data.hours ?? [])),
    [useCustomers, data.hourSessions, data.hours],
  );
  const categories = useMemo(() => [...new Set(rows.map((r) => r.category))], [rows]);
  // How many weeks the hourly export covers: measured against the weekly customer counts if we have them.
  const measuredWeeks = useMemo(() => {
    const hourly = (data.hourSessions ?? []).reduce((a, s) => a + s.sessions, 0);
    const weekly = (data.sessions ?? []).filter((s) => s.sessions > 300).sort((a, b) => (a.year + String(a.week).padStart(2, "0")).localeCompare(b.year + String(b.week).padStart(2, "0"))).slice(-8);
    if (!hourly || weekly.length < 4) return null;
    const avg = weekly.reduce((a, s) => a + s.sessions, 0) / weekly.length;
    return Math.max(1, Math.round((hourly / avg) * 2) / 2);
  }, [data.hourSessions, data.sessions]);
  const [weeksTyped, setWeeks] = useState<number | null>(null);
  const weeks = weeksTyped ?? measuredWeeks ?? 1;
  const [busy, setBusy] = useState(75);
  const [rate, setRate] = useState<number>(ukRates.minimumWage.age21plus);
  const [current, setCurrent] = useState(0);
  const [minutes, setMinutes] = useState<Record<string, number>>({});
  if (!rows.length) return null;

  const mins = (c: string) => minutes[c] ?? defaultMinutes(c);
  const load = new Map<string, number>(); // serving minutes per average week, by day|hour
  for (const r of rows) {
    if (!r.transactions) continue;
    const k = `${r.weekday}|${r.hour}`;
    load.set(k, (load.get(k) ?? 0) + (r.transactions * mins(r.category)) / Math.max(1, weeks));
  }
  const hours = [...new Set(rows.filter((r) => r.transactions > 0).map((r) => r.hour))].sort();
  const days = DAYS.filter((d) => rows.some((r) => r.weekday === d && r.transactions > 0));
  const capacity = 60 * (busy / 100);
  const need = (k: string) => (load.has(k) ? Math.max(1, Math.ceil((load.get(k) ?? 0) / capacity)) : 0);
  const staffHours = [...load.keys()].reduce((a, k) => a + need(k), 0);
  const costPerHour = employerCost({ hourlyRate: rate, hoursPerWeek: Math.max(1, staffHours) }).perWorkedHour.total;
  const weekCost = staffHours * costPerHour;

  // Plain-English rota: runs of hours on each day where two or more are needed.
  const doubles: string[] = [];
  for (const d of days) {
    let start: string | null = null;
    let peak = 0;
    const flush = (endHour: string) => {
      if (start) doubles.push(`${d.slice(0, 3)} ${start}–${endHour}${peak > 2 ? ` (${peak} at the busiest)` : ""}`);
      start = null;
      peak = 0;
    };
    for (const h of hours) {
      const n = need(`${d}|${h}`);
      if (n >= 2) {
        start ??= h;
        peak = Math.max(peak, n);
      } else flush(h);
    }
    flush(`${String(Number(hours.at(-1)!.slice(0, 2)) + 1).padStart(2, "0")}:00`);
  }

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-bold">Staffing planner</h2>
      <p className="mt-1 max-w-3xl text-sm text-white/55">How many people you need on the counter each hour to serve your customers without queues building, from your own customer and transaction counts. Set the minutes to what your counter really takes: if you know how many staff hours you have now, enter them and adjust the minutes until busy times look right.</p>

      {hasCustomers && (data.hours?.length ?? 0) > 0 && (
        <div role="radiogroup" aria-label="Plan from" className="mt-4 inline-flex rounded-full border border-white/15 bg-white/[0.03] p-1 text-sm">
          {(["customers", "transactions"] as const).map((k) => (
            <button key={k} role="radio" aria-checked={source === k} onClick={() => setSource(k)} className={`rounded-full px-4 py-1.5 ${source === k ? "bg-white font-semibold text-[#06173a]" : "text-white/65"}`}>
              {k === "customers" ? "Plan from customers" : "Plan from transactions"}
            </button>
          ))}
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-4">
        <Num label="Weeks this export covers" value={weeks} min={1} max={60} step={0.5} onChange={setWeeks} />
        <Num label="Time serving per hour" value={busy} min={30} max={100} step={5} onChange={setBusy} suffix="%" />
        <Num label="Hourly pay" value={rate} min={1} max={60} step={0.01} prefix="£" onChange={setRate} />
        <Num label="Staff hours you have now (a week)" value={current} min={0} max={500} step={0.5} onChange={setCurrent} />
        {categories.map((c) => (
          <Num key={c} label={c === "Customer" ? "Minutes per customer" : `Minutes per ${c.toLowerCase()} transaction`} value={mins(c)} min={0.5} max={20} step={0.5} onChange={(v) => setMinutes({ ...minutes, [c]: v })} />
        ))}
      </div>

      <p className="mt-2 text-xs text-white/50">
        {measuredWeeks && weeksTyped === null
          ? `Your hourly export matches about ${measuredWeeks} week${measuredWeeks === 1 ? "" : "s"} of customers (checked against your weekly customer counts).`
          : "Branch Hub's hourly reports usually cover one week. Change this if yours covers more."}
        {useCustomers ? " Planning from customer visits: each one is someone at the counter." : ""}
      </p>
      <div className="mt-5 overflow-x-auto">
        <table className="text-xs">
          <thead>
            <tr>
              <th />
              {hours.map((h) => <th key={h} className="px-0.5 pb-1 font-normal text-white/50">{h.slice(0, 2)}</th>)}
              <th className="pl-3 pb-1 text-left font-normal text-white/50">Hours</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d}>
                <td className="pr-2 text-white/60">{d.slice(0, 3)}</td>
                {hours.map((h) => {
                  const k = `${d}|${h}`;
                  const n = need(k);
                  return (
                    <td key={h} className="p-0.5">
                      <div title={`${d} ${h}: about ${int(load.get(k) ?? 0)} minutes of serving a week → ${n} ${n === 1 ? "person" : "people"}`} className="flex h-10 w-12 items-center justify-center rounded-[4px] font-semibold" style={{ background: n ? peopleColour(n) : "rgba(255,255,255,0.03)", color: n === 2 ? "#06173a" : "#fff" }}>
                        {n || ""}
                      </div>
                    </td>
                  );
                })}
                <td className="pl-3 font-semibold tabular-nums">{hours.reduce((a, h) => a + need(`${d}|${h}`), 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/60">
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-[2px]" style={{ background: peopleColour(1) }} /> One person</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-[2px]" style={{ background: peopleColour(2) }} /> Two people</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-[2px]" style={{ background: peopleColour(3) }} /> Three or more</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">Counter hours needed a week</p>
          <p className="mt-1 font-display text-3xl font-bold">{int(staffHours)}</p>
          <p className="text-xs text-white/50">Including you, during opening hours</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">What those hours cost</p>
          <p className="mt-1 font-display text-3xl font-bold">{gbp(weekCost)}</p>
          <p className="text-xs text-white/50">a week at {gbp(costPerHour, 2)} an hour with holiday pay, NI and pension (if all paid staff)</p>
        </div>
        <div className={`rounded-2xl border p-5 ${current ? (current > staffHours * 1.1 ? "border-[#C9A227]/50 bg-[#C9A227]/[0.07]" : current < staffHours * 0.9 ? "border-red/50 bg-red/[0.08]" : "border-emerald-400/40 bg-emerald-400/[0.06]") : "border-white/10 bg-white/[0.04]"}`}>
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">Against what you have now</p>
          {current ? (
            <>
              <p className="mt-1 font-display text-3xl font-bold">{current > staffHours ? "+" : "−"}{int(Math.abs(current - staffHours))} h</p>
              <p className="text-xs text-white/50">{current > staffHours ? `About ${gbp((current - staffHours) * costPerHour)} a week more than the counter needs. Use the time for back office, stock and selling.` : `About ${int(staffHours - current)} hours short: expect queues at the busy times.`}</p>
            </>
          ) : (
            <p className="mt-1 text-sm text-white/55">Enter the staff hours you have now to compare.</p>
          )}
        </div>
      </div>

      {doubles.length > 0 && (
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
          <p className="font-semibold">When to have two or more on the counter</p>
          <p className="mt-1 text-white/70">{doubles.join(" · ")}</p>
        </div>
      )}
      <p className="mt-3 text-xs text-white/45">Counter time only: back-office work (declarations, pouches, stock, balancing) needs time on top. The minutes per transaction are averages you can change.</p>
    </section>
  );
}

// ── Growth planner ──────────────────────────────────────────────────────────────────────────────

/** £ per item for a carrier's drop-offs or pick-ups, from the lines on the remuneration statement. */
function carrierRate(statement: Statement, product: string) {
  const pick = /pick[\s-]?up/i.test(product);
  const carrier = /evri/i.test(product) ? /evri/i : /amazon/i.test(product) ? /amz|amazon/i : /dpd/i.test(product) ? /dpd/i : /dhl/i.test(product) ? /dhl/i : /local collect/i.test(product) ? /local collect/i : /home shopping|returns/i.test(product) ? /home shopping returns/i : /parcelforce|global priority/i.test(product) ? /global priority|parcelforce/i : null;
  if (!carrier) return null;
  const kind = pick ? /click|collect/i : /drop|return|lfbf/i;
  const lines = statement.lines.filter((l) => l.by === "Volume" && carrier.test(l.name) && (kind.test(l.name) || /local collect|home shopping/i.test(l.name)) && l.sales > 0 && l.exc > 0 && !/sell more|fixed payment/i.test(l.name));
  const items = lines.reduce((a, l) => a + l.sales, 0);
  return items ? lines.reduce((a, l) => a + l.exc, 0) / items : null;
}

export function GrowthPlanner({ data, statement }: { data: BranchData; statement: Statement | null }) {
  const [rate, setRate] = useState<number>(ukRates.minimumWage.age21plus);
  const [dropMins, setDropMins] = useState(2);
  const [pickMins, setPickMins] = useState(2);
  const [svcMins, setSvcMins] = useState<Record<string, number>>({});
  const [avgSale, setAvgSale] = useState(400);
  const costPerHour = employerCost({ hourlyRate: rate, hoursPerWeek: 30 }).perWorkedHour.total;

  // Footfall trend
  const sessions = data.sessions ?? [];
  const years = new Map<string, number[]>();
  for (const s of sessions) years.set(s.year, [...(years.get(s.year) ?? []), s.sessions]);
  const yearAvg = [...years]
    .sort()
    .map(([y, v]) => {
      const sorted = [...v].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)] ?? 0;
      const open = v.filter((x) => x > median * 0.25);
      return { y, avg: open.length ? open.reduce((a, b) => a + b, 0) / open.length : 0 };
    })
    .filter((r) => r.avg > 0);
  const lastY = yearAvg.at(-1);
  const prevY = yearAvg.at(-2);

  // Parcels: what each carrier earns against the counter time it takes
  const parcels = data.parcels ?? [];
  const weeks = [...new Set(parcels.map((p) => p.week))].filter((w) => parcels.some((p) => p.week === w && p.volume > 0)).length || 1;
  const byProduct = new Map<string, number>();
  for (const p of parcels) byProduct.set(p.product, (byProduct.get(p.product) ?? 0) + p.volume);
  const parcelRows = statement
    ? [...byProduct]
        .map(([product, v]) => {
          const perWeek = v / weeks;
          const pay = carrierRate(statement, product);
          const mins = /pick[\s-]?up/i.test(product) ? pickMins : dropMins;
          const earns = pay === null ? null : perWeek * pay;
          const staff = (perWeek * mins * costPerHour) / 60;
          return { product: product.replace(/^customer\s+/i, ""), perWeek, pay, earns, staff, net: earns === null ? null : earns - staff };
        })
        .filter((r) => r.perWeek >= 0.5)
        .sort((a, b) => (b.earns ?? 0) - (a.earns ?? 0))
    : [];
  const parcelEarns = parcelRows.reduce((a, r) => a + (r.earns ?? 0), 0);
  const parcelStaff = parcelRows.reduce((a, r) => a + r.staff, 0);

  // Best ways to grow: what each service pays per staff hour, and what +£1,000 a year takes
  const svcs = statement ? services(statement) : [];
  const growth = svcs
    .map((s) => {
      const minutes = svcMins[s.id] ?? s.minutes;
      const pay = s.pay(s.id === "travel" ? avgSale : s.extra?.value ?? 0);
      const perHour = minutes > 0 ? (pay * 60) / minutes : 0;
      const perWeekFor1k = pay > 0 ? 1000 / 52 / pay : Infinity;
      const staffCostYear = ((perWeekFor1k * minutes) / 60) * costPerHour * 52;
      return { s, minutes, pay, perHour, perWeekFor1k, net: 1000 - staffCostYear };
    })
    .sort((a, b) => b.perHour - a.perHour);
  const maxPerHour = Math.max(costPerHour * 1.2, ...growth.map((g) => g.perHour));

  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-bold">Growth planner</h2>
      <p className="mt-1 max-w-3xl text-sm text-white/55">Where your next pound should come from: what each service earns for the counter time it takes, using the rates on your own statement and your real volumes.</p>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-4">
        <Num label="Hourly pay" value={rate} min={1} max={60} step={0.01} prefix="£" onChange={setRate} />
        <Num label="Minutes per drop-off" value={dropMins} min={0.5} max={10} step={0.5} onChange={setDropMins} />
        <Num label="Minutes per pick-up" value={pickMins} min={0.5} max={10} step={0.5} onChange={setPickMins} />
        <Num label="Average currency sale" value={avgSale} min={50} max={3000} step={50} prefix="£" onChange={setAvgSale} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className={`rounded-2xl border p-5 ${lastY && prevY ? (lastY.avg >= prevY.avg ? "border-emerald-400/40 bg-emerald-400/[0.06]" : "border-red/50 bg-red/[0.08]") : "border-white/10 bg-white/[0.04]"}`}>
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">Footfall</p>
          {lastY ? (
            <>
              <p className="mt-1 font-display text-3xl font-bold">{int(lastY.avg)} <span className="text-base font-normal text-white/55">sessions a week</span></p>
              <p className="text-xs text-white/50">{prevY ? `${lastY.avg >= prevY.avg ? "Up" : "Down"} ${Math.abs(Math.round((lastY.avg / prevY.avg - 1) * 100))}% on ${prevY.y} (${lastY.y} so far)` : lastY.y}</p>
            </>
          ) : (
            <p className="mt-1 text-sm text-white/55">Add Customer sessions by week to see your trend.</p>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">Parcels earn</p>
          {statement && parcelRows.length ? (
            <>
              <p className="mt-1 font-display text-3xl font-bold">{gbp(parcelEarns)} <span className="text-base font-normal text-white/55">a week</span></p>
              <p className="text-xs text-white/50">and take about {gbp(parcelStaff)} of counter time ({((parcelStaff / costPerHour)).toFixed(1)} h)</p>
            </>
          ) : (
            <p className="mt-1 text-sm text-white/55">Add your remuneration statement and parcel export.</p>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">An hour of counter time costs</p>
          <p className="mt-1 font-display text-3xl font-bold">{gbp(costPerHour, 2)}</p>
          <p className="text-xs text-white/50">with holiday pay, employer NI and pension</p>
        </div>
      </div>

      {!statement && <p className="mt-6 rounded-xl border border-dashed border-white/15 p-6 text-sm text-white/55">Add your remuneration statement (the PDF) with your Branch Hub files to see what each service earns and the best ways to grow.</p>}

      {statement && growth.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-lg font-bold">Best ways to grow</h3>
          <p className="mt-1 max-w-3xl text-sm text-white/55">Ranked by what each service earns for an hour behind the counter. The white line is what that hour costs. For each, what it takes to add £1,000 a year, and what&apos;s left after paying for the time.</p>
          <ul className="mt-4 space-y-2">
            {growth.map((g, i) => (
              <li key={g.s.id} className={`rounded-xl border p-4 ${g.perHour >= costPerHour ? "border-emerald-400/25 bg-emerald-400/[0.04]" : "border-white/10 bg-white/[0.03]"}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold"><span className="mr-2 text-white/40">{i + 1}.</span>{g.s.label}</p>
                  <p className="text-sm"><b className={g.perHour >= costPerHour ? "text-emerald-300" : "text-white/80"}>{gbp(g.perHour, 2)}</b><span className="text-xs text-white/50"> an hour</span></p>
                </div>
                <div className="relative mt-2 h-2.5 rounded-full bg-white/5">
                  <div className={`h-full rounded-full ${g.perHour >= costPerHour ? "bg-emerald-400/80" : "bg-red/80"}`} style={{ width: `${Math.min(100, (g.perHour / maxPerHour) * 100)}%` }} />
                  <span aria-hidden className="absolute inset-y-[-2px] w-[2px] bg-white" style={{ left: `${(costPerHour / maxPerHour) * 100}%` }} />
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-white/60">
                  <span>
                    +£1,000 a year = about <b className="text-white">{g.perWeekFor1k < 1 ? g.perWeekFor1k.toFixed(1) : int(g.perWeekFor1k)} more {g.s.item}s a week</b> at {gbp(g.pay, g.pay < 1 ? 3 : 2)} each ·{" "}
                    <b className={g.net >= 0 ? "text-emerald-300" : "text-red-light"}>{g.net >= 0 ? `${gbp(g.net)} left` : `${gbp(-g.net)} short`}</b> after the counter time
                  </span>
                  <label className="flex items-center gap-2 whitespace-nowrap">
                    Minutes each
                    <input type="number" min={0.5} max={60} step={0.5} value={g.minutes} onChange={(e) => setSvcMins({ ...svcMins, [g.s.id]: Math.max(0.5, Number(e.target.value) || 0.5) })} className="w-16 rounded border border-white/15 bg-white/[0.04] px-2 py-1 text-white" />
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {statement && parcelRows.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-lg font-bold">Parcels: what each carrier earns against the time it takes</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-white/45">
                  <th className="py-2 font-medium">Service</th>
                  <th className="py-2 text-right font-medium">A week</th>
                  <th className="py-2 text-right font-medium">Pays each</th>
                  <th className="py-2 text-right font-medium">Earns a week</th>
                  <th className="py-2 text-right font-medium">Counter time</th>
                  <th className="py-2 text-right font-medium">After time</th>
                </tr>
              </thead>
              <tbody>
                {parcelRows.map((r) => (
                  <tr key={r.product} className="border-t border-white/10">
                    <td className="py-2">{r.product}</td>
                    <td className="py-2 text-right tabular-nums">{int(r.perWeek)}</td>
                    <td className="py-2 text-right tabular-nums">{r.pay === null ? "not on statement" : gbp(r.pay, 3)}</td>
                    <td className="py-2 text-right tabular-nums">{r.earns === null ? "–" : gbp(r.earns, 2)}</td>
                    <td className="py-2 text-right tabular-nums">{gbp(r.staff, 2)}</td>
                    <td className={`py-2 text-right font-semibold tabular-nums ${r.net === null ? "" : r.net >= 0 ? "text-emerald-300" : "text-red-light"}`}>{r.net === null ? "–" : gbp(r.net, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-white/45">Parcels often bring customers who buy other things; this shows only what each transaction pays. Volume bonuses on the statement (such as tiered carrier payments) aren&apos;t included per item.</p>
        </div>
      )}
    </section>
  );
}
