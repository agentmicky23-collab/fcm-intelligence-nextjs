// Explainer videos. The narration is kept here so the captions, the transcript
// and the search data all match each video.

const media = "https://dykudrjpcliuyahjuiag.supabase.co/storage/v1/object/public/site-media/explainers";

type Line = { line: string; seconds: number };

export type Explainer = {
  slug: string;
  title: string;
  description: string;
  poster: string;
  sources: { hd: string; sd: string };
  captions: string;
  duration: string; // ISO 8601, for search engines
  length: string; // shown on the play button
  uploadDate: string;
  narration: Line[];
  starts?: number[]; // when each line begins, if the scenes aren't 10 seconds each
  aiLabel?: string;
};

function explainerMedia(slug: string, file = slug) {
  return {
    poster: `${media}/${file}-poster.jpg`,
    sources: { hd: `${media}/${file}-1080-web.mp4`, sd: `${media}/${file}-720-web.mp4` },
    captions: `/captions/${slug}.vtt`,
  };
}

// Each scene is 10 seconds; the narration starts a quarter of a second in.
export const explainers: Record<string, Explainer> = {
  "how-a-report-works": {
    slug: "how-a-report-works",
    title: "How an FCM report works",
    description:
      "A 90-second animated explainer: what you send, what goes into an Insight or Intelligence Report, and how every report is checked before it reaches you.",
    ...explainerMedia("how-a-report-works"),
    duration: "PT1M32S",
    length: "1:32",
    uploadDate: "2026-09-30",
    narration: [
      { line: "Found a Post Office for sale? Before you spend a penny on solicitors, let's find out what you're really buying.", seconds: 7.6 },
      { line: "Send me the listing, the postcode and anything the broker's given you. That's all we need to get started.", seconds: 6.2 },
      { line: "First, we look from above: who lives nearby, how busy the street is, and how people actually reach the counter.", seconds: 7.8 },
      { line: "Then we map every competing Post Office nearby, named, with distances, so you know who's chasing your customers.", seconds: 8.3 },
      { line: "We check crime around the branch, because the risk to your cash, your staff and your stock is real.", seconds: 5.8 },
      { line: "We break down the Post Office income line by line, and read what customers really say about the branch online.", seconds: 8.2 },
      { line: "The Intelligence Report goes further: the accounts, staffing costs including TUPE, where profit can grow, and how to negotiate the price.", seconds: 9.5 },
      { line: "Every report ends with the risks and a clear verdict, and I check every one myself before it reaches you.", seconds: 5.8 },
      { line: "Insight at £199, full Intelligence at £499, plus VAT. Know exactly what you're buying, before you buy it.", seconds: 11.4 },
    ],
  },
  "branch-health-check": {
    slug: "branch-health-check",
    title: "The Branch Health Check",
    description: "A one-minute explainer: the checks you can choose, how they're priced, and how the monthly option works.",
    ...explainerMedia("branch-health-check"),
    duration: "PT1M3S",
    length: "1:03",
    uploadDate: "2026-09-30",
    narration: [
      { line: "Your branch is making money. But is it making all the money it should, and is your cash really safe?", seconds: 6.8 },
      { line: "You choose what we check. Every branch is different, so you only pay for the checks your branch actually needs.", seconds: 8.4 },
      { line: "We spend a full day auditing your cash and stamp stock, counter by counter, independently, so nothing gets missed.", seconds: 8.6 },
      { line: "We audit your staff's training and knowledge, then look at your staffing structure and what it's really costing you.", seconds: 6.6 },
      { line: "We review your remuneration, find where the profit is hiding, and give you a clear improvement action plan.", seconds: 6.4 },
      { line: "Book it as a one-off, or go monthly and save 25%. One branch or fifty, we'll build your quote.", seconds: 7.3 },
    ],
  },
  "guided-acquisition": {
    slug: "guided-acquisition",
    title: "Guided Acquisition, start to finish",
    description: "An 80-second explainer of the whole journey: the report, the offer, the business plan, the interview, handover day and your first 30 days.",
    ...explainerMedia("guided-acquisition"),
    duration: "PT1M23S",
    length: "1:23",
    uploadDate: "2026-09-30",
    narration: [
      { line: "Buying a Post Office is the biggest decision most people ever make. You shouldn't have to make it on your own.", seconds: 7.6 },
      { line: "First, we find out if the branch is worth your money, with a full Intelligence Report on the business.", seconds: 7.2 },
      { line: "Then we work out what it's really worth, and guide you through the offer and the negotiation.", seconds: 6.4 },
      { line: "We write the business plan the Post Office and your lender will ask for, built from the real numbers.", seconds: 7.0 },
      { line: "Then we prepare you for the Post Office interview, so you walk in knowing exactly what they're looking for.", seconds: 6.9 },
      { line: "On handover day, I'm there with you, checking the cash, stamps and stock independently while the auditors count.", seconds: 7.6 },
      { line: "Throughout the whole journey, you've got six one-to-one sessions and unlimited email and WhatsApp support.", seconds: 7.2 },
      { line: "And once the keys are yours, we give you an operations plan and check in after your first thirty days.", seconds: 6.8 },
    ],
  },
  "handover-day": {
    slug: "handover-day",
    title: "What happens on handover day",
    description: "Fifty seconds on the transfer audit: what gets counted, what you sign for, the risk if a count is wrong, and why an independent check matters.",
    ...explainerMedia("handover-day"),
    duration: "PT53S",
    length: "0:53",
    uploadDate: "2026-09-30",
    narration: [
      { line: "Once the Post Office approves you, you're given a handover date. That day, the branch closes while everything is counted.", seconds: 8.1 },
      { line: "Every note, every stamp and all the stock is audited in branch, and any losses or gains are settled by the seller.", seconds: 8.7 },
      { line: "Then you sign for it all, along with the safe keys, alarm codes and access codes. From that moment, it's yours.", seconds: 7.5 },
      { line: "But auditors are human. If they've miscounted and you find the shortfall that evening, you're the one who's liable.", seconds: 7.5 },
      { line: "That's why I'm on site with you, as a strategic partner of Post Office, checking everything independently before you sign.", seconds: 7.6 },
    ],
  },
  welcome: {
    slug: "welcome",
    title: "A welcome from Mikesh",
    description: "Thirty seconds from Mikesh Parekh on who he is and what you'll find here.",
    ...explainerMedia("welcome"),
    duration: "PT31S",
    length: "0:31",
    uploadDate: "2026-09-30",
    aiLabel: "AI-generated from Mikesh Parekh's likeness and voice.",
    starts: [0.28, 13.3, 18.25],
    narration: [
      { line: "Hello, I'm Mikesh. I've been running Post Offices for fifteen years, alongside an amazing team of like-minded people who've helped me build, run and rebuild my businesses.", seconds: 12.1 },
      { line: "I've done the hard work, and made the mistakes, so you don't have to.", seconds: 3.9 },
      { line: "Now I'm growing my team, so we can help you grow too. Welcome. Let's get started.", seconds: 6.0 },
    ],
  },
};

export const explainer = explainers["how-a-report-works"];
export const transcript = explainer.narration.map((n) => n.line);
export const transcriptOf = (e: Explainer) => e.narration.map((n) => n.line);

const stamp = (t: number) => {
  const m = Math.floor(t / 60);
  const s = (t - m * 60).toFixed(3).padStart(6, "0");
  return `00:${String(m).padStart(2, "0")}:${s}`;
};

/** WebVTT captions: each line is split at its middle clause break and timed by length. */
export function captionsVtt(e: Explainer) {
  const cues: string[] = [];
  e.narration.forEach(({ line, seconds }, i) => {
    const start = e.starts?.[i] ?? i * 10 + 0.25;
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
