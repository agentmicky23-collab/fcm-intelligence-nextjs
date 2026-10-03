// Remuneration Analyser: reads a Post Office remuneration statement (the self-billing invoice PDF)
// in the browser, breaks it down by stream and works out what extra business would be worth.
// Nothing here talks to a server. Only the lines and totals are kept: never the branch, remuneration
// number, statement number, VAT number, name or address printed on the statement.

export type TextPage = { width: number; items: { str: string; x: number; y: number }[] };

export type RemLine = {
  code: string;
  name: string;
  category: string;
  group: string;
  vat: string;
  by: "Value" | "Volume";
  /** £ value of sales for "Value" lines, number of items for "Volume" lines. */
  sales: number;
  /** A percentage (1.5 = 1.5%) for "Value" lines, £ per item for "Volume" lines. */
  rate: number | null;
  inc: number | null;
  exc: number;
};

export type OtherPayment = { name: string; inc: number; exc: number };

export type Statement = {
  from: string | null;
  to: string | null;
  weeks: number;
  lines: RemLine[];
  other: OtherPayment[];
  /** Exc VAT total printed on the statement, to check the lines add up. */
  statedExc: number | null;
};

const money = (s: string) => Number(s.replace(/[£,]/g, ""));

/** Rebuilds the printed lines from pdf.js text items: same height = same line, left to right. */
function textLines(page: TextPage, from = 0, to = Infinity) {
  const rows: { y: number; items: { str: string; x: number }[] }[] = [];
  for (const it of page.items) {
    if (!it.str.trim() || it.x < from || it.x >= to) continue;
    const row = rows.find((r) => Math.abs(r.y - it.y) < 2.5);
    if (row) row.items.push(it);
    else rows.push({ y: it.y, items: [it] });
  }
  return rows
    .sort((a, b) => b.y - a.y)
    .map((r) => r.items.sort((a, b) => a.x - b.x).map((i) => i.str.trim()).join(" ").replace(/\s+/g, " "));
}

const ROW = /^(\d{4}) (.+?) (Standard|Exempt|Zero|Reduced|Outside scope) (Value|Volume) (£?[\d,]+(?:\.\d+)?)(?: (£\d+(?:\.\d+)?|\d+(?:\.\d+)?%))?(?: (£[\d,]+\.\d{2}))?(?: (£-?[\d,]+\.\d{2}))$/i;
const TOTAL = /^Total(?: £-?[\d,]+\.\d{2}){1,2}$/;
const HEADER = /^Sales Ref No\b/;

function parseRow(m: RegExpMatchArray, category: string, group: string): RemLine {
  const rate = m[6] ? (m[6].endsWith("%") ? Number(m[6].slice(0, -1)) : money(m[6])) : null;
  return {
    code: m[1],
    name: m[2],
    vat: m[3],
    by: (m[4][0].toUpperCase() + m[4].slice(1).toLowerCase()) as "Value" | "Volume",
    sales: money(m[5]),
    rate,
    inc: m[7] ? money(m[7]) : null,
    exc: money(m[8]),
    category,
    group,
  };
}

export class NotAStatement extends Error {}

