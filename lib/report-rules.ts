// The fixed rules of an FCM report (schema v3): section keys, what each tier includes, the grade scale,
// the overall-score weights and the verdict. Calculated in code so every report follows them exactly.

import { reportSections } from "@/lib/report";
import { sectionKeys, type SectionKey } from "@/lib/report-data";

export const schemaVersion = "3.0";

export const tierSections = {
  insight: reportSections.filter((s) => s.tier === "insight").map((s) => sectionKeys[s.n - 1]),
  intelligence: [...sectionKeys],
} as const;

/** 8-band grade scale (agreed March 2026). */
export const gradeBands = [
  { grade: "A", min: 85 },
  { grade: "A-", min: 80 },
  { grade: "B+", min: 75 },
  { grade: "B", min: 65 },
  { grade: "C+", min: 55 },
  { grade: "C", min: 45 },
  { grade: "D", min: 30 },
  { grade: "F", min: 0 },
] as const;
export type Grade = (typeof gradeBands)[number]["grade"];
export const grades = gradeBands.map((b) => b.grade) as readonly string[];

export const gradeFor = (score: number): Grade => gradeBands.find((b) => score >= b.min)!.grade;

/** Weights for the overall score. Sections not listed (4, 5, 13, 14, 15) are reported but don't move the overall. */
export const weights: Partial<Record<SectionKey, number>> = {
  s2_financial_analysis: 20,
  s3_po_remuneration: 15,
  s6_location_intelligence: 15,
  s7_demographics: 10,
  s8_crime_safety: 5,
  s9_competition_mapping: 15,
  s10_footfall_analysis: 10,
  s11_infrastructure: 5,
  s12_future_outlook: 5,
};

/** Sections that are never scored. */
export const unscoredSections: SectionKey[] = ["s14_profit_improvement", "s15_due_diligence"];

export const verdicts = ["Proceed with Confidence", "Proceed with Caution", "Significant Concerns", "Do Not Proceed"] as const;
export type Verdict = (typeof verdicts)[number];

export function verdictForScore(score: number): Verdict {
  if (score >= 75) return "Proceed with Confidence";
  if (score >= 60) return "Proceed with Caution";
  if (score >= 45) return "Significant Concerns";
  return "Do Not Proceed";
}

const capOrder = (v: Verdict) => verdicts.indexOf(v);
const atMost = (v: Verdict, cap: Verdict): Verdict => (capOrder(v) < capOrder(cap) ? cap : v);

/**
 * The overall score: the weighted mean of the scored sections that have data. A section with no data
 * (score null) is left out and its weight shared across the rest, rather than counted as a poor score.
 * Then the verdict, capped when the evidence is too thin for confidence.
 */
export function overall(sectionScores: Partial<Record<SectionKey, number | null>>, opts: { financialsVerified: boolean; redFlags: number; dealbreakers: number }) {
  let sum = 0;
  let weight = 0;
  const used: SectionKey[] = [];
  const missing: SectionKey[] = [];
  for (const [k, w] of Object.entries(weights) as [SectionKey, number][]) {
    const s = sectionScores[k];
    if (typeof s === "number") {
      sum += s * w;
      weight += w;
      used.push(k);
    } else missing.push(k);
  }
  const score = weight ? Math.round(sum / weight) : null;
  let verdict: Verdict | null = score === null ? null : verdictForScore(score);
  const caps: string[] = [];
  if (verdict && !opts.financialsVerified) {
    const v = atMost(verdict, "Proceed with Caution");
    if (v !== verdict) caps.push("No verified accounts: verdict capped at Proceed with Caution");
    verdict = v;
  }
  if (verdict && opts.dealbreakers > 0) {
    const v = atMost(verdict, "Significant Concerns");
    if (v !== verdict) caps.push("A red flag marked as a dealbreaker: verdict capped at Significant Concerns");
    verdict = v;
  }
  return {
    score,
    grade: score === null ? null : gradeFor(score),
    verdict,
    caps,
    basis: missing.length ? ("partial" as const) : ("full" as const),
    sectionsUsed: used,
    sectionsWithoutData: missing,
    weightUsed: weight,
  };
}
