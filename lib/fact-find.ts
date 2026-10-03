// The fact find: what we need from the buyer (and, through them, the seller or broker) to write a report
// without guessing. Mik fills it in on a call, or emails the client a link to fill it in themselves.
// Every figure here is recorded with where it came from, and the report labels it that way.

export type Field = {
  key: string;
  label: string;
  type: "text" | "textarea" | "money" | "number" | "percent" | "select" | "yesno" | "date" | "email" | "tel" | "url";
  options?: string[];
  hint?: string;
  half?: boolean;
};

export type Section = { key: string; title: string; intro: string; fields: Field[]; source?: boolean };

export const sources = ["The seller", "The broker or agent", "The listing", "The accounts", "My own estimate"];

export const factFindSections: Section[] = [
  {
    key: "client",
    title: "About you",
    intro: "So we know who the report is for and what matters to you.",
    fields: [
      { key: "name", label: "Your name", type: "text", half: true },
      { key: "email", label: "Email", type: "email", half: true },
      { key: "phone", label: "Phone", type: "tel", half: true },
      { key: "experience", label: "Have you run a Post Office before?", type: "select", options: ["No, this would be my first", "Yes, I run one now", "Yes, in the past"], half: true },
      { key: "plans", label: "How would you run it?", type: "select", options: ["Work in it full time", "Part time, with staff", "Fully managed by staff", "Not sure yet"], half: true },
      { key: "timescale", label: "When are you hoping to buy?", type: "select", options: ["Within 3 months", "3 to 6 months", "Later", "Just exploring"], half: true },
    ],
  },
  {
    key: "business",
    title: "The business",
    intro: "Which shop it is, and how you found it.",
    fields: [
      { key: "name", label: "Business or shop name", type: "text", half: true },
      { key: "address", label: "Full address", type: "textarea", hint: "Including the postcode." },
      { key: "found_via", label: "How did you find it?", type: "select", options: ["A broker or agent", "A listing website", "Word of mouth", "I know the seller", "Other"], half: true },
      { key: "broker", label: "Broker or agent (if any)", type: "text", half: true },
      { key: "listing_url", label: "Link to the listing (if any)", type: "url" },
      { key: "contract_type", label: "Post Office contract type, if you know it", type: "select", options: ["Mains", "Local", "Local Plus", "Traditional / Core", "Don't know"], half: true },
      { key: "opening_hours", label: "Opening hours", type: "textarea", hint: "Shop and Post Office counter, if different." },
      { key: "services", label: "Other services in the shop", type: "textarea", hint: "For example lottery, PayPoint, ATM, parcels, off-licence, newspapers." },
    ],
  },
  {
    key: "price",
    title: "Price and what it includes",
    intro: "As the seller or broker gave it to you.",
    source: true,
    fields: [
      { key: "asking_price", label: "Asking price", type: "money", half: true },
      { key: "tenure", label: "Leasehold or freehold?", type: "select", options: ["Leasehold", "Freehold", "Don't know"], half: true },
      { key: "includes", label: "What the price includes", type: "textarea", hint: "Business, fixtures and fittings, stock, the building, accommodation." },
      { key: "stock_value", label: "Stock value (if separate)", type: "money", half: true },
      { key: "accommodation", label: "Living accommodation", type: "text", hint: "For example 3-bed flat above.", half: true },
    ],
  },
  {
    key: "figures",
    title: "Takings and profit",
    intro: "Whatever you've been given. Leave blank anything you don't have: we'll never guess it.",
    source: true,
    fields: [
      { key: "retail_turnover", label: "Shop sales (turnover) per year", type: "money", half: true },
      { key: "weekly_takings", label: "Or weekly takings", type: "money", half: true },
      { key: "gross_margin", label: "Gross margin on shop sales", type: "percent", half: true },
      { key: "po_pay", label: "Post Office pay (remuneration) per year", type: "money", half: true },
      { key: "po_pay_monthly", label: "Or per month", type: "money", half: true },
      { key: "other_income", label: "Other income per year", type: "money", hint: "Lottery commission, PayPoint, ATM, rent from a flat…", half: true },
      { key: "net_profit", label: "Net profit per year (as stated)", type: "money", half: true },
      { key: "accounts_period", label: "Which year do these figures cover?", type: "text", half: true },
      { key: "figures_notes", label: "Anything else about the figures", type: "textarea" },
    ],
  },
  {
    key: "staff",
    title: "Staff",
    intro: "Staff usually transfer to the buyer, so their costs matter. No names needed.",
    source: true,
    fields: [
      { key: "count", label: "Number of staff", type: "number", half: true },
      { key: "weekly_hours", label: "Total staff hours per week", type: "number", half: true },
      { key: "hourly_rate", label: "Typical hourly rate", type: "money", half: true },
      { key: "owner_hours", label: "Hours the owner works per week", type: "number", half: true },
      { key: "staff_notes", label: "Roles, long-serving staff, anything else", type: "textarea" },
    ],
  },
  {
    key: "premises",
    title: "Premises and running costs",
    intro: "What it costs to keep the doors open.",
    source: true,
    fields: [
      { key: "rent", label: "Rent per year", type: "money", half: true },
      { key: "lease_years_left", label: "Years left on the lease", type: "number", half: true },
      { key: "rent_review", label: "Next rent review", type: "text", half: true },
      { key: "repairs", label: "Who pays for repairs?", type: "select", options: ["Tenant (full repairing)", "Shared", "Landlord", "Don't know"], half: true },
      { key: "business_rates", label: "Business rates per year", type: "money", half: true },
      { key: "utilities", label: "Utilities per year", type: "money", half: true },
      { key: "insurance", label: "Insurance per year", type: "money", half: true },
      { key: "other_costs", label: "Other costs per year", type: "money", half: true },
      { key: "costs_notes", label: "Anything else about the premises", type: "textarea", hint: "Condition, parking, security, planned works." },
    ],
  },
  {
    key: "questions",
    title: "What you want to know",
    intro: "The report answers these directly.",
    fields: [
      { key: "questions", label: "Your questions about this business", type: "textarea" },
      { key: "concerns", label: "Anything that worries you", type: "textarea" },
      { key: "seller_said", label: "Anything the seller or broker told you", type: "textarea", hint: "For example why they're selling, recent changes, plans nearby." },
    ],
  },
];

