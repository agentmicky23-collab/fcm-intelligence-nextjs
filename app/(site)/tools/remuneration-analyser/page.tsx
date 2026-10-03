import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RemunerationAnalyser } from "@/components/tools/RemunerationAnalyser";
import { Container, Eyebrow, Slant } from "@/components/ui";
import { adminEmail, isAdmin } from "@/lib/server/admin";

// Paid, members-only tool. Anyone not allowed in gets a plain 404: no public page, no description.
// Until payment is set up, only Mikesh (signed in to the control room) is allowed.
export const metadata: Metadata = {
  title: "Tools",
  robots: { index: false, follow: false, nocache: true },
};

export default async function RemunerationAnalyserPage() {
  if (!(await isAdmin())) notFound();

  return (
    <>
      <section className="relative overflow-hidden bg-night">
        <Slant className="inset-y-0 right-[-12%] hidden w-[30%] bg-navy md:block" />
        <Slant className="inset-y-0 right-[16%] hidden w-[2.5%] bg-red md:block" />
        <Container className="relative py-14 md:py-16">
          <Eyebrow light>Members&apos; tools</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-5xl">Remuneration Analyser</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">See exactly where your Post Office money comes from, and what growing each service would be worth.</p>
        </Container>
      </section>

      <section className="bg-night">
        <Container className="pb-20">
          <p className="mb-5 inline-block rounded-full border border-white/15 px-3 py-1 text-xs text-white/60">Preview: only you can see this until payment is switched on.</p>
          <RemunerationAnalyser viewer={adminEmail()} />
        </Container>
      </section>
    </>
  );
}
