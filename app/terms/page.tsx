import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of use" };

export default function Page() {
  return (
    <section>
      <Container className="max-w-3xl py-20">
        <h1 className="font-display text-4xl text-navy">Terms of use</h1>
        <p className="mt-6 rounded-lg bg-gold/15 px-4 py-3 text-sm text-gold-dark">
          Draft: the full terms will be published before the site launches.
        </p>
        <p className="mt-6 leading-relaxed text-muted">
          {site.name} is run by {site.company}. Questions in the meantime: {site.contactEmail}.
        </p>
      </Container>
    </section>
  );
}
