import { checkReport } from "@/lib/report-check";
import { isOrderTier } from "@/lib/checkout";
import { checkOpsKey, getReport } from "@/lib/server/reports";

// OpenClaw (Sentinel) runs this after upserting a report: every deterministic rule, with the fix for each problem.
// The same check gates /ready, so a report with critical issues can't be sent to Mikesh.
export async function POST(req: Request, ctx: { params: Promise<{ orderId: string }> }) {
  if (!checkOpsKey(req.headers.get("authorization"))) return Response.json({ ok: false, error: "unauthorised" }, { status: 401 });
  const { orderId } = await ctx.params;
  const stored = await getReport(orderId);
  if (!stored) return Response.json({ ok: false, error: "no report in Supabase for this order" }, { status: 404 });
  const result = checkReport(stored.report, { orderId, tier: isOrderTier(stored.tier) ? stored.tier : "insight" });
  return Response.json(result);
}
