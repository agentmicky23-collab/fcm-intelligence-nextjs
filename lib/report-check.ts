// Checks an agent-written report before it can reach Mikesh. Everything here is deterministic, so the same
// report always gets the same answer. "critical" issues block the report; "warnings" are shown to Mikesh.

import { employerCost } from "@/lib/employer-cost";
import { distanceText, latLng, metresBetween, parseDistance } from "@/lib/geo";
import { arr, isRec, num, rec, sectionKeys, str, type SectionKey } from "@/lib/report-data";
import { gradeFor, grades, overall, schemaVersion, tierSections, unscoredSections, verdicts, weights } from "@/lib/report-rules";
import type { Tier } from "@/lib/report";
import { staleRateText } from "@/lib/uk-rates";

export type Issue = { level: "critical" | "warning"; where: string; problem: string; fix: string };

const parse = (v: unknown): unknown => {
  if (typeof v !== "string") return v;
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
};

/** Every string in the report with its path, for text checks. */
function strings(v: unknown, path = "", out: { path: string; text: string }[] = []) {
  const x = parse(v);
  if (typeof x === "string") out.push({ path, text: x });
  else if (Array.isArray(x)) x.forEach((e, i) => strings(e, `${path}[${i}]`, out));
  else if (isRec(x)) for (const [k, e] of Object.entries(x)) strings(e, path ? `${path}.${k}` : k, out);
  return out;
}

