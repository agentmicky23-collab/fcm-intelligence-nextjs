// The structure of an FCM report, and which sections each tier includes.

export type Tier = "insight" | "intelligence";

export const reportSections = [
  { n: 1, title: "Executive summary & verdict", tier: "insight" },
  { n: 2, title: "Financial analysis", tier: "intelligence" },
  { n: 3, title: "Post Office remuneration", tier: "insight" },
  { n: 4, title: "Staffing & hidden costs", tier: "intelligence" },
  { n: 5, title: "Online reputation", tier: "insight" },
  { n: 6, title: "Location", tier: "insight" },
  { n: 7, title: "Demographics", tier: "insight" },
  { n: 8, title: "Crime & safety", tier: "insight" },
  { n: 9, title: "Competition", tier: "insight" },
  { n: 10, title: "Footfall", tier: "insight" },
  { n: 11, title: "Infrastructure", tier: "insight" },
  { n: 12, title: "Future outlook", tier: "intelligence" },
  { n: 13, title: "Risks & red flags", tier: "insight" },
  { n: 14, title: "Profit improvement plan", tier: "intelligence" },
  { n: 15, title: "Due diligence & negotiation", tier: "intelligence" },
] as const satisfies readonly { n: number; title: string; tier: Tier }[];

export const tiers = [
  { id: "insight", name: "Insight", price: "£199", count: reportSections.filter((s) => s.tier === "insight").length },
  { id: "intelligence", name: "Intelligence", price: "£499", count: reportSections.length },
] as const;

export const inTier = (section: { tier: Tier }, tier: Tier) => tier === "intelligence" || section.tier === "insight";
