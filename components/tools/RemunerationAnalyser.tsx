"use client";

import { useMemo, useRef, useState } from "react";
import { breakdown, combine, demoStatement, levers, NotAStatement, parseStatement, type Lever, type Statement, type TextPage } from "@/lib/remuneration";

const WORKER = "/vendor/pdf.worker-6.4.299.min.mjs";

const streamColour: Record<string, string> = {
  Mail: "#e0241b",
  Banking: "#378ADD",
  Travel: "#C9A227",
  "Government & Identity services": "#7F77DD",
  "Bill Payments": "#1D9E75",
  "Fixed payments": "#8a93a6",
};
const colourFor = (name: string, i: number) => streamColour[name] ?? ["#D85A30", "#4fb3bf", "#b07cc6", "#9bbf4a", "#e39b5b"][i % 5];

const gbp = (n: number, dp = 0) => `£${n.toLocaleString("en-GB", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
const date = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "");

/** Reads the PDFs in this browser with pdf.js. Nothing is uploaded. */
async function readPdf(file: File): Promise<TextPage[]> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = WORKER;
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages: TextPage[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const tc = await page.getTextContent();
    pages.push({
      width: page.getViewport({ scale: 1 }).width,
      items: tc.items.flatMap((i) => ("str" in i ? [{ str: i.str, x: i.transform[4] as number, y: i.transform[5] as number }] : [])),
    });
  }
  await doc.cleanup();
  return pages;
}

type Active = Extract<Lever, { weekly: unknown }>;

function Slider({ lever, value, extra, onChange }: { lever: Active; value: number; extra: number; onChange: (v: number, e: number) => void }) {
  const weekly = lever.weekly(value, extra);
  return (
    <div className={`rounded-xl border p-4 transition-colors ${value ? "border-red/50 bg-red/[0.06]" : "border-white/10 bg-white/[0.03]"}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-white">{lever.label}</p>
        <p className={`shrink-0 text-right font-display text-lg font-bold ${value ? "text-white" : "text-white/35"}`}>
          +{gbp(weekly * 52)}<span className="block text-[11px] font-normal text-white/50">a year</span>
        </p>
      </div>
      <label className="mt-3 block">
        <span className="flex justify-between text-xs text-white/60">
          <span><b className="text-white tabular-nums">{value.toLocaleString("en-GB")}</b> {lever.unit}</span>
          <span className="tabular-nums">+{gbp(weekly, 2)} a week</span>
        </span>
        <input type="range" min={0} max={lever.max} step={lever.step} value={value} onChange={(e) => onChange(Number(e.target.value), extra)} className="rem-range mt-2 w-full" aria-label={`${lever.label}: ${lever.unit}`} />
      </label>
      {lever.extra && (
        <label className="mt-2 block">
          <span className="flex justify-between text-xs text-white/60">
            <span>{lever.extra.label}</span>
            <b className="text-white tabular-nums">{lever.extra.money ? gbp(extra, 2) : `${extra} ${lever.extra.unit}`}</b>
          </span>
          <input type="range" min={lever.extra.min} max={lever.extra.max} step={lever.extra.step} value={extra} onChange={(e) => onChange(value, Number(e.target.value))} className="rem-range rem-range-small mt-1.5 w-full" aria-label={lever.extra.label} />
        </label>
      )}
      <p className="mt-3 text-[11px] leading-relaxed text-white/45">{lever.how}</p>
    </div>
  );
}

