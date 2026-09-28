import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrintButton } from "@/components/report/PrintButton";
import { RequestAccess } from "@/components/RequestAccess";
import { ButtonLink, Container, Slant } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { abs, breadcrumbs, orgId, pageMeta, personId } from "@/lib/seo";
import { currentMember } from "@/lib/server/member";
import { getResource, prepareBody, resources, showReviewNotes } from "@/lib/resources";

export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata(props: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const r = getResource((await props.params).slug);
  return r ? pageMeta(`/resources/${r.slug}`, r.title, r.summary) : {};
}

/** Non-members see the introduction and the first section, then an invitation to join. */
function preview(body: string) {
  const parts = body.split(/\n(?=## )/);
  return parts.slice(0, 2).join("\n");
}

export default async function ResourcePage(props: PageProps<"/resources/[slug]">) {
  const r = getResource((await props.params).slug);
  if (!r) notFound();
  const member = await currentMember();
  const body = prepareBody(r.body);

  return (
    <div className="report">
      <JsonLd
        data={[
          {
            "@type": "Article",
            headline: r.title,
            description: r.summary,
            genre: r.format,
            inLanguage: "en-GB",
            mainEntityOfPage: abs(`/resources/${r.slug}`),
            author: { "@id": personId },
            publisher: { "@id": orgId },
          },
          breadcrumbs([["Free resources", "/resources"], [r.title, `/resources/${r.slug}`]]),
        ]}
      />
      <section className="relative overflow-hidden bg-night">
        <Slant className="inset-y-0 right-[-16%] hidden w-[24%] bg-navy xl:block" />
        <Slant className="inset-y-0 right-[6%] hidden w-[2.5%] bg-red xl:block" />
        <Container className="relative max-w-3xl py-16 md:py-20">
          <Link href="/resources" className="no-print text-sm text-white/60 hover:text-red">
            ← {member ? "Members' library" : "Free resources"}
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-red">{r.format}</p>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-5xl">{r.title}</h1>
          <p className="mt-5 text-lg text-white/70">{r.summary}</p>
          <div className="no-print mt-6 flex flex-wrap items-center gap-6 text-sm text-white/60">
            <span>{r.readingMinutes} min read</span>
            {member && <PrintButton className="text-white hover:text-red-light" />}
          </div>
        </Container>
      </section>

      {showReviewNotes && (
        <div className="no-print bg-red/10">
          <Container className="max-w-3xl py-3 text-sm text-red-dark">
            Preview only: bold <strong>[To check]</strong> notes mark details for Mikesh to confirm. They don&apos;t appear on the live site.
          </Container>
        </div>
      )}

      <section className="bg-white">
        <Container className="max-w-3xl py-14 md:py-16">
          <div className="prose-fcm resource">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: (props) => (
                  <div className="overflow-x-auto">
                    <table {...props} />
                  </div>
                ),
                li: ({ className, children }) =>
                  className?.includes("task-list-item") ? (
                    <li className={className}>
                      <label className="flex cursor-pointer items-start gap-3">{children}</label>
                    </li>
                  ) : (
                    <li className={className}>{children}</li>
                  ),
                input: ({ type, checked }) => <input type={type} defaultChecked={checked} />,
              }}
            >{member ? body : preview(body)}</Markdown>
          </div>

          {!member && (
            <div className="relative mt-4">
              <div aria-hidden className="pointer-events-none absolute -top-24 left-0 right-0 h-24 bg-gradient-to-b from-white/0 to-white" />
              <div className="border-t-[3px] border-red bg-night p-7 text-white sm:p-10">
                <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">Read the rest free.</h2>
                <p className="mt-3 max-w-xl leading-relaxed text-white/70">
                  Join free and the whole {r.format.toLowerCase()}, plus the other five resources, open straight away. You can
                  save any of them as a PDF.
                </p>
                <div className="mt-6"><ButtonLink href="/account">Join free</ButtonLink></div>
                <div className="mt-8 border-t border-white/15 pt-6">
                  <p className="mb-3 text-sm text-white/60">Already a member on another device?</p>
                  <RequestAccess dark />
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
