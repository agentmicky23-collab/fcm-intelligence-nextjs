// Paying for a report online. Checkout runs through Stripe and only switches on once
// STRIPE_SECRET_KEY is set; until then the order buttons go to the enquiry form instead.

export type OrderTier = "insight" | "intelligence";

export const orderTiers: Record<OrderTier, { name: string; price: string; priceId: string; service: string }> = {
  insight: { name: "Insight Report", price: "£199", priceId: "price_1TCoi3BMIWL7f1H3byX2RVBB", service: "insight-report" },
  intelligence: { name: "Intelligence Report", price: "£499", priceId: "price_1TCoirBMIWL7f1H3GkpEJ2mb", service: "intelligence-report" },
};

export const isOrderTier = (v: unknown): v is OrderTier => v === "insight" || v === "intelligence";

/** Where the order button for a tier should go. */
export function orderHref(tier: OrderTier) {
  return process.env.STRIPE_SECRET_KEY ? `/reports/order?report=${tier}` : `/contact?service=${orderTiers[tier].service}`;
}

export const orderLimits = { text: 200, url: 500, message: 1500 };

export const listingSources = ["A property or business-for-sale website", "A business transfer agent", "The Post Office website", "Word of mouth", "Other"];

// What the buyer already has. The Intelligence Report uses the financials if they can share them.
export const haveOptions = [
  { key: "has_asking_price", label: "The asking price" },
  { key: "has_financials", label: "Accounts or a profit and loss" },
  { key: "has_po_remuneration", label: "The Post Office remuneration figure" },
  { key: "has_staff_info", label: "Staff details and hours" },
  { key: "has_lease_terms", label: "Lease terms" },
] as const;

export type OrderPayload = {
  report: OrderTier;
  name: string;
  email: string;
  phone?: string;
  business_name: string;
  postcode: string;
  town?: string;
  listing_url?: string;
  listing_source?: string;
  message?: string;
  have: string[];
  terms: boolean;
  company_url?: string; // honeypot
};

export type OrderResult = { ok: true; url: string } | { ok: false; error: "invalid" | "unavailable" | "not_enabled" };