export const documentKinds = [
  "Accounts (profit and loss, balance sheet)",
  "Post Office remuneration statements",
  "Till reports or sales figures",
  "Lease",
  "Broker's or agent's sales pack",
  "Staff details (no names)",
  "Bills (rates, utilities, insurance)",
  "Photos",
  "Other",
];

export type FactFindData = Record<string, Record<string, string>>;
export type FactFindFile = { name: string; size: number; type: string; kind: string; by: string; uploaded_at: string; path: string };

/** How complete it is: answered fields out of all fields, and the seller-only items still missing. */
export function completeness(data: FactFindData, files: FactFindFile[]) {
  let answered = 0;
  let total = 0;
  for (const s of factFindSections)
    for (const f of s.fields) {
      total++;
      if ((data[s.key]?.[f.key] ?? "").trim()) answered++;
    }
  const has = (s: string, ...k: string[]) => k.some((x) => (data[s]?.[x] ?? "").trim());
  const doc = (kind: string) => files.some((f) => f.kind === kind);
  const missing = [
    !has("price", "asking_price") && "Asking price",
    !has("figures", "retail_turnover", "weekly_takings", "net_profit") && !doc(documentKinds[0]) && "Accounts or takings",
    !has("figures", "po_pay", "po_pay_monthly") && !doc(documentKinds[1]) && "Post Office pay",
    !has("staff", "count", "weekly_hours") && "Staff",
    !has("premises", "rent") && !has("price", "tenure") && "Rent or tenure",
    !has("premises", "business_rates", "utilities") && "Running costs",
    !has("business", "opening_hours") && "Opening hours",
  ].filter(Boolean) as string[];
  return { answered, total, missing };
}
