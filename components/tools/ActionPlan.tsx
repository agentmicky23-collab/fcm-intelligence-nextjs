"use client";

// Branch Check: the action plan. Reads everything loaded and turns it into findings with a £ value
// where we can put one, and the actions to take. Advice is FCM's own; numbers are the member's own.

import { lastTwelve, opsMonth, opsSeries, periodViews, type BranchData, type OeiRules } from "@/lib/branch-hub";
import { breakdown, services, type Statement } from "@/lib/remuneration";

const gbp = (n: number) => `${n < 0 ? "−" : ""}£${Math.round(Math.abs(n)).toLocaleString("en-GB")}`;
const int = (n: number) => Math.round(n).toLocaleString("en-GB");
const pct = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(Math.round(n * 100))}%`;
const ukDate = (iso: string) => iso.split("-").reverse().join("/");
const monthName = (ym: string) => new Date(ym + "-15T12:00:00Z").toLocaleDateString("en-GB", { month: "short", year: "numeric" });

type Priority = "now" | "month" | "watch" | "good";
type Item = { priority: Priority; area: string; title: string; found: string; worth?: string; actions: string[]; worthValue?: number };

function sessionYears(data: BranchData) {
  const years = new Map<string, Map<number, number>>();
  for (const s of data.sessions ?? []) {
    const m = years.get(s.year) ?? new Map<number, number>();
    m.set(s.week, s.sessions);
    years.set(s.year, m);
  }
  return [...years].sort((a, b) => a[0].localeCompare(b[0]));
}

const avg = (v: number[]) => (v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0);

export function buildPlan(data: BranchData, statement: Statement | null, rules: OeiRules | null): Item[] {
  const items: Item[] = [];
  const years = sessionYears(data);
  const remPerYear = statement ? breakdown(statement).perYear : null;

  // ── Footfall ──
  let valuePerVisit: number | null = null;
  if (years.length >= 2) {
    const [thisY, thisW] = years.at(-1)!;
    const [lastY, lastW] = years.at(-2)!;
    const same = [...thisW.keys()].filter((w) => (thisW.get(w) ?? 0) > 300 && (lastW.get(w) ?? 0) > 300);
    const now = same.reduce((a, w) => a + (thisW.get(w) ?? 0), 0);
    const before = same.reduce((a, w) => a + (lastW.get(w) ?? 0), 0);
    const recentWeeks = [...thisW.values()].filter((v) => v > 300).slice(-8);
    const perWeek = avg(recentWeeks);
    if (statement && perWeek) valuePerVisit = breakdown(statement).perWeek / perWeek;
    const yearly = years.map(([y, w]) => ({ y, avg: avg([...w.values()].filter((v) => v > 300)) })).filter((r) => r.avg);
    const peak = yearly.reduce((a, r) => (r.avg > a.avg ? r : a), yearly[0]);
    if (same.length >= 4 && before) {
      const change = now / before - 1;
      const lostPerYear = ((before - now) / same.length) * 52;
      items.push({
        priority: change < -0.03 ? "now" : change < 0 ? "month" : "good",
        area: "Footfall",
        title: change < 0 ? `Fewer customers: ${pct(change)} on the same weeks last year` : `More customers: ${pct(change)} on the same weeks last year`,
        found: `${thisY} so far averages ${int(now / same.length)} customer visits a week against ${int(before / same.length)} in the same weeks of ${lastY}. Your busiest year was ${peak.y} at ${int(peak.avg)} a week.`,
        worth: valuePerVisit && change < 0 ? `About ${gbp(lostPerYear * valuePerVisit)} a year of remuneration at ${`£${valuePerVisit.toFixed(2)}`} a visit, before what those customers spend in the shop.` : undefined,
        worthValue: valuePerVisit && change < 0 ? lostPerYear * valuePerVisit : 0,
        actions:
          change < 0
            ? [
                "Check your Google listing: opening hours, photos, and that every Post Office service you offer is listed.",
                "Ask why: has a competitor opened a parcel point or Post Office nearby, or a bank closed (which should bring customers in)?",
                "Make the services that bring people in visible from the street: banking, parcel drop-off and collection, travel money.",
              ]
            : ["Keep doing what's working, and track it each month."],
      });
    }

    // Christmas peak
    const peaks = years
      .map(([y, w]) => ({ y, peak: Math.max(...[35, 36, 37, 38].map((k) => w.get(k) ?? 0)), base: avg([...w.values()].filter((v) => v > 300)) }))
      .filter((r) => r.peak > 300 && r.base);
    if (peaks.length >= 3) {
      const first = peaks[0];
      const last = peaks.at(-1)!;
      const lift = (r: { peak: number; base: number }) => r.peak / r.base - 1;
      const falling = last.peak < first.peak;
      items.push({
        priority: falling ? "month" : "good",
        area: "Footfall",
        title: falling ? `Christmas is getting quieter: busiest week down ${pct(last.peak / first.peak - 1).replace("−", "")} since ${first.y}` : "Christmas peak is holding up",
        found: `Busiest pre-Christmas week: ${peaks.map((r) => `${r.y} ${int(r.peak)}`).join(", ")}. In ${last.y} it was ${pct(lift(last))} above a normal week, against ${pct(lift(first))} in ${first.y}.`,
        actions: falling
          ? [
              "From early November, promote last posting dates, gift cards and travel money in the window and on social media.",
              "Ask your regular senders (small businesses, online sellers) about their Christmas volumes and offer a set drop-off time.",
              "Plan staff and stock for the peak you'll actually get, not the one you used to get.",
            ]
          : ["Plan staff for the peak weeks in early November."],
      });
    }

    // Unusual weeks (closures or data gaps)
    const [, w] = years.at(-2)!;
    const typical = avg([...w.values()].filter((v) => v > 300));
    const low = [...w].filter(([, v]) => v > 0 && v < typical * 0.7).map(([k]) => k);
    if (low.length)
      items.push({
        priority: "watch",
        area: "Footfall",
        title: `${low.length} unusually quiet week${low.length === 1 ? "" : "s"} last year (${lastY})`,
        found: `${low.length === 1 ? "Week" : "Weeks"} ${low.map((k) => `W${k}`).join(", ")} ${low.length === 1 ? "was" : "were"} well below your normal ${int(typical)} visits a week.`,
        actions: ["Note what happened (closure, roadworks, bank holiday, staff shortage, system outage) so it isn't mistaken for a trend, and claim any reversal you're due."],
      });
  }

  // ── Busy hours, customers and bulk senders ──
  if (data.hourSessions?.length && data.hours?.length) {
    const cust = new Map<string, number>();
    for (const s of data.hourSessions) cust.set(`${s.weekday} ${s.hour}`, (cust.get(`${s.weekday} ${s.hour}`) ?? 0) + s.sessions);
    const tx = new Map<string, number>();
    for (const t of data.hours) tx.set(`${t.weekday} ${t.hour}`, (tx.get(`${t.weekday} ${t.hour}`) ?? 0) + t.transactions);
    const ratio = [...cust].filter(([, c]) => c >= 15).map(([k, c]) => ({ k, c, t: tx.get(k) ?? 0, r: (tx.get(k) ?? 0) / c }));
    const bulk = ratio.filter((x) => x.r >= 1.7).sort((a, b) => b.r - a.r);
    if (bulk.length)
      items.push({
        priority: "month",
        area: "Customers",
        title: `Bulk senders: ${bulk.slice(0, 3).map((b) => b.k).join(", ")}`,
        found: `In these hours each customer does ${bulk.slice(0, 3).map((b) => `${b.r.toFixed(1)}`).join(", ")} transactions, against about 1 the rest of the time: ${bulk.slice(0, 3).map((b) => `${b.k} ${int(b.t)} transactions from ${int(b.c)} customers`).join("; ")}.`,
        actions: [
          "Find out who they are: usually small businesses and online sellers. Get to know them by name.",
          "Agree a regular drop-off time that suits your quiet hours, and encourage pre-paid online postage so their visit is quick.",
          "Offer business services (business account, collections, cash deposits) while you have them at the counter.",
        ],
      });
    const quiet = [...cust].filter(([, c]) => c >= 5).sort((a, b) => a[1] - b[1]).slice(0, 4);
    items.push({
      priority: "watch",
      area: "Staffing",
      title: "Use the quiet hours for the back office",
      found: `Quietest open hours: ${quiet.map(([k, c]) => `${k} (${int(c)})`).join(", ")}.`,
      actions: ["Make up cash pouches, do stock counts and rems, and train staff in these slots, so the busy hours are all counter."],
    });
  }

  // ── Operational Excellence ──
  if (rules && data.periods?.length) {
    const v = periodViews(rules, data.periods).filter((p) => p.paid);
    const last12 = v.slice(-12);
    const missed = last12.reduce((a, p) => a + p.missed, 0);
    const causes = new Map<string, number>();
    for (const p of last12) for (const c of p.lostToCause) causes.set(c.cause, (causes.get(c.cause) ?? 0) + c.pounds);
    const top = [...causes].sort((a, b) => b[1] - a[1]);
    const recent = v.slice(-3);
    const recentMissed = recent.reduce((a, p) => a + p.missed, 0);
    const recentGood = recent.every((p) => p.balanced !== "no") && recentMissed < recent.reduce((a, p) => a + p.possible, 0) * 0.1;
    items.push({
      priority: recentGood ? "good" : recentMissed > 300 ? "now" : "month",
      area: "Operational Excellence",
      title: recentGood
        ? `Operational Excellence on track: ${recent.map((p) => p.totalPoints).join(", ")} points in the last three periods`
        : missed > 0
          ? `${gbp(missed)} of incentive missed in the last 12 paid periods`
          : "Full incentive earned in the last 12 paid periods",
      found: `${gbp(missed)} missed over the last 12 paid periods; last three periods ${recent.map((p) => `${p.totalPoints}`).join(", ")} points. ${top.length ? `Biggest causes over the year: ${top.slice(0, 3).map(([c, x]) => `${c.toLowerCase()} ${gbp(x)}`).join(", ")}.` : ""}`,
      worth: missed > 0 ? `Up to ${gbp(missed)} a year back with full marks.` : undefined,
      worthValue: missed,
      actions: [
        ...(top.some(([c]) => /excess cash/i.test(c)) ? ["Return everything above the retain message on every collection; check the planned order the day before."] : []),
        ...(top.some(([c]) => /declaration/i.test(c)) ? ["Declare every stock unit used each day before the cut-off, including any used for a moment."] : []),
        ...(top.some(([c]) => /pouch/i.test(c)) ? ["Two people count and seal every pouch; make pouches up before the day's declaration."] : []),
        ...(top.some(([c]) => /balance/i.test(c)) ? ["Put the monthly balancing week in the diary for the year and give it to whoever covers your holidays."] : []),
        "Check the Operational Excellence page on Branch Hub weekly, not monthly.",
      ],
    });
  }

  // ── Cash ──
  const end = (() => {
    const all = [...(data.days ?? []).map((d) => d.date.slice(0, 7)), ...(data.ops ?? []).map((o) => opsMonth(o.year, o.month) ?? "")].filter(Boolean).sort();
    return all.at(-1) ?? new Date().toISOString().slice(0, 7);
  })();
  if (data.days?.length) {
    const recent = data.days.slice(-90).filter((d) => d.excessCash !== null);
    const a = avg(recent.map((d) => d.excessCash!));
    const big = recent.filter((d) => (d.excessCash ?? 0) >= 10000);
    const svc = new Map<string, number[]>();
    for (const d of data.days.slice(-365)) if (d.service === "collection" && d.excessCash !== null) svc.set(d.weekday, [...(svc.get(d.weekday) ?? []), d.excessCash]);
    const worstDay = [...svc].filter(([, v]) => v.length >= 3).map(([k, v]) => ({ k, a: avg(v) })).sort((x, y) => y.a - x.a)[0];
    items.push({
      priority: a >= 3000 ? "now" : a >= 1000 ? "month" : "good",
      area: "Cash",
      title: `Excess cash averaging ${gbp(a)} a day over the last 90 days`,
      found: `${big.length} day${big.length === 1 ? "" : "s"} at £10,000 or more.${worstDay ? ` Collections on ${worstDay.k}s leave the most behind (${gbp(worstDay.a)} on average).` : ""}`,
      actions: ["On collection days, return everything above the retain message.", ...(worstDay ? [`Look at what happens before ${worstDay.k} collections: late deposits, or pouches made up after the declaration?`] : [])],
    });
  }
  if (data.pouches?.length) {
    const yearAgo = `${Number(end.slice(0, 4)) - 1}${end.slice(4)}`;
    const recent = data.pouches.filter((p) => p.date.slice(0, 7) > yearAgo);
    const shortVal = recent.filter((p) => p.type === "Shortage").reduce((a, p) => a + p.amount, 0);
    const prior = data.pouches.filter((p) => p.date.slice(0, 7) <= yearAgo && p.date.slice(0, 7) > `${Number(yearAgo.slice(0, 4)) - 1}${yearAgo.slice(4)}`).filter((p) => p.type === "Shortage").reduce((a, p) => a + p.amount, 0);
    const big = recent.filter((p) => p.amount >= 500);
    if (recent.length)
      items.push({
        priority: big.length ? "now" : "watch",
        area: "Cash",
        title: `Pouch shortages ${gbp(shortVal)} in the last 12 months${prior ? ` (${gbp(prior)} the year before)` : ""}`,
        found: `${recent.length} pouch errors.${big.length ? ` Large ones: ${big.map((p) => `${gbp(p.amount)} ${p.type.toLowerCase()} ${ukDate(p.date)}`).join("; ")}.` : ""}`,
        worthValue: shortVal,
        actions: ["Check every correction has been accepted or disputed in time.", "Two-person count and seal for every pouch, with the count written on the slip."],
      });
  }
  if (data.ops?.length) {
    const roll = opsSeries(data.ops, "Trading Period Rollover Result").filter((s) => s.month > `${Number(end.slice(0, 4)) - 1}${end.slice(4)}`);
    const short = roll.filter((s) => s.value < 0);
    const total = short.reduce((a, s) => a + s.value, 0);
    if (short.length)
      items.push({
        priority: total < -1000 ? "now" : "month",
        area: "Cash",
        title: `Monthly balance short ${short.length} times in 12 months (${gbp(total)})`,
        found: `Worst: ${short.sort((a, b) => a.value - b.value).slice(0, 3).map((s) => `${monthName(s.month)} ${gbp(s.value)}`).join(", ")}.`,
        worthValue: -total,
        actions: ["Find each difference before rolling over: check that day's declarations and any large or unusual transactions.", "If the same kind of difference repeats, it's a process: fix the process, not just the month."],
      });
    const loss = lastTwelve(opsSeries(data.ops, "Transaction Corrections - Debit Loss Value"), end);
    if (loss.now > 0)
      items.push({
        priority: loss.now > loss.before ? "month" : "watch",
        area: "Cash",
        title: `${gbp(loss.now)} of corrections taken from the branch in 12 months (${gbp(loss.before)} the year before)`,
        found: loss.now <= loss.before ? "Falling, which is the right direction." : "Rising: worth finding the cause.",
        worthValue: loss.now,
        actions: ["Review each correction over £100 and its reason with the team."],
      });
    // Counter accuracy: anything rising
    const counter = [
      ["Rejected Postage Labels", "rejected postage labels"],
      ["Spoilt Postage Labels", "spoilt labels"],
      ["Reversals", "reversals"],
      ["Underpaid Mail", "underpaid mail"],
      ["Customer Complaints", "customer complaints"],
    ] as const;
    const rising = counter.map(([t, l]) => ({ l, ...lastTwelve(opsSeries(data.ops!, t), end) })).filter((c) => c.before > 0 && c.now > c.before * 1.1);
    items.push(
      rising.length
        ? { priority: "month", area: "Counter", title: `Rising at the counter: ${rising.map((r) => r.l).join(", ")}`, found: rising.map((r) => `${r.l} ${int(r.now)} (was ${int(r.before)})`).join("; "), actions: ["Go through the latest examples with the team and agree one fix for each."] }
        : { priority: "good", area: "Counter", title: "Counter mistakes are falling", found: counter.map(([t, l]) => ({ l, ...lastTwelve(opsSeries(data.ops!, t), end) })).filter((c) => c.before).map((c) => `${c.l} ${int(c.now)} (was ${int(c.before)})`).join("; "), actions: ["Keep it up: recognise the team for it."] },
    );
  }

  // ── Growth ──
  if (statement) {
    const svcs = services(statement)
      .map((s) => ({ s, pay: s.pay(s.extra?.value ?? 0) }))
      .map((x) => ({ ...x, perHour: (x.pay * 60) / x.s.minutes }))
      .sort((a, b) => b.perHour - a.perHour);
    const best = svcs.slice(0, 3);
    const worst = svcs.at(-1);
    items.push({
      priority: "month",
      area: "Growth",
      title: `Grow ${best.map((b) => b.s.label.toLowerCase()).join(", ")} first`,
      found: `They earn the most for the counter time: ${best.map((b) => `${b.s.label} about £${b.perHour.toFixed(0)} an hour`).join(", ")}${worst ? `, against ${worst.s.label.toLowerCase()} at about £${worst.perHour.toFixed(0)}` : ""}.`,
      worth: remPerYear ? `Your remuneration is about ${gbp(remPerYear)} a year; see the Growth planner for what +£1,000 takes in each.` : undefined,
      actions: [
        "Put these on show: window, counter screen and a line from staff at the end of every transaction.",
        "Give staff one simple prompt each (for example, travel money before holidays, passport check and send).",
        "Don't add paid hours for low-paying volume; make it quick instead (pre-paid labels, a drop-off point).",
      ],
    });
    if (valuePerVisit)
      items.push({
        priority: "watch",
        area: "Growth",
        title: `Each customer visit is worth about £${valuePerVisit.toFixed(2)} in remuneration`,
        found: "Remuneration before VAT divided by your recent customer visits.",
        actions: ["Raise the value of each visit: one more service per customer is worth more than chasing more low-paying transactions."],
      });
  }
  if (data.parcels?.length) {
    const weeks = new Map<string, number>();
    for (const p of data.parcels) if (/drop/i.test(p.product)) weeks.set(p.week, (weeks.get(p.week) ?? 0) + p.volume);
    const v = [...weeks].sort().map(([, n]) => n).filter((n) => n > 50);
    if (v.length >= 4) {
      const firstHalf = avg(v.slice(0, Math.floor(v.length / 2)));
      const secondHalf = avg(v.slice(Math.floor(v.length / 2)));
      const change = secondHalf / firstHalf - 1;
      items.push({
        priority: change < -0.08 ? "month" : "watch",
        area: "Parcels",
        title: `Parcel drop-offs ${change < -0.03 ? "falling" : change > 0.03 ? "rising" : "steady"}: ${int(secondHalf)} a week lately, ${int(firstHalf)} before`,
        found: `Weekly drop-offs ranged from ${int(Math.min(...v))} to ${int(Math.max(...v))}.`,
        actions: ["Parcels bring footfall: make drop-off fast so it doesn't tie up the counter, and use the visit to offer something else."],
      });
    }
  }

  const order: Record<Priority, number> = { now: 0, month: 1, watch: 2, good: 3 };
  return items.sort((a, b) => order[a.priority] - order[b.priority] || (b.worthValue ?? 0) - (a.worthValue ?? 0));
}

const label: Record<Priority, string> = { now: "Act now", month: "This month", watch: "Keep an eye on", good: "Going well" };
const style: Record<Priority, string> = {
  now: "border-red/50 bg-red/[0.08]",
  month: "border-[#C9A227]/50 bg-[#C9A227]/[0.07]",
  watch: "border-white/15 bg-white/[0.03]",
  good: "border-emerald-400/40 bg-emerald-400/[0.06]",
};
const chip: Record<Priority, string> = { now: "bg-red text-white", month: "bg-[#C9A227] text-[#06173a]", watch: "bg-white/15 text-white", good: "bg-emerald-400 text-[#06173a]" };

export function ActionPlan({ data, statement, rules }: { data: BranchData; statement: Statement | null; rules: OeiRules | null }) {
  const items = buildPlan(data, statement, rules);
  if (!items.length)
    return <p className="mt-8 rounded-xl border border-dashed border-white/15 p-6 text-sm text-white/55">Add your Branch Hub exports and remuneration statement: the more you add, the more the plan can tell you.</p>;
  const counts = (["now", "month", "watch", "good"] as Priority[]).map((p) => [p, items.filter((i) => i.priority === p).length] as const);
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-bold">Your action plan</h2>
      <p className="mt-1 max-w-3xl text-sm text-white/55">What your figures are telling you, most urgent first, with what each is worth and what to do about it.</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {counts.map(([p, n]) => n > 0 && <span key={p} className={`rounded-full px-3 py-1 font-semibold ${chip[p]}`}>{n} {label[p].toLowerCase()}</span>)}
      </div>
      <ol className="mt-5 space-y-3">
        {items.map((it, i) => (
          <li key={it.title} className={`rounded-2xl border p-5 ${style[it.priority]}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-lg font-bold text-white/40">{i + 1}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${chip[it.priority]}`}>{label[it.priority]}</span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-white/50">{it.area}</span>
            </div>
            <p className="mt-2 font-display text-lg font-bold leading-snug">{it.title}</p>
            <p className="mt-1 text-sm text-white/70">{it.found}</p>
            {it.worth && <p className="mt-1 text-sm font-semibold text-white">{it.worth}</p>}
            <ul className="mt-3 space-y-1.5 text-sm text-white/80">
              {it.actions.map((a) => (
                <li key={a} className="flex gap-2"><span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />{a}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-white/45">The plan updates as you add files. Figures are from your own exports; the suggestions are FCM&apos;s general guidance, not Post Office instructions.</p>
    </section>
  );
}
