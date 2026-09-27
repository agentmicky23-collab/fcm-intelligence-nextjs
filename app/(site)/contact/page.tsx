import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Container, Eyebrow } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get in touch",
  description: "Tell me where you are and what you need, and I'll come back to you personally.",
};

export default async function ContactPage(props: PageProps<"/contact">) {
  const { service } = await props.searchParams;
  return (
    <section>
      <Container className="grid gap-14 py-20 md:grid-cols-[1fr_1.4fr] md:py-24">
        <div>
          <Eyebrow>Get in touch</Eyebrow>
          <h1 className="mt-5 font-display font-bold tracking-[-0.02em] text-4xl leading-tight text-navy">Tell me where you are.</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Whether you&apos;ve found a branch, you&apos;re just starting to look, or you&apos;re already running one,
            send me a few lines and I&apos;ll come back to you personally.
          </p>
          <p className="mt-8 text-sm text-muted">
            Or email me directly at{" "}
            <a href={`mailto:${site.contactEmail}`} className="font-medium text-red-dark underline underline-offset-4">
              {site.contactEmail}
            </a>
          </p>
        </div>
        <div className=" border border-line bg-white p-7 sm:p-10">
          <ContactForm initialService={typeof service === "string" ? service : undefined} />
        </div>
      </Container>
    </section>
  );
}
