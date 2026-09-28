// Plain-text summaries of the site for AI assistants (the llms.txt convention).
// Built from the same data as the pages, so prices and facts stay in step.

import { getArticles } from "@/lib/articles";
import { reportFaqs, serviceFaqs } from "@/lib/faqs";
import { credentials } from "@/lib/home";
import { reportSections } from "@/lib/report";
import { getResource, resources } from "@/lib/resources";
import { stages } from "@/lib/services";
import { site } from "@/lib/site";

const url = (path: string) => `${site.url}${path}`;

function servicesSection() {
  return stages
    .map((st) => {
      const lines = st.services.map((s) => {
        const price = /^£/.test(s.price) || s.price.startsWith("From") ? `${s.price} + VAT${s.unit ? ` (${s.unit})` : ""}` : s.price;
        return `- **${s.name}** (${price}): ${s.summary} Includes: ${s.includes.join("; ")}.`;
      });
      return `### ${st.title}\n\n${st.intro}\n\n${lines.join("\n")}`;
    })
    .join("\n\n");
}

const faqSection = () =>
  [...reportFaqs, ...serviceFaqs.filter((f) => !reportFaqs.some((r) => r.q === f.q))].map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n");

function intro() {
  return `# ${site.name}

> ${site.name} is the advisory business of ${site.owner}, a UK Post Office operator who runs 43 branches and has run up to 100 over 15 years. It offers acquisition reports on Post Offices for sale, consultancy, training and operational support for single and multiple branch operators, and free resources for buyers. ${site.name} is a strategic partner to Post Office. The business is ${site.company}. All prices are in GBP and exclude VAT.

Key facts: ${credentials.join(" · ")}. Contact: ${site.contactEmail}, or the enquiry form at ${url("/contact")}.`;
}

export function llmsTxt() {
  const articles = getArticles();
  return `${intro()}

## Main pages

- [Acquisition reports](${url("/reports")}): Insight (£199 + VAT, 10 sections) and Intelligence (£499 + VAT, 15 sections) reports on any UK Post Office for sale.
- [Example Intelligence Report](${url("/reports/example")}): a complete sample report on a fictional branch.
- [Services and prices](${url("/services")}): every service for buying, starting out and running a Post Office.
- [Free insurance review](${url("/services/insurance-review")}): 17 questions that check a Post Office's insurance cover.
- [About ${site.owner}](${url("/about")}): background, track record and the management team.
- [Free resources](${url("/resources")}): checklists and guides, free with membership.
- [Contact](${url("/contact")})

## Articles

${articles.map((a) => `- [${a.title}](${url(`/insights/${a.slug}`)}): ${a.description}`).join("\n")}

## Free resources

${resources.map((r) => `- [${r.title}](${url(`/resources/${r.slug}`)}): ${r.description}`).join("\n")}

## Optional

- [Full text of the articles, services and common questions](${url("/llms-full.txt")})
`;
}

export function llmsFullTxt() {
  const articles = getArticles();
  return `${intro()}

## Services

${servicesSection()}

## What's in a report

${reportSections.map((s) => `${s.n}. ${s.title} (${s.tier === "insight" ? "Insight and Intelligence" : "Intelligence only"})`).join("\n")}

## Common questions

${faqSection()}

## Free resources (members only; summaries)

${resources
  .map((r) => {
    const full = getResource(r.slug);
    return `- [${r.title}](${url(`/resources/${r.slug}`)}): ${full?.summary ?? r.description}`;
  })
  .join("\n")}

## Articles

${articles
  .map((a) => `### ${a.title}\n\nBy ${site.owner}, ${a.date}. ${url(`/insights/${a.slug}`)}\n\n${a.description}\n\n${a.body.trim()}`)
  .join("\n\n---\n\n")}
`;
}
