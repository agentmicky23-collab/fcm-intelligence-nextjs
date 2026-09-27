import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date
  category: string;
  readingMinutes: number;
  body: string;
};

const DIR = path.join(process.cwd(), "content", "articles");

function load(file: string): Article {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  const words = content.trim().split(/\s+/).length;
  return {
    slug: file.replace(/\.md$/, ""),
    title: String(data.title),
    description: String(data.description),
    date: String(data.date),
    category: String(data.category ?? "Buying"),
    readingMinutes: Math.max(2, Math.ceil(words / 200)),
    body: content,
  };
}

export function getArticles(): Article[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(load)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(slug: string): Article | undefined {
  if (!/^[a-z0-9-]+$/.test(slug)) return undefined;
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(DIR, file))) return undefined;
  return load(file);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
