import { businessRates } from "@/lib/business-rates";

// The business rates bill (England, current year) from a premises' rateable value.
// Used by the report agents for the premises costs. GET /api/tools/business-rates?rv=11500&rhl=1&only=1
export function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const rv = Number(q.get("rv"));
  if (!Number.isFinite(rv) || rv <= 0 || rv > 10_000_000) return Response.json({ error: "rv (rateable value in £) must be 1 to 10,000,000" }, { status: 400 });
  const flag = (k: string) => (q.get(k) === null ? undefined : q.get(k) === "1" || q.get(k) === "yes" || q.get(k) === "true");
  return Response.json(businessRates({ rateableValue: rv, rhl: flag("rhl"), onlyProperty: flag("only") }), { headers: { "Cache-Control": "public, max-age=3600" } });
}
