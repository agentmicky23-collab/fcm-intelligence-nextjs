import { getArticle, getArticles } from "@/lib/articles";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "FCM Intelligence article";

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug);
  return ogImage({ eyebrow: article?.category ?? "Insights", title: article?.title ?? "FCM Intelligence", footer: "Mikesh Parekh · fcmintelligence.com" });
}
