import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Free resources for members. The text lives in content/resources/<slug>.md.
export const resources = [
  { slug: "due-diligence-checklist", title: "The due diligence checklist", description: "The ten checks I run on every Post Office, with the documents to request for each one.", format: "Checklist" },
  { slug: "questions-for-the-broker", title: "Questions to ask the broker", description: "What to ask on the first call, so you only spend time on branches worth viewing.", format: "Question list" },
  { slug: "hidden-costs-calculator-sheet", title: "Hidden costs worksheet", description: "Holiday pay, TUPE, utilities, rates and the rest, so they're in your numbers before you offer.", format: "Worksheet" },
  { slug: "tupe-explained", title: "TUPE explained for new postmasters", description: "What transfers with the staff, what you can and can't change, and where the costs hide.", format: "Guide" },
  { slug: "first-90-days", title: "Your first 90 days", description: "What to do in your first three months after taking over a branch, phase by phase.", format: "Guide" },
  { slug: "five-year-high-street-test", title: "The five-year high street test", description: "How to judge where a location is heading before you commit your money to it.", format: "Checklist" },
] as const;

export type Resource = (typeof resources)[number] & { summary: string; readingMinutes: number; body: string };

const DIR = path.join(process.cwd(), "content", "resources");

export function getResource(slug: string): Resource | undefined {
  const meta = resources.find((r) => r.slug === slug);
  const file = path.join(DIR, `${slug}.md`);
  if (!meta || !fs.existsSync(file)) return undefined;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { ...meta, summary: String(data.summary ?? meta.description), readingMinutes: Number(data.readingMinutes ?? 5), body: content };
}

/** Notes for Mikesh to verify, written as [CHECK: ...]. Shown on previews, removed on the live site. */
export const showReviewNotes = process.env.VERCEL_ENV !== "production";

export function prepareBody(body: string) {
  return showReviewNotes
    ? body.replace(/\s*\[CHECK(?::\s*([^\]]*))?\]/g, (_, note) => ` **[To check${note ? `: ${note}` : ""}]**`)
    : body.replace(/\s*\[CHECK(?::[^\]]*)?\]/g, "");
}
