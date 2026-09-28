import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/articles";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/insights", "/resources", "/services", "/services/insurance-review", "/reports", "/reports/example", "/account", "/contact", "/privacy", "/terms"].map((p) => ({
    url: `${site.url}${p}`,
  }));
  const articles = getArticles().map((a) => ({ url: `${site.url}/insights/${a.slug}`, lastModified: a.date }));
  return [...pages, ...articles];
}
