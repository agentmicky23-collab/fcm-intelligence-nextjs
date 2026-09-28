import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { rpc } from "@/lib/server/supabase";

// A member's library key lives in this cookie after they confirm or open an emailed link.
export const memberCookie = "fcm_member";
export const cookieOptions = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 365 };

export const newToken = () => randomBytes(32).toString("base64url");

/** The member's name if this browser holds a valid library key, otherwise null. */
export async function currentMember(): Promise<string | null> {
  const key = (await cookies()).get(memberCookie)?.value;
  if (!key || key.length > 64) return null;
  try {
    const res = await rpc("member_access", { p_access_token: key });
    if (!res.ok) return null;
    return (JSON.parse(res.body) as string | null) ?? null;
  } catch {
    return null;
  }
}
