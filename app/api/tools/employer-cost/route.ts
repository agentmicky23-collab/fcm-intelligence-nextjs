import { employerCost } from "@/lib/employer-cost";
import { ukRates } from "@/lib/uk-rates";

// The true cost of employing someone, from their hourly rate and weekly hours (current UK rates).
// Used by the report agents for Section 4, and the basis of the cost-to-employer calculator.
// GET /api/tools/employer-cost?rate=12.71&hours=30   (add &rates=1 for the full rates table)
export function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const rate = Number(q.get("rate") ?? ukRates.minimumWage.age21plus);
  const hours = Number(q.get("hours") ?? 30);
  if (!Number.isFinite(rate) || rate <= 0 || rate > 200 || !Number.isFinite(hours) || hours <= 0 || hours > 80) {
    return Response.json({ error: "rate must be 0-200 and hours 0-80" }, { status: 400 });
  }
  const pension = q.get("pension");
  const body = {
    ...employerCost({ hourlyRate: rate, hoursPerWeek: hours, pension: pension === "yes" || pension === "no" ? pension : "auto" }),
    ...(q.get("rates") === "1" ? { rates: ukRates } : {}),
  };
  return Response.json(body, { headers: { "Cache-Control": "public, max-age=3600" } });
}