export function parseStatement(pages: TextPage[]): Statement {
  const full = pages.flatMap((p) => textLines(p));
  const text = full.join("\n");

  // Pay period: "for transactions done between 03/08/2026 and 30/08/2026"
  const period = text.match(/between (\d{2})\/(\d{2})\/(\d{4}) and (\d{2})\/(\d{2})\/(\d{4})/);
  let from: string | null = null;
  let to: string | null = null;
  let weeks = 4;
  if (period) {
    from = `${period[3]}-${period[2]}-${period[1]}`;
    to = `${period[6]}-${period[5]}-${period[4]}`;
    const days = (Date.parse(to) - Date.parse(from)) / 86400000 + 1;
    if (days > 0 && days < 400) weeks = Math.max(1, Math.round(days / 7));
  }

  // Transaction lines. A heading followed by a sub-heading and the column header starts a stream.
  const lines: RemLine[] = [];
  let category = "Other";
  let group = "";
  const isPlain = (s: string | undefined) => !!s && !ROW.test(s) && !TOTAL.test(s) && !HEADER.test(s);
  full.forEach((l, i) => {
    if (HEADER.test(full[i + 1] ?? "") && isPlain(l)) {
      group = l;
      if (isPlain(full[i - 1]) && !/^Payable on|^Category\b/.test(full[i - 1])) category = full[i - 1];
      return;
    }
    const m = l.match(ROW);
    if (m) lines.push(parseRow(m, category, group));
  });
  if (!lines.length) throw new NotAStatement("No remuneration lines found");

  // Page 1 is two columns side by side: read each half on its own for the summaries.
  const halves = pages.slice(0, 1).flatMap((p) => [...textLines(p, 0, p.width * 0.53), ...textLines(p, p.width * 0.53)]);
  const other: OtherPayment[] = [];
  const start = halves.findIndex((l) => /^Other Payments$/i.test(l));
  if (start >= 0) {
    for (const l of halves.slice(start + 1)) {
      if (/^Total\b/.test(l)) break;
      const m = l.match(/^(.+?) (£-?[\d,]+\.\d{2}) (£-?[\d,]+\.\d{2})$/);
      if (m) other.push({ name: m[1], inc: money(m[2]), exc: money(m[3]) });
    }
  }
  const overall = halves.findIndex((l) => /^Overall Summary$/i.test(l));
  let statedExc: number | null = null;
  if (overall >= 0) {
    const t = halves.slice(overall).find((l) => /^Total £/.test(l))?.match(/£(-?[\d,]+\.\d{2}) £(-?[\d,]+\.\d{2})$/);
    if (t) statedExc = money(t[2]);
  }

  return { from, to, weeks, lines, other, statedExc };
}

