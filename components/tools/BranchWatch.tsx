"use client";

// Branch Check: the cash and losses watch and counter accuracy. Built only from the member's own
// Branch Hub exports; the advice is FCM's own general counter practice, not Post Office material.

import { lastTwelve, opsMonth, opsSeries, type BranchData } from "@/lib/branch-hub";

const gbp = (n: number, dp = 0) => `${n < 0 ? "−" : ""}£${Math.abs(n).toLocaleString("en-GB", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
const int = (n: number) => Math.round(n).toLocaleString("en-GB");
const monthName = (ym: string) => new Date(ym + "-15T12:00:00Z").toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
const short = (v: number) => (Math.abs(v) >= 1000 ? `£${(Math.abs(v) / 1000).toFixed(1).replace(/\.0$/, "")}k` : `£${Math.round(Math.abs(v))}`);

function monthsBetween(from: string, to: string) {
  const out: string[] = [];
  for (let d = new Date(from + "-15T12:00:00Z"); d.toISOString().slice(0, 7) <= to; d.setUTCMonth(d.getUTCMonth() + 1)) out.push(d.toISOString().slice(0, 7));
  return out;
}

function latestMonth(data: BranchData) {
  const all = [
    ...(data.ops ?? []).map((o) => opsMonth(o.year, o.month)),
    ...(data.days ?? []).map((d) => d.date.slice(0, 7)),
    ...(data.pouches ?? []).map((p) => p.date.slice(0, 7)),
  ].filter((m): m is string => !!m);
  return all.sort().at(-1) ?? new Date().toISOString().slice(0, 7);
}

// ── charts ──────────────────────────────────────────────────────────────────────────────────────

/** Month-by-month bars around a zero line: positive values up (blue), negative down (red). */
export function SignedMonths({ series, months, label }: { series: Map<string, { up: number; down: number }>; months: string[]; label: (m: string, v: { up: number; down: number }) => string }) {
  // Square-root scale: one very large month doesn't flatten the rest. The labels carry the real amounts.
  const max = Math.sqrt(Math.max(1, ...months.flatMap((m) => [series.get(m)?.up ?? 0, series.get(m)?.down ?? 0])));
  const h = (v: number) => (v > 0 ? Math.max(3, (Math.sqrt(v) / max) * 80) : 0);
  const H = 80;
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[640px] gap-1">
        {months.map((m) => {
          const v = series.get(m) ?? { up: 0, down: 0 };
          return (
            <div key={m} className="flex min-w-[22px] flex-1 flex-col items-center" title={label(m, v)}>
              <div className="flex w-full flex-col items-center justify-end" style={{ height: H + 16 }}>
                {v.up >= 0.5 && <span className="text-[9px] text-white/60">{short(v.up)}</span>}
                <div className="w-full max-w-[26px] rounded-t-[4px] bg-[#378ADD]" style={{ height: h(v.up) }} />
              </div>
              <div className="h-px w-full bg-white/30" />
              <div className="flex w-full flex-col items-center" style={{ height: H + 16 }}>
                <div className="w-full max-w-[26px] rounded-b-[4px] bg-[#e0241b]" style={{ height: h(v.down) }} />
                {v.down >= 0.5 && <span className={`text-[9px] ${v.down >= 1000 ? "font-bold text-red-light" : "text-white/60"}`}>{short(v.down)}</span>}
              </div>
              <span className="mt-1 text-[9px] text-white/40">{monthName(m)[0]}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-1 text-[11px] text-white/40">{monthName(months[0])} to {monthName(months.at(-1)!)} · bar heights are scaled so smaller months stay visible; the labels are the real amounts</p>
    </div>
  );
}

/** One measure, month by month: single-colour columns with the value on top. */
function MonthColumns({ series, months, money }: { series: Map<string, number>; months: string[]; money?: boolean }) {
  const max = Math.max(1, ...series.values());
  return (
    <div className="flex h-28 items-end gap-[3px]">
      {months.map((m) => {
        const v = series.get(m) ?? 0;
        return (
          <div key={m} className="flex min-w-0 flex-1 flex-col items-center justify-end" title={`${monthName(m)}: ${money ? gbp(v, 2) : int(v)}`}>
            <div className="w-full rounded-t-[3px] bg-[#7F77DD]" style={{ height: Math.max(v ? 2 : 0, (v / max) * 96) }} />
          </div>
        );
      })}
    </div>
  );
}

// ── Cash and losses watch ───────────────────────────────────────────────────────────────────────

type Alert = { tone: "red" | "amber" | "green"; title: string; detail: string; check?: string };

function cashAlerts(data: BranchData, end: string): Alert[] {
  const out: Alert[] = [];
  const yearAgo = (() => {
    const d = new Date(end + "-15T12:00:00Z");
    d.setUTCMonth(d.getUTCMonth() - 11);
    return d.toISOString().slice(0, 7);
  })();

  const pouches = (data.pouches ?? []).filter((p) => p.date.slice(0, 7) >= yearAgo);
  if (data.pouches) {
    const big = pouches.filter((p) => p.amount >= 500);
    const shortVal = pouches.filter((p) => p.type === "Shortage").reduce((a, p) => a + p.amount, 0);
    if (big.length)
      out.push({
        tone: "red",
        title: `${big.length} large pouch error${big.length === 1 ? "" : "s"} in the last 12 months`,
        detail: big.map((p) => `${gbp(p.amount)} ${p.type.toLowerCase()} on ${p.date.split("-").reverse().join("/")}`).join("; "),
        check: "Make sure each has a transaction correction you've accepted or disputed, and that the team counts and seals every pouch with two people.",
      });
    else if (pouches.length) out.push({ tone: "amber", title: `${pouches.length} pouch errors in the last 12 months, none over £500`, detail: `Shortages total ${gbp(shortVal)}.` });
    else out.push({ tone: "green", title: "No pouch errors in the last 12 months", detail: "" });
  }

  if (data.ops) {
    const loss = lastTwelve(opsSeries(data.ops, "Transaction Corrections - Debit Loss Value"), end);
    const gain = lastTwelve(opsSeries(data.ops, "Transaction Corrections - Credit Gain Value"), end);
    if (loss.now > 0)
      out.push({
        tone: loss.now > 2000 ? "red" : "amber",
        title: `${gbp(loss.now)} of corrections taken from the branch in the last 12 months`,
        detail: `${gbp(gain.now)} came back in your favour. The 12 months before: ${gbp(loss.before)} taken, ${gbp(gain.before)} back.`,
        check: "Look at each correction over £100 and its reason. Repeated causes point to a process or training gap.",
      });
    const roll = opsSeries(data.ops, "Trading Period Rollover Result").filter((s) => s.month >= yearAgo);
    const neg = roll.filter((s) => s.value < 0);
    if (neg.length)
      out.push({
        tone: neg.reduce((a, s) => a + s.value, 0) < -1000 ? "red" : "amber",
        title: `Monthly balance came out short ${neg.length} time${neg.length === 1 ? "" : "s"} in the last 12 months`,
        detail: `${gbp(neg.reduce((a, s) => a + s.value, 0))} in total. Worst: ${neg.sort((a, b) => a.value - b.value).slice(0, 3).map((s) => `${monthName(s.month)} ${gbp(s.value)}`).join(", ")}.`,
        check: "Find the cause before rolling over each month: check the day's declarations and any large transactions around the dates it started.",
      });
    const remit = opsSeries(data.ops, "Cash Remittance Lower Than Expected - Avg Value").filter((s) => s.month >= yearAgo && s.value > 0);
    if (remit.length)
      out.push({
        tone: "amber",
        title: `Cash returned was lower than expected in ${remit.length} month${remit.length === 1 ? "" : "s"}`,
        detail: `Average shortfall ${gbp(remit.reduce((a, s) => a + s.value, 0) / remit.length)} when it happened.`,
        check: "Return what the retain message allows on every collection: it's the main cause of excess cash.",
      });
  }

  if (data.days) {
    const recent = data.days.filter((d) => d.date.slice(0, 7) >= yearAgo);
    const missed = recent.filter((d) => d.declared === "not complete");
    const failed = recent.filter((d) => /failed/.test(d.service));
    if (missed.length) out.push({ tone: "amber", title: `${missed.length} day${missed.length === 1 ? "" : "s"} without a completed cash declaration`, detail: `Latest: ${missed.slice(-3).map((d) => d.date.split("-").reverse().join("/")).join(", ")}.`, check: "Declare every stock unit used that day before the cut-off, even if it was only used briefly." });
    if (failed.length) out.push({ tone: "amber", title: `${failed.length} failed collection${failed.length === 1 ? "" : "s"}`, detail: failed.map((d) => d.date.split("-").reverse().join("/")).join(", ") });
  }

  if (data.rollovers) {
    const missed = data.rollovers.filter((r) => r.completed === "no" && r.start.slice(0, 7) >= yearAgo);
    out.push(missed.length ? { tone: "red", title: `Monthly balance missed its week ${missed.length} time${missed.length === 1 ? "" : "s"} in the last 12 months`, detail: missed.map((r) => r.window).join("; ") } : { tone: "green", title: "Every monthly balance done in its week (last 12 months)", detail: "" });
  }
  const order = { red: 0, amber: 1, green: 2 };
  return out.sort((a, b) => order[a.tone] - order[b.tone]);
}

export function CashWatch({ data }: { data: BranchData }) {
  const end = latestMonth(data);
  const alerts = cashAlerts(data, end);
  const months = monthsBetween(
    (() => {
      const d = new Date(end + "-15T12:00:00Z");
      d.setUTCMonth(d.getUTCMonth() - 23);
      return d.toISOString().slice(0, 7);
    })(),
    end,
  );
  const corrections = new Map<string, { up: number; down: number }>();
  const balances = new Map<string, { up: number; down: number }>();
  if (data.ops) {
    for (const s of opsSeries(data.ops, "Transaction Corrections - Credit Gain Value")) corrections.set(s.month, { up: s.value, down: corrections.get(s.month)?.down ?? 0 });
    for (const s of opsSeries(data.ops, "Transaction Corrections - Debit Loss Value")) corrections.set(s.month, { up: corrections.get(s.month)?.up ?? 0, down: s.value });
    for (const s of opsSeries(data.ops, "Trading Period Rollover Result")) balances.set(s.month, s.value >= 0 ? { up: s.value, down: 0 } : { up: 0, down: -s.value });
  }
  const tone = { red: "border-red/50 bg-red/[0.08]", amber: "border-[#C9A227]/50 bg-[#C9A227]/[0.07]", green: "border-emerald-400/40 bg-emerald-400/[0.06]" };
  const dot = { red: "bg-red", amber: "bg-[#C9A227]", green: "bg-emerald-400" };

  return (
    <>
      <section className="mt-8">
        <h2 className="font-display text-xl font-bold">Cash and losses watch</h2>
        <p className="mt-1 max-w-3xl text-sm text-white/55">What needs your attention, most serious first. Everything here comes from your own exports.</p>
        {alerts.length ? (
          <ul className="mt-4 space-y-3">
            {alerts.map((a) => (
              <li key={a.title} className={`rounded-xl border p-4 ${tone[a.tone]}`}>
                <p className="flex items-center gap-2 font-semibold">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot[a.tone]}`} aria-hidden />
                  <span className="sr-only">{a.tone === "red" ? "Act now:" : a.tone === "amber" ? "Keep an eye on:" : "Good:"}</span>
                  {a.title}
                </p>
                {a.detail && <p className="mt-1 text-sm text-white/70">{a.detail}</p>}
                {a.check && <p className="mt-1 text-sm text-white/55"><b className="text-white/80">What to check:</b> {a.check}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-white/55">Add your cash pouch errors, daily cash and declarations, monthly balancing and operational reporting exports to see this.</p>
        )}
      </section>

      {corrections.size > 0 && (
        <section className="mt-8">
          <h3 className="font-display text-lg font-bold">Corrections, month by month</h3>
          <p className="mt-1 text-sm text-white/55">Blue: corrections in your favour. Red: corrections taken from the branch.</p>
          <div className="mt-4">
            <SignedMonths series={corrections} months={months} label={(m, v) => `${monthName(m)}: ${gbp(v.up, 2)} in your favour, ${gbp(v.down, 2)} taken`} />
          </div>
        </section>
      )}
      {balances.size > 0 && (
        <section className="mt-8">
          <h3 className="font-display text-lg font-bold">Monthly balance results</h3>
          <p className="mt-1 text-sm text-white/55">Blue: over. Red: short. Months with no bar balanced with no difference recorded.</p>
          <div className="mt-4">
            <SignedMonths series={balances} months={months} label={(m, v) => `${monthName(m)}: ${v.down ? `short ${gbp(v.down, 2)}` : `over ${gbp(v.up, 2)}`}`} />
          </div>
        </section>
      )}
    </>
  );
}

