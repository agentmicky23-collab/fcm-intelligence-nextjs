import { factFindAccess, getFactFind, publishableKey, storageBase } from "@/lib/server/fact-find";

// Streams one of the fact find's documents to Mik or the client who uploaded it.
export async function GET(req: Request, ctx: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await ctx.params;
  const q = new URL(req.url).searchParams;
  if (!(await factFindAccess(orderId, q.get("t")))) return new Response("Not allowed", { status: 403 });
  const ff = await getFactFind(orderId);
  const file = ff?.files.find((f) => f.name === q.get("name"));
  if (!ff || !file) return new Response("Not found", { status: 404 });
  const res = await fetch(`${storageBase()}/${file.path.split("/").map(encodeURIComponent).join("/")}`, {
    headers: { apikey: publishableKey() },
    cache: "no-store",
  });
  if (!res.ok || !res.body) return new Response("Couldn't fetch the file", { status: 502 });
  return new Response(res.body, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "Content-Disposition": `inline; filename="${file.name.replace(/^\d+-/, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