/** Several statements (for example a year's worth) into one: lines with the same code are added up. */
export function combine(list: Statement[]): Statement {
  if (list.length === 1) return list[0];
  const byKey = new Map<string, RemLine>();
  for (const s of list)
    for (const l of s.lines) {
      const k = `${l.code}|${l.name}`;
      const prev = byKey.get(k);
      if (!prev) byKey.set(k, { ...l });
      else {
        prev.sales += l.sales;
        prev.exc += l.exc;
        prev.inc = (prev.inc ?? 0) + (l.inc ?? 0);
        prev.rate = l.rate ?? prev.rate;
      }
    }
  const other = new Map<string, OtherPayment>();
  for (const s of list)
    for (const o of s.other) {
      const p = other.get(o.name);
      if (p) {
        p.inc += o.inc;
        p.exc += o.exc;
      } else other.set(o.name, { ...o });
    }
  const dates = list.flatMap((s) => [s.from, s.to]).filter((d): d is string => !!d).sort();
  const stated = list.every((s) => s.statedExc !== null) ? list.reduce((a, s) => a + (s.statedExc ?? 0), 0) : null;
  return { from: dates[0] ?? null, to: dates.at(-1) ?? null, weeks: list.reduce((a, s) => a + s.weeks, 0), lines: [...byKey.values()], other: [...other.values()], statedExc: stated };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export type Breakdown = {
  total: number;
  transactions: number;
  fixed: number;
  perWeek: number;
  perYear: number;
  addsUp: boolean | null;
  streams: { name: string; exc: number; share: number; groups: { name: string; exc: number; lines: RemLine[] }[] }[];
  infoOnly: RemLine[];
};

export function breakdown(s: Statement): Breakdown {
  const transactions = round2(s.lines.reduce((a, l) => a + l.exc, 0));
  const fixed = round2(s.other.reduce((a, o) => a + o.exc, 0));
  const total = round2(transactions + fixed);
  const streams = new Map<string, Map<string, RemLine[]>>();
  for (const l of s.lines) {
    if (l.exc === 0) continue;
    const g = streams.get(l.category) ?? new Map<string, RemLine[]>();
    g.set(l.group, [...(g.get(l.group) ?? []), l]);
    streams.set(l.category, g);
  }
  const out = [...streams].map(([name, groups]) => {
    const gs = [...groups].map(([g, lines]) => ({ name: g, exc: round2(lines.reduce((a, l) => a + l.exc, 0)), lines: lines.sort((a, b) => b.exc - a.exc) }));
    const exc = round2(gs.reduce((a, g) => a + g.exc, 0));
    return { name, exc, share: total ? exc / total : 0, groups: gs.sort((a, b) => b.exc - a.exc) };
  });
  if (fixed) out.push({ name: "Fixed payments", exc: fixed, share: total ? fixed / total : 0, groups: [{ name: "Not tied to transactions", exc: fixed, lines: [] }] });
  return {
    total,
    transactions,
    fixed,
    perWeek: total / s.weeks,
    perYear: (total / s.weeks) * 52,
    addsUp: s.statedExc === null ? null : Math.abs(s.statedExc - total) < 1,
    streams: out.sort((a, b) => b.exc - a.exc),
    infoOnly: s.lines.filter((l) => l.exc === 0),
  };
}

// ── What-if levers ──────────────────────────────────────────────────────────────────────────────
// Every rate comes from the statement itself. If a service isn't on it, the lever says so rather
// than guessing a rate.

/** Average £ per item over the volume lines whose names match. */
function perItem(s: Statement, match: RegExp) {
  const ls = s.lines.filter((l) => l.by === "Volume" && match.test(l.name) && l.sales > 0 && l.exc > 0);
  const items = ls.reduce((a, l) => a + l.sales, 0);
  return items ? { rate: ls.reduce((a, l) => a + l.exc, 0) / items, from: ls.map((l) => l.name) } : null;
}

/** Average % over the value lines whose names match (weighted by sales). */
function percent(s: Statement, match: RegExp) {
  const ls = s.lines.filter((l) => l.by === "Value" && match.test(l.name) && l.sales > 0 && l.exc > 0);
  const sales = ls.reduce((a, l) => a + l.sales, 0);
  return sales ? { rate: ls.reduce((a, l) => a + l.exc, 0) / sales, from: ls.map((l) => l.name) } : null;
}

export type Lever = {
  id: string;
  stream: string;
  label: string;
  /** What one unit of the slider is, e.g. "parcels a week". */
  unit: string;
  max: number;
  step: number;
  /** A second number that multiplies the first (visits each, average £), with its default. */
  extra?: { label: string; unit: string; min: number; max: number; step: number; value: number; money?: boolean };
  /** £ a week, ex VAT, for the slider value(s). */
  weekly: (n: number, extra: number) => number;
  how: string;
} | {
  id: string;
  stream: string;
  label: string;
  missing: string;
};

const gbp = (n: number, dp = 2) => `£${n.toLocaleString("en-GB", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
const pct = (r: number) => `${(r * 100).toLocaleString("en-GB", { maximumFractionDigits: 3 })}%`;

export function levers(s: Statement): Lever[] {
  const out: Lever[] = [];

  // Banking: each deposit pays per item plus a percentage of the cash paid in.
  const dep = perItem(s, /auto cash deposits/i);
  const depValue = percent(s, /cash deposits \(value\)/i);
  const depCount = s.lines.filter((l) => l.by === "Volume" && /(auto|manual) cash deposits/i.test(l.name)).reduce((a, l) => a + l.sales, 0);
  const avgDeposit = depValue && depCount ? s.lines.filter((l) => /cash deposits \(value\)/i.test(l.name)).reduce((a, l) => a + l.sales, 0) / depCount : 0;
  if (dep) {
    const v = depValue?.rate ?? 0;
    out.push({
      id: "deposits",
      stream: "Banking",
      label: "More banking customers paying in",
      unit: "extra customers a week",
      max: 50,
      step: 1,
      extra: { label: "Visits each a week", unit: "visits", min: 1, max: 7, step: 1, value: 1 },
      weekly: (n, visits) => n * visits * (dep.rate + avgDeposit * v),
      how: `Each deposit pays ${gbp(dep.rate, 3)}${v ? ` plus ${pct(v)} of the cash (your average deposit is ${gbp(avgDeposit, 0)}, so about ${gbp(dep.rate + avgDeposit * v)} a deposit)` : ""}.`,
    });
  } else out.push({ id: "deposits", stream: "Banking", label: "More banking customers paying in", missing: "Your statement doesn't show cash deposits." });

  const wd = perItem(s, /auto cash withdrawals/i);
  if (wd)
    out.push({
      id: "withdrawals",
      stream: "Banking",
      label: "More cash withdrawals",
      unit: "extra withdrawals a week",
      max: 200,
      step: 5,
      weekly: (n) => n * wd.rate,
      how: `Each withdrawal pays ${gbp(wd.rate, 3)}.`,
    });

  // Travel money: a percentage of the currency sold.
  const fx = percent(s, /travel money - (on demand|discounted)|bureau|currency/i);
  if (fx)
    out.push({
      id: "travel",
      stream: "Travel",
      label: "More currency sold",
      unit: "£ more currency a week",
      max: 10000,
      step: 100,
      weekly: (n) => n * fx.rate,
      how: `You earn ${pct(fx.rate)} of the currency sold (your mix of on-demand and discounted rates).`,
    });
  else out.push({ id: "travel", stream: "Travel", label: "More currency sold", missing: "Your statement doesn't show travel money sales." });

  // Mail: counter-paid parcels earn a percentage of the postage; prepaid labels and collections pay per item.
  const parcels = percent(s, /parcels|^rm tracked (24|48)$|pf express/i);
  if (parcels)
    out.push({
      id: "parcels",
      stream: "Mail",
      label: "More parcels paid for at the counter",
      unit: "extra parcels a week",
      max: 200,
      step: 1,
      extra: { label: "Average postage per parcel", unit: "£", min: 1, max: 30, step: 0.5, value: 5, money: true },
      weekly: (n, avg) => n * avg * parcels.rate,
      how: `You earn ${pct(parcels.rate)} of the postage on these (your mix of parcel services). Set the average postage to what your customers usually pay.`,
    });
  const prepaid = perItem(s, /tracked online .*parcels|home shopping returns|drop off|returns|lfbf|accept only|prepaid/i);
  if (prepaid)
    out.push({
      id: "prepaid",
      stream: "Mail",
      label: "More prepaid parcels and returns dropped off",
      unit: "extra parcels a week",
      max: 500,
      step: 5,
      weekly: (n) => n * prepaid.rate,
      how: `Prepaid labels and returns pay about ${gbp(prepaid.rate, 3)} each on your statement (Royal Mail and other carriers).`,
    });
  const collect = perItem(s, /click (and|&) collect|local collect/i);
  if (collect)
    out.push({
      id: "collect",
      stream: "Mail",
      label: "More click & collect parcels",
      unit: "extra parcels a week",
      max: 300,
      step: 5,
      weekly: (n) => n * collect.rate,
      how: `Collections pay about ${gbp(collect.rate, 3)} each.`,
    });
  if (!parcels && !prepaid && !collect) out.push({ id: "parcels", stream: "Mail", label: "More parcels", missing: "Your statement doesn't show parcel services." });

  // Government and identity.
  const passport = perItem(s, /passport/i);
  if (passport)
    out.push({ id: "passport", stream: "Government & Identity services", label: "More passport check & send", unit: "extra a week", max: 30, step: 1, weekly: (n) => n * passport.rate, how: `Each one pays about ${gbp(passport.rate)}.` });
  const dvla = perItem(s, /dvla/i);
  if (dvla)
    out.push({ id: "dvla", stream: "Government & Identity services", label: "More DVLA transactions", unit: "extra a week", max: 50, step: 1, weekly: (n) => n * dvla.rate, how: `Each one pays about ${gbp(dvla.rate)}.` });

  // Bill payments.
  const bills = perItem(s, /utility|resellers|telecoms|bill/i);
  if (bills)
    out.push({ id: "bills", stream: "Bill Payments", label: "More bill payments", unit: "extra a week", max: 300, step: 5, weekly: (n) => n * bills.rate, how: `Each bill payment pays about ${gbp(bills.rate, 3)}.` });

  return out;
}

// ── Example statement (made-up figures, for the demo) ────────────────────────────────────────────

type Demo = [category: string, group: string, name: string, vat: "Standard" | "Exempt", by: "Value" | "Volume", sales: number, rate: number];

const demoRows: Demo[] = [
  ["Mail", "Special Delivery", "SD By 1pm", "Standard", "Value", 2400, 18],
  ["Mail", "Ordinary inland mail", "1st Class Parcels", "Standard", "Value", 520, 15],
  ["Mail", "Ordinary inland mail", "2nd Class Parcels", "Standard", "Value", 360, 12],
  ["Mail", "Ordinary inland mail", "1st Class Letters", "Standard", "Value", 610, 15],
  ["Mail", "Ordinary inland mail", "2nd Class Letters", "Standard", "Value", 280, 12],
  ["Mail", "Ordinary inland mail", "RM Tracked Online 24 & 48 - Parcels", "Standard", "Volume", 700, 0.3],
  ["Mail", "Ordinary inland mail", "RM Tracked 48", "Standard", "Value", 400, 12],
  ["Mail", "Postage stamps", "1st Class Stamps Sales", "Standard", "Value", 900, 6],
  ["Mail", "Postage stamps", "2nd Class Stamps Sales", "Standard", "Value", 600, 3],
  ["Mail", "Collections & returns", "Home Shopping Returns", "Standard", "Volume", 450, 0.3],
  ["Mail", "Collections & returns", "RM-Local Collect", "Standard", "Volume", 80, 0.28],
  ["Mail", "Other carriers", "Drop Off & Returns - Carrier A", "Standard", "Volume", 800, 0.19],
  ["Mail", "Other carriers", "Click & Collect - Carrier A", "Standard", "Volume", 300, 0.19],
  ["Mail", "Other carriers", "Customer Drop Off - Carrier B", "Standard", "Volume", 60, 0.33],
  ["Mail", "Other carriers", "Click and Collect - Carrier B", "Standard", "Volume", 40, 0.35],
  ["Banking", "Banking deposits", "All Cash Deposits (Value)", "Exempt", "Value", 600000, 0.14],
  ["Banking", "Banking deposits", "Auto Cash Deposits", "Exempt", "Volume", 1100, 0.5],
  ["Banking", "Banking withdrawals", "Auto Cash Withdrawals", "Exempt", "Volume", 1000, 0.25],
  ["Banking", "Banking withdrawals", "Bus. Change Giving (Value)", "Exempt", "Value", 8000, 1],
  ["Travel", "Travel money", "Travel Money - On Demand", "Exempt", "Value", 10000, 1.4],
  ["Travel", "Travel money", "Travel Money - Discounted", "Exempt", "Value", 7000, 1],
  ["Travel", "Travel money", "Travel Money - Click & Collect", "Standard", "Volume", 12, 3.5],
  ["Government & Identity services", "DVLA services", "DVLA - Barcode & Non Barcode", "Standard", "Volume", 35, 0.9],
  ["Government & Identity services", "Passport services", "Passport Check & Send", "Standard", "Volume", 9, 5.5],
  ["Government & Identity services", "Other identity services", "ID Verification", "Standard", "Volume", 10, 1.8],
  ["Bill Payments", "Bill payments", "Utility Payments", "Standard", "Volume", 400, 0.085],
  ["Bill Payments", "Bill payments", "Resellers VAT Rated", "Standard", "Volume", 300, 0.19],
  ["Sending/Receiving Money", "Sending/receiving money", "Postal Order Fee", "Exempt", "Value", 100, 45],
];

export const demoStatement: Statement = {
  from: null,
  to: null,
  weeks: 4,
  lines: demoRows.map(([category, group, name, vat, by, sales, rate], i) => {
    const exc = round2(by === "Value" ? (sales * rate) / 100 : sales * rate);
    return { code: String(i + 1).padStart(4, "0"), category, group, name, vat, by, sales, rate, exc, inc: vat === "Standard" ? round2(exc * 1.2) : exc };
  }),
  other: [
    { name: "Fixed payment A", inc: 250, exc: 250 },
    { name: "Fixed payment B", inc: 360, exc: 300 },
  ],
  statedExc: null,
};