// ── Counter accuracy ────────────────────────────────────────────────────────────────────────────

const measures = [
  { type: "Rejected Postage Labels", value: "Rejected Postage Labels Value", label: "Rejected postage labels", tip: "Weigh and measure every item, check the service matches the size, and stick the label flat and clear of seams." },
  { type: "Spoilt Postage Labels", value: "Spoilt Postage Labels Value", label: "Spoilt postage labels", tip: "Check the printer and label roll at the start of the day; confirm the details with the customer before printing." },
  { type: "Reversals", value: "Reversals Value", label: "Reversals", tip: "Confirm the amount and service with the customer before settling; reversals often mean a rushed transaction." },
  { type: "Underpaid Mail", value: null, label: "Underpaid mail", tip: "Use the size guide and scales for letters and large letters, not judgement by eye." },
  { type: "Prohibited and Restricted Mail Items", value: null, label: "Prohibited or restricted items", tip: "Ask the prohibited-items question on every parcel, every time." },
  { type: "Customer Complaints", value: null, label: "Customer complaints", tip: "Read each one with the team: most complaints repeat." },
] as const;

export function CounterAccuracy({ data }: { data: BranchData }) {
  const ops = data.ops ?? [];
  if (!ops.length) return <p className="mt-8 rounded-xl border border-dashed border-white/15 p-6 text-sm text-white/55">Add your Operational reporting export from Branch Hub to see this.</p>;
  const end = latestMonth(data);
  const months = monthsBetween(
    (() => {
      const d = new Date(end + "-15T12:00:00Z");
      d.setUTCMonth(d.getUTCMonth() - 23);
      return d.toISOString().slice(0, 7);
    })(),
    end,
  );
  const rows = measures
    .map((m) => {
      const series = opsSeries(ops, m.type);
      const values = m.value ? opsSeries(ops, m.value) : [];
      const t = lastTwelve(series, end);
      const v = lastTwelve(values, end);
      const change = t.before > 0 ? (t.now - t.before) / t.before : null;
      return { ...m, series: new Map(series.map((s) => [s.month, s.value])), now: t.now, before: t.before, valueNow: v.now, change };
    })
    .filter((r) => r.now > 0 || r.before > 0);
  const valueTotal = rows.reduce((a, r) => a + (r.type === "Reversals" ? 0 : r.valueNow), 0);
  const worst = [...rows].filter((r) => r.change !== null && r.change > 0).sort((a, b) => (b.change ?? 0) - (a.change ?? 0))[0];

  return (
    <>
      <section className="mt-8">
        <h2 className="font-display text-xl font-bold">Counter accuracy</h2>
        <p className="mt-1 max-w-3xl text-sm text-white/55">Mistakes at the counter over the last 12 months, against the 12 before. Each chart shows the last 24 months.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">Rejected and spoilt labels</p>
            <p className="mt-1 font-display text-3xl font-bold">{gbp(valueTotal)}</p>
            <p className="text-xs text-white/50">Postage value, last 12 months</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">Mistakes, last 12 months</p>
            <p className="mt-1 font-display text-3xl font-bold">{int(rows.reduce((a, r) => a + r.now, 0))}</p>
            <p className="text-xs text-white/50">{int(rows.reduce((a, r) => a + r.before, 0))} the 12 months before</p>
          </div>
          <div className={`rounded-2xl border p-5 ${worst ? "border-red/50 bg-red/[0.08]" : "border-emerald-400/40 bg-emerald-400/[0.06]"}`}>
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">Focus on</p>
            <p className="mt-1 font-display text-xl font-bold">{worst ? worst.label : "Nothing rising"}</p>
            <p className="text-xs text-white/50">{worst ? `Up ${Math.round((worst.change ?? 0) * 100)}% on the year before` : "Every measure is flat or falling"}</p>
          </div>
        </div>
      </section>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {rows.map((r) => (
          <section key={r.type} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-semibold">{r.label}</h3>
              <p className="text-right text-sm tabular-nums">
                <b>{int(r.now)}</b>
                {r.value && r.valueNow > 0 && <span className="text-white/55"> · {gbp(r.valueNow)}</span>}
                {r.change !== null && (
                  <span className={`ml-2 text-xs ${r.change > 0.05 ? "text-red-light" : r.change < -0.05 ? "text-emerald-300" : "text-white/50"}`}>
                    {r.change > 0 ? "▲" : r.change < 0 ? "▼" : "•"} {Math.abs(Math.round(r.change * 100))}%
                  </span>
                )}
              </p>
            </div>
            <div className="mt-3">
              <MonthColumns series={r.series} months={months} />
              <p className="mt-1 flex justify-between text-[10px] text-white/40"><span>{monthName(months[0])}</span><span>{monthName(months.at(-1)!)}</span></p>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/55"><b className="text-white/75">Tip:</b> {r.tip}</p>
          </section>
        ))}
      </div>
    </>
  );
}
