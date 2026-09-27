import { ButtonLink, Container } from "@/components/ui";

/** Invitation to create a free account: the main conversion on every page. */
export function JoinCta() {
  return (
    <section className="bg-navy">
      <Container className="grid items-center gap-10 py-20 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Free membership</p>
          <h2 className="mt-4 font-display text-3xl leading-tight text-white sm:text-4xl">
            Get the checklists I use on every deal.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/70">
            Join free for my due diligence checklist, the questions to ask every broker, and a short email when I
            publish something worth reading. No spam, and you can leave whenever you like.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
          <ButtonLink href="/account">Create a free account</ButtonLink>
          <ButtonLink href="/resources" variant="outline-light">
            See what&apos;s included
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
