import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/articles";
import { resources } from "@/lib/resources";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticles();
  const latest = articles[0]?.date;
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly", lastModified?: string) => ({
    url: `${site.url}${path}`,
    priority,
    changeFrequency,
    ...(lastModified ? { lastModified } : {}),
  });
  return [
    page("", 1, "weekly", latest),
    page("/reports", 0.9),
    page("/services", 0.9),
    page("/about", 0.8),
    page("/insights", 0.8, "weekly", latest),
    page("/resources", 0.7),
    page("/reports/example", 0.7),
    page("/services/insurance-review", 0.7),
    page("/account", 0.5),
    page("/contact", 0.6),
    page("/privacy", 0.2, "yearly"),
    page("/terms", 0.2, "yearly"),
    page("/cookies", 0.2, "yearly"),
    ...articles.map((a) => page(`/insights/${a.slug}`, 0.7, "yearly", a.date)),
    ...resources.map((r) => page(`/resources/${r.slug}`, 0.6)),
  ];
}
