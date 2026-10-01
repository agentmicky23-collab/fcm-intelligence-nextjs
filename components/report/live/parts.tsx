import type { ReactNode } from "react";
import { Grow, Reveal } from "@/components/report/charts";
import { arr, num, str, type Image, type Rec } from "@/lib/report-data";

// Building blocks for showing an agent-written report. Each one renders nothing when its data is missing,
// so a thin section still reads cleanly.

export function SectionShell({ n, title, s, intelligenceOnly, children }: { n: number; title: string; s: Rec; intelligenceOnly: boolean; children: ReactNode }) {
  const grade = str(s.grade);
  const score = num(s.score);
  const headline = str(s.headline);
  const detail = str(s.headline_detail);
  return (
    <section id={`s${n}`} className="report-section scroll-mt-24 border-t border-line py-14 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <span className="font-display text-sm font-semibold text-red">{String(n).padStart(2, "0")}</span>
        <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-navy sm:text-[30px]">{title}</h2>
        {intelligenceOnly && (
          <span className="border border-navy/15 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Intelligence</span>
        )}
        {grade && (
          <span className="ml-auto flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-navy">{grade}</span>
            {score !== null && <span className="text-sm text-muted">{score}/100</span>}
          </span>
        )}
      </div>
      {headline && <p className="mt-4 max-w-3xl font-display text-xl font-semibold leading-snug text-navy">{headline}</p>}
      {detail && <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-muted">{detail}</p>}
      <div className="mt-8 space-y-8">{children}</div>
      <Sources text={str(s.sources)} />
    </section>
  );
}

export function Sources({ text }: { text: string }) {
  if (!text) return null;
  return <p className="mt-10 border-t border-line pt-4 text-xs leading-relaxed text-muted"><span className="font-semibold text-navy">Sources: </span>{text}</p>;
}

export function Heading({ children }: { children: ReactNode }) {
  return <h3 className="font-display text-base font-semibold text-navy">{children}</h3>;
}

export function Para({ label, text }: { label?: string; text: string }) {
  if (!text) return null;
  return (
    <div>
      {label && <Heading>{label}</Heading>}
      <p className={`max-w-3xl text-[15px] leading-relaxed text-ink ${label ? "mt-2" : ""}`}>{text}</p>
    </div>
  );
}

export function StatBoxes({ items }: { items: unknown }) {
  const rows = arr(items).filter((i) => str(i.value));
  if (!rows.length) return null;
  return (
    <dl className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
      {rows.map((s, i) => (
        <div key={i} className="flex flex-col bg-white p-5">
          <dd className="font-display text-2xl font-bold tracking-[-0.02em] text-navy">{str(s.value)}</dd>
          <dt className="mt-1 text-sm text-muted">{str(s.label)}</dt>
        </div>
      ))}
    </dl>
  );
}

export function View({ text, label = "FCM view" }: { text: string; label?: string }) {
  if (!text) return null;
  return (
    <Reveal className="flex gap-4 bg-night p-6 text-white">
      <span aria-hidden className="mt-1 block h-4 w-2.5 shrink-0 -skew-x-[18deg] bg-red" />
      <p className="text-[15px] leading-relaxed"><span className="font-semibold">{label}: </span>{text}</p>
    </Reveal>
  );
}

export function Callout({ title, text }: { title: string; text: string }) {
  if (!text) return null;
  return (
    <div className="border-l-[3px] border-red bg-light px-5 py-4">
      <p className="text-sm font-semibold text-navy">{title}</p>
      <p className="mt-1 text-[15px] leading-relaxed text-ink">{text}</p>
    </div>
  );
}

const tones: Record<string, string> = {
  high: "bg-red text-white", red_flag: "bg-red text-white", essential: "bg-red text-white", negative: "bg-red text-white", declining: "bg-red/10 text-red-dark", "at risk": "bg-red text-white",
  medium: "bg-navy text-white", moderate: "bg-navy text-white", caution: "bg-navy text-white", important: "bg-navy text-white", recommended: "bg-navy text-white", monitor: "bg-navy text-white", stable: "bg-navy/10 text-navy",
  low: "bg-navy/10 text-navy", minimal: "bg-navy/10 text-navy", clear: "bg-navy/10 text-navy", optional: "bg-navy/10 text-navy", useful: "bg-navy/10 text-navy", positive: "bg-navy/10 text-navy", neutral: "bg-navy/10 text-navy", growing: "bg-navy/10 text-navy",
};
const labels: Record<string, string> = { red_flag: "Red flag", caution: "Caution", clear: "Clear" };

export function Badge({ value }: { value: unknown }) {
  const v = str(value);
  if (!v) return null;
  const key = v.toLowerCase();
  return <span className={`inline-block whitespace-nowrap px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${tones[key] ?? "bg-light text-navy"}`}>{labels[key] ?? v.replace(/_/g, " ")}</span>;
}

export type Col = { key: string; label: string; badge?: boolean; strong?: boolean; render?: (row: Rec) => ReactNode };

export function Table({ title, cols, rows }: { title?: string; cols: Col[]; rows: unknown }) {
  const data = arr(rows);
  if (!data.length) return null;
  return (
    <div>
      {title && <Heading>{title}</Heading>}
      <div className={`overflow-x-auto ${title ? "mt-3" : ""}`}>
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2 border-navy text-navy">
              {cols.map((c) => <th key={c.key} className="py-2 pr-4 font-semibold">{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-line align-top">
                {cols.map((c) => (
                  <td key={c.key} className={`py-3 pr-4 ${c.strong ? "font-medium text-navy" : "text-ink"}`}>
                    {c.render ? c.render(row) : c.badge ? <Badge value={row[c.key]} /> : typeof row[c.key] === "boolean" ? (row[c.key] ? "Yes" : "No") : str(row[c.key]) || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Cards({ title, items, tone }: { title: string; items: unknown; tone: "good" | "bad" }) {
  const rows = arr(items).filter((i) => str(i.title) || str(i.detail));
  if (!rows.length) return null;
  return (
    <div>
      <Heading>{title}</Heading>
      <ul className="mt-3 space-y-3">
        {rows.map((c, i) => (
          <li key={i} className={`border-l-[3px] bg-white px-5 py-4 ${tone === "good" ? "border-navy" : "border-red"}`}>
            <p className="font-semibold text-navy">{str(c.title)}</p>
            <p className="mt-1 text-[15px] leading-relaxed text-ink">{str(c.detail)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <Heading>{title}</Heading>
      <ul className="mt-3 space-y-2">
        {items.map((t, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink">
            <span aria-hidden className="mt-[9px] h-2 w-1.5 shrink-0 -skew-x-[18deg] bg-red" />{t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Horizontal bars, 0-100 by default, with an optional national comparison under each. */
export function Bars({ title, rows, max = 100, suffix = "" }: { title?: string; rows: { label: string; value: number; compare?: number }[]; max?: number; suffix?: string }) {
  if (!rows.length) return null;
  const hasCompare = rows.some((r) => r.compare !== undefined);
  const w = (v: number) => `${Math.max(1.5, Math.min(100, (v / max) * 100))}%`;
  return (
    <div>
      {title && <Heading>{title}</Heading>}
      <ul className={`space-y-3 ${title ? "mt-4" : ""}`}>
        {rows.map((r, i) => (
          <li key={i} className="grid grid-cols-[minmax(96px,170px)_1fr_auto] items-center gap-4 text-sm">
            <span className="text-ink">{r.label}</span>
            <div className="space-y-1">
              <div className="h-3 bg-light">
                <div className="h-3" style={{ width: w(r.value) }}><Grow className="h-3 bg-navy" delay={i * 0.04} /></div>
              </div>
              {r.compare !== undefined && <div className="h-1.5 bg-light"><div className="h-1.5 bg-red/60" style={{ width: w(r.compare) }} /></div>}
            </div>
            <span className="w-20 text-right font-medium text-navy">{r.value}{suffix}</span>
          </li>
        ))}
      </ul>
      {hasCompare && (
        <p className="mt-3 flex gap-5 text-xs text-muted">
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 bg-navy" />This area</span>
          <span className="flex items-center gap-2"><span className="h-1.5 w-2.5 bg-red/60" />National</span>
        </p>
      )}
    </div>
  );
}

export function Pictures({ title, images }: { title?: string; images: Image[] }) {
  if (!images.length) return null;
  return (
    <figure>
      {title && <Heading>{title}</Heading>}
      <div className={`grid gap-3 ${images.length > 1 ? "sm:grid-cols-2" : ""} ${title ? "mt-3" : ""}`}>
        {images.map((m, i) => (
          <div key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element -- report images are stored in Supabase and sized by the agents */}
            <img src={m.url} alt={m.caption || title || "Report image"} loading="lazy" className="w-full border border-line bg-light object-cover" />
            {m.caption && <figcaption className="mt-2 text-xs text-muted">{m.caption}</figcaption>}
          </div>
        ))}
      </div>
    </figure>
  );
}
