"use client";

// Branch Check: the staffing planner (from transactions by hour) and the growth planner.
// Built only from the member's own exports and the rates on their own remuneration statement.

import { useMemo, useState } from "react";
import type { BranchData } from "@/lib/branch-hub";
import { employerCost } from "@/lib/employer-cost";
import { ukRates } from "@/lib/uk-rates";

const gbp = (n: number, dp = 0) => `£${n.toLocaleString("en-GB", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
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

const defaultMinutes = (category: string) => (/mail/i.test(category) ? 2.5 : /bank/i.test(category) ? 2 : 1.5);

export function StaffingPlanner({ data }: { data: BranchData }) {
  const rows = useMemo(() => data.hours ?? [], [data.hours]);
  const categories = useMemo(() => [...new Set(rows.map((r) => r.category))], [rows]);
  const [weeks, setWeeks] = useState(4);
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
      <p className="mt-1 max-w-3xl text-sm text-white/55">How many people you need on the counter each hour to serve your customers without queues building, from your own transaction counts. Change the minutes to what your counter really takes.</p>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-4">
        <Num label="Weeks this export covers" value={weeks} min={1} max={60} onChange={setWeeks} />
        <Num label="Time serving per hour" value={busy} min={30} max={100} step={5} onChange={setBusy} suffix="%" />
        <Num label="Hourly pay" value={rate} min={1} max={60} step={0.01} prefix="£" onChange={setRate} />
        <Num label="Staff hours you have now (a week)" value={current} min={0} max={500} step={0.5} onChange={setCurrent} />
        {categories.map((c) => (
          <Num key={c} label={`Minutes per ${c.toLowerCase()} transaction`} value={mins(c)} min={0.5} max={20} step={0.5} onChange={(v) => setMinutes({ ...minutes, [c]: v })} />
        ))}
      </div>

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
