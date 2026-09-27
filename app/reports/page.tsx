import type { Metadata } from "next";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui";
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
      <section className="bg-navy">
        <Container className="py-20 md:py-24">
          <Eyebrow>Acquisition reports</Eyebrow>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-white sm:text-5xl">
            Know what you&apos;re buying before you spend a penny on solicitors.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            I built these reports around the checks I run on every branch I look at. Give us the listing, and you get
            the picture a broker won&apos;t give you.
          </p>
        </Container>
      </section>

      <section>
        <Container className="grid gap-6 py-16 md:grid-cols-2 md:py-20">
          {reports.map((r, i) => (
            <div
              key={r.slug}
              className={`flex flex-col rounded-2xl p-8 ${i === 1 ? "bg-navy text-white ring-2 ring-gold" : "border border-cream-dark bg-white"}`}
            >
              {i === 1 && <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">The full picture</p>}
              <h2 className={`font-display text-3xl ${i === 1 ? "text-white" : "text-navy"}`}>{r.name}</h2>
              <p className={`mt-2 font-display text-4xl ${i === 1 ? "text-gold" : "text-gold-dark"}`}>{r.price}</p>
              <p className={`mt-4 leading-relaxed ${i === 1 ? "text-white/75" : "text-muted"}`}>{r.summary}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {r.includes.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <ButtonLink href={`/contact?service=${r.slug}`} variant={i === 1 ? "gold" : "navy"}>
                  Register interest
                </ButtonLink>
              </div>
            </div>
          ))}
        </Container>
      </section>

      <section className="bg-white">
        <Container className="grid gap-10 py-16 md:grid-cols-3 md:py-20">
          <SectionHeading eyebrow="How it works" title="Three steps." className="md:col-span-1" />
          <ol className="grid gap-6 sm:grid-cols-3 md:col-span-2">
            {[
              ["Send the listing", "The business name, postcode and the listing link. Add any documents the broker has given you."],
              ["We do the research", "Location, competition, crime, footfall, reputation, and the numbers if you've got them."],
              ["I review it", "Every report is checked before it reaches you. If something doesn't add up, we say so."],
            ].map(([title, text], i) => (
              <li key={title}>
                <p className="font-display text-3xl text-gold">{i + 1}</p>
                <h3 className="mt-2 font-display text-lg text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
