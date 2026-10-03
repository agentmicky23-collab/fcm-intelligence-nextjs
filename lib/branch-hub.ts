// Branch Check: recognises each Branch Hub export (CSV or XLS) by its columns and turns it into plain data.
// Runs in the browser. No scheme rules live here: anything that needs them takes `rules` as an argument,
// fetched from the server only for members (see lib/server/oei-rules.ts).

import { readCsv, readXls, readXlsx, type Cell } from "@/lib/xls";

export type DayRow = { date: string; weekday: string; declared: "done" | "not complete" | "no activity" | "other"; time: string | null; service: string; cashReturned: number | null; excessCash: number | null };
export type PeriodRow = { period: string; start: string; balanceWeek: string; balanced: "yes" | "no" | "not due"; failedDeclarations: number; declarationPoints: number; avgExcessCash: number; excessCashPoints: number; pouchErrors: number; pouchPoints: number; avgExcessStock: number | null; stockPoints: number; totalPoints: number; percent: number; eligible: number; earned: number };
export type PouchRow = { date: string; amount: number; type: "Shortage" | "Surplus" };
export type RolloverRow = { period: string; start: string; group: string; window: string; completed: "yes" | "no" | "not due"; doneAt: string | null };
export type OpsRow = { type: string; unit: string; year: string; month: string; value: number };
export type HourRow = { category: string; hour: string; weekday: string; transactions: number };
export type ParcelRow = { week: string; product: string; volume: number };
export type SessionRow = { year: string; week: number; sessions: number };
export type HourSessionRow = { hour: string; weekday: string; sessions: number };

export type BranchData = {
  periods?: PeriodRow[];
  days?: DayRow[];
  pouches?: PouchRow[];
  rollovers?: RolloverRow[];
  ops?: OpsRow[];
  hours?: HourRow[];
  parcels?: ParcelRow[];
  sessions?: SessionRow[];
  hourSessions?: HourSessionRow[];
};

export const fileKinds: { key: keyof BranchData; label: string }[] = [
  { key: "periods", label: "Operational Excellence summary" },
  { key: "days", label: "Daily cash and declarations" },
  { key: "pouches", label: "Cash pouch errors" },
  { key: "rollovers", label: "Monthly balancing" },
  { key: "ops", label: "Operational reporting" },
  { key: "hours", label: "Transactions by hour" },
  { key: "parcels", label: "Parcel drop-offs and pick-ups" },
  { key: "sessions", label: "Customer sessions by week" },
  { key: "hourSessions", label: "Customer sessions by hour" },
];

// ── cells ───────────────────────────────────────────────────────────────────────────────────────

