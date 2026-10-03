import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RemunerationAnalyser } from "@/components/tools/RemunerationAnalyser";
import { SuiteHeader } from "@/components/tools/SuiteHeader";
import { Container } from "@/components/ui";
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
      <SuiteHeader current="/tools/remuneration-analyser" title="Remuneration Analyser" intro="See exactly where your Post Office money comes from, and what growing each service would be worth." />

      <section className="bg-night">
        <Container className="pb-20">
          <p className="mb-5 inline-block rounded-full border border-white/15 px-3 py-1 text-xs text-white/60">Preview: only you can see this until payment is switched on.</p>
          <RemunerationAnalyser viewer={adminEmail()} />
        </Container>
      </section>
    </>
  );
}
