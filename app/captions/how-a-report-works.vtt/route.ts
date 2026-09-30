import { captionsVtt } from "@/lib/explainer";

export const dynamic = "force-static";

export function GET() {
  return new Response(captionsVtt(), { headers: { "content-type": "text/vtt; charset=utf-8" } });
}
