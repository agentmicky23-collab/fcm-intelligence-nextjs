// Branch Health Check pricing. Every price is before VAT, and each check is priced per branch
// unless it says otherwise. A null price is quoted separately.

export type Per = "branch" | "counter" | "staff";
export type Check = { name: string; price: number | null; per: Per; note?: string };

export const checks: Check[] = [
  { name: "Operational excellence monitoring", price: 100, per: "branch" },
  { name: "Independent audit of cash and stamp stock", price: 250, per: "counter", note: "A full day on site" },
  { name: "Cash movement monitoring", price: 250, per: "branch" },
  { name: "Staff training audit", price: 250, per: "staff", note: "3 hours on site, including travel" },
  { name: "Staff knowledge audit", price: null, per: "branch" },
  { name: "Remuneration and income review", price: 200, per: "branch" },
  { name: "Staffing structure and costs", price: 200, per: "branch" },
  { name: "Profit improvement opportunities", price: 200, per: "branch" },
  { name: "Improvement action plan", price: 200, per: "branch" },
];

export const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;

export const perLabel = (c: Check) =>
  c.price === null ? "Quoted separately" : `${gbp(c.price)} per ${c.per === "staff" ? "member of staff" : c.per}`;

export type BranchSize = { label: string; counters: number; staff: number };

/** Cost of each chosen check at one branch. */
export function branchLines(branch: BranchSize, chosen: Check[]) {
  return chosen.map((c) => {
    const qty = c.per === "counter" ? branch.counters : c.per === "staff" ? branch.staff : 1;
    return { check: c, qty, cost: c.price === null ? null : c.price * qty };
  });
}