const num = (c: Cell): number | null => {
  if (c === null || c === "") return null;
  if (typeof c === "number") return c;
  const s = c.replace(/[£,%'\s]/g, "");
  if (!s || s === "-") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};
const n0 = (c: Cell) => num(c) ?? 0;
const txt = (c: Cell) => (c === null ? "" : String(c).replace(/ /g, " ").trim());

/** dd/mm/yyyy (or an Excel serial) → yyyy-mm-dd. */
function isoDate(c: Cell): string {
  if (typeof c === "number") {
    const d = new Date(Date.UTC(1899, 11, 30) + Math.round(c) * 86400000);
    return d.toISOString().slice(0, 10);
  }
  const m = txt(c).match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (!m) return "";
  const y = m[3].length === 2 ? `20${m[3]}` : m[3];
  return `${y}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}
const periodStart = (p: string) => isoDate(p.split(" - ")[0] ?? "");

// ── recognising files ───────────────────────────────────────────────────────────────────────────

type Table = { head: string[]; rows: Cell[][] };

function table(rows: Cell[][]): Table | null {
  const at = rows.findIndex((r) => r.filter((c) => txt(c)).length >= 3);
  if (at < 0) return null;
  return { head: rows[at].map((c) => txt(c).toLowerCase()), rows: rows.slice(at + 1).filter((r) => r.some((c) => txt(c))) };
}

const has = (t: Table, ...cols: string[]) => cols.every((c) => t.head.includes(c));
const col = (t: Table, name: string) => t.head.indexOf(name);

function recognise(t: Table): Partial<BranchData> | null {
  const g = (r: Cell[], name: string) => r[col(t, name)] ?? null;

  if (has(t, "total points", "remuneration percent earned")) {
    return {
      periods: t.rows
        .map((r) => ({
          period: txt(g(r, "date bracket")),
          start: periodStart(txt(g(r, "date bracket"))),
          balanceWeek: txt(g(r, "expected balance week")),
          balanced: (/^yes/i.test(txt(g(r, "balance status"))) ? "yes" : /^no$/i.test(txt(g(r, "balance status"))) ? "no" : "not due") as PeriodRow["balanced"],
          failedDeclarations: n0(g(r, "failed declaration")),
          declarationPoints: n0(g(r, "declaration score deduction")),
          avgExcessCash: n0(g(r, "average excess cash")),
          excessCashPoints: n0(g(r, "excess cash score deduction")),
          pouchErrors: n0(g(r, "cash pouch errors")),
          pouchPoints: n0(g(r, "cash pouch score deduction")),
          avgExcessStock: num(g(r, "average excess stock")),
          stockPoints: n0(g(r, "excess stock score deduction")),
          totalPoints: n0(g(r, "total points")),
          percent: n0(g(r, "remuneration percent earned")),
          eligible: n0(g(r, "variable remuneration")),
          earned: n0(g(r, "remuneration_amount")),
        }))
        .filter((p) => p.start)
        .sort((a, b) => a.start.localeCompare(b.start)),
    };
  }
  if (has(t, "declaration status", "excess cash")) {
    return {
      days: t.rows
        .map((r) => {
          const s = txt(g(r, "declaration status"));
          const time = s.match(/(\d{1,2}:\d{2})$/)?.[1] ?? null;
          return {
            date: isoDate(g(r, "date")),
            weekday: txt(g(r, "day of week")),
            declared: (time ? "done" : /not complete/i.test(s) ? "not complete" : /no activity/i.test(s) ? "no activity" : "other") as DayRow["declared"],
            time,
            service: txt(g(r, "collection deliveries")).toLowerCase(),
            cashReturned: num(g(r, "cash returned")),
            excessCash: num(g(r, "excess cash")),
          };
        })
        .filter((d) => d.date)
        .sort((a, b) => a.date.localeCompare(b.date)),
    };
  }
  if (has(t, "document number", "amount", "type")) {
    return {
      pouches: t.rows
        .map((r) => ({ date: isoDate(g(r, "date")), amount: n0(g(r, "amount")), type: (/short/i.test(txt(g(r, "type"))) ? "Shortage" : "Surplus") as PouchRow["type"] }))
        .filter((p) => p.date)
        .sort((a, b) => a.date.localeCompare(b.date)),
    };
  }
  if (has(t, "trading group", "expected dates")) {
    return {
      rollovers: t.rows
        .map((r) => ({
          period: txt(g(r, "date bracket")),
          start: periodStart(txt(g(r, "date bracket"))),
          group: txt(g(r, "trading group")),
          window: txt(g(r, "expected dates")),
          completed: (/^yes/i.test(txt(g(r, "completed"))) ? "yes" : /^no$/i.test(txt(g(r, "completed"))) ? "no" : "not due") as RolloverRow["completed"],
          doneAt: txt(g(r, "balance_date_done")) || null,
        }))
        .filter((r) => r.start)
        .sort((a, b) => a.start.localeCompare(b.start)),
    };
  }
  if (has(t, "type", "unit of measure", "measure")) {
    const yr = col(t, "financial ytd") >= 0 ? "financial ytd" : "financial year";
    return {
      ops: t.rows.map((r) => ({ type: txt(g(r, "type")), unit: txt(g(r, "unit of measure")), year: txt(g(r, yr)), month: txt(g(r, "range")), value: n0(g(r, "measure")) })).filter((o) => o.type),
    };
  }
  if (has(t, "hourly intervals", "week day", "sessions")) {
    return { hourSessions: t.rows.map((r) => ({ hour: txt(g(r, "hourly intervals")).slice(0, 5), weekday: txt(g(r, "week day")), sessions: n0(g(r, "sessions")) })).filter((s) => s.hour && s.weekday) };
  }
  if (has(t, "hourly intervals", "week day", "transactions")) {
    return { hours: t.rows.map((r) => ({ category: txt(g(r, "category")), hour: txt(g(r, "hourly intervals")).slice(0, 5), weekday: txt(g(r, "week day")), transactions: n0(g(r, "transactions")) })) };
  }
  if (has(t, "product", "volume", "week start")) {
    return { parcels: t.rows.map((r) => ({ week: isoDate(g(r, "week start")), product: txt(g(r, "product")), volume: n0(g(r, "volume")) })).filter((p) => p.week && p.product) };
  }
  if (has(t, "sessions", "weekcode")) {
    return { sessions: t.rows.map((r) => ({ year: txt(g(r, "financialyear")), week: Number(txt(g(r, "weekcode")).replace(/\D/g, "")), sessions: n0(g(r, "sessions")) })).filter((s) => s.year && s.week) };
  }
  return null;
}

/** Reads one export. Returns what it recognised, or null if it isn't a Branch Hub file we know. */
export async function readBranchFile(name: string, bytes: Uint8Array): Promise<Partial<BranchData> | null> {
  let rows: Cell[][];
  const isXls = bytes[0] === 0xd0 && bytes[1] === 0xcf;
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b;
  if (isXls) rows = readXls(bytes);
  else if (isZip) rows = await readXlsx(bytes);
  else if (/\.csv$/i.test(name) || !isXls) {
    let text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    if (text.includes("�")) text = new TextDecoder("windows-1252").decode(bytes);
    rows = readCsv(text.replace(/^﻿/, ""));
  } else return null;
  const t = table(rows);
  return t ? recognise(t) : null;
}

/** Adds what a file contains to what's already loaded (a newer file of the same kind replaces the older). */
export function merge(into: BranchData, add: Partial<BranchData>): BranchData {
  return { ...into, ...add };
}

// ── Operational Excellence (needs the rules) ────────────────────────────────────────────────────

export type OeiRules = {
  paymentsFrom: string;
  startingPoints: number;
  deductions: { failedDeclarationDay: number; pouchError: number; perThousandExcessCash: number; perThousandExcessStamps: number };
  dailyExcessCashCap: number;
  schemes: { from: string; firstPayingPoints: number; percentPerPoint: number; maxPercent: number; pouchAllowance: { base: number; firstBandOver: number; bandSize: number }; stampStock: boolean; eligible: string }[];
  source: string;
};

export function schemeFor(rules: OeiRules, start: string) {
  return [...rules.schemes].reverse().find((s) => start >= s.from) ?? rules.schemes[0];
}

export function percentFor(rules: OeiRules, start: string, points: number) {
  const s = schemeFor(rules, start);
  if (points < s.firstPayingPoints) return 0;
  return Math.min(s.maxPercent, (points - s.firstPayingPoints + 1) * s.percentPerPoint);
}

export function pouchAllowance(rules: OeiRules, start: string, cashReturned: number) {
  const a = schemeFor(rules, start).pouchAllowance;
  return a.base + (cashReturned > a.firstBandOver ? 1 + Math.floor((cashReturned - a.firstBandOver) / a.bandSize) : 0);
}

export type PeriodView = PeriodRow & { paid: boolean; maxPercent: number; possible: number; missed: number; pointValue: number; lostToCause: { cause: string; points: number; pounds: number }[] };

/** Each period with what it could have paid, what was missed, and what each cause cost. */
export function periodViews(rules: OeiRules, periods: PeriodRow[]): PeriodView[] {
  return periods
    .filter((p) => p.eligible > 0)
    .map((p) => {
      const s = schemeFor(rules, p.start);
      const paid = p.start >= rules.paymentsFrom;
      const possible = (p.eligible * s.maxPercent) / 100;
      const pointValue = (p.eligible * s.percentPerPoint) / 100;
      const counted = [
        { cause: "Missed declarations", points: -p.declarationPoints },
        { cause: "Excess cash", points: -p.excessCashPoints },
        { cause: "Cash pouch errors", points: -p.pouchPoints },
        { cause: "Excess stamp stock", points: s.stampStock ? -p.stockPoints : 0 },
      ].filter((c) => c.points > 0);
      // Points only cost money between "full marks" and the first paying point; a missed balance costs the lot.
      const lostToCause =
        p.balanced === "no"
          ? [{ cause: "Monthly balance not done in its week", points: 0, pounds: paid ? possible : 0 }]
          : counted.map((c) => ({ ...c, pounds: paid ? Math.min(c.points * pointValue, possible) : 0 }));
      const earned = paid ? p.earned : 0;
      return { ...p, earned, paid, maxPercent: s.maxPercent, possible: paid ? possible : 0, missed: paid ? Math.max(0, possible - earned) : 0, pointValue, lostToCause };
    });
}

/** Financial year (April to March) a trading period belongs to, e.g. "2025/26". */
export function financialYear(start: string) {
  const [y, m, d] = start.split("-").map(Number);
  const startsNew = m >= 4 || (m === 3 && d >= 28);
  const fy = startsNew ? y : y - 1;
  return `${fy}/${String((fy + 1) % 100).padStart(2, "0")}`;
}

/** A quick check from numbers typed in by hand. */
export function quickScore(rules: OeiRules, input: { start: string; eligible: number; balancedOnTime: boolean; failedDeclarations: number; avgExcessCash: number; pouchErrors: number; cashReturned: number; avgExcessStamps: number }) {
  const s = schemeFor(rules, input.start);
  const d = rules.deductions;
  const allowance = pouchAllowance(rules, input.start, input.cashReturned);
  const counted = Math.max(0, input.pouchErrors - allowance);
  const parts = [
    { cause: "Missed declarations", points: input.failedDeclarations * d.failedDeclarationDay },
    { cause: "Excess cash", points: Math.floor(Math.min(input.avgExcessCash, rules.dailyExcessCashCap) / 1000) * d.perThousandExcessCash },
    { cause: "Cash pouch errors", points: counted * d.pouchError, note: `${allowance} allowed this month` },
    ...(s.stampStock ? [{ cause: "Excess stamp stock", points: Math.floor(input.avgExcessStamps / 1000) * d.perThousandExcessStamps }] : []),
  ];
  const points = Math.max(0, rules.startingPoints - parts.reduce((a, p) => a + p.points, 0));
  const percent = input.balancedOnTime ? percentFor(rules, input.start, points) : 0;
  const pointValue = (input.eligible * s.percentPerPoint) / 100;
  return {
    points,
    percent,
    payment: (input.eligible * percent) / 100,
    possible: (input.eligible * s.maxPercent) / 100,
    maxPercent: s.maxPercent,
    pointValue,
    parts: parts.map((p) => ({ ...p, pounds: p.points * pointValue })),
    balancedOnTime: input.balancedOnTime,
    eligibleNote: s.eligible,
  };
}

// ── Monthly series from operational reporting ───────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025/26" + "Nov" → "2025-11"; "2025/26" + "Feb" → "2026-02". */
export function opsMonth(year: string, month: string) {
  const i = MONTHS.indexOf(month.slice(0, 3));
  const y = Number(year.slice(0, 4));
  if (i < 0 || !y) return null;
  return `${i >= 3 ? y : y + 1}-${String(i + 1).padStart(2, "0")}`;
}

/** One measure as a month-by-month series (months with no row count as 0 between the first and last). */
export function opsSeries(ops: OpsRow[], type: string) {
  const m = new Map<string, number>();
  for (const o of ops) {
    if (o.type !== type) continue;
    const k = opsMonth(o.year, o.month);
    if (k) m.set(k, (m.get(k) ?? 0) + o.value);
  }
  return [...m].sort((a, b) => a[0].localeCompare(b[0])).map(([month, value]) => ({ month, value }));
}

/** Totals for the last 12 months and the 12 before, from a monthly series, ending at `end` (yyyy-mm). */
export function lastTwelve(series: { month: string; value: number }[], end: string) {
  const back = (n: number) => {
    const d = new Date(end + "-15T12:00:00Z");
    d.setUTCMonth(d.getUTCMonth() - n);
    return d.toISOString().slice(0, 7);
  };
  const from = back(11);
  const prevFrom = back(23);
  const now = series.filter((s) => s.month >= from && s.month <= end).reduce((a, s) => a + s.value, 0);
  const before = series.filter((s) => s.month >= prevFrom && s.month < from).reduce((a, s) => a + s.value, 0);
  return { now, before, from };
}
