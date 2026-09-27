import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Container, Eyebrow, SectionHeading, Slant } from "@/components/ui";
import { stages, type Service } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work with me",
  description: "Reports, consultations and hands-on support for buying, starting and running a Post Office.",
};

function ServiceCard({ service }: { service: Service }) {
  const href = service.href ?? `/contact?service=${service.slug}`;
  return (
    <div className="flex flex-col border border-line bg-white p-7">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display font-bold tracking-[-0.02em] text-xl text-navy">{service.name}</h3>
        <div className="shrink-0 text-right">
          <p
            className={
              service.price.startsWith("£")
                ? "font-display font-bold tracking-[-0.02em] text-xl text-red-dark"
                : "pt-1 text-xs font-semibold uppercase tracking-wide text-red-dark"
            }
          >
            {service.price}
          </p>
          {service.unit && <p className="text-xs text-muted">{service.unit}</p>}
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{service.summary}</p>
      <ul className="mt-5 flex-1 space-y-2 text-sm text-ink">
        {service.includes.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
      <Link href={href} className="mt-6 text-sm font-semibold text-red-dark hover:text-navy">
        {service.href ? "Find out more →" : "Enquire →"}
      </Link>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-night">
        <Slant className="inset-y-0 right-[-12%] hidden w-[34%] bg-navy md:block" />
        <Slant className="inset-y-0 right-[20%] hidden w-[3%] bg-red md:block" />
        <Slant className="inset-y-0 right-[25%] hidden w-[0.8%] bg-red/55 md:block" />
        <Container className="relative py-20 md:py-24">
          <Eyebrow light>Work with me</Eyebrow>
          <h1 className="mt-5 max-w-3xl font-display font-bold tracking-[-0.02em] text-4xl leading-tight text-white sm:text-5xl">
            When you want me in your corner.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            Everything I&apos;ve learned from 43 branches, applied to your situation. Pick where you are and I&apos;ll
            show you how I can help.
          </p>
          <nav className="mt-10 flex flex-wrap gap-3" aria-label="Service stages">
            {stages.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className=" border border-white/25 px-5 py-2.5 text-sm text-white hover:border-red hover:text-red"
              >
                {s.title}
              </a>
            ))}
          </nav>
          {!site.pricesConfirmed && (
            <p className="mt-8 inline-block bg-red/15 px-4 py-2 text-sm text-red-light">
              Draft: prices on this page are provisional and still to be confirmed.
            </p>
          )}
        </Container>
      </section>

      {stages.map((stage, i) => (
        <section key={stage.id} id={stage.id} className={`scroll-mt-20 ${i % 2 ? "bg-white" : ""}`}>
          <Container className="py-16 md:py-20">
            <SectionHeading eyebrow={`Stage ${i + 1}`} title={stage.title} intro={stage.intro} />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stage.services.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </Container>
        </section>
      ))}

      <section className="bg-navy">
        <Container className="flex flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="font-display font-bold tracking-[-0.02em] text-3xl text-white">Not sure where to start?</h2>
            <p className="mt-2 text-white/70">Book a discovery call and I&apos;ll point you in the right direction.</p>
          </div>
          <ButtonLink href="/contact?service=discovery-call">Book a discovery call</ButtonLink>
        </Container>
      </section>
    </>
  );
}
