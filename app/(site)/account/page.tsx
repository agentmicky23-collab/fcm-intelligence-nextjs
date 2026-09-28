import type { Metadata } from "next";
import { MemberSignup } from "@/components/MemberSignup";
import { Container, Eyebrow, Slant } from "@/components/ui";
import { memberBenefits } from "@/lib/member";
import { resources } from "@/lib/resources";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/account", "Free Membership for Post Office Buyers and Operators", "Join free for checklists, worksheets and guides on buying and running a Post Office, written by an operator of 43 branches.");


export default function AccountPage() {
  return (
    <section className="relative overflow-hidden bg-night">
      <Slant className="inset-y-0 right-[-12%] hidden w-[34%] bg-navy lg:block" />
      <Slant className="inset-y-0 right-[20%] hidden w-[3%] bg-red lg:block" />
      <Container className="relative grid items-start gap-12 py-20 md:py-24 lg:grid-cols-[1.1fr_1fr]">
        <div className="text-white lg:col-start-1 lg:row-start-1">
          <Eyebrow light>Free membership</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-[-0.02em] sm:text-5xl">
            The checklists I use on every deal. Free.
          </h1>
          <ul className="mt-8 space-y-4 text-lg text-white/80">
            {memberBenefits.map((b) => (
              <li key={b} className="flex gap-4">
                <span aria-hidden className="mt-2 h-3.5 w-2 shrink-0 -skew-x-[18deg] bg-red" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-7 sm:p-10 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <MemberSignup />
        </div>
        <div className="text-white lg:col-start-1">
          <p className="text-sm font-medium text-white/60">What members get first</p>
          <ul className="mt-4 grid gap-2 text-sm text-white/75 sm:grid-cols-2">
            {resources.map((r) => (
              <li key={r.slug} className="border border-white/15 px-4 py-3">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-red-light">{r.format}</span>
                {r.title}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
