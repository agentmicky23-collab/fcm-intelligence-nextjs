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
    ...explainerMedia("welcome", "welcome-v3"),
    duration: "PT33S",
    length: "0:33",
    uploadDate: "2026-09-30",
    aiLabel: "AI-generated from Mikesh Parekh's likeness and voice.",
    starts: [0.1, 18.55, 22.9],
    narration: [
      { line: "Hello, I'm Mikesh. I've been running Post Offices for fifteen years, alongside an amazing team of like-minded people who've helped me build, run and rebuild my businesses.", seconds: 12.4 },
      { line: "I've done the hard work, and made the mistakes, so you don't have to.", seconds: 4.0 },
      { line: "Now I'm growing my team, so we can help you grow too. Welcome. Let's get started.", seconds: 6.9 },
    ],
  },
  "ten-things-i-check-before-buying-a-post-office": {
    slug: "ten-things-i-check-before-buying-a-post-office",
    title: "The 10 things I check before buying any Post Office",
    description: "The ten checks I run on every Post Office for sale, from audit history to online reputation, before I'd think about an offer.",
    ...explainerMedia("ten-things-i-check-before-buying-a-post-office"),
    duration: "PT33S",
    length: "0:33",
    uploadDate: "2026-10-01",
    narration: [
      { line: "I check the same ten things on every Post Office, and no nice shopfront or keen broker rushes me past them.", seconds: 8.2 },
      { line: "First, the numbers: the audit history, where the Post Office income really comes from, real footfall, and five years of accounts.", seconds: 9.6 },
      { line: "Then staff, holiday owed, bills, losses, competition and reputation. If a seller won't share any of it, that tells you something.", seconds: 9.9 },
    ],
  },
  "five-years-of-accounts": {
    slug: "five-years-of-accounts",
    title: "Why I ask for five years of accounts, not three",
    description: "Two or three years of figures can hide more than they show; here is what five years reveals and what to do if a seller won't provide them.",
    ...explainerMedia("five-years-of-accounts"),
    duration: "PT33S",
    length: "0:33",
    uploadDate: "2026-10-01",
    narration: [
      { line: "I ask every seller for five years of accounts and five years of Post Office pay statements. Not one, not three. Five.", seconds: 9.6 },
      { line: "Some sellers polish the figures before a sale: costs deferred, hours cut, owners working free. Five years shows the real trend underneath.", seconds: 9.5 },
      { line: "A sudden jump in profit needs a clear reason. A seller offering only one or two years? Treat that as a red flag.", seconds: 8.4 },
    ],
  },
  "freehold-vs-leasehold": {
    slug: "freehold-vs-leasehold",
    title: "Freehold vs leasehold: the cost that never appears on the listing",
    description: "Leasehold looks cheaper on day one, but rent reviews can quietly eat your margin; here is how I weigh freehold against leasehold.",
    ...explainerMedia("freehold-vs-leasehold"),
    duration: "PT33S",
    length: "0:33",
    uploadDate: "2026-10-01",
    narration: [
      { line: "Leasehold branches are almost always cheaper to buy. For a first-time buyer, that's tempting, and the early numbers often look fine.", seconds: 8.4 },
      { line: "Then rent reviews start, often seven percent or more a year, while wages, rates and bills rise too. The lease eats your margin.", seconds: 9.6 },
      { line: "With a freehold there's no landlord and no rent review. For a family working their own counter, it's almost always my choice.", seconds: 8.5 },
    ],
  },
  "hidden-costs-new-postmasters-underestimate": {
    slug: "hidden-costs-new-postmasters-underestimate",
    title: "The hidden costs new postmasters underestimate",
    description: "The asking price is only the start; these are the costs that turn up after completion and catch new Post Office owners out.",
    ...explainerMedia("hidden-costs-new-postmasters-underestimate"),
    duration: "PT33S",
    length: "0:33",
    uploadDate: "2026-10-01",
    narration: [
      { line: "The asking price gets the attention. The costs that hurt new postmasters turn up after you've got the keys.", seconds: 7.2 },
      { line: "Holiday your staff built up under the last owner. Redundancy costs from long service. And utilities: budget ten to twenty percent more.", seconds: 9.6 },
      { line: "Then stock losses, counter errors, equipment and fees. Put every one in your numbers before you make an offer, not after.", seconds: 8.7 },
    ],
  },
  "never-spend-your-whole-budget": {
    slug: "never-spend-your-whole-budget",
    title: "Never spend your whole budget: my 35 to 40% rule",
    description: "Why I tell first-time Post Office buyers to keep 35 to 40% of their budget in reserve, and how to narrow hundreds of listings to two or three.",
    ...explainerMedia("never-spend-your-whole-budget"),
    duration: "PT33S",
    length: "0:33",
    uploadDate: "2026-10-01",
    narration: [
      { line: "The most common mistake I see first-time buyers make isn't the branch they pick. It's putting every penny into it.", seconds: 7.1 },
      { line: "My rule is simple: never spend everything. Keep thirty-five to forty percent of your budget in reserve for what you can't see coming.", seconds: 8.8 },
      { line: "Filter listings by location first, then by the budget below your maximum. Two or three good listings are all you need to start.", seconds: 9.0 },
    ],
  },
  "easy-to-buy-hard-to-sell": {
    slug: "easy-to-buy-hard-to-sell",
    title: "Easy to buy, very hard to sell: plan your exit before you buy",
    description: "Everyone asks how to buy a Post Office, but almost nobody asks how they will sell it; here is why your exit matters as much as your entry price.",
    ...explainerMedia("easy-to-buy-hard-to-sell"),
    duration: "PT33S",
    length: "0:33",
    uploadDate: "2026-10-01",
    narration: [
      { line: "It's very easy to buy a Post Office. It's very, very tough to sell one. I wish more buyers heard that before signing.", seconds: 9.0 },
      { line: "Costs rise, high streets lose shops. The worst place to be is the last shop open on an empty street, with few buyers.", seconds: 9.1 },
      { line: "So ask the five-year question: are homes being built, and is the supermarket staying? Your exit is part of the deal.", seconds: 8.4 },
    ],
  },
  "your-google-reviews-are-a-free-blueprint": {
    slug: "your-google-reviews-are-a-free-blueprint",
    title: "Your online reviews are a free blueprint for what to fix",
    description: "How we manage reputation across our Post Office branches, and why reading every review matters when you are buying one.",
    ...explainerMedia("your-google-reviews-are-a-free-blueprint"),
    duration: "PT33S",
    length: "0:33",
    uploadDate: "2026-10-01",
    narration: [
      { line: "When you serve three thousand people a week, one or two leave unhappy, and they're the ones who review. Happy customers rarely do.", seconds: 9.0 },
      { line: "So we reply to unhappy customers, invite our regulars to scan a code at the counter, and keep opening times and photos current.", seconds: 8.8 },
      { line: "Buying a branch? Read every review, especially recent ones. Patterns in complaints are a free list of what you'll need to fix first.", seconds: 9.2 },
    ],
  },
  "insurance-review": {
    slug: "insurance-review",
    title: "Free Post Office insurance review",
    description: "Seventeen questions that show whether your Post Office insurance covers the risks you actually carry, with free, instant results and nothing to buy.",
    ...explainerMedia("insurance-review"),
    duration: "PT33S",
    length: "0:33",
    uploadDate: "2026-10-01",
    narration: [
      { line: "Most branches are on shop cover with Post Office extras bolted on. But a Post Office carries cash, contract income and a counter.", seconds: 9.6 },
      { line: "Gaps I look for: cash limits sized for a shop, no staff theft cover, and Post Office income unprotected if you close.", seconds: 9.6 },
      { line: "Take my free seventeen-question check with your policy beside you. Instant results, nothing to buy. I'm not selling insurance.", seconds: 9.9 },
    ],
  },
  "members-library": {
    slug: "members-library",
    title: "The members' library: free guides for Post Office buyers",
    description: "Six free checklists and guides I use myself, from due diligence and the broker call to TUPE, hidden costs and your first 90 days.",
    ...explainerMedia("members-library"),
    duration: "PT33S",
    length: "0:33",
    uploadDate: "2026-10-01",
    narration: [
      { line: "These are the checklists and guides I use myself. Six of them, and every one is free for members.", seconds: 7.3 },
      { line: "The ten checks I run on every branch, questions for the broker, a hidden costs worksheet, and a plain guide to inheriting staff.", seconds: 8.9 },
      { line: "Then your first ninety days and the five-year high street test. Join free to read online, tick things off and save them.", seconds: 8.5 },
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
