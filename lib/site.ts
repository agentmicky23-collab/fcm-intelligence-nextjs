// Facts about Mikesh and the business, used across the site.
// Keep these in one place so the numbers never drift between pages.

export const site = {
  name: "FCM Intelligence",
  owner: "Mikesh Parekh",
  company: "Firstclass Managerial Ltd",
  // Shown on the legal pages and in the footer, as the Companies Act requires.
  companyNumber: "10772880",
  registeredOffice: "57-59 Penny Meadow, Ashton-under-Lyne, OL6 6HE",
  vatNumber: "GB 278 3738 55",
  // The date the terms, privacy and cookies pages were last changed. Recorded with each report order.
  legalUpdated: "1 October 2026",
  url: "https://fcmintelligence.com",
  tagline: "Straight answers on buying and running a Post Office, from someone who runs 43 of them.",
  contactEmail: "mikesh@interimenterprises.co.uk",
  // Filled in once Mikesh sends the links. Empty values are hidden.
  social: {
    linkedin: "",
    x: "",
  },
  // Set to true once Mikesh has confirmed every price on the services page.
  pricesConfirmed: true,
  // Set to true when the site is ready to be found by search engines.
  indexable: true,
} as const;


export const nav = [
  { href: "/insights", label: "Insights" },
  { href: "/services", label: "Practice areas" },
  { href: "/reports", label: "Reports" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
] as const;
