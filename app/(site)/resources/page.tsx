import type { Metadata } from "next";
import Link from "next/link";
import { ExplainerBlock } from "@/components/ExplainerBlock";
import { RequestAccess } from "@/components/RequestAccess";
import { explainers } from "@/lib/explainer";
import { ButtonLink, Container, Eyebrow, Slant } from "@/components/ui";
import { currentMember } from "@/lib/server/member";
import { resources } from "@/lib/resources";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/resources", "Free Post Office Checklists and Guides", "Due diligence checklist, questions for the broker, hidden costs worksheet, TUPE explained and more. Free resources for Post Office buyers.");


export default async function ResourcesPage() {
  const member = await currentMember();
  const first = member?.split(" ")[0];

  return (
    <>
      <JsonLd data={breadcrumbs([["Free resources", "/resources"]])} />
      <section className="relative overflow-hidden bg-night">
        <Slant className="inset-y-0 right-[-12%] hidden w-[34%] bg-navy md:block" />
        <Slant className="inset-y-0 right-[20%] hidden w-[3%] bg-red md:block" />
        <Slant className="inset-y-0 right-[25%] hidden w-[0.8%] bg-red/55 md:block" />
        <Container className="relative py-20 md:py-24">
          <Eyebrow light>{member ? "Members' library" : "Free resources"}</Eyebrow>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-5xl">
            {member ? `Welcome back, ${first}.` : "The checklists and guides I use myself."}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            {member
              ? "Everything here is yours. Read online, tick things off as you go, or save any of them as a PDF."
              : "All free for members. Read the opening of each one below, then join to read the rest and save them."}
          </p>
          {!member && (
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <ButtonLink href="/account">Join free</ButtonLink>
              <a href="#member-link" className="text-[15px] font-medium text-white">Already a member? →</a>
            </div>
          )}
        </Container>
      </section>

      <section>
        <Container className="grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-3 md:py-20">
          {resources.map((r, i) => (
            <Link key={r.slug} href={`/resources/${r.slug}`} className="group relative flex flex-col border border-line bg-white p-7 transition-colors hover:border-navy">
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-dark">{r.format}</p>
                <span className="font-display text-[13px] font-semibold text-navy/30">0{i + 1}</span>
              </div>
              <h2 className="mt-3 font-display text-xl font-bold tracking-[-0.02em] text-navy">{r.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{r.description}</p>
              <p className="mt-6 text-sm font-semibold text-red-dark group-hover:text-navy">{member ? "Open →" : "Preview →"}</p>
              <span aria-hidden className="absolute bottom-0 left-0 h-[3px] w-12 bg-red transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-16 md:py-20">
          <ExplainerBlock video={explainers["members-library"]} page="/resources" />
        </Container>
      </section>

      {!member && (
        <section id="member-link" className="scroll-mt-20 bg-white">
          <Container className="grid items-center gap-8 py-14 md:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-navy">Already a member?</h2>
              <p className="mt-2 text-muted">On a new phone or computer? I&apos;ll email you a link that opens the library.</p>
            </div>
            <RequestAccess />
          </Container>
        </section>
      )}
    </>
  );
}