export function RemunerationAnalyser() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [values, setValues] = useState<Record<string, { n: number; e: number }>>({});
  const [open, setOpen] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const demo = statements.length === 0;
  const s = useMemo(() => (demo ? demoStatement : combine(statements)), [demo, statements]);
  const b = useMemo(() => breakdown(s), [s]);
  const ls = useMemo(() => levers(s), [s]);
  const active = ls.filter((l): l is Active => "weekly" in l);

  const extraFor = (l: Active) => values[l.id]?.e ?? l.extra?.value ?? 1;
  const addedWeekly = (l: Active) => l.weekly(values[l.id]?.n ?? 0, extraFor(l));
  const addedByStream = new Map<string, number>();
  for (const l of active) addedByStream.set(l.stream, (addedByStream.get(l.stream) ?? 0) + addedWeekly(l) * 52);
  const added = [...addedByStream.values()].reduce((a, v) => a + v, 0);
  const max = Math.max(...b.streams.map((x) => (x.exc / s.weeks) * 52 + (addedByStream.get(x.name) ?? 0)), 1);

  async function load(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    const out: Statement[] = [];
    try {
      for (const f of [...files].slice(0, 13)) {
        if (f.type && f.type !== "application/pdf") throw new NotAStatement(`${f.name} isn't a PDF.`);
        out.push(parseStatement(await readPdf(f)));
      }
      setStatements(out);
      setValues({});
    } catch (e) {
      setError(
        e instanceof NotAStatement
          ? "That doesn't look like a Post Office remuneration statement. Use the PDF statement (the self-billing invoice), not a scan or photo."
          : "Couldn't read that file. Try saving the statement again as a PDF.",
      );
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  const totalShareBar = b.streams.filter((x) => x.exc > 0);

  return (
    <div className="rem text-white">
      {/* Load */}
      <div
        className="flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-5"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          load(e.dataTransfer.files);
        }}
      >
        <div className="flex-1">
          <p className="font-display text-lg font-bold">{demo ? "You're looking at an example." : `Your ${statements.length === 1 ? "statement" : `${statements.length} statements`}`}</p>
          <p className="text-sm text-white/60">
            {demo
              ? "Add your remuneration statement PDF to see your own figures. You can add up to 13 to cover a whole year."
              : `${date(s.from)} to ${date(s.to)}, ${s.weeks} weeks. ${b.addsUp === true ? "Every line adds up to the statement total." : b.addsUp === false ? "The lines don't add up to the printed total: check the figures before relying on them." : ""}`}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-300">
            <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current"><path d="M8 1 2 3.5v4C2 11 4.6 14.2 8 15c3.4-.8 6-4 6-7.5v-4L8 1Zm-1 10L4.5 8.5l1-1L7 9l3.5-3.5 1 1L7 11Z" /></svg>
            Read on this device only. Your statement is never uploaded or stored.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => input.current?.click()} disabled={busy} className="bg-red px-5 py-3 text-sm font-semibold hover:bg-red-dark disabled:opacity-60">
            {busy ? "Reading…" : demo ? "Add my statement" : "Use different statements"}
          </button>
          {!demo && <button onClick={() => { setStatements([]); setValues({}); }} className="border border-white/25 px-5 py-3 text-sm hover:bg-white/10">Clear</button>}
        </div>
        <input ref={input} type="file" accept="application/pdf" multiple hidden onChange={(e) => load(e.target.files)} />
        {error && <p className="w-full rounded-lg border border-red/40 bg-red/10 px-3 py-2 text-sm text-red-light">{error}</p>}
      </div>

      {/* Headline numbers */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["A year (estimate)", gbp(b.perYear), `${s.weeks}-week${s.weeks === 1 ? "" : ""} period × 52 weeks`],
          ["A week", gbp(b.perWeek), "Before VAT"],
          ["From transactions", gbp((b.transactions / s.weeks) * 52), `${Math.round((b.transactions / b.total) * 100)}% of the total`],
          ["With your changes", gbp(b.perYear + added), added ? `+${gbp(added)} (+${((added / b.perYear) * 100).toFixed(1)}%)` : "Move the sliders below"],
        ].map(([label, value, note], i) => (
          <div key={label} className={`rounded-2xl border p-5 ${i === 3 && added ? "border-red/50 bg-red/[0.1]" : "border-white/10 bg-white/[0.04]"}`}>
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">{label}</p>
            <p className="mt-1 font-display text-3xl font-bold">{value}</p>
            <p className={`text-xs ${i === 3 && added ? "text-red-light" : "text-white/45"}`}>{note}</p>
          </div>
        ))}
      </div>

      {/* Share bar */}
      <div className="mt-6">
        <div className="flex h-4 w-full overflow-hidden rounded-full bg-white/5">
          {totalShareBar.map((x, i) => (
            <span key={x.name} title={`${x.name}: ${(x.share * 100).toFixed(1)}%`} style={{ width: `${x.share * 100}%`, background: colourFor(x.name, i) }} className="h-full" />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60">
          {totalShareBar.map((x, i) => (
            <span key={x.name} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: colourFor(x.name, i) }} />
              {x.name} {(x.share * 100).toFixed(1)}%
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_1fr]">
        {/* Streams */}
        <section>
          <h2 className="font-display text-xl font-bold">Where your money comes from</h2>
          <p className="mt-1 text-sm text-white/55">A year, before VAT. The red part is what your changes would add.</p>
          <ul className="mt-5 space-y-2">
            {b.streams.map((x, i) => {
              const now = (x.exc / s.weeks) * 52;
              const plus = addedByStream.get(x.name) ?? 0;
              const isOpen = open === x.name;
              return (
                <li key={x.name} className="rounded-xl border border-white/10 bg-white/[0.03]">
                  <button onClick={() => setOpen(isOpen ? null : x.name)} className="w-full p-3 text-left" aria-expanded={isOpen}>
                    <span className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 font-semibold">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: colourFor(x.name, i) }} />
                        {x.name}
                      </span>
                      <span className="tabular-nums">
                        {gbp(now)}
                        {plus > 0 && <b className="text-red-light"> +{gbp(plus)}</b>}
                        <span className="ml-2 text-xs text-white/45">{(x.share * 100).toFixed(1)}%</span>
                      </span>
                    </span>
                    <span className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-white/5">
                      <span className="h-full transition-all duration-500" style={{ width: `${(now / max) * 100}%`, background: colourFor(x.name, i) }} />
                      <span className="rem-added h-full transition-all duration-500" style={{ width: `${(plus / max) * 100}%` }} />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-white/10 px-3 pb-3">
                      {x.name === "Fixed payments" ? (
                        <p className="pt-3 text-xs leading-relaxed text-white/60">
                          {s.other.map((o) => `${o.name} ${gbp((o.exc / s.weeks) * 52)}`).join(" · ")}. These aren&apos;t earned per transaction, so they don&apos;t grow with sales and may not carry on for a new postmaster.
                        </p>
                      ) : (
                        x.groups.map((g) => (
                          <div key={g.name} className="pt-3">
                            <p className="flex justify-between text-xs font-semibold text-white/70"><span>{g.name}</span><span className="tabular-nums">{gbp((g.exc / s.weeks) * 52)} a year</span></p>
                            <table className="mt-1 w-full text-[11px] text-white/60">
                              <tbody>
                                {g.lines.slice(0, 12).map((l) => (
                                  <tr key={l.code + l.name} className="border-t border-white/5">
                                    <td className="py-1 pr-2">{l.name}</td>
                                    <td className="py-1 pr-2 text-right tabular-nums">{l.by === "Value" ? gbp(l.sales) : `${l.sales.toLocaleString("en-GB")} items`}</td>
                                    <td className="py-1 pr-2 text-right tabular-nums">{l.rate === null ? "" : l.by === "Value" ? `${l.rate}%` : gbp(l.rate, l.rate < 1 ? 3 : 2)}</td>
                                    <td className="py-1 text-right tabular-nums text-white/80">{gbp(l.exc, 2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {b.infoOnly.length > 0 && <p className="mt-3 text-xs text-white/40">{b.infoOnly.length} lines on the statement pay nothing (counted for information only) and are left out.</p>}
        </section>

        {/* Levers */}
        <section>
          <h2 className="font-display text-xl font-bold">What if you grew it?</h2>
          <p className="mt-1 text-sm text-white/55">Move a slider to see what extra business is worth, using the rates on {demo ? "the example" : "your"} statement.</p>
          <div className="mt-5 space-y-6">
            {[...new Set(ls.map((l) => l.stream))].map((stream) => (
              <div key={stream}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: colourFor(stream, 0) }}>{stream}</p>
                <div className="grid gap-3">
                  {ls.filter((l) => l.stream === stream).map((l) =>
                    "weekly" in l ? (
                      <Slider key={l.id} lever={l} value={values[l.id]?.n ?? 0} extra={extraFor(l)} onChange={(n, e) => setValues((v) => ({ ...v, [l.id]: { n, e } }))} />
                    ) : (
                      <p key={l.id} className="rounded-xl border border-white/10 px-4 py-3 text-xs text-white/45">{l.label}: {l.missing}</p>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Running total */}
      <div className={`sticky bottom-3 z-10 mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 backdrop-blur sm:px-5 sm:py-4 transition-all ${added ? "border-red/60 bg-[#1a0a10]/90" : "border-white/10 bg-[#030a1b]/90"}`}>
        <p className="text-sm text-white/70">{added ? "Your changes add" : "Move the sliders to build your plan"}</p>
        {added > 0 && (
          <p className="font-display text-xl font-bold sm:text-2xl">
            +{gbp(added)} <span className="text-sm font-normal text-white/60">a year<span className="hidden sm:inline"> · +{gbp(added / 52, 2)} a week · {gbp(b.perYear + added)} in total</span></span>
          </p>
        )}
        {added > 0 && <button onClick={() => setValues({})} className="text-xs text-white/60 underline">Reset</button>}
      </div>

      <div className="mt-8 grid gap-3 text-xs leading-relaxed text-white/45 md:grid-cols-3">
        <p>All figures are before VAT. The yearly figure is the weekly average × 52, so one statement can over- or under-state a year: travel money peaks in summer and mail before Christmas. Add a full year of statements for the truest picture.</p>
        <p>The what-ifs use the rates printed on {demo ? "the example" : "your"} statement. Where a service pays a percentage, the average is weighted by what you actually sold. Post Office can change rates; this isn&apos;t advice or a forecast.</p>
        <p>Only the lines and totals are read. The branch, remuneration and VAT numbers, names and addresses on the statement are ignored, and nothing leaves this device.</p>
      </div>
    </div>
  );
}
