import { captionsVtt, explainers } from "@/lib/explainer";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(explainers).map((slug) => ({ file: `${slug}.vtt` }));
}

export async function GET(_req: Request, ctx: RouteContext<"/captions/[file]">) {
  const { file } = await ctx.params;
  const video = explainers[file.replace(/\.vtt$/, "")];
  if (!video) return new Response("Not found", { status: 404 });
  return new Response(captionsVtt(video), { headers: { "content-type": "text/vtt; charset=utf-8" } });
}
