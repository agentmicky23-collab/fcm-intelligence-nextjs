// Calls the database functions in the fcm-intelligence Supabase project.
// The URL and publishable key are public by design: the key can only run the functions this site
// is granted (submit_enquiry, join_member and friends); it can't read any table.
const supabaseUrl = process.env.SUPABASE_URL ?? "https://dykudrjpcliuyahjuiag.supabase.co";
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_nuvi3t_j2k7XMv57L1YWhw_wAn1r-lu";

export async function rpc(fn: string, args: Record<string, unknown>) {
  const headers: Record<string, string> = { apikey: supabaseKey, "Content-Type": "application/json" };
  // Legacy anon keys are JWTs and go in Authorization too; new publishable keys don't.
  if (!supabaseKey.startsWith("sb_")) headers.Authorization = `Bearer ${supabaseKey}`;
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers,
    body: JSON.stringify(args),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  return { ok: res.ok, body: await res.text() };
}
