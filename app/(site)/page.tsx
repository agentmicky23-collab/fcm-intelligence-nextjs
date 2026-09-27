import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { JoinCta } from "@/components/JoinCta";
import { ButtonLink, Container, Eyebrow, PhotoPlaceholder, SectionHeading } from "@/components/ui";
import { getArticles } from "@/lib/articles";
import { resources } from "@/lib/resources";
import { stages } from "@/lib/services";
import { stats } from "@/lib/site";

export default function Home() {
  const latest = getArticles().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(191,155,81,0.18),transparent_55%)]" />
        <Container className="relative grid items-center gap-12 py-20 md:grid-cols-[1.25fr_1fr] md:py-28">
          <div>
            <Eyebrow>Mikesh Parekh · Subpostmaster since 2011</Eyebrow>
            <h1 className="mt-6 font-display text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">
              I&apos;ve spent 15 years buying, building and running Post Offices.
              <span className="text-gold"> Here&apos;s what I&apos;ve learned.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              From one branch in Oldham to 43 across the country. If you&apos;re thinking about buying a Post Office, or
              already running one, I&apos;ll give you the straight answers I wish someone had given me.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/insights">Read the insights</ButtonLink>
              <ButtonLink href="/account" variant="outline-light">
                Join free
              </ButtonLink>
            </div>
          </div>
          <PhotoPlaceholder label="Mikesh at one of his branches" className="aspect-[4/5] w-full" />
        </Container>
      </section>

      {/* Stats */}
      <section className="border-b border-cream-dark bg-white">
        <Container className="grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl text-navy">{s.value}</p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* Philosophy */}
      <section>
        <Container className="grid gap-12 py-20 md:grid-cols-2 md:py-24">
          <SectionHeading
            eyebrow="Why I do this"
            title="Buying a Post Office is easy. Buying the right one is not."
          />
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            <p>
              Most first-time buyers are working from a broker&apos;s listing and a gut feeling. I want you working from
              what I know: ask for five years of accounts, not three. Value the property separately from the business.
              Never spend your whole budget. And before you buy, ask what that high street will look like in five years.
            </p>
            <p>Most of what&apos;s on this site is free, and it always will be.</p>
            <blockquote className="border-l-2 border-gold pl-5 font-display text-xl italic text-navy">
              &ldquo;Every time I lose I secretly win, because I discover a lesson within it I will never forget.&rdquo;
            </blockquote>
          </div>
        </Container>
      </section>

      {/* Latest insights */}
      <section className="bg-white">
        <Container className="py-20 md:py-24">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Latest insights" title="Practical, from the counter." />
            <Link href="/insights" className="text-sm font-semibold text-gold-dark hover:text-navy">
              All insights →
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {latest.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </Container>
      </section>

      {/* Free resources */}
      <section>
        <Container className="py-20 md:py-24">
          <SectionHeading
            eyebrow="Free for members"
            title="The tools I use on every deal."
            intro="Create a free account and they're yours: checklists, worksheets and guides built from real acquisitions."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.slice(0, 3).map((r) => (
              <div key={r.slug} className="rounded-2xl border border-cream-dark bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">{r.format}</p>
                <h3 className="mt-2 font-display text-lg text-navy">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{r.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <ButtonLink href="/resources" variant="outline">
              See all free resources
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Where are you */}
      <section className="bg-white">
        <Container className="py-20 md:py-24">
          <SectionHeading
            eyebrow="Work with me"
            title="Want me to look at your situation personally?"
            intro="Wherever you are, there's a way I can help."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {stages.map((stage) => (
              <Link
                key={stage.id}
                href={`/services#${stage.id}`}
                className="group rounded-2xl bg-navy p-8 text-white transition-colors hover:bg-navy-700"
              >
                <h3 className="font-display text-2xl">{stage.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{stage.intro}</p>
                <p className="mt-6 text-sm font-semibold text-gold group-hover:text-gold-light">
                  {stage.services.length} ways I can help →
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <JoinCta />
    </>
  );
}
