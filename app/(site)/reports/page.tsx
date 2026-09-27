import type { Metadata } from "next";
import Link from "next/link";
import { ScoreRing } from "@/components/report/charts";
import { ReportMap } from "@/components/report/ReportMap";
import { ButtonLink, Container, Eyebrow, SectionHeading, Slant } from "@/components/ui";
import { example } from "@/lib/example-report";
import { stages } from "@/lib/services";

export const metadata: Metadata = {
  title: "Acquisition reports",
  description: "Insight (£199) and Intelligence (£499) reports on any UK Post Office, before you risk your money on it.",
};

const buying = stages.find((s) => s.id === "buying")!;
const reports = buying.services.filter((s) => s.href === "/reports");

export default function ReportsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-night">
        <Slant className="inset-y-0 right-[-12%] hidden w-[34%] bg-navy md:block" />
        <Slant className="inset-y-0 right-[20%] hidden w-[3%] bg-red md:block" />
        <Slant className="inset-y-0 right-[25%] hidden w-[0.8%] bg-red/55 md:block" />
        <Container className="relative py-20 md:py-24">
          <Eyebrow light>Acquisition reports</Eyebrow>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-5xl">
            Know what you&apos;re buying before you spend a penny on solicitors.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            Built around the checks I run on every branch I look at. Send the listing, and get the picture a broker won&apos;t give you.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <ButtonLink href="/reports/example">See an example report</ButtonLink>
            <Link href="#compare" className="text-[15px] font-medium text-white">Compare reports →</Link>
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-20 md:py-24">
          <SectionHeading title="What's inside" intro="Fifteen sections. Choose a report to see which ones it covers." />
          <div className="mt-10">
            <ReportMap />
          </div>
        </Container>
      </section>

      <section id="compare" className="scroll-mt-20">
        <Container className="grid gap-6 py-20 md:grid-cols-2 md:py-24">
          {reports.map((r, i) => (
            <div key={r.slug} className={`relative flex flex-col overflow-hidden p-8 sm:p-10 ${i === 1 ? "bg-night text-white" : "border border-line bg-white"}`}>
              {i === 1 && <Slant className="inset-y-0 right-[-14%] w-[30%] bg-navy" />}
              <div className="relative flex flex-1 flex-col">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className={`font-display text-3xl font-bold tracking-[-0.02em] ${i === 1 ? "text-white" : "text-navy"}`}>{r.name}</h2>
                  <p className={`text-right font-display text-4xl font-bold tracking-[-0.02em] ${i === 1 ? "text-red-light" : "text-red-dark"}`}>
                    {r.price}
                    <span className={`block font-sans text-xs font-normal tracking-normal ${i === 1 ? "text-white/60" : "text-muted"}`}>+ VAT</span>
                  </p>
                </div>
                <p className={`mt-4 leading-relaxed ${i === 1 ? "text-white/75" : "text-muted"}`}>{r.summary}</p>
                <ul className="mt-6 flex-1 space-y-3 text-[15px]">
                  {r.includes.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-[7px] h-2.5 w-1.5 shrink-0 -skew-x-[18deg] bg-red" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <ButtonLink href={`/contact?service=${r.slug}`} variant={i === 1 ? "red" : "navy"}>Order the {r.name}</ButtonLink>
                </div>
              </div>
            </div>
          ))}
        </Container>
      </section>

      <section className="relative overflow-hidden bg-night text-white">
        <Container className="grid items-center gap-12 py-20 md:grid-cols-[1fr_1.2fr] md:py-24">
          <div>
            <Eyebrow light>Example</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-[40px]">Read a full report before you buy one.</h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-white/70">
              A complete Intelligence Report on a fictional branch: every section, every chart, and my view on each.
            </p>
            <div className="mt-8"><ButtonLink href="/reports/example">Open the example</ButtonLink></div>
          </div>
          <Link href="/reports/example" className="group relative block overflow-hidden bg-navy p-8 transition-transform hover:-translate-y-1" aria-label="Open the example report">
            <Slant className="inset-y-0 right-[-10%] w-[22%] bg-night" />
            <div className="relative flex items-center justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/55">Intelligence Report</p>
                <p className="mt-3 font-display text-2xl font-bold">{example.branch}</p>
                <p className="mt-1 text-sm text-white/60">{example.town}</p>
                <p className="mt-6 font-display text-lg font-semibold">{example.verdict}</p>
              </div>
              <div className="shrink-0"><ScoreRing score={example.score} grade={example.grade} size={120} /></div>
            </div>
          </Link>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-20 md:py-24">
          <SectionHeading title="How it works" />
          <ol className="relative mt-14 grid gap-10 md:grid-cols-3">
            <span aria-hidden className="absolute left-0 right-0 top-[22px] hidden h-[2px] bg-navy/12 md:block" />
            {[
              ["Send the listing", "The business name, postcode and listing link, plus anything the broker has sent you."],
              ["We research it", "Location, competition, crime, footfall, reputation, and the numbers if you have them."],
              ["I review it", "Every report is checked by me before it reaches you. If something doesn't add up, it says so."],
            ].map(([title, text], i) => (
              <li key={title} className="relative">
                <span className={`flex h-11 w-14 -skew-x-[18deg] items-center justify-center font-display text-[15px] font-bold text-white ${i === 2 ? "bg-red" : "bg-navy"}`}>
                  <span className="skew-x-[18deg]">{i + 1}</span>
                </span>
                <h3 className="mt-6 font-display text-[22px] font-semibold text-navy">{title}</h3>
                <p className="mt-2 max-w-[32ch] text-[15px] leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
