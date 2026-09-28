import type { Metadata } from "next";
import { InsuranceReview } from "@/components/insurance/InsuranceReview";
import { Container, Eyebrow, Slant } from "@/components/ui";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/services/insurance-review", "Free Post Office Insurance Review", "Seventeen questions that show whether your Post Office insurance covers the risks you actually carry. Free, instant results, nothing to buy.");


export default function InsuranceReviewPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-night">
        <Slant className="inset-y-0 right-[-12%] hidden w-[34%] bg-navy md:block" />
        <Slant className="inset-y-0 right-[20%] hidden w-[3%] bg-red md:block" />
        <Slant className="inset-y-0 right-[25%] hidden w-[0.8%] bg-red/55 md:block" />
        <Container className="relative py-20 md:py-24">
          <Eyebrow light>Insurance Review</Eyebrow>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-5xl">
            Is your Post Office insurance fit for purpose?
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
            Most branches are on shop cover with Post Office extras bolted on. A Post Office needs cover built around what it
            actually carries: the cash, the contract income and the counter.
          </p>
          <p className="mt-4 text-sm font-medium text-white/60">Free to use. I&apos;m not selling insurance.</p>
        </Container>
      </section>
      <section>
        <Container className="py-16 md:py-20">
          <InsuranceReview />
        </Container>
      </section>
    </>
  );
}
