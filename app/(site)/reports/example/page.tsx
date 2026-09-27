import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { MotionConfig } from "motion/react";
import { Draw, Grow, Pop, Reveal, Rise, ScoreRing } from "@/components/report/charts";
import { MapPanel } from "@/components/report/MapPanel";
import { PrintButton } from "@/components/report/PrintButton";
import { ButtonLink, Slant } from "@/components/ui";
import { example as r } from "@/lib/example-report";
import { reportSections } from "@/lib/report";

export const metadata: Metadata = {
  title: "Example Intelligence Report",
  description: "A full example of an FCM Intelligence Report on a fictional Post Office branch.",
};

const k = (n: number) => `£${Math.abs(n)}k`;

function Section({ n, children, intro }: { n: number; intro?: string; children: ReactNode }) {
  const s = reportSections[n - 1];
  return (
    <section id={`s${n}`} className="report-section scroll-mt-24 border-t border-line py-14 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-4">
        <span className="font-display text-sm font-semibold text-red">{String(n).padStart(2, "0")}</span>
        <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-navy sm:text-[30px]">{s.title}</h2>
        {s.tier === "intelligence" && (
          <span className="ml-auto hidden shrink-0 border border-navy/15 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted sm:block">
            Intelligence only
          </span>
        )}
      </div>
      {intro && <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">{intro}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Insight({ children }: { children: ReactNode }) {
  return (
    <Reveal className="mt-8 flex gap-4 bg-night p-6 text-white">
      <span aria-hidden className="mt-1 block h-4 w-2.5 shrink-0 -skew-x-[18deg] bg-red" />
      <p className="text-[15px] leading-relaxed"><span className="font-semibold">Mikesh&apos;s view: </span>{children}</p>
    </Reveal>
  );
}

function Legend({ items }: { items: { label: string; className: string }[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2"><span className={`h-2.5 w-2.5 ${i.className}`} />{i.label}</li>
      ))}
    </ul>
  );
}

/** The profit plan as waterfall steps: the base, each improvement stacked on it, then the total. */
function waterfall() {
  const steps: { step: string; value: number; from: number; tone: string; label: string }[] = [];
  let run = 0;
  r.profitPlan.forEach((p, i) => {
    steps.push({ step: p.step, value: p.value, from: i === 0 ? 0 : run, tone: i === 0 ? "bg-navy" : "bg-navy/40", label: i === 0 ? k(p.value) : `+${k(p.value)}` });
    run += p.value;
  });
  steps.push({ step: "Potential net profit", value: run, from: 0, tone: "bg-red", label: k(run) });
  return steps;
}
const pct70 = (v: number) => `${(v / 70) * 100}%`;

const shades = ["bg-navy", "bg-navy/75", "bg-navy/50", "bg-navy/30", "bg-navy/15"];

