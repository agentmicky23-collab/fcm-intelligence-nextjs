import { ButtonLink, Container, Eyebrow } from "@/components/ui";

/** Invitation to join free: the main conversion on content pages. */
export function JoinCta() {
  return (
    <section className="bg-night">
      <Container className="relative grid items-center gap-10 py-20 md:grid-cols-[1.3fr_1fr]">
        <div>
          <Eyebrow light>Free membership</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-[40px]">
            Get the checklists I use on every deal.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/70">
            Free for members, with a short email when I publish something worth reading.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
          <ButtonLink href="/account">Join free</ButtonLink>
          <ButtonLink href="/resources" variant="outline-light">
            See what&apos;s included
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
