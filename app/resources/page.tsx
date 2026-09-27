import type { Metadata } from "next";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { resources } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Free resources",
  description: "Checklists, worksheets and guides for buying and running a Post Office. Free with a member account.",
};

export default function ResourcesPage() {
  return (
    <>
      <section className="bg-navy">
        <Container className="py-20 md:py-24">
          <Eyebrow>Free resources</Eyebrow>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-white sm:text-5xl">
            The checklists and guides I use myself.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            All free. Create a member account and you can download every one of them.
          </p>
          <div className="mt-8">
            <ButtonLink href="/account">Create a free account</ButtonLink>
          </div>
        </Container>
      </section>
      <section>
        <Container className="grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-3 md:py-20">
          {resources.map((r) => (
            <div key={r.slug} className="flex flex-col rounded-2xl border border-cream-dark bg-white p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">{r.format}</p>
              <h2 className="mt-3 font-display text-xl text-navy">{r.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{r.description}</p>
              <p className="mt-6 text-xs font-medium text-muted">Free for members</p>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
