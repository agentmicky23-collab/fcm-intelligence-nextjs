import { adminCookie } from "@/lib/server/admin";
import { site } from "@/lib/site";

export async function POST() {
  return new Response(null, {
    status: 303,
    headers: { Location: new URL("/admin", site.url).toString(), "Set-Cookie": `${adminCookie}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` },
  });
}
