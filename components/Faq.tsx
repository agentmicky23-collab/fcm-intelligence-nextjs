import { JsonLd } from "@/components/JsonLd";
import { Container, SectionHeading } from "@/components/ui";
import type { Faq as FaqItem } from "@/lib/faqs";
import { faqSchema } from "@/lib/seo";

/** A list of common questions, open and closed with the keyboard or a tap, with matching FAQ structured data. */
export function Faq({ items, title = "Common questions" }: { items: FaqItem[]; title?: string }) {
  return (
    <section className="bg-light">
      <JsonLd data={faqSchema(items)} />
      <Container className="max-w-3xl py-20 md:py-24">
        <SectionHeading title={title} />
        <div className="mt-10 divide-y divide-line border-y border-line">
          {items.map(({ q, a }) => (
            <details key={q} className="group">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-display text-lg font-semibold text-navy hover:text-red-dark [&::-webkit-details-marker]:hidden">
                {q}
                <span aria-hidden className="shrink-0 text-3xl font-normal leading-none text-red transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pb-6 pr-10 leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
