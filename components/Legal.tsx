import type { ReactNode } from "react";

/** A titled section of a legal page (privacy policy, terms). */
export function LegalPart({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-navy">{title}</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-ink [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">{children}</div>
    </section>
  );
}
