// The report format the OpenClaw agents write (fcm-report-schema-v2, 26 March 2026), and helpers to read it
// safely. Reports were written by AI agents over several weeks, so fields can be missing, renamed or stored as
// JSON strings; everything here tolerates that rather than failing the page.

import type { Tier } from "@/lib/report";

export type Rec = Record<string, unknown>;

export type StoredReport = {
  order_id: string;
  tier: Tier;
  status: string;
  customer_email: string;
  created_at: string;
  updated_at: string;
  order_status: string | null;
  delivered_at: string | null;
  report: Rec;
};

export const isRec = (v: unknown): v is Rec => typeof v === "object" && v !== null && !Array.isArray(v);

/** A string, or "" for anything else. Numbers are turned into text. */
export const str = (v: unknown) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");
export const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v)) ? Number(v) : null);
export const arr = (v: unknown): Rec[] => (Array.isArray(v) ? v.filter(isRec) : []);
export const strs = (v: unknown): string[] => (Array.isArray(v) ? v.map(str).filter(Boolean) : []);
export const rec = (v: unknown): Rec => (isRec(v) ? v : {});

const parse = (v: unknown): unknown => {
  if (typeof v !== "string") return v;
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
};

/** Section keys used by the agents over time, mapped to the v2 names. */
const aliases: Record<string, string> = {
  s2_financial_performance: "s2_financial_analysis",
  s4_staffing_and_operations: "s4_staffing",
  s4_staffing_operations: "s4_staffing",
  s8_crime_and_safety: "s8_crime_safety",
  s5_online_reputation: "s5_online_presence",
  s6_location: "s6_location_intelligence",
  s9_competition: "s9_competition_mapping",
  s10_footfall: "s10_footfall_analysis",
  s13_risks: "s13_risk_assessment",
};

export const sectionKeys = [
  "s1_executive_summary",
  "s2_financial_analysis",
  "s3_po_remuneration",
  "s4_staffing",
  "s5_online_presence",
  "s6_location_intelligence",
  "s7_demographics",
  "s8_crime_safety",
  "s9_competition_mapping",
  "s10_footfall_analysis",
  "s11_infrastructure",
  "s12_future_outlook",
  "s13_risk_assessment",
  "s14_profit_improvement",
  "s15_due_diligence",
] as const;
export type SectionKey = (typeof sectionKeys)[number];

export type Image = { url: string; caption: string; kind: string };

export type Report = {
  meta: Rec;
  order: Rec;
  sections: Partial<Record<SectionKey, Rec>>;
  images: { cover: Image | null; photos: Image[]; streetView: Image[]; maps: Image[] };
};


function image(v: unknown, kind: string): Image | null {
  const r = rec(v);
  const url = str(r.url);
  return /^https:\/\//.test(url) ? { url, caption: str(r.caption), kind: str(r.map_type) || kind } : null;
}

export function normalise(raw: Rec): Report {
  const sections: Partial<Record<SectionKey, Rec>> = {};
  for (const [k, v] of Object.entries(rec(parse(raw.sections)))) {
    const key = (aliases[k] ?? k) as SectionKey;
    const value = parse(v);
    if (!isRec(value) || !sectionKeys.includes(key)) continue;
    // Keep the fuller copy when a section appears under two names.
    if (!sections[key] || Object.keys(value).length > Object.keys(sections[key]).length) sections[key] = value;
  }

  const im = rec(parse(raw.images));
  const maps = (Array.isArray(im.maps) ? im.maps : []).map((p) => image(p, "location")).filter((x): x is Image => !!x);
  // Older reports also stored the three analysis maps as separate fields.
  for (const [field, kind] of [["competition_map", "competition"], ["crime_heatmap", "crime_heatmap"], ["footfall_map", "footfall"]] as const) {
    const m = image(im[field], kind);
    if (m && !maps.some((x) => x.url === m.url)) maps.push({ ...m, kind });
  }
  return {
    meta: rec(parse(raw.metadata)),
    order: rec(parse(raw.order)),
    sections,
    images: {
      cover: image(im.cover_image, "cover"),
      photos: (Array.isArray(im.google_business_photos) ? im.google_business_photos : []).map((p) => image(p, "photo")).filter((x): x is Image => !!x),
      streetView: (Array.isArray(im.street_view) ? im.street_view : []).map((p) => image(p, "street")).filter((x): x is Image => !!x),
      maps,
    },
  };
}

/** The maps of one kind (location, competition, crime_heatmap, footfall), with any legacy single-map fields. */
export function mapsOf(report: Report, kind: string) {
  return report.images.maps.filter((m) => m.kind === kind || (kind === "crime_heatmap" && m.kind === "crime"));
}
