import { NextResponse } from "next/server";
import { cookieOptions, memberCookie, newToken } from "@/lib/server/member";
import { rpc } from "@/lib/server/supabase";

// The link in the confirmation email. Confirms the member, remembers them on this device,
// and shows the welcome page.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const done = (params: string) => NextResponse.redirect(new URL(`/account/confirm?${params}`, url.origin), 303);
  if (!token || token.length > 64) return done("expired=1");

  try {
    const res = await rpc("confirm_member", { p_token: token, p_access_token: newToken() });
    const rows = res.ok ? (JSON.parse(res.body) as { name: string; access_token: string }[]) : [];
    if (!res.ok) console.error("member: confirm failed", res.body.slice(0, 300));
    if (!rows.length) return done("expired=1");
    const response = done(`welcome=${encodeURIComponent(rows[0].name.split(" ")[0])}`);
    response.cookies.set(memberCookie, rows[0].access_token, cookieOptions);
    return response;
  } catch (err) {
    console.error("member: confirm failed", err);
    return done("expired=1");
  }
}
