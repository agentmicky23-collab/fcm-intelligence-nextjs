import type { ReactNode } from "react";
import { site } from "@/lib/site";

/** A titled section of a legal page (privacy policy, terms). */
export function LegalPart({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-12 scroll-mt-24">
      <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-navy">{title}</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-ink [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">{children}</div>
    </section>
  );
}

/** The company details every legal page opens with. */
export function LegalCompany() {
  return (
    <p>
      {site.name} is a trading name of {site.company}, a company registered in England and Wales (company no.{" "}
      {site.companyNumber}). Registered office: {site.registeredOffice}.{site.vatNumber && ` VAT no. ${site.vatNumber}.`} It&apos;s
      run by {site.owner}. Email{" "}
      <a className="text-red-dark underline" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
    </p>
  );
}

/** Title block for a legal page. */
export function LegalHeader({ title, intro }: { title: string; intro: ReactNode }) {
  return (
    <>
      <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-navy">{title}</h1>
      <p className="mt-4 text-sm text-muted">Last updated {site.legalUpdated}</p>
      <p className="mt-6 text-lg leading-relaxed text-muted">{intro}</p>
    </>
  );
}
