import Link from "next/link";
import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { ScoreRing } from "@/components/report/charts";
import { PrintButton } from "@/components/report/PrintButton";
import { Slant } from "@/components/ui";
import { inTier, reportSections, type Tier } from "@/lib/report";
import { num, str, type Report } from "@/lib/report-data";
import { site } from "@/lib/site";
import { SectionShell } from "./parts";
import { sectionBodies } from "./Sections";

const sectionKeyFor = (n: number) => (["s1_executive_summary", "s2_financial_analysis", "s3_po_remuneration", "s4_staffing", "s5_online_presence", "s6_location_intelligence", "s7_demographics", "s8_crime_safety", "s9_competition_mapping", "s10_footfall_analysis", "s11_infrastructure", "s12_future_outlook", "s13_risk_assessment", "s14_profit_improvement", "s15_due_diligence"] as const)[n - 1];

const date = (v: string) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};

/** A finished report. `showAll` is Mikesh's preview: every section, with the customer's view marked. */
export function ReportView({ report, tier, orderId, banner, showAll = false }: { report: Report; tier: Tier; orderId: string; banner?: ReactNode; showAll?: boolean }) {
  const m = report.meta;
  const exec = report.sections.s1_executive_summary ?? {};
  const score = num(m.overall_score) ?? num(exec.score);
  const grade = str(m.overall_grade) || str(exec.grade);
  const verdict = str(m.overall_verdict) || str(exec.verdict);
  const verdictDetail = str(m.verdict_detail) || str(exec.verdict_detail);
  const name = str(m.business_name) || str(report.order.business_name) || "Your report";
  const place = [str(m.full_address) || [str(m.address_line_1), str(m.town), str(m.postcode)].filter(Boolean).join(", ")].filter(Boolean).join("");
  const facts = [
    num(m.asking_price) !== null && { label: "Asking price", value: `£${num(m.asking_price)!.toLocaleString("en-GB")}` },
    num(m.stated_turnover) !== null && { label: "Stated turnover", value: `£${num(m.stated_turnover)!.toLocaleString("en-GB")}` },
    str(m.listing_source) && { label: "Listed with", value: str(m.listing_source) },
    str(m.report_date) && { label: "Report date", value: date(str(m.report_date)) },
  ].filter(Boolean) as { label: string; value: string }[];

  // What each tier includes is fixed by what we sell, not by the list the agents wrote into the report.
  const visible = new Set(reportSections.filter((s) => inTier(s, tier)).map((s) => s.n));
  const shown = reportSections.filter((s) => showAll || visible.has(s.n));
  const locked = reportSections.filter((s) => !visible.has(s.n));

  return (
    <MotionConfig reducedMotion="user">
      <div className="report">
        {banner}
        <div className="no-print border-b border-line bg-white">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm sm:px-8">
            <p className="text-muted">{tier === "intelligence" ? "Intelligence" : "Insight"} Report · Ref {orderId}</p>
            <PrintButton className="font-medium text-red-dark hover:text-red" />
          </div>
        </div>

        {/* Cover */}
        <section className="relative overflow-hidden bg-night">
          <Slant className="inset-y-0 right-[-10%] hidden w-[38%] bg-navy md:block" />
          <Slant className="inset-y-0 right-[26%] hidden w-[3.5%] bg-red md:block" />
          <Slant className="inset-y-0 right-[31.5%] hidden w-[0.9%] bg-red/55 md:block" />
          <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.3fr_1fr] md:py-20">
            <div>
              <p className="text-sm font-medium text-white/60">Prepared for {str(report.order.customer_name) || "you"} by {site.name}</p>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">{name}</h1>
              {place && <p className="mt-4 text-lg text-white/70">{place}</p>}
              {str(m.property_type) && <p className="mt-1 text-white/50">{str(m.property_type)}</p>}
              {verdict && (
                <div className="mt-10 max-w-xl border-l-[3px] border-red pl-5">
                  <p className="font-display text-2xl font-bold text-white">{verdict}</p>
                  {verdictDetail && <p className="mt-2 leading-relaxed text-white/70">{verdictDetail}</p>}
                </div>
              )}
            </div>
            {score !== null && grade && (
              <div className="flex md:justify-end">
                <ScoreRing score={score} grade={grade} />
              </div>
            )}
          </div>
        </section>

        {facts.length > 0 && (
          <section className="border-b border-line bg-white">
            <dl className="mx-auto grid max-w-[1280px] grid-cols-2 px-5 sm:px-8 md:grid-cols-4">
              {facts.map((s) => (
                <div key={s.label} className="py-8">
                  <dd className="font-display text-2xl font-bold tracking-[-0.02em] text-navy">{s.value}</dd>
                  <dt className="mt-1 text-sm text-muted">{s.label}</dt>
                </div>
              ))}
            </dl>
          </section>
        )}

        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[220px_1fr]">
          <nav aria-label="Report contents" className="no-print hidden lg:block">
            <ol className="sticky top-28 space-y-2.5 text-[13px]">
              {reportSections.map((s) => (
                <li key={s.n}>
                  {visible.has(s.n) || showAll ? (
                    <a href={`#s${s.n}`} className="flex gap-3 text-muted hover:text-navy">
                      <span className="w-5 font-semibold text-red">{String(s.n).padStart(2, "0")}</span>{s.title}
                    </a>
                  ) : (
                    <span className="flex gap-3 text-muted/50"><span className="w-5 font-semibold">{String(s.n).padStart(2, "0")}</span>{s.title}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="min-w-0">
            {shown.map((sec) => {
              const data = report.sections[sectionKeyFor(sec.n)];
              const Body = sectionBodies[sec.n];
              return (
                <SectionShell key={sec.n} n={sec.n} title={sec.title} s={data ?? {}} intelligenceOnly={showAll && !visible.has(sec.n)}>
                  {data ? <Body s={data} report={report} /> : <p className="text-muted">This section wasn&apos;t included in the report data.</p>}
                </SectionShell>
              );
            })}

            {!showAll && locked.length > 0 && (
              <section className="no-print mt-6 border border-line bg-light p-8">
                <p className="font-display text-xl font-bold text-navy">Also in the Intelligence Report</p>
                <p className="mt-2 max-w-2xl text-muted">
                  The full report adds {locked.length} more sections: {locked.map((s) => s.title.toLowerCase()).join(", ")}. If you&apos;d like to upgrade, reply to your report email and I&apos;ll arrange it.
                </p>
              </section>
            )}

            <p className="mt-12 border-t border-line pt-6 text-xs leading-relaxed text-muted">
              This report is information and opinion, not financial, legal or tax advice. Figures that don&apos;t come from the business&apos;s own accounts are estimates.
              It&apos;s for your own use in deciding whether to buy this business. See the <Link href="/terms#reports" className="underline">terms</Link>.
            </p>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
