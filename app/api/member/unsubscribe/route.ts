import { rpc } from "@/lib/server/supabase";
import { text } from "@/lib/server/request";

// Unsubscribes a member. Takes the token from the query string (one-click unsubscribe from email
// apps, RFC 8058) or from a JSON body (the unsubscribe page).
export async function POST(req: Request) {
  let token = new URL(req.url).searchParams.get("token") ?? "";
  if (!token && req.headers.get("content-type")?.includes("application/json")) {
    try {
      token = text(((await req.json()) as Record<string, unknown>).token, 64);
    } catch {}
  }
  if (!token || token.length > 64) return Response.json({ ok: false }, { status: 400 });

  try {
    const res = await rpc("unsubscribe_member", { p_token: token });
    if (!res.ok) {
      console.error("member: unsubscribe failed", res.body.slice(0, 300));
      return Response.json({ ok: false }, { status: 502 });
    }
    return Response.json({ ok: JSON.parse(res.body) === true });
  } catch (err) {
    console.error("member: unsubscribe failed", err);
    return Response.json({ ok: false }, { status: 502 });
  }
}
