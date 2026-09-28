// Search and AI discovery: page metadata and schema.org structured data.
// Everything here is built from the same facts the pages show, so the two never disagree.

import type { Metadata } from "next";
import { site } from "@/lib/site";
import { stages, type Service } from "@/lib/services";

export const abs = (path: string) => `${site.url}${path === "/" ? "" : path}`;

export const shareImage = { url: `${site.url}/opengraph-image`, width: 1200, height: 630, alt: `${site.name}: buying and running a Post Office` };

/** Metadata for a page: title, description, canonical URL and matching social previews. */
export function pageMeta(path: string, title: string, description: string, extra: Metadata = {}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: abs(path) },
    // Pages with their own share image (articles) override this with an opengraph-image file.
    openGraph: { title, description, url: abs(path), siteName: site.name, locale: "en_GB", type: "website", images: [shareImage] },
    twitter: { card: "summary_large_image", title, description, images: [shareImage.url] },
    ...extra,
  };
}

const orgId = `${site.url}/#organization`;
const personId = `${site.url}/#mikesh`;
const websiteId = `${site.url}/#website`;

export const organization = {
  "@type": "ProfessionalService",
  "@id": orgId,
  name: site.name,
  legalName: site.company,
  url: site.url,
  logo: `${site.url}/brand/logo-full-navy.png`,
  image: `${site.url}/brand/logo-full-navy.png`,
  description:
    "Post Office acquisition reports, consultancy and operational support from an operator who runs 43 branches in the UK. Strategic partner to Post Office.",
  email: site.contactEmail,
  founder: { "@id": personId },
  areaServed: { "@type": "Country", name: "United Kingdom" },
  knowsAbout: [
    "Buying a Post Office",
    "Post Office remuneration",
    "Subpostmaster operations",
    "Post Office due diligence",
    "TUPE",
    "Retail business acquisition",
  ],
  sameAs: Object.values(site.social).filter(Boolean),
};

export const person = {
  "@type": "Person",
  "@id": personId,
  name: site.owner,
  jobTitle: "Post Office operator and founder",
  url: `${site.url}/about`,
  worksFor: { "@id": orgId },
  knowsAbout: organization.knowsAbout,
  sameAs: Object.values(site.social).filter(Boolean),
};

export const website = {
  "@type": "WebSite",
  "@id": websiteId,
  url: site.url,
  name: site.name,
  inLanguage: "en-GB",
  publisher: { "@id": orgId },
};

export function breadcrumbs(items: [name: string, path: string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"] as [string, string], ...items].map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: abs(path),
    })),
  };
}

/** "£1,200" → 1200, "From £100" → 100. Null when there's no fixed price. */
const amount = (price: string) => {
  const m = price.replace(/,/g, "").match(/£(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
};

function offer(s: Service) {
  const price = amount(s.price);
  if (s.price === "Free") return { "@type": "Offer", price: 0, priceCurrency: "GBP" };
  if (price === null) return undefined;
  return {
    "@type": "Offer",
    priceCurrency: "GBP",
    price,
    priceSpecification: {
      "@type": s.unit?.startsWith("per month") ? "UnitPriceSpecification" : "PriceSpecification",
      price,
      priceCurrency: "GBP",
      valueAddedTaxIncluded: false,
      ...(s.unit?.startsWith("per month") ? { unitCode: "MON" } : {}),
      ...(s.price.startsWith("From") ? { minPrice: price } : {}),
    },
    url: abs(s.href ?? `/contact?service=${s.slug}`),
  };
}

export function serviceSchema(s: Service, category: string) {
  return {
    "@type": "Service",
    name: s.name,
    description: s.summary,
    serviceType: category,
    provider: { "@id": orgId },
    areaServed: { "@type": "Country", name: "United Kingdom" },
    ...(offer(s) ? { offers: offer(s) } : {}),
  };
}

export const allServices = () => stages.flatMap((st) => st.services.map((s) => serviceSchema(s, st.title)));

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}

export { orgId, personId, websiteId };
