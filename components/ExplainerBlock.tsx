import { ExplainerVideo } from "@/components/ExplainerVideo";
import { JsonLd } from "@/components/JsonLd";
import { Eyebrow } from "@/components/ui";
import { transcriptOf, type Explainer } from "@/lib/explainer";
import { abs, orgId } from "@/lib/seo";

/** An explainer video with its title, transcript and search data. */
export function ExplainerBlock({
  video,
  page,
  className = "",
  stacked = false,
}: {
  video: Explainer;
  page: string;
  className?: string;
  /** Video above its text, for narrow columns such as an article. */
  stacked?: boolean;
}) {
  const transcript = transcriptOf(video);
  return (
    <div className={`grid items-start ${stacked ? "gap-6" : "gap-10 lg:grid-cols-[1fr_20rem]"} ${className}`}>
      <ExplainerVideo video={video} />
      <div>
        <Eyebrow>Watch</Eyebrow>
        <h3 className="mt-4 font-display text-2xl font-bold leading-tight tracking-[-0.02em] text-navy">{video.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{video.description}</p>
        <details className="group mt-6 border-t border-line pt-4">
          <summary className="cursor-pointer list-none text-sm font-semibold text-red-dark hover:text-navy [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Read the transcript →</span>
            <span className="hidden group-open:inline">Hide the transcript</span>
          </summary>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink">
            {transcript.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </details>
        <p className="mt-6 text-xs text-muted">{video.aiLabel ?? "Animated explainer, narrated in Mikesh Parekh's voice."}</p>
      </div>
      <JsonLd data={videoSchema(video, page)} />
    </div>
  );
}

/** schema.org VideoObject for an explainer, so search engines and AI assistants can index it. */
export function videoSchema(video: Explainer, page: string) {
  return {
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: [video.poster],
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: video.sources.hd,
    inLanguage: "en-GB",
    transcript: transcriptOf(video).join(" "),
    publisher: { "@id": orgId },
    isPartOf: abs(page),
  };
}
