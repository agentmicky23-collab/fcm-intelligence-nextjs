import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BranchCheck } from "@/components/tools/BranchCheck";
import { SuiteHeader } from "@/components/tools/SuiteHeader";
import { Container } from "@/components/ui";
import { adminEmail, isAdmin } from "@/lib/server/admin";

// Paid members' tool. Anyone not allowed in gets a plain 404. Until payment is set up, only Mikesh can open it.
export const metadata: Metadata = { title: "Tools", robots: { index: false, follow: false, nocache: true } };

export default async function BranchCheckPage() {
  if (!(await isAdmin())) notFound();
  return (
    <>
      <SuiteHeader current="/tools/branch-check" title="Branch Check" intro="Your Branch Hub reports, in plain English: what you earned, what you missed and why, and what to fix first." />
      <section className="bg-night">
        <Container className="pb-20">
          <p className="mb-5 inline-block rounded-full border border-white/15 px-3 py-1 text-xs text-white/60">Preview: only you can see this until payment is switched on.</p>
          <BranchCheck viewer={adminEmail()} />
        </Container>
      </section>
    </>
  );
}