export default function ExampleReportPage() {
  const { financial: f, negotiation: neg } = r;
  const staffTotal = r.staffing.reduce((a, s) => a + s.value, 0);
  const crimeMax = 35;
  const crimePath = r.crime.monthly.map((v, i) => `${i === 0 ? "M" : "L"}${(i / 11) * 600} ${160 - (v / crimeMax) * 150}`).join(" ");
  const planTotal = r.profitPlan.reduce((a, p) => a + p.value, 0);
  const nx = (v: number) => ((v - neg.min) / (neg.max - neg.min)) * 100;

  return (
    <MotionConfig reducedMotion="user">
      <div className="report">
        {/* Notice */}
        <div className="bg-red text-white">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
            <p className="text-sm">
              <span className="font-semibold">Example report.</span> The branch is fictional and every figure is illustrative.
            </p>
            <PrintButton className="text-white underline-offset-4 hover:underline" />
          </div>
        </div>

        {/* Cover */}
        <section className="relative overflow-hidden bg-night">
          <Slant className="inset-y-0 right-[-10%] hidden w-[38%] bg-navy md:block" />
          <Slant className="inset-y-0 right-[26%] hidden w-[3.5%] bg-red md:block" />
          <Slant className="inset-y-0 right-[31.5%] hidden w-[0.9%] bg-red/55 md:block" />
          <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.3fr_1fr] md:py-20">
            <div>
              <p className="text-sm font-medium text-white/60">{r.tier} · Ref {r.reference}</p>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">{r.branch}</h1>
              <p className="mt-4 text-lg text-white/70">{r.town} · {r.type}</p>
              <div className="mt-10 max-w-xl border-l-[3px] border-red pl-5">
                <p className="font-display text-2xl font-bold text-white">{r.verdict}</p>
                <p className="mt-2 leading-relaxed text-white/70">{r.verdictDetail}</p>
              </div>
            </div>
            <div className="flex md:justify-end">
              <ScoreRing score={r.score} grade={r.grade} />
            </div>
          </div>
        </section>

        <section className="border-b border-line bg-white">
          <dl className="mx-auto grid max-w-[1280px] grid-cols-2 px-5 sm:px-8 md:grid-cols-4">
            {r.headlineStats.map((s) => (
              <div key={s.label} className="py-8">
                <dt className="order-2 mt-1 text-sm text-muted">{s.label}</dt>
                <dd className="font-display text-3xl font-bold tracking-[-0.02em] text-navy">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[220px_1fr]">
          {/* Contents */}
          <nav aria-label="Report contents" className="no-print hidden lg:block">
            <ol className="sticky top-28 space-y-2.5 text-[13px]">
              {reportSections.map((s) => (
                <li key={s.n}>
                  <a href={`#s${s.n}`} className="flex gap-3 text-muted hover:text-navy">
                    <span className="w-5 font-semibold text-red">{String(s.n).padStart(2, "0")}</span>{s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="min-w-0">
            {/* 1 */}
            <Section n={1} intro="Twelve areas scored out of 100. Anything under 65 needs attention before you commit.">
              <ul className="space-y-3">
                {r.categories.map((c, i) => (
                  <li key={c.name} className="grid grid-cols-[130px_1fr_32px] items-center gap-4 text-sm sm:grid-cols-[170px_1fr_32px]">
                    <span className="text-ink">{c.name}</span>
                    <div className="h-2.5 bg-navy/8">
                      <div className="h-full" style={{ width: `${c.score}%` }}>
                        <Grow delay={i * 0.04} className={`h-full ${c.score < 65 ? "bg-red" : "bg-navy"}`} />
                      </div>
                    </div>
                    <span className={`text-right font-display font-semibold ${c.score < 65 ? "text-red-dark" : "text-navy"}`}>{c.score}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {[
                  { title: "Strengths", items: r.strengths, mark: "+", tone: "text-navy" },
                  { title: "Concerns", items: r.concerns, mark: "!", tone: "text-red" },
                ].map((col) => (
                  <div key={col.title} className="border border-line bg-white p-6">
                    <h3 className="font-display text-lg font-semibold text-navy">{col.title}</h3>
                    <ul className="mt-4 space-y-3 text-[15px] leading-relaxed">
                      {col.items.map((t) => (
                        <li key={t} className="flex gap-3"><span className={`font-display font-bold ${col.tone}`}>{col.mark}</span>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>

            {/* 2 */}
            <Section n={2} intro="What the asking price is made of, and what the business is likely to earn.">
              <h3 className="font-display text-base font-semibold text-navy">Asking price: £165k</h3>
              <div className="mt-3 flex h-12 w-full">
                {f.askingSplit.map((p, i) => (
                  <div key={p.label} style={{ width: `${(p.value / 165) * 100}%` }} className="h-full">
                    <Grow delay={i * 0.25} className={`flex h-full items-center px-3 text-xs font-semibold text-white ${["bg-navy", "bg-navy/60", "bg-red"][i]}`}>
                      {k(p.value)}
                    </Grow>
                  </div>
                ))}
              </div>
              <Legend items={f.askingSplit.map((p, i) => ({ label: p.label, className: ["bg-navy", "bg-navy/60", "bg-red"][i] }))} />

              <h3 className="mt-10 font-display text-base font-semibold text-navy">Estimated profit and loss, per year (low to high)</h3>
              <div className="mt-5 space-y-4">
                {[...f.pnl, { item: "Net profit", low: f.net.low, high: f.net.high }].map((p, i) => {
                  const net = p.item === "Net profit";
                  const neg = p.high < 0 || p.low < 0;
                  const near = Math.min(Math.abs(p.low), Math.abs(p.high));
                  const far = Math.max(Math.abs(p.low), Math.abs(p.high));
                  const w = (v: number) => `${(v / 110) * 100}%`;
                  return (
                    <div key={p.item} className={`grid grid-cols-[110px_1fr_92px] items-center gap-3 text-sm sm:grid-cols-[180px_1fr_120px] sm:gap-4 ${net ? "border-t border-line pt-4 font-semibold" : ""}`}>
                      <span>{p.item}</span>
                      <div className="relative flex h-6">
                        <div className="relative h-full" style={{ width: w(far) }}>
                          <Grow delay={i * 0.1} className="absolute inset-0">
                            <span className={`absolute inset-y-0 left-0 ${net ? "bg-red" : neg ? "bg-navy/40" : "bg-navy"}`} style={{ width: `${(near / far) * 100}%` }} />
                            <span className={`absolute inset-y-0 right-0 ${net ? "bg-red/35" : neg ? "bg-navy/15" : "bg-navy/35"}`} style={{ width: `${100 - (near / far) * 100}%` }} />
                          </Grow>
                        </div>
                      </div>
                      <span className={`text-right text-xs sm:text-sm ${net ? "text-red-dark" : "text-muted"}`}>
                        {neg ? "−" : ""}{k(near)} to {neg ? "−" : ""}{k(far)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <Legend items={[{ label: "Low estimate", className: "bg-navy" }, { label: "Up to high estimate", className: "bg-navy/35" }, { label: "Costs", className: "bg-navy/40" }]} />
              <Insight>
                A £26k to £57k spread is too wide to price on. The top of that range depends on the retail margin holding, and
                only five years of accounts will show whether it has. On the midpoint, this business is worth nearer £148k than £165k.
              </Insight>
            </Section>

            {/* 3 */}
            <Section n={3} intro="Where the branch's £58k of Post Office income comes from.">
              <div className="flex h-14 w-full overflow-hidden">
                {r.remuneration.map((s, i) => (
                  <div key={s.stream} style={{ width: `${s.share}%` }}>
                    <Grow delay={i * 0.15} className={`flex h-full items-end p-2 text-xs font-semibold ${i < 2 ? "text-white" : "text-navy"} ${shades[i]}`}>{s.share}%</Grow>
                  </div>
                ))}
              </div>
              <Legend items={r.remuneration.map((s, i) => ({ label: s.stream, className: shades[i] }))} />
              <Insight>
                Banking is already the biggest earner, and the bank branch closing in town should push it higher. Ask Post Office
                what uplift other branches saw after similar closures nearby.
              </Insight>
            </Section>

            {/* 4 */}
            <Section n={4} intro={`The true cost of the current team: about £${staffTotal}k a year.`}>
              <div className="flex h-12 w-full">
                {r.staffing.map((s, i) => (
                  <div key={s.item} style={{ width: `${(s.value / staffTotal) * 100}%` }}>
                    <Grow delay={i * 0.12} className={`h-full ${i === 0 ? "bg-navy" : ["", "bg-red", "bg-navy/50", "bg-navy/30", "bg-navy/15"][i]}`} />
                  </div>
                ))}
              </div>
              <Legend items={r.staffing.map((s, i) => ({ label: `${s.item} £${s.value}k`, className: ["bg-navy", "bg-red", "bg-navy/50", "bg-navy/30", "bg-navy/15"][i] }))} />
              <Insight>
                Two staff transfer under TUPE on rates above the local market. You can&apos;t change their terms just because you
                bought the business, so price that cost in rather than planning to cut it.
              </Insight>
            </Section>

            {/* 5 */}
            <Section n={5} intro="What customers say online, and whether anyone is listening.">
              <div className="grid gap-8 md:grid-cols-3">
                <div>
                  <p className="font-display text-6xl font-extrabold tracking-[-0.04em] text-navy">{r.reviews.rating}</p>
                  <div className="mt-3 flex gap-1" aria-hidden>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span key={i} className="relative h-3 w-6 -skew-x-[18deg] bg-navy/12">
                        <span className="absolute inset-y-0 left-0" style={{ width: `${Math.min(1, Math.max(0, r.reviews.rating - i)) * 100}%` }}>
                          <Grow delay={i * 0.12} className="h-full bg-navy" />
                        </span>
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-muted">{r.reviews.count} Google reviews</p>
                </div>
                <div>
                  <p className="font-display text-6xl font-extrabold tracking-[-0.04em] text-red">{r.reviews.responseRate}%</p>
                  <p className="mt-3 text-sm text-muted">of reviews have had a reply from the owner</p>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-semibold text-navy">Customers praise</p>
                    <div className="mt-2 flex flex-wrap gap-2">{r.reviews.positive.map((t) => <span key={t} className="bg-navy px-2.5 py-1 text-white">{t}</span>)}</div>
                  </div>
                  <div>
                    <p className="font-semibold text-navy">Customers complain about</p>
                    <div className="mt-2 flex flex-wrap gap-2">{r.reviews.negative.map((t) => <span key={t} className="border border-red px-2.5 py-1 text-red-dark">{t}</span>)}</div>
                  </div>
                </div>
              </div>
              <Insight>Replying to reviews costs nothing and is the quickest win in this report. The lunchtime queue complaint tells you where the rota is wrong.</Insight>
            </Section>

            {/* 6 */}
            <Section n={6} intro="The branch sits on a busy parade, with everyday destinations inside a five-minute walk.">
              <div className="grid gap-8 xl:grid-cols-[1fr_260px]">
                <MapPanel
                  lat={r.map.lat}
                  lng={r.map.lng}
                  rings={[{ metres: 250, label: "250 m" }, { metres: 500, label: "500 m" }]}
                  label="250 m is about a three-minute walk; 500 m about six. Real map, fictional branch position."
                />
                <div>
                  <h3 className="font-display text-base font-semibold text-navy">Within a short walk</h3>
                  <ul className="mt-4 divide-y divide-line border-y border-line text-sm">
                    {r.footfall.filter((f) => f.metres <= 500).map((f) => (
                      <li key={f.name} className="flex items-center justify-between gap-4 py-3">
                        <span>{f.name}</span>
                        <span className="text-right"><span className="font-semibold text-navy">{f.metres} m</span><span className="block text-xs text-muted">{Math.max(1, Math.round(f.metres / 80))} min walk</span></span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 space-y-2 text-sm">
                    <p className="flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-red" />The branch</p>
                    <p className="flex items-center gap-3"><span className="h-3 w-3 border border-dashed border-navy" />Walking distance</p>
                  </div>
                </div>
              </div>
              <Insight>A bus stop at the door and a GP surgery two minutes away give this branch steady, all-day footfall that doesn&apos;t depend on the high street.</Insight>
            </Section>

            {/* 7 */}
            <Section n={7} intro="Who lives within a mile, compared with England as a whole.">
              <div className="space-y-6">
                {r.demographics.map((d, i) => (
                  <div key={d.measure} className="grid grid-cols-[130px_1fr] items-center gap-4 text-sm sm:grid-cols-[210px_1fr]">
                    <span>{d.measure}</span>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3"><div className="h-3" style={{ width: `${d.local}%` }}><Grow delay={i * 0.1} className="h-full bg-red" /></div><span className="text-xs font-semibold">{d.local}%</span></div>
                      <div className="flex items-center gap-3"><div className="h-3" style={{ width: `${d.national}%` }}><Grow delay={i * 0.1 + 0.1} className="h-full bg-navy/30" /></div><span className="text-xs text-muted">{d.national}%</span></div>
                    </div>
                  </div>
                ))}
              </div>
              <Legend items={[{ label: "Local", className: "bg-red" }, { label: "England", className: "bg-navy/30" }]} />
              <Insight>An older population with fewer cars relies on a local Post Office. That is loyal, repeat custom, and it is less exposed to parcel lockers.</Insight>
            </Section>

            {/* 8 */}
            <Section n={8} intro="Recorded crime within half a mile over the last 12 months.">
              <div className="grid gap-10 md:grid-cols-[1.5fr_1fr]">
                <svg viewBox="-10 -10 620 190" className="w-full" role="img" aria-label="Monthly crime incidents over 12 months, trending upwards">
                  {[0, 1, 2, 3].map((g) => <line key={g} x1="0" x2="600" y1={160 - g * 50} y2={160 - g * 50} stroke="var(--color-line)" />)}
                  <Draw d={crimePath} fill="none" stroke="var(--color-red)" strokeWidth="3" strokeLinejoin="round" />
                  {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m, i) => <text key={i} x={(i / 11) * 600} y="178" fontSize="11" textAnchor="middle" fill="var(--color-muted)">{m}</text>)}
                </svg>
                <ul className="space-y-3 text-sm">
                  {r.crime.split.map((c, i) => (
                    <li key={c.type}>
                      <div className="flex justify-between"><span>{c.type}</span><span className="font-semibold">{c.share}%</span></div>
                      <div className="mt-1.5 h-2 bg-navy/8"><div style={{ width: `${c.share * 2.5}%` }} className="h-full"><Grow delay={i * 0.1} className={`h-full ${i === 0 ? "bg-red" : "bg-navy"}`} /></div></div>
                    </li>
                  ))}
                </ul>
              </div>
              <Insight>Shoplifting is the biggest category and it is rising. Budget for CCTV and a tighter layout around the counter from day one.</Insight>
            </Section>

            {/* 9 */}
            <Section n={9} intro="Every Post Office and parcel point within two miles.">
              <MapPanel
                lat={r.map.lat}
                lng={r.map.lng}
                rings={[0.5, 1, 1.5, 2].map((m) => ({ metres: m * 1609, label: `${m} mi` }))}
                markers={r.competitors.map((c, i) => ({
                  east: Math.cos((c.angle * Math.PI) / 180) * c.miles * 1609,
                  north: -Math.sin((c.angle * Math.PI) / 180) * c.miles * 1609,
                  label: String.fromCharCode(65 + i),
                  kind: c.full ? "full" : "partial",
                }))}
                label="Real map with fictional competitor positions, for illustration."
                heightClass="h-[380px] sm:h-[600px]"
              />
              <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto]">
                <ul className="divide-y divide-line border-y border-line text-sm">
                  {r.competitors.map((c, i) => ({ ...c, letter: String.fromCharCode(65 + i) })).sort((a, b) => a.miles - b.miles).map((c) => (
                    <li key={c.letter} className="flex items-center justify-between gap-4 py-3">
                      <span className="flex items-center gap-3">
                        <span className={`flex h-6 w-6 items-center justify-center text-xs font-bold ${c.full ? "bg-navy text-white" : "border-2 border-navy text-navy"}`}>{c.letter}</span>
                        {c.name}
                      </span>
                      <span className="font-semibold text-navy">{c.miles} mi</span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-2 text-sm md:w-56">
                  <p className="flex items-center gap-3"><span className="h-3.5 w-3.5 bg-navy" />Full-service Post Office</p>
                  <p className="flex items-center gap-3"><span className="h-3.5 w-3.5 border-2 border-navy" />Local or parcel point</p>
                  <p className="flex items-center gap-3"><span className="h-3.5 w-3.5 rounded-full bg-red" />The branch</p>
                </div>
              </div>
              <Insight>The nearest full-service branch is 1.4 miles away. The supermarket parcel point takes drop-offs, but not banking or bill payments, which is where this branch earns most.</Insight>
            </Section>

            {/* 10 */}
            <Section n={10} intro="What brings people past the door, and how far away it is.">
              <div className="relative mt-4 h-40">
                <div className="absolute inset-x-0 top-1/2 h-[2px] bg-navy/15" />
                <div className="absolute inset-x-0 top-1/2 h-[2px]"><Grow className="h-full bg-navy" /></div>
                <span className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 bg-red" aria-hidden />
                {r.footfall.map((p, i) => (
                  <div key={p.name} className="absolute top-1/2" style={{ left: `${(p.metres / 1000) * 100}%` }}>
                    <Reveal delay={0.3 + i * 0.12}>
                      <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-navy" />
                      <div
                        className={`absolute w-28 text-xs ${i % 2 ? "top-5" : "-top-14"} ${
                          p.metres < 150 ? "-left-1.5 text-left" : p.metres > 850 ? "-translate-x-full text-right" : "-translate-x-1/2 text-center"
                        }`}
                      >
                        <p className="font-semibold text-navy">{p.name}</p>
                        <p className="text-muted">{p.metres} m</p>
                      </div>
                    </Reveal>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted"><span>The branch</span><span>1 km</span></div>
            </Section>

            {/* 11 */}
            <Section n={11} intro="The practical things that stop a branch trading.">
              <ul className="grid gap-px bg-line sm:grid-cols-2">
                {r.infrastructure.map((i) => (
                  <li key={i.item} className="flex items-center justify-between gap-4 bg-white p-5 text-sm">
                    <span>{i.item}</span><span className="font-semibold text-navy">{i.status}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* 12 */}
            <Section n={12} intro="What is likely to change around the branch in the next two years.">
              <ol className="relative border-l-2 border-navy/15 pl-8">
                {r.outlook.map((o, i) => (
                  <Reveal key={o.event} delay={i * 0.12} className="relative pb-8 last:pb-0">
                    <span className={`absolute -left-[41px] top-0.5 flex h-5 w-5 items-center justify-center text-xs font-bold text-white ${o.effect === "positive" ? "bg-navy" : "bg-red"}`}>
                      {o.effect === "positive" ? "+" : "−"}
                    </span>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted">{o.when}</p>
                    <p className="mt-1 font-display text-lg font-semibold text-navy">{o.event}</p>
                  </Reveal>
                ))}
              </ol>
            </Section>

            {/* 13 */}
            <Section n={13} intro="Each risk placed by how likely it is and how much it would cost you.">
              <svg viewBox="0 0 520 330" className="w-full max-w-2xl" role="img" aria-label="Risk matrix plotting likelihood against impact">
                <rect x="40" y="10" width="470" height="280" fill="white" stroke="var(--color-line)" />
                <rect x="275" y="10" width="235" height="140" fill="var(--color-red)" fillOpacity="0.08" />
                <line x1="275" x2="275" y1="10" y2="290" stroke="var(--color-line)" />
                <line x1="40" x2="510" y1="150" y2="150" stroke="var(--color-line)" />
                <text x="275" y="318" fontSize="12" textAnchor="middle" fill="var(--color-muted)">Likelihood →</text>
                <text x="16" y="150" fontSize="12" textAnchor="middle" fill="var(--color-muted)" transform="rotate(-90 16 150)">Impact →</text>
                <text x="500" y="30" fontSize="11" textAnchor="end" fill="var(--color-red-dark)" fontWeight="600">Deal with these before you buy</text>
                {r.risks.map((k2, i) => {
                  const x = 40 + k2.likelihood * 470, y = 290 - k2.impact * 280;
                  const hot = k2.likelihood > 0.5 && k2.impact > 0.5;
                  return (
                    <Pop key={k2.name} delay={0.2 + i * 0.12}>
                      <circle cx={x} cy={y} r="9" fill={hot ? "var(--color-red)" : "var(--color-navy)"} />
                      <text x={x + (x > 400 ? -14 : 14)} y={y + 4} fontSize="12" textAnchor={x > 400 ? "end" : "start"} fill="var(--color-ink)">{k2.name}</text>
                    </Pop>
                  );
                })}
              </svg>
            </Section>

            {/* 14 */}
            <Section n={14} intro={`Four changes that could take net profit from about £41k to £${planTotal}k a year.`}>
              <div className="flex h-64 gap-3 sm:gap-5" role="img" aria-label={`Profit rising from £41k to £${planTotal}k through four improvements`}>
                {waterfall().map((b, i) => (
                  <div key={b.step} className="relative h-full flex-1">
                    <div className="absolute inset-x-0" style={{ bottom: pct70(b.from), height: pct70(b.value) }}>
                      <Rise delay={i * 0.15} className={`absolute inset-0 ${b.tone}`} />
                    </div>
                    <p className={`absolute inset-x-0 mb-2 text-center font-display text-sm font-semibold ${b.tone === "bg-red" ? "text-red-dark" : "text-navy"}`} style={{ bottom: pct70(b.from + b.value) }}>
                      {b.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-3 text-center text-xs text-muted sm:gap-5">
                {[...r.profitPlan.map((p) => p.step), "Potential net profit"].map((s) => <p key={s} className="flex-1">{s}</p>)}
              </div>
            </Section>

            {/* 15 */}
            <Section n={15} intro="Where to open, where to settle, and when to walk away.">
              <div className="relative mt-16 h-3 bg-navy/10">
                <div className="absolute inset-y-0" style={{ left: `${nx(neg.opening)}%`, width: `${nx(neg.walkAway) - nx(neg.opening)}%` }}>
                  <Grow className="h-full bg-navy" />
                </div>
                {[
                  { v: neg.opening, l: "Open", c: "bg-navy", up: true },
                  { v: neg.target, l: "Aim for", c: "bg-red", up: false },
                  { v: neg.walkAway, l: "Walk away above", c: "bg-navy", up: true },
                  { v: neg.asking, l: "Asking", c: "bg-navy/40", up: false },
                ].map((m) => (
                  <div key={m.l} className="absolute top-1/2" style={{ left: `${nx(m.v)}%` }}>
                    <span className={`absolute -left-2 -top-2 h-4 w-4 ${m.c}`} />
                    <div className={`absolute w-28 -translate-x-1/2 text-center text-xs ${m.up ? "-top-14" : "top-5"}`}>
                      <p className="font-semibold text-navy">{m.l}</p><p className="text-muted">£{m.v}k</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-8 mt-16" />
              <h3 className="font-display text-lg font-semibold text-navy">Ask the seller before you offer</h3>
              <ol className="mt-4 space-y-3 text-[15px] leading-relaxed">
                {neg.questions.map((q, i) => (
                  <li key={q} className="flex gap-4"><span className="font-display font-semibold text-red">{i + 1}</span>{q}</li>
                ))}
              </ol>
              <Insight>Open at £138k and justify it with the accounts gap and the TUPE costs. Settle around £148k. Above £155k the numbers stop working, however much you like the branch.</Insight>
            </Section>
          </div>
        </div>

        {/* CTA */}
        <section className="no-print relative overflow-hidden bg-red">
          <Slant className="inset-y-0 right-[8%] w-[22%] bg-black/12" />
          <div className="relative mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 px-5 py-16 text-white sm:px-8 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-[-0.02em] sm:text-[40px]">Want this for a real branch?</h2>
              <p className="mt-3 text-white/80">Insight from £199. Intelligence, as above, £499. Prices plus VAT.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/contact?service=intelligence-report" variant="white">Order a report</ButtonLink>
              <Link href="/reports" className="inline-flex min-h-12 items-center px-4 text-[15px] font-semibold text-white">Compare reports →</Link>
            </div>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
