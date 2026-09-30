// The "How a report works" explainer video on the Reports page.
// The narration is kept here so the captions, the transcript and the search data all match the video.

const media = "https://dykudrjpcliuyahjuiag.supabase.co/storage/v1/object/public/site-media/explainers";

export const explainer = {
  title: "How an FCM report works",
  description:
    "A 90-second animated explainer: what you send, what goes into an Insight or Intelligence Report, and how every report is checked before it reaches you.",
  poster: `${media}/how-a-report-works-poster.jpg`,
  sources: {
    hd: `${media}/how-a-report-works-1080-web.mp4`,
    sd: `${media}/how-a-report-works-720-web.mp4`,
  },
  captions: "/captions/how-a-report-works.vtt",
  duration: "PT1M32S",
  seconds: 92,
  uploadDate: "2026-09-30",
};

// Each scene is 10 seconds; the narration starts a quarter of a second in.
const narration: { line: string; seconds: number }[] = [
  { line: "Found a Post Office for sale? Before you spend a penny on solicitors, let's find out what you're really buying.", seconds: 7.6 },
  { line: "Send me the listing, the postcode and anything the broker's given you. That's all we need to get started.", seconds: 6.2 },
  { line: "First, we look from above: who lives nearby, how busy the street is, and how people actually reach the counter.", seconds: 7.8 },
  { line: "Then we map every competing Post Office nearby, named, with distances, so you know who's chasing your customers.", seconds: 8.3 },
  { line: "We check crime around the branch, because the risk to your cash, your staff and your stock is real.", seconds: 5.8 },
  { line: "We break down the Post Office income line by line, and read what customers really say about the branch online.", seconds: 8.2 },
  { line: "The Intelligence Report goes further: the accounts, staffing costs including TUPE, where profit can grow, and how to negotiate the price.", seconds: 9.5 },
  { line: "Every report ends with the risks and a clear verdict, and I check every one myself before it reaches you.", seconds: 5.8 },
  { line: "Insight at £199, full Intelligence at £499, plus VAT. Know exactly what you're buying, before you buy it.", seconds: 11.4 },
];

export const transcript = narration.map((n) => n.line);

const stamp = (t: number) => {
  const m = Math.floor(t / 60);
  const s = (t - m * 60).toFixed(3).padStart(6, "0");
  return `00:${String(m).padStart(2, "0")}:${s}`;
};

/** WebVTT captions: each line is split at its middle clause break and timed by length. */
export function captionsVtt() {
  const cues: string[] = [];
  narration.forEach(({ line, seconds }, i) => {
    const start = i * 10 + 0.25;
    const breaks = [...line.matchAll(/[,:?.] /g)].map((m) => (m.index ?? 0) + 1);
    const mid = breaks.sort((a, b) => Math.abs(a - line.length / 2) - Math.abs(b - line.length / 2))[0];
    const parts = mid ? [line.slice(0, mid).trim(), line.slice(mid).trim()] : [line];
    let t = start;
    for (const part of parts) {
      const d = (seconds * part.length) / line.length;
      cues.push(`${stamp(t)} --> ${stamp(t + d)}\n${part}`);
      t += d;
    }
  });
  return `WEBVTT\n\n${cues.join("\n\n")}\n`;
}
