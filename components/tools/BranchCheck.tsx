"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fileKinds, financialYear, merge, periodViews, quickScore, readBranchFile, type BranchData, type OeiRules } from "@/lib/branch-hub";
import { Protected } from "./Protected";

const gbp = (n: number, dp = 0) => `£${n.toLocaleString("en-GB", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
const int = (n: number) => Math.round(n).toLocaleString("en-GB");
const monthName = (iso: string) => new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
/** A trading period is named after the month it mostly covers (a period starting 29 June is July's). */
const periodName = (start: string) => monthName(new Date(Date.parse(start + "T12:00:00Z") + 14 * 86400000).toISOString().slice(0, 10));
/** Heat map colour: blue (quiet) through grey to red (busy). t runs 0 to 1. */
const QUIET = [55, 138, 221];
const MIDDLE = [214, 218, 226];
const BUSY = [224, 36, 27];
function heat(t: number) {
  const [a, b, k] = t < 0.5 ? [QUIET, MIDDLE, t / 0.5] : [MIDDLE, BUSY, (t - 0.5) / 0.5];
  return `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * k)).join(",")})`;
}
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type Tab = "oei" | "cash" | "counter" | "hours" | "parcels" | "quick";

function Card({ label, value, note, tone }: { label: string; value: string; note?: string; tone?: "good" | "bad" }) {
  return (
    <div className={`rounded-2xl border p-5 ${tone === "bad" ? "border-red/50 bg-red/[0.08]" : tone === "good" ? "border-emerald-400/40 bg-emerald-400/[0.06]" : "border-white/10 bg-white/[0.04]"}`}>
      <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold">{value}</p>
      {note && <p className="text-xs text-white/50">{note}</p>}
    </div>
  );
}

function Bars({ rows, unit = "£", tone = "#378ADD" }: { rows: { label: string; value: number; note?: string }[]; unit?: "£" | ""; tone?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.label} title={`${r.label}: ${unit === "£" ? gbp(r.value) : int(r.value)}${r.note ? ` (${r.note})` : ""}`}>
          <div className="flex justify-between gap-3 text-sm">
            <span className="text-white/80">{r.label}</span>
            <span className="tabular-nums">{unit === "£" ? gbp(r.value) : int(r.value)}{r.note && <span className="ml-2 text-xs text-white/45">{r.note}</span>}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-white/5">
            <div className="h-full rounded-full" style={{ width: `${(r.value / max) * 100}%`, background: tone }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Each carrier keeps the same colour in every chart. */
const carrierColour = (name: string) =>
  /evri/i.test(name) ? "#7F77DD" : /royal mail/i.test(name) ? "#e0241b" : /amazon/i.test(name) ? "#C9A227" : /dpd/i.test(name) ? "#D85A30" : /dhl/i.test(name) ? "#1D9E75" : /parcelforce/i.test(name) ? "#4fb3bf" : "#8a93a6";

function Columns({ rows }: { rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  const total = rows.reduce((a, r) => a + r.value, 0) || 1;
  return (
    <div className="flex h-64 items-end gap-3 border-b border-white/15 pt-6">
      {rows.map((r) => (
        <div key={r.label} className="flex h-full min-w-0 flex-1 flex-col justify-end text-center" title={`${r.label}: ${int(r.value)} a week (${Math.round((r.value / total) * 100)}%)`}>
          <p className="font-display text-lg font-bold tabular-nums">{int(r.value)}</p>
          <div className="mx-auto w-full max-w-[64px] rounded-t-[4px] transition-all duration-500" style={{ height: `${Math.max(2, (r.value / max) * 170)}px`, background: carrierColour(r.label) }} />
        </div>
      ))}
    </div>
  );
}

function ColumnLabels({ rows }: { rows: { label: string; value: number }[] }) {
  const total = rows.reduce((a, r) => a + r.value, 0) || 1;
  return (
    <div className="mt-2 flex gap-3">
      {rows.map((r) => (
        <div key={r.label} className="min-w-0 flex-1 text-center">
          <p className="text-xs leading-tight text-white/80 [overflow-wrap:anywhere]" title={r.label}>{r.label.replace(/^Royal Mail /, "RM ")}</p>
          <p className="text-[11px] text-white/45">{Math.round((r.value / total) * 100)}%</p>
        </div>
      ))}
    </div>
  );
}

/** Excess cash calendar: one row per month, one square per day; blue = none, red = £10k or more. */
function ExcessCashCalendar({ days }: { days: { date: string; excessCash: number | null; declared: string }[] }) {
  const byMonth = new Map<string, Map<number, { v: number | null; declared: string }>>();
  for (const d of days) {
    const m = d.date.slice(0, 7);
    const row = byMonth.get(m) ?? new Map();
    row.set(Number(d.date.slice(8, 10)), { v: d.excessCash, declared: d.declared });
    byMonth.set(m, row);
  }
  const months = [...byMonth].sort((a, b) => a[0].localeCompare(b[0])).slice(-15);
  const RED_AT = 10000;
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="text-[10px]">
          <thead>
            <tr>
              <th />
              {Array.from({ length: 31 }, (_, i) => <th key={i} className="pb-1 font-normal text-white/40">{i + 1}</th>)}
              <th className="pb-1 pl-3 text-left font-normal text-white/50">Daily average</th>
            </tr>
          </thead>
          <tbody>
            {months.map(([m, row]) => {
              const vals = [...row.values()].map((x) => x.v).filter((v): v is number => v !== null);
              const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
              return (
                <tr key={m}>
                  <td className="whitespace-nowrap pr-2 text-xs text-white/60">{monthName(m + "-15")}</td>
                  {Array.from({ length: 31 }, (_, i) => {
                    const c = row.get(i + 1);
                    const v = c?.v ?? null;
                    const t = v === null ? 0 : Math.min(1, v / RED_AT);
                    return (
                      <td key={i} className="p-[1.5px]">
                        <div
                          title={c ? `${m.slice(5)}/${i + 1}: ${v === null ? "no figure" : gbp(v)} excess cash${c.declared === "not complete" ? " · declaration not completed" : ""}` : undefined}
                          className={`flex h-7 w-7 items-center justify-center rounded-[3px] font-semibold tabular-nums ${c?.declared === "not complete" ? "ring-2 ring-white" : ""}`}
                          style={{ background: !c || v === null ? "rgba(255,255,255,0.03)" : heat(t), color: v !== null && Math.abs(t - 0.5) < 0.22 ? "#06173a" : "#fff" }}
                        >
                          {v && v >= 500 ? Math.round(v / 1000) : ""}
                        </div>
                      </td>
                    );
                  })}
                  <td className={`whitespace-nowrap pl-3 text-xs font-semibold tabular-nums ${avg >= 5000 ? "text-red-light" : avg < 1000 ? "text-emerald-300" : "text-white/80"}`}>{gbp(avg)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/60" aria-hidden>
        <span>None</span>
        <span className="h-3 w-48 rounded-full" style={{ background: `linear-gradient(90deg, ${heat(0)}, ${heat(0.5)}, ${heat(1)})` }} />
        <span>£10k or more</span>
        <span className="ml-4 inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-[2px] ring-2 ring-white" /> Declaration not completed</span>
      </div>
      <p className="mt-2 text-xs text-white/50">Numbers are £ thousands held over after a collection, carried each day until the next one. Every £1,000 of the daily average over a trading period costs a point (rows here are calendar months, so their averages differ slightly from Branch Hub&apos;s).</p>
    </div>
  );
}

function Empty({ what }: { what: string }) {
  return <p className="rounded-xl border border-dashed border-white/15 p-6 text-sm text-white/55">Add your {what} export from Branch Hub to see this.</p>;
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      {sub && <p className="mt-1 max-w-3xl text-sm text-white/55">{sub}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

// ── Operational Excellence ─────────────────────────────────────────────────────────────────────

function OeiTab({ data, rules }: { data: BranchData; rules: OeiRules }) {
  const views = useMemo(() => (data.periods ? periodViews(rules, data.periods) : []), [data.periods, rules]);
  if (!views.length) return <Empty what="Operational Excellence summary" />;
  const paid = views.filter((v) => v.paid);
  const years = new Map<string, { possible: number; earned: number; missed: number; n: number }>();
  for (const v of paid) {
    const y = financialYear(v.start);
    const t = years.get(y) ?? { possible: 0, earned: 0, missed: 0, n: 0 };
    t.possible += v.possible;
    t.earned += v.earned;
    t.missed += v.missed;
    t.n++;
    years.set(y, t);
  }
  const recent = paid.slice(-12);
  const causes = new Map<string, { points: number; pounds: number; periods: number }>();
  for (const v of recent)
    for (const c of v.lostToCause) {
      const t = causes.get(c.cause) ?? { points: 0, pounds: 0, periods: 0 };
      t.points += c.points;
      t.pounds += c.pounds;
      t.periods++;
      causes.set(c.cause, t);
    }
  const ranked = [...causes].sort((a, b) => b[1].pounds - a[1].pounds);
  const last = paid.at(-1);
  const maxPossible = Math.max(1, ...views.map((v) => (v.paid ? v.possible : (v.eligible * v.maxPercent) / 100)));

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[...years].slice(-3).map(([y, t]) => (
          <Card key={y} label={`${y} (${t.n} periods)`} value={`${gbp(t.earned)} of ${gbp(t.possible)}`} note={`${Math.round((t.earned / t.possible) * 100)}% earned · ${gbp(t.missed)} missed`} tone={t.earned / t.possible > 0.85 ? "good" : t.earned / t.possible < 0.6 ? "bad" : undefined} />
        ))}
      </div>

      <Section title="Every period: earned and missed" sub="The solid part is what you were paid; the striped part is what you could also have had. Periods before payments began are shown faded.">
        <div className="flex h-48 items-end gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] p-3">
          {views.map((v) => {
            const possible = v.paid ? v.possible : (v.eligible * v.maxPercent) / 100;
            const earned = v.paid ? v.earned : (v.eligible * v.percent) / 100;
            return (
              <div key={v.start} className={`flex min-w-[18px] flex-1 flex-col justify-end ${v.paid ? "" : "opacity-35"}`} title={`${periodName(v.start)}: ${v.totalPoints} points, ${v.percent}%. ${v.paid ? `Earned ${gbp(earned, 2)} of ${gbp(possible, 2)}` : "Before payments began"}${v.balanced === "no" ? ". Monthly balance not done in its week" : ""}`}>
                <div className="rem-added rounded-t-[4px] opacity-70" style={{ height: `${(Math.max(0, possible - earned) / maxPossible) * 150}px` }} />
                <div className={`${earned >= possible - 0.5 ? "rounded-t-[4px]" : ""} bg-emerald-400/80`} style={{ height: `${(earned / maxPossible) * 150}px` }} />
                <p className="mt-1 text-center text-[9px] text-white/40">{periodName(v.start).split(" ")[0][0]}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Where the money went (last 12 paid periods)" sub="Each point is worth a share of your remuneration, so every lost point has a price. Biggest first: fix these in this order.">
        {ranked.length ? (
          <ol className="space-y-3">
            {ranked.map(([cause, t], i) => (
              <li key={cause} className="flex flex-wrap items-baseline justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <span>
                  <b className="mr-2 text-red-light">{i + 1}.</b>
                  <b>{cause}</b>
                  <span className="ml-2 text-xs text-white/50">{t.points ? `${t.points} points over ${t.periods} period${t.periods === 1 ? "" : "s"}` : `${t.periods} period${t.periods === 1 ? "" : "s"}: nothing paid that month`}</span>
                </span>
                <span className="font-display text-xl font-bold">{gbp(t.pounds)}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-emerald-300">Nothing lost in the last 12 paid periods.</p>
        )}
        {last && <p className="mt-3 text-xs text-white/50">At your latest remuneration, one point is worth about {gbp(last.pointValue, 2)} a period ({gbp(last.pointValue * 13)} a year).</p>}
      </Section>

      <Section title="Period by period">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-white/45">
                <th className="py-2 font-medium">Period</th>
                <th className="py-2 font-medium">Balanced</th>
                <th className="py-2 text-right font-medium">Points</th>
                <th className="py-2 text-right font-medium">Paid %</th>
                <th className="py-2 text-right font-medium">Earned</th>
                <th className="py-2 text-right font-medium">Missed</th>
                <th className="py-2 pl-4 font-medium">Lost to</th>
              </tr>
            </thead>
            <tbody>
              {[...views].reverse().map((v) => (
                <tr key={v.start} className={`border-t border-white/10 ${v.paid ? "" : "text-white/40"}`}>
                  <td className="py-2">{periodName(v.start)}</td>
                  <td className={`py-2 ${v.balanced === "no" ? "font-semibold text-red-light" : ""}`}>{v.balanced}</td>
                  <td className="py-2 text-right tabular-nums">{v.totalPoints}</td>
                  <td className="py-2 text-right tabular-nums">{v.percent}%</td>
                  <td className="py-2 text-right tabular-nums">{v.paid ? gbp(v.earned, 2) : "–"}</td>
                  <td className={`py-2 text-right tabular-nums ${v.missed > 100 ? "text-red-light" : ""}`}>{v.paid ? gbp(v.missed, 2) : "–"}</td>
                  <td className="py-2 pl-4 text-xs text-white/60">{v.lostToCause.map((c) => (c.points ? `${c.cause} −${c.points}` : c.cause)).join(" · ") || "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}

// ── Cash ───────────────────────────────────────────────────────────────────────────────────────

function CashTab({ data }: { data: BranchData }) {
  const days = data.days ?? [];
  const missed = days.filter((d) => d.declared === "not complete");
  const byYear = (rows: { date: string; amount: number; type: string }[]) => {
    const y = new Map<string, { short: number; shortN: number; surplus: number; surplusN: number }>();
    for (const r of rows) {
      const k = r.date.slice(0, 4);
      const t = y.get(k) ?? { short: 0, shortN: 0, surplus: 0, surplusN: 0 };
      if (r.type === "Shortage") {
        t.short += r.amount;
        t.shortN++;
      } else {
        t.surplus += r.amount;
        t.surplusN++;
      }
      y.set(k, t);
    }
    return [...y];
  };
  const pouchYears = byYear(data.pouches ?? []);
  const bigPouches = [...(data.pouches ?? [])].sort((a, b) => b.amount - a.amount).slice(0, 5);
  const rollMiss = (data.rollovers ?? []).filter((r) => r.completed === "no");
  const opsYear = (type: string) => {
    const y = new Map<string, number>();
    for (const o of data.ops ?? []) if (o.type === type) y.set(o.year, (y.get(o.year) ?? 0) + o.value);
    return [...y].sort();
  };
  const tcLoss = opsYear("Transaction Corrections - Debit Loss Value");
  const tcGain = opsYear("Transaction Corrections - Credit Gain Value");
  const rollResult = opsYear("Trading Period Rollover Result");

  return (
    <>
      <Section title="Excess cash, day by day" sub="Lower is better: excess cash costs points and it's cash at risk in the branch. Look for the red runs: they usually start with a collection where too little was returned.">
        {days.length ? <ExcessCashCalendar days={days} /> : <Empty what="Daily cash and declarations" />}
      </Section>
      <Section title="Declarations">
        {days.length ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <Card label="Days not completed" value={int(missed.length)} note={missed.length ? `Latest: ${missed.slice(-3).map((d) => d.date.split("-").reverse().join("/")).join(", ")}` : "None in this export"} tone={missed.length ? "bad" : "good"} />
            <Card label="Days with over £10k excess" value={int(days.filter((d) => (d.excessCash ?? 0) > 10000).length)} note={`out of ${int(days.length)} days`} />
            <Card label="Collections" value={int(days.filter((d) => d.service === "collection").length)} note={`${int(days.filter((d) => /failed/.test(d.service)).length)} failed`} />
          </div>
        ) : (
          <Empty what="Daily cash and declarations" />
        )}
      </Section>
      <Section title="Cash pouch errors" sub="Shortages and surpluses found when your pouches were counted.">
        {pouchYears.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-white/45">
                    <th className="py-2 font-medium">Year</th>
                    <th className="py-2 text-right font-medium">Shortages</th>
                    <th className="py-2 text-right font-medium">Surpluses</th>
                  </tr>
                </thead>
                <tbody>
                  {pouchYears.map(([y, t]) => (
                    <tr key={y} className="border-t border-white/10">
                      <td className="py-2">{y}</td>
                      <td className="py-2 text-right tabular-nums">{t.shortN} · {gbp(t.short)}</td>
                      <td className="py-2 text-right tabular-nums">{t.surplusN} · {gbp(t.surplus)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-white/55">Largest: {bigPouches.map((p) => `${gbp(p.amount)} ${p.type.toLowerCase()} on ${p.date.split("-").reverse().join("/")}`).join("; ")}. Check each has been resolved.</p>
          </>
        ) : (
          <Empty what="Cash pouch errors" />
        )}
      </Section>
      <Section title="Monthly balancing">
        {data.rollovers?.length ? (
          rollMiss.length ? (
            <ul className="space-y-1 text-sm">{rollMiss.map((r) => <li key={r.start} className="text-red-light">Not done in its week: {r.period} (window {r.window}{r.doneAt ? `, done ${r.doneAt}` : ""})</li>)}</ul>
          ) : (
            <p className="text-sm text-emerald-300">Every monthly balance in this export was done in its week.</p>
          )
        ) : (
          <Empty what="Monthly balancing" />
        )}
        {data.rollovers?.find((r) => r.completed === "not due") && (
          <p className="mt-2 text-xs text-white/55">Coming up: {data.rollovers.filter((r) => r.completed === "not due").map((r) => `${r.window} (group ${r.group})`).join("; ")}.</p>
        )}
      </Section>
      {(tcLoss.length > 0 || rollResult.length > 0) && (
        <Section title="Corrections and balance results by year" sub="From your operational reporting. Debit losses are corrections taken from the branch; credit gains are corrections in its favour.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-white/45">
                  <th className="py-2 font-medium">Year</th>
                  <th className="py-2 text-right font-medium">Debit losses</th>
                  <th className="py-2 text-right font-medium">Credit gains</th>
                  <th className="py-2 text-right font-medium">Balance results</th>
                </tr>
              </thead>
              <tbody>
                {[...new Set([...tcLoss, ...tcGain, ...rollResult].map(([y]) => y))].sort().map((y) => (
                  <tr key={y} className="border-t border-white/10">
                    <td className="py-2">{y}</td>
                    <td className="py-2 text-right tabular-nums">{gbp(tcLoss.find(([k]) => k === y)?.[1] ?? 0)}</td>
                    <td className="py-2 text-right tabular-nums">{gbp(tcGain.find(([k]) => k === y)?.[1] ?? 0)}</td>
                    <td className="py-2 text-right tabular-nums">{gbp(rollResult.find(([k]) => k === y)?.[1] ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}
    </>
  );
}

// ── Counter accuracy ───────────────────────────────────────────────────────────────────────────

const counterMeasures = [
  ["Rejected Postage Labels", "Rejected Postage Labels Value", "Rejected postage labels"],
  ["Spoilt Postage Labels", "Spoilt Postage Labels Value", "Spoilt postage labels"],
  ["Reversals", "Reversals Value", "Reversals"],
  ["Underpaid Mail", null, "Underpaid mail"],
  ["Prohibited and Restricted Mail Items", null, "Prohibited or restricted items"],
  ["Customer Complaints", null, "Customer complaints"],
] as const;

function CounterTab({ data }: { data: BranchData }) {
  const ops = data.ops ?? [];
  if (!ops.length) return <Empty what="Operational reporting" />;
  const years = [...new Set(ops.map((o) => o.year))].sort().slice(-4);
  const sum = (type: string, y: string) => ops.filter((o) => o.type === type && o.year === y).reduce((a, o) => a + o.value, 0);
  const avg = (type: string, y: string) => {
    const v = ops.filter((o) => o.type === type && o.year === y);
    return v.length ? v.reduce((a, o) => a + o.value, 0) / v.length : null;
  };
  return (
    <Section title="Counter accuracy by year" sub="Mistakes that cost money or time. Falling numbers mean training is working. The latest year is the year so far.">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-white/45">
              <th className="py-2 font-medium">Measure</th>
              {years.map((y) => <th key={y} className="py-2 text-right font-medium">{y}</th>)}
            </tr>
          </thead>
          <tbody>
            {counterMeasures.map(([vol, val, label]) => (
              <tr key={vol} className="border-t border-white/10">
                <td className="py-2">{label}</td>
                {years.map((y) => (
                  <td key={y} className="py-2 text-right tabular-nums">
                    {int(sum(vol, y))}
                    {val && <span className="block text-xs text-white/45">{gbp(sum(val, y))}</span>}
                  </td>
                ))}
              </tr>
            ))}
            {["Cash Declarations Completed", "Cash Declaration Accuracy"].map((t) => (
              <tr key={t} className="border-t border-white/10">
                <td className="py-2">{t.replace("Cash Declarations", "Declarations").replace("Cash Declaration", "Declaration")}</td>
                {years.map((y) => {
                  const a = avg(t, y);
                  return <td key={y} className="py-2 text-right tabular-nums">{a === null ? "–" : `${Math.round(a)}%`}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

// ── Busy hours ─────────────────────────────────────────────────────────────────────────────────

function HoursTab({ data }: { data: BranchData }) {
  const [cat, setCat] = useState("All");
  const rows = data.hours ?? [];
  if (!rows.length) return <Empty what="Transactions by hour" />;
  const cats = ["All", ...new Set(rows.map((r) => r.category))];
  const use = rows.filter((r) => cat === "All" || r.category === cat);
  const grid = new Map<string, number>();
  for (const r of use) grid.set(`${r.weekday}|${r.hour}`, (grid.get(`${r.weekday}|${r.hour}`) ?? 0) + r.transactions);
  const hours = [...new Set(rows.filter((r) => rows.some((x) => x.hour === r.hour && x.transactions > 0)).map((r) => r.hour))].sort();
  const days = DAYS.filter((d) => rows.some((r) => r.weekday === d && r.transactions > 0));
  const counts = [...grid.values()].filter((v) => v > 0);
  const max = Math.max(1, ...counts);
  const min = Math.min(max, ...counts);
  // Colour by rank, so a couple of very busy slots don't wash everything else out.
  const sorted = [...counts].sort((a, b) => a - b);
  const scale = (v: number) => (sorted.length < 2 ? 1 : sorted.lastIndexOf(v) / (sorted.length - 1));
  const total = [...grid.values()].reduce((a, b) => a + b, 0);
  const busiest = [...grid].sort((a, b) => b[1] - a[1]).slice(0, 3);
  return (
    <Section title="When the counter is busy" sub="Transactions by day and hour for the period you exported. Red is busiest, blue is quietest: plan two people for the red slots and one for the blue.">
      <div role="radiogroup" aria-label="Category" className="mb-4 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button key={c} role="radio" aria-checked={cat === c} onClick={() => setCat(c)} className={`rounded-full px-3 py-1.5 text-xs ${cat === c ? "bg-white font-semibold text-[#06173a]" : "border border-white/15 text-white/70"}`}>{c}</button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="text-xs">
          <thead>
            <tr>
              <th />
              {hours.map((h) => <th key={h} className="px-0.5 pb-1 font-normal text-white/50">{h.slice(0, 2)}</th>)}
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d}>
                <td className="pr-2 text-white/60">{d.slice(0, 3)}</td>
                {hours.map((h) => {
                  const v = grid.get(`${d}|${h}`) ?? 0;
                  return (
                    <td key={h} className="p-0.5">
                      <div title={`${d} ${h}: ${int(v)} transactions`} className="flex h-10 w-12 items-center justify-center rounded-[4px] font-semibold tabular-nums" style={{ background: v ? heat(scale(v)) : "rgba(255,255,255,0.03)", color: v && Math.abs(scale(v) - 0.5) < 0.22 ? "#06173a" : "#fff" }}>
                        {v ? int(v) : ""}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center gap-3 text-xs text-white/60" aria-hidden>
        <span>Quieter ({int(min)})</span>
        <span className="h-3 w-48 rounded-full" style={{ background: `linear-gradient(90deg, ${heat(0)}, ${heat(0.5)}, ${heat(1)})` }} />
        <span>Busier ({int(max)})</span>
      </div>
      <p className="mt-3 text-sm text-white/65">{int(total)} transactions in this export. Busiest: {busiest.map(([k, v]) => `${k.split("|")[0]} ${k.split("|")[1]} (${int(v)})`).join(", ")}.</p>
    </Section>
  );
}

// ── Parcels and footfall ───────────────────────────────────────────────────────────────────────

function ParcelsTab({ data }: { data: BranchData }) {
  const parcels = data.parcels ?? [];
  const weeks = [...new Set(parcels.map((p) => p.week))];
  const activeWeeks = weeks.filter((w) => parcels.filter((p) => p.week === w).reduce((a, p) => a + p.volume, 0) > 0).length || 1;
  const byProduct = new Map<string, number>();
  for (const p of parcels) byProduct.set(p.product, (byProduct.get(p.product) ?? 0) + p.volume);
  const rows = [...byProduct].map(([label, v]) => ({ label, value: v / activeWeeks })).filter((r) => r.value >= 0.5).sort((a, b) => b.value - a.value);
  const carrier = (label: string) => label.replace(/^customer\s+(drop[\s-]?off|pick[\s-]?up)\s*-\s*/i, "");
  const dropRows = rows.filter((r) => /drop[\s-]?off/i.test(r.label)).map((r) => ({ ...r, label: carrier(r.label) }));
  const pickRows = rows.filter((r) => /pick[\s-]?up/i.test(r.label)).map((r) => ({ ...r, label: carrier(r.label) }));
  const otherRows = rows.filter((r) => !/drop[\s-]?off|pick[\s-]?up/i.test(r.label));
  const drop = dropRows.reduce((a, r) => a + r.value, 0);
  const pick = pickRows.reduce((a, r) => a + r.value, 0);

  const sessions = data.sessions ?? [];
  const years = new Map<string, number[]>();
  for (const s of sessions) years.set(s.year, [...(years.get(s.year) ?? []), s.sessions]);
  const yearRows = [...years]
    .sort()
    .map(([y, v]) => {
      const sorted = [...v].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)] ?? 0;
      const open = v.filter((x) => x > median * 0.25);
      return { label: y, value: open.length ? open.reduce((a, b) => a + b, 0) / open.length : 0, note: `${open.length} weeks${v.length - open.length ? `, ${v.length - open.length} closed or missing` : ""}` };
    })
    .filter((r) => r.value > 0);

  return (
    <>
      <Section title="Parcels a week" sub={`Average over ${activeWeeks} week${activeWeeks === 1 ? "" : "s"}. Pair this with the Staffing tab in the Remuneration Analyser to see what this volume earns per staff hour.`}>
        {rows.length ? (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">Customer drop-offs</p>
                <p className="mt-1 font-display text-3xl font-bold">{int(drop)} <span className="text-base font-normal text-white/55">a week</span></p>
                <div className="mt-2">{dropRows.length ? <><Columns rows={dropRows} /><ColumnLabels rows={dropRows} /></> : <p className="text-sm text-white/50">None in this export.</p>}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">Customer pick-ups</p>
                <p className="mt-1 font-display text-3xl font-bold">{int(pick)} <span className="text-base font-normal text-white/55">a week</span></p>
                <div className="mt-2">{pickRows.length ? <><Columns rows={pickRows} /><ColumnLabels rows={pickRows} /></> : <p className="text-sm text-white/50">None in this export.</p>}</div>
              </div>
            </div>
            {otherRows.length > 0 && <div className="mt-6"><Bars rows={otherRows} unit="" tone="#8a93a6" /></div>}
          </>
        ) : (
          <Empty what="parcel drop-offs and pick-ups" />
        )}
      </Section>
      <Section title="Customer sessions: your footfall" sub="Average customer sessions a week in each financial year. Weeks with almost none (closures or missing data) are left out of the average.">
        {yearRows.length ? <Bars rows={yearRows} unit="" tone="#1D9E75" /> : <Empty what="Customer sessions by week" />}
      </Section>
    </>
  );
}

// ── Quick check (typed in) ─────────────────────────────────────────────────────────────────────

function QuickTab({ rules }: { rules: OeiRules }) {
  const [f, setF] = useState({ eligible: 7000, balancedOnTime: true, failedDeclarations: 0, avgExcessCash: 0, pouchErrors: 0, cashReturned: 0, avgExcessStamps: 0 });
  const start = new Date().toISOString().slice(0, 10);
  const r = quickScore(rules, { start, ...f });
  const field = (k: keyof typeof f, label: string, step = 1, prefix?: string) => (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.12em] text-white/50">{label}</span>
      <span className="mt-1 flex items-center rounded-md border border-white/15 bg-white/[0.04] px-3">
        {prefix && <span className="text-white/50">{prefix}</span>}
        <input type="number" inputMode="decimal" min={0} step={step} value={f[k] as number} onChange={(e) => setF({ ...f, [k]: Math.max(0, Number(e.target.value) || 0) })} className="w-full bg-transparent py-2 pl-1 text-white outline-none" />
      </span>
    </label>
  );
  return (
    <Section title="Quick check" sub="No files? Type in this period's numbers from the Operational Excellence page on Branch Hub.">
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-4">
        {field("eligible", "Remuneration this period", 50, "£")}
        {field("failedDeclarations", "Days declarations missed")}
        {field("avgExcessCash", "Average excess cash", 100, "£")}
        {field("pouchErrors", "Cash pouch errors")}
        {field("cashReturned", "Cash returned this month", 10000, "£")}
        {field("avgExcessStamps", "Average excess stamp stock", 100, "£")}
        <label className="col-span-2 flex items-center gap-3 self-end pb-2 text-sm">
          <input type="checkbox" checked={f.balancedOnTime} onChange={(e) => setF({ ...f, balancedOnTime: e.target.checked })} className="h-5 w-5 accent-[#e0241b]" />
          Monthly balance done in its week
        </label>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Card label="Points" value={String(r.points)} tone={r.points >= 97 ? "good" : r.points < 90 ? "bad" : undefined} />
        <Card label="Payment" value={gbp(r.payment, 2)} note={`${r.percent}% of a possible ${r.maxPercent}% (${gbp(r.possible, 2)})`} tone={r.balancedOnTime ? undefined : "bad"} />
        <Card label="Missing out on" value={gbp(r.possible - r.payment, 2)} note={`One point ≈ ${gbp(r.pointValue, 2)} this period`} />
      </div>
      {!r.balancedOnTime && <p className="mt-3 text-sm text-red-light">Without the monthly balance done in its week, nothing is paid this month, whatever the points.</p>}
      <ul className="mt-4 space-y-2 text-sm">
        {r.parts.filter((p) => p.points > 0).map((p) => (
          <li key={p.cause} className="flex justify-between rounded-lg border border-white/10 px-4 py-2">
            <span>{p.cause} <span className="text-xs text-white/50">−{p.points} points{"note" in p && p.note ? ` (${p.note})` : ""}</span></span>
            <b>{gbp(p.pounds, 2)}</b>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-white/45">What counts as remuneration here: {r.eligibleNote}</p>
    </Section>
  );
}

// ── The page ───────────────────────────────────────────────────────────────────────────────────

export function BranchCheck({ viewer }: { viewer: string }) {
  const [rules, setRules] = useState<OeiRules | null>(null);
  const [rulesError, setRulesError] = useState(false);
  const [data, setData] = useState<BranchData>({});
  const [loaded, setLoaded] = useState<string[]>([]);
  const [problem, setProblem] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("oei");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/tools/branch-check/rules", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setRules)
      .catch(() => setRulesError(true));
  }, []);

  async function add(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setProblem("");
    const skipped: string[] = [];
    let next = data;
    const names: string[] = [];
    for (const f of [...files].slice(0, 20)) {
      if (!/\.(csv|xls)$/i.test(f.name)) {
        skipped.push(f.name);
        continue;
      }
      try {
        const got = readBranchFile(f.name, new Uint8Array(await f.arrayBuffer()));
        if (got) {
          next = merge(next, got);
          names.push(...Object.keys(got));
        } else skipped.push(f.name);
      } catch {
        skipped.push(f.name);
      }
    }
    setData(next);
    setLoaded((l) => [...new Set([...l, ...names])]);
    if (skipped.length) setProblem(`Not recognised: ${skipped.join(", ")}. Use the CSV or XLS exports from Branch Hub.`);
    setBusy(false);
    if (input.current) input.current.value = "";
  }

  const tabs: [Tab, string][] = [
    ["oei", "Operational Excellence"],
    ["cash", "Cash"],
    ["counter", "Counter accuracy"],
    ["hours", "Busy hours"],
    ["parcels", "Parcels and footfall"],
    ["quick", "Quick check"],
  ];

  return (
    <Protected viewer={viewer} onIdle={() => { setData({}); setLoaded([]); }}>
      <div className="text-white">
        <div
          className="rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-5"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            add(e.dataTransfer.files);
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-display text-lg font-bold">{loaded.length ? "Your Branch Hub files" : "Add your Branch Hub exports"}</p>
              <p className="text-sm text-white/60">Drop in the CSV or XLS files (as many as you like, all at once). Each one is recognised automatically.</p>
              <p className="mt-1 text-xs text-emerald-300">Read on this device only. Never uploaded or stored.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => input.current?.click()} disabled={busy} className="bg-red px-5 py-3 text-sm font-semibold hover:bg-red-dark disabled:opacity-60">{busy ? "Reading…" : "Add files"}</button>
              {loaded.length > 0 && <button onClick={() => { setData({}); setLoaded([]); }} className="border border-white/25 px-5 py-3 text-sm hover:bg-white/10">Clear</button>}
            </div>
            <input ref={input} type="file" accept=".csv,.xls,text/csv,application/vnd.ms-excel" multiple hidden onChange={(e) => add(e.target.files)} />
          </div>
          <ul className="mt-4 grid gap-1.5 text-xs sm:grid-cols-2 lg:grid-cols-4">
            {fileKinds.map((k) => (
              <li key={k.key} className={loaded.includes(k.key) ? "text-emerald-300" : "text-white/45"}>{loaded.includes(k.key) ? "✓" : "○"} {k.label}</li>
            ))}
          </ul>
          {problem && <p className="mt-3 rounded-lg border border-red/40 bg-red/10 px-3 py-2 text-sm text-red-light">{problem}</p>}
        </div>

        <div role="tablist" className="mt-6 flex flex-wrap gap-2">
          {tabs.map(([k, label]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-full px-4 py-2 text-sm transition-colors ${tab === k ? "bg-red font-semibold text-white" : "border border-white/15 text-white/70 hover:text-white"}`}>{label}</button>
          ))}
        </div>

        {(tab === "oei" || tab === "quick") && !rules ? (
          <p className="mt-8 text-sm text-white/55">{rulesError ? "Couldn't load this part. Refresh the page, or sign in again." : "Loading…"}</p>
        ) : (
          <div className="mt-2">
            {tab === "oei" && rules && <OeiTab data={data} rules={rules} />}
            {tab === "cash" && <CashTab data={data} />}
            {tab === "counter" && <CounterTab data={data} />}
            {tab === "hours" && <HoursTab data={data} />}
            {tab === "parcels" && <ParcelsTab data={data} />}
            {tab === "quick" && rules && <QuickTab rules={rules} />}
          </div>
        )}

        <p className="mt-10 text-xs leading-relaxed text-white/45">
          For information and education, not advice. Figures come from your own Branch Hub exports; for any question about your score or a correction, Branch Hub and the Branch Support Centre are the official source.
          FCM Intelligence isn&apos;t part of, or endorsed by, Post Office Limited.
        </p>
      </div>
    </Protected>
  );
}