const placeholder = /\b(TBC|TBD|TODO|XXX+|undefined|NaN|lorem ipsum)\b|Data from [A-Z]|\[insert|\{\{/;
const fakeSources = /FCM (comparable transactions|benchmark) database|FCM internal benchmarks?/i;
const usSpelling = /\b(color|colors|colored|center|centers|centered|analyze|analyzed|neighborhood|neighbors?|gray|favorite|organize|organized|parking lot|realize|realized)\b/i;
const imageUrl = (orderId: string) =>
  new RegExp(`^https://dykudrjpcliuyahjuiag\\.supabase\\.co/storage/v1/object/public/report-images/${orderId.replace(/[-]/g, "\\-")}/[^?#\\s]+$`);

export function checkReport(raw: unknown, opts: { orderId: string; tier: Tier }) {
  const issues: Issue[] = [];
  const crit = (where: string, problem: string, fix: string) => issues.push({ level: "critical", where, problem, fix });
  const warn = (where: string, problem: string, fix: string) => issues.push({ level: "warning", where, problem, fix });

  const r = rec(parse(raw));
  const meta = rec(parse(r.metadata));
  const order = rec(parse(r.order));
  const sections = rec(parse(r.sections));
  const s = (k: SectionKey) => rec(parse(sections[k]));

  // --- Structure
  if (str(meta.schema_version) !== schemaVersion) warn("metadata.schema_version", `Expected "${schemaVersion}", found "${str(meta.schema_version) || "none"}"`, `Set metadata.schema_version to "${schemaVersion}".`);
  const keys = Object.keys(sections);
  for (const k of keys) if (!(sectionKeys as readonly string[]).includes(k)) crit(`sections.${k}`, "Not one of the 15 section keys (renamed, duplicated or extra)", "Use only the canonical keys s1_executive_summary … s15_due_diligence; merge any content into the right section and delete this key.");
  for (const k of sectionKeys) if (!isRec(parse(sections[k]))) crit(`sections.${k}`, "Section missing", "Write all 15 sections, whatever the tier.");
  if (r.tier_visibility !== undefined) {
    const tv = rec(parse(r.tier_visibility));
    const same = (a: unknown, b: readonly string[]) => Array.isArray(a) && a.length === b.length && b.every((x) => a.includes(x));
    if (!same(tv.insight, tierSections.insight) || !same(tv.intelligence, tierSections.intelligence) || Object.keys(tv).some((k) => k !== "insight" && k !== "intelligence"))
      warn("tier_visibility", "Doesn't match the fixed tier lists (the website ignores it)", "Remove tier_visibility; the website decides what each tier shows.");
  }
  if (str(order.tier) && str(order.tier) !== opts.tier) crit("order.tier", `Report says "${str(order.tier)}" but the order is "${opts.tier}"`, "Use the tier from the order.");
  for (const f of ["business_name", "postcode", "report_date"]) if (!str(meta[f])) crit(`metadata.${f}`, "Missing", `Fill metadata.${f}.`);

  // --- Identity of the business
  const identity = rec(meta.identity);
  const confidence = str(identity.confidence);
  if (confidence === "unconfirmed") crit("metadata.identity", "The business researched isn't confirmed as the one ordered", "Stop and ask Mik to confirm the premises before writing the report.");
  else if (confidence === "probable") warn("metadata.identity", "Business identity is only probable", "Say so in Section 1 concerns and tell Mik in the approval summary.");
  else if (!confidence) warn("metadata.identity", "No record of how the business was identified", "Add metadata.identity {confidence, method, evidence}.");

  // --- Scores and grades
  const scores: Partial<Record<SectionKey, number | null>> = {};
  for (const k of sectionKeys) {
    const sec = s(k);
    const score = sec.score === null || sec.score === undefined ? null : num(sec.score);
    const grade = str(sec.grade);
    scores[k] = score;
    if (unscoredSections.includes(k)) {
      if (score !== null) warn(`sections.${k}.score`, "This section isn't scored", "Set score and grade to null.");
      continue;
    }
    if (score === null) {
      if (grade) crit(`sections.${k}.grade`, "Grade given without a score", "Set grade to null when there's no score.");
      continue;
    }
    if (!Number.isInteger(score) || score < 0 || score > 100) crit(`sections.${k}.score`, `Score ${score} isn't a whole number from 0 to 100`, "Use a whole number from 0 to 100.");
    else if (!grades.includes(grade)) crit(`sections.${k}.grade`, `"${grade}" isn't on the grade scale`, `Use ${gradeFor(score)} (the grade for ${score}).`);
    else if (grade !== gradeFor(score)) crit(`sections.${k}.grade`, `Score ${score} is ${gradeFor(score)}, not ${grade}`, `Set the grade to ${gradeFor(score)}.`);
  }

  // Missing data must be null, not a low score.
  const s2 = s("s2_financial_analysis");
  if (str(s2.data_status) !== "verified" && scores.s2_financial_analysis !== null) crit("sections.s2_financial_analysis.score", `Scored without verified accounts (data_status "${str(s2.data_status) || "none"}")`, "Section 2 is scored only on verified accounts. Set the score and grade to null; the verdict is capped instead.");
  const s8 = s("s8_crime_safety");
  if (/no (crime )?data|data (is )?unavailable|not (been )?supplied|hasn'?t supplied/i.test(str(s8.headline) + " " + str(s8.headline_detail)) && scores.s8_crime_safety !== null)
    warn("sections.s8_crime_safety.score", "Crime is scored although the section says the data isn't available", "If there's no crime data, set the score to null.");

  // Overall score, grade and verdict.
  const financialsVerified = str(s2.data_status) === "verified";
  const s13 = s("s13_risk_assessment");
  const risks = arr(s13.detailed_risks);
  const redFlags = arr(s13.risk_grid).filter((x) => str(x.status) === "red_flag").length;
  const dealbreakers = risks.filter((x) => str(x.status) === "red_flag" && /^(yes|true)\b/i.test(str(x.dealbreaker))).length;
  const computed = overall(scores, { financialsVerified, redFlags, dealbreakers });
  const ms = num(meta.overall_score);
  if (computed.score !== null) {
    if (ms === null) crit("metadata.overall_score", "Missing", `Set it to ${computed.score} (weighted from the section scores).`);
    else if (Math.abs(ms - computed.score) > 1) crit("metadata.overall_score", `${ms} doesn't match the weighted section scores (${computed.score})`, `Set it to ${computed.score}. Don't adjust it by hand.`);
    if (str(meta.overall_grade) && str(meta.overall_grade) !== computed.grade) crit("metadata.overall_grade", `"${str(meta.overall_grade)}" should be ${computed.grade}`, `Set it to ${computed.grade}.`);
  }
  const verdictsUsed = { "metadata.overall_verdict": str(meta.overall_verdict), "s1.verdict": str(s("s1_executive_summary").verdict), "s13.overall_verdict": str(s13.overall_verdict) };
  for (const [where, v] of Object.entries(verdictsUsed)) {
    if (!v) crit(where, "Missing verdict", `Use "${computed.verdict}".`);
    else if (!(verdicts as readonly string[]).includes(v)) crit(where, `"${v}" isn't one of the four verdicts`, `Use exactly one of: ${verdicts.join(", ")}. For this report: "${computed.verdict}".`);
    else if (computed.verdict && v !== computed.verdict) crit(where, `"${v}" doesn't follow from the scores`, `Use "${computed.verdict}"${computed.caps.length ? ` (${computed.caps.join("; ")})` : ""}.`);
  }
  for (const c of arr(s("s1_executive_summary").category_scores)) {
    const label = str(c.category);
    const key = str(c.section) as SectionKey;
    if (key && sectionKeys.includes(key) && num(c.score) !== scores[key]) crit(`s1.category_scores (${label})`, `Score ${str(c.score)} differs from the section's own score (${scores[key] ?? "null"})`, "Copy each category score from its section.");
    if (num(c.score) !== null && str(c.grade) && str(c.grade) !== gradeFor(num(c.score)!)) crit(`s1.category_scores (${label})`, `Grade ${str(c.grade)} doesn't match score ${str(c.score)}`, `Use ${gradeFor(num(c.score)!)}.`);
  }

  // --- Sources
  for (const k of sectionKeys) {
    const src = parse(s(k).sources);
    const has = typeof src === "string" ? src.trim().length > 0 : Array.isArray(src) ? src.length > 0 : false;
    if (isRec(parse(sections[k])) && !has) crit(`sections.${k}.sources`, "No sources", "List the sources the section's facts came from.");
  }

  // --- Text checks across the whole report
  for (const { path, text } of strings(r)) {
    for (const st of staleRateText) if (st.pattern.test(text)) crit(path, `Out-of-date rate: ${st.why}`, "Use the current rates from /api/tools/employer-cost and the rates file.");
    if (placeholder.test(text)) crit(path, `Placeholder text: "${text.slice(0, 80)}"`, "Replace with real data or mark the item unavailable.");
    if (/fcmreport\.co(m|\.uk)/i.test(text)) crit(path, "Mentions fcmreport.com", "Use fcmintelligence.com.");
    if (fakeSources.test(text)) crit(path, "Cites an FCM database that doesn't exist", "Cite the real source, or label the figure as an FCM estimate with its method.");
    if (/\bguaranteed\b/i.test(text) && /post office|PO |remuneration|commission/i.test(text)) warn(path, "Calls Post Office pay guaranteed", "Post Office pay is mostly transaction-based; describe it accurately.");
    if (usSpelling.test(text) && !/^images|url$/i.test(path)) warn(path, `US spelling: "${text.match(usSpelling)?.[0]}"`, "Use British English.");
    if (/\*\*[^*]+\*\*|^#{1,3} /m.test(text)) warn(path, "Contains markdown formatting", "Plain text only; the website does the formatting.");
  }

  // --- Staffing figures must match the calculator
  const s4 = s("s4_staffing");
  const we = rec(s4.worked_example);
  if (num(we.hourly_rate) !== null && num(we.hours_per_week) !== null) {
    const calc = employerCost({ hourlyRate: num(we.hourly_rate)!, hoursPerWeek: num(we.hours_per_week)! });
    const stated = num(we.cost_per_worked_hour);
    if (stated === null || Math.abs(stated - calc.perWorkedHour.total) > 0.02) crit("sections.s4_staffing.worked_example", `True hourly cost should be £${calc.perWorkedHour.total.toFixed(2)} (stated ${stated ?? "nothing"})`, "Take the worked example from /api/tools/employer-cost.");
  } else warn("sections.s4_staffing.worked_example", "No worked example from the calculator", "Add worked_example from /api/tools/employer-cost for the branch's typical shift pattern.");

  // --- Images
  const pattern = imageUrl(opts.orderId);
  const urls = strings(r.images).filter((x) => x.path.endsWith("url"));
  for (const { path, text } of urls) {
    if (/key=|AIza|googleapis\.com/.test(text)) crit(`images.${path}`, "Image URL contains a Google API address or key", "Download the image, upload it to Supabase storage and use that URL.");
    else if (!pattern.test(text)) crit(`images.${path}`, `Not a Supabase report-images URL for this order: ${text.slice(0, 90)}`, `Upload to report-images/${opts.orderId}/ and use the public URL.`);
  }
  // Google's terms don't allow storing or republishing Places photos or Street View. The website shows Street View
  // live and links to the Google listing instead; maps are drawn by the website from coordinates.
  const im = rec(parse(r.images));
  for (const f of ["google_business_photos", "street_view"]) {
    if (Array.isArray(im[f]) && im[f].length)
      crit(`images.${f}`, "Stored Google photos or Street View images", "Remove them. The website shows Street View live and links to the Google listing; use images.photos only for photos we're allowed to use (seller, customer, FCM, or openly licensed with a credit).");
  }
  const googleSource = /google|street ?view/i;
  if (googleSource.test(str(rec(im.cover_image).source))) crit("images.cover_image", "Cover image is from Google", "Use a photo we're allowed to use, or leave cover_image out.");
  arr(im.photos).forEach((p, i) => {
    if (googleSource.test(str(p.source))) crit(`images.photos[${i}]`, "Photo is from Google", "Remove it; only photos we're allowed to use (with a credit) go in images.photos.");
    else if (!str(p.credit) && !str(p.source)) warn(`images.photos[${i}]`, "Photo has no credit", "Add credit: who took it or the licence (e.g. \"Seller\", \"Geograph, CC BY-SA 2.0, J Smith\").");
  });

  // --- Coordinates for the maps
  const centre = latLng(meta.lat, meta.lng);
  if (!centre) crit("metadata.lat", "Missing or not in the UK (metadata.lat and metadata.lng)", "Add the branch's coordinates from postcodes.io or the Post Office branch finder. The maps and Street View use them.");
  else {
    if (arr(im.maps).length) warn("images.maps", "Map images aren't needed", "Remove them; the website draws the maps from the coordinates.");
    const lists: [string, unknown, string][] = [
      ["sections.s9_competition_mapping.full_service_pos", s("s9_competition_mapping").full_service_pos, "branch_name"],
      ["sections.s9_competition_mapping.drop_collect_points", s("s9_competition_mapping").drop_collect_points, "location"],
      ["sections.s9_competition_mapping.grocery_competition", s("s9_competition_mapping").grocery_competition, "name"],
      ["sections.s10_footfall_analysis.footfall_generators", s("s10_footfall_analysis").footfall_generators, "facility"],
    ];
    for (const [where, rows, nameKey] of lists) {
      const missing: string[] = [];
      arr(rows).forEach((row, i) => {
        const p = latLng(row.lat, row.lng);
        if (!p) {
          if (!/subject/i.test(`${str(row[nameKey])} ${str(row.distance)}`)) missing.push(str(row[nameKey]) || `item ${i + 1}`);
          return;
        }
        const stated = parseDistance(row.distance);
        const actual = metresBetween(centre, p);
        if (stated !== null && Math.abs(stated - actual) > Math.max(150, actual * 0.3))
          warn(`${where}[${i}].distance`, `Says ${str(row.distance)}, but the coordinates are ${distanceText(actual)} apart`, "Check the coordinates and the distance; distances are straight-line from the branch.");
      });
      if (missing.length) warn(where, `No coordinates for ${missing.length}: ${missing.slice(0, 4).join(", ")}${missing.length > 4 ? "…" : ""}`, "Add lat and lng so they appear on the map.");
    }
  }

  const known = new Set(urls.map((u) => u.text.split("/").pop()));
  for (const k of sectionKeys) {
    for (const [f, v] of Object.entries(s(k))) {
      if (!/_refs?$/.test(f)) continue;
      for (const ref of (Array.isArray(v) ? v : [v]).map(str).filter(Boolean)) {
        const file = ref.split("/").pop();
        if (!known.has(file) && !/^https:/.test(ref)) warn(`sections.${k}.${f}`, `Refers to an image that isn't in images: ${ref}`, "Point it at an image listed in images, or remove it.");
      }
    }
  }

  const critical = issues.filter((i) => i.level === "critical");
  return { ok: critical.length === 0, critical, warnings: issues.filter((i) => i.level === "warning"), computed };
}

export type ReportCheck = ReturnType<typeof checkReport>;
export { weights };
