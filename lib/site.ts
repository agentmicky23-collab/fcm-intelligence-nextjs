// Facts about Mikesh and the business, used across the site.
// Keep these in one place so the numbers never drift between pages.

export const site = {
  name: "FCM Intelligence",
  owner: "Mikesh Parekh",
  company: "Firstclass Managerial Ltd",
  url: "https://fcmintelligence.com",
  tagline: "Straight answers on buying and running a Post Office, from someone who runs 43 of them.",
  contactEmail: "mikesh@interimenterprises.co.uk",
  staffAppUrl: "https://app.fcmintelligence.com",
  // Filled in once Mikesh sends the links. Empty values are hidden.
  social: {
    linkedin: "",
    x: "",
  },
  // Set to true once Mikesh has confirmed every price on the services page.
  pricesConfirmed: true,
  // Set to true when the site is ready to be found by search engines.
  indexable: false,
} as const;

export const stats = [
  { value: "15", label: "years as a subpostmaster" },
  { value: "43", label: "Post Office branches" },
  { value: "200+", label: "staff" },
  { value: "10", label: "Crown conversions in 2025" },
] as const;

export const nav = [
  { href: "/insights", label: "Insights" },
  { href: "/services", label: "Practice areas" },
  { href: "/reports", label: "Reports" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
] as const;
