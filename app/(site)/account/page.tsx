import type { Metadata } from "next";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free membership",
  description: "Free member accounts: checklists, guides and tools for Post Office buyers and operators.",
};

export default function AccountPage() {
  return (
    <section>
      <Container className="max-w-2xl py-24 text-center md:py-32">
        <Eyebrow>Free membership</Eyebrow>
        <h1 className="mt-5 font-display font-bold tracking-[-0.02em] text-4xl leading-tight text-navy sm:text-5xl">Member accounts open soon.</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          Free accounts will give you every checklist, worksheet and guide on the site, plus a short email when I
          publish something worth reading. Want to be first in? Drop me a line and I&apos;ll add you.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={`mailto:${site.contactEmail}?subject=${encodeURIComponent("Add me to the FCM list")}`}>
            Add me to the list
          </ButtonLink>
          <ButtonLink href="/insights" variant="outline">
            Read the insights
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
