import { isAdmin } from "@/lib/server/admin";
import { oeiRules } from "@/lib/server/oei-rules";

// The scheme rules for the Branch Check tool, sent only to people allowed to use it.
// (Until payment is switched on, that's Mikesh signed in to the control room.)
export async function GET() {
  if (!(await isAdmin())) return new Response("Not found", { status: 404 });
  return Response.json(oeiRules, { headers: { "Cache-Control": "private, no-store" } });
}
