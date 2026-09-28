import { NextResponse } from "next/server";
import { cookieOptions, memberCookie } from "@/lib/server/member";
import { rpc } from "@/lib/server/supabase";

// The link in the library email. Remembers the member on this device and opens the library.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key") ?? "";
  const response = NextResponse.redirect(new URL("/resources", url.origin), 303);
  if (!key || key.length > 64) return response;
  try {
    const res = await rpc("member_access", { p_access_token: key });
    if (res.ok && JSON.parse(res.body)) response.cookies.set(memberCookie, key, cookieOptions);
  } catch (err) {
    console.error("member: open failed", err);
  }
  return response;
}
