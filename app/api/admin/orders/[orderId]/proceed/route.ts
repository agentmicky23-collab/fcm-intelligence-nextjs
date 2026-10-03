import { isAdmin, logSiteEvent } from "@/lib/server/admin";
import { adminProceed } from "@/lib/server/fact-find";
import { site } from "@/lib/site";

// Mik: finish the report without the missing information. The gaps stay stated in the report.
export async function POST(_req: Request, ctx: { params: Promise<{ orderId: string }> }) {
  if (!(await isAdmin())) return new Response("Not allowed", { status: 403 });
  const { orderId } = await ctx.params;
  await adminProceed(orderId);
  await logSiteEvent({ order_id: orderId, agent: "mik", stage: "review", kind: "done", message: "Mik chose to finish the report without the missing information: gaps will be stated, no guessing" });
  return Response.redirect(new URL(`/admin/orders/${orderId}?proceeding=1`, site.url), 303);
}
