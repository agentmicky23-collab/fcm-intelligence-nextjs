// Content for the home page. Figures come from lib/site.ts facts.

export const practices = [
  { title: "Acquisitions & due diligence", line: "Independent assessment before you commit.", href: "/services" },
  { title: "Business plans & finance", line: "Plans, projections and accounts lenders trust.", href: "/services" },
  { title: "HR & employment", line: "TUPE, contracts and people matters, handled properly.", href: "/services" },
  { title: "Health, safety & compliance", line: "Audit-ready branches and safe workplaces.", href: "/services" },
  { title: "Operations & growth", line: "Performance reviews and multi-branch strategy.", href: "/services" },
  { title: "Insight & Intelligence reports", line: "Location and business reports from £199.", href: "/reports" },
] as const;

export const credentials = ["15 years operating", "10 Crown conversions in 2025", "Strategic partner to Post Office"] as const;

export const steps = [
  { title: "Book a call", line: "A short first conversation about where you are." },
  { title: "I review", line: "Accounts, lease, staffing, compliance: whatever the question needs." },
  { title: "You get a plan", line: "Clear written advice you can act on or take to a lender." },
] as const;
