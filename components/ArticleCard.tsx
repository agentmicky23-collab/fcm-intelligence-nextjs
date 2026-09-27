import Link from "next/link";
import { formatDate, type Article } from "@/lib/articles";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="group flex h-full flex-col border border-line bg-white p-7 transition-all hover:-translate-y-0.5 hover:border-red/60 hover:shadow-[0_12px_40px_-20px_rgba(11,29,58,0.35)]"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-dark">{article.category}</p>
      <h3 className="mt-3 font-display font-bold tracking-[-0.02em] text-xl leading-snug text-navy group-hover:text-navy-600">{article.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{article.description}</p>
      <p className="mt-6 text-xs text-muted">
        {formatDate(article.date)} · {article.readingMinutes} min read
      </p>
    </Link>
  );
}
