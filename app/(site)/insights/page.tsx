import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { JoinCta } from "@/components/JoinCta";
import { Container, Eyebrow, Slant } from "@/components/ui";
import { getArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Insights",
  description: "Practical advice on buying and running a Post Office, from 15 years and 43 branches of experience.",
};

export default function InsightsPage() {
  const articles = getArticles();
  return (
    <>
      <section className="relative overflow-hidden bg-night">
        <Slant className="inset-y-0 right-[-12%] hidden w-[34%] bg-navy md:block" />
        <Slant className="inset-y-0 right-[20%] hidden w-[3%] bg-red md:block" />
        <Slant className="inset-y-0 right-[25%] hidden w-[0.8%] bg-red/55 md:block" />
        <Container className="relative py-20 md:py-24">
          <Eyebrow light>Insights</Eyebrow>
          <h1 className="mt-5 max-w-3xl font-display font-bold tracking-[-0.02em] text-4xl leading-tight text-white sm:text-5xl">
            What I&apos;ve learned running Post Offices, written down.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            No theory. These are the things I check, the mistakes I&apos;ve seen and the rules I follow on every deal.
          </p>
        </Container>
      </section>
      <section>
        <Container className="grid gap-6 py-16 md:grid-cols-2 lg:grid-cols-3 md:py-20">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </Container>
      </section>
      <JoinCta />
    </>
  );
}
