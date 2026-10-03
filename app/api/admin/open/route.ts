import { adminCookie, checkLink, newSession } from "@/lib/server/admin";
import { site } from "@/lib/site";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  if (!checkLink(q.get("e"), q.get("s"))) return Response.redirect(new URL("/admin?expired=1", site.url), 303);
  const session = newSession();
  const o = session.options;
  const headers = new Headers({ Location: new URL("/admin", site.url).toString() });
  headers.append("Set-Cookie", `${adminCookie}=${session.value}; Path=${o.path}; Max-Age=${o.maxAge}; HttpOnly; Secure; SameSite=Lax`);
  return new Response(null, { status: 303, headers });
}
