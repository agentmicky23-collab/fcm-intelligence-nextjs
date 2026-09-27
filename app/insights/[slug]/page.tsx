import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArticleCard } from "@/components/ArticleCard";
import { JoinCta } from "@/components/JoinCta";
import { Container } from "@/components/ui";
import { formatDate, getArticle, getArticles } from "@/lib/articles";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    openGraph: { type: "article", title: article.title, description: article.description, publishedTime: article.date },
  };
}

export default async function ArticlePage(props: PageProps<"/insights/[slug]">) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) notFound();

  const more = getArticles()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <>
      <section className="bg-navy">
        <Container className="max-w-3xl py-16 md:py-20">
          <Link href="/insights" className="text-sm text-white/60 hover:text-gold">
            ← All insights
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-gold">{article.category}</p>
          <h1 className="mt-4 font-display text-3xl leading-tight text-white sm:text-5xl">{article.title}</h1>
          <p className="mt-6 text-sm text-white/60">
            {site.owner} · {formatDate(article.date)} · {article.readingMinutes} min read
          </p>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="max-w-3xl py-14 md:py-16">
          <p className="mb-10 font-display text-xl leading-relaxed text-navy">{article.description}</p>
          <div className="prose-fcm">
            <Markdown remarkPlugins={[remarkGfm]}>{article.body}</Markdown>
          </div>
          <div className="mt-14 rounded-2xl bg-cream p-8">
            <p className="font-display text-xl text-navy">Want me to look at a branch with you?</p>
            <p className="mt-2 text-muted">
              Reports from £199, or book an hour with me and we&apos;ll go through it together.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
              <Link href="/reports" className="text-gold-dark hover:text-navy">See the reports →</Link>
              <Link href="/services" className="text-gold-dark hover:text-navy">All the ways I can help →</Link>
            </div>
          </div>
        </Container>
      </section>

      {more.length > 0 && (
        <section>
          <Container className="py-16">
            <h2 className="font-display text-2xl text-navy">Keep reading</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {more.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <JoinCta />
    </>
  );
}
