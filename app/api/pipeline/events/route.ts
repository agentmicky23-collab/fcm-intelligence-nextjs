import { checkOpsKey } from "@/lib/server/reports";
import { cleanEvents, logEvents } from "@/lib/server/admin";

// OpenClaw reports each step of a report run here, so the control room (/admin) can show it live.
// POST one event or an array: { order_id, agent, stage?, item?, kind, round?, message, detail?, at? }
export async function POST(req: Request) {
  if (!checkOpsKey(req.headers.get("authorization"))) return Response.json({ ok: false, error: "unauthorised" }, { status: 401 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "body must be JSON" }, { status: 400 });
  }
  const events = cleanEvents(body);
  if (typeof events === "string") return Response.json({ ok: false, error: events }, { status: 400 });
  const stored = await logEvents(events);
  return Response.json({ ok: stored === events.length, stored }, { status: stored ? 200 : 502 });
}
