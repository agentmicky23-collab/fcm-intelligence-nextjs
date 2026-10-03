// What the control room shows: the stages of a report run, each agent's checklist, and how to read
// the events OpenClaw sends (POST /api/pipeline/events) into "what's happening now".

import { reportSections } from "@/lib/report";
import { sectionKeys } from "@/lib/report-data";

export type AgentId = "scout" | "sage" | "sentinel" | "website" | "oracle" | "mik";

export const agents: { id: AgentId; name: string; role: string; does: string; colour: string }[] = [
  { id: "scout", name: "Scout", role: "Research", does: "Finds the business and gathers the facts from 16 sources", colour: "#1D9E75" },
  { id: "sage", name: "Sage", role: "Writer", does: "Writes the 15 sections in your voice, one at a time", colour: "#7F77DD" },
  { id: "sentinel", name: "Sentinel", role: "Checker", does: "Checks the research, every section and every figure", colour: "#D85A30" },
  { id: "website", name: "Website", role: "Automatic check", does: "Scores, grades and the verdict; blocks anything critical", colour: "#378ADD" },
  { id: "oracle", name: "Oracle", role: "Final read", does: "Reads the live page as the customer will see it", colour: "#C9A227" },
  { id: "mik", name: "You", role: "Approve & send", does: "Read it and press Approve & send", colour: "#e0241b" },
];

/** Order status → which station is working on it. */
export const stationFor: Record<string, AgentId | "paid" | "sent" | "error"> = {
  fact_find: "paid",
  received: "paid",
  research: "scout",
  writing: "sage",
  validating: "sentinel",
  qa: "oracle",
  awaiting_approval: "mik",
  needs_info: "mik",
  delivered: "sent",
  error: "error",
};

export const statusLabel: Record<string, string> = {
  fact_find: "Waiting for the fact find",
  received: "Queued for the next run",
  research: "Scout is researching",
  writing: "Sage is writing",
  validating: "Sentinel is checking",
  qa: "Oracle's final read",
  awaiting_approval: "Waiting for you",
  needs_info: "Needs information",
  delivered: "Sent to the customer",
  error: "Stopped: needs attention",
};

export const scoutSources: { key: string; label: string }[] = [
  { key: "identity", label: "Which business (identity)" },
  { key: "listing_scrape", label: "Sale listing" },
  { key: "po_branches", label: "Nearby Post Offices" },
  { key: "drop_collect", label: "Parcel drop-off points" },
  { key: "grocery", label: "Grocery competition" },
  { key: "google_business", label: "Google listing and reviews" },
  { key: "crime", label: "Crime" },
  { key: "demographics", label: "Census (small area)" },
  { key: "income", label: "Household income" },
  { key: "footfall", label: "Footfall: schools, GPs, transport" },
  { key: "broadband", label: "Broadband" },
  { key: "mobile_coverage", label: "Mobile signal" },
  { key: "companies_house", label: "Companies House accounts" },
  { key: "business_rates", label: "Business rates" },
  { key: "planning", label: "Planning and developments" },
  { key: "bank_closures", label: "Bank closures" },
  { key: "licensing_hygiene", label: "Licences and food hygiene" },
];

export const sageSections = reportSections.map((s) => ({ key: sectionKeys[s.n - 1] as string, label: `${s.n}. ${s.title}` }));

export const sentinelChecks: { key: string; label: string }[] = [
  { key: "pack", label: "Research pack review" },
  { key: "A", label: "A. Structure" },
  { key: "B", label: "B. Every figure has a source" },
  { key: "C", label: "C. Rates and facts" },
  { key: "D", label: "D. Gaps handled honestly" },
  { key: "E", label: "E. Right business, specific to it" },
  { key: "F", label: "F. Wording and advice" },
  { key: "G", label: "G. Maps and images" },
];

export const oracleChecks: { key: string; label: string }[] = [
  { key: "1", label: "Right business" },
  { key: "2", label: "Verdict makes sense" },
  { key: "3", label: "Consistent throughout" },
  { key: "4", label: "Honest about gaps" },
  { key: "5", label: "Specific and useful" },
  { key: "6", label: "Reads in your voice" },
  { key: "7", label: "Nothing risky" },
  { key: "8", label: "The page works" },
  { key: "9", label: "Customer's questions answered" },
  { key: "10", label: "Complete" },
];

export type Ev = { at: string; agent: string; stage: string | null; item: string | null; kind: string; round: number | null; message: string; detail?: Record<string, unknown> | null; order_id: string };

export type ItemState = "todo" | "working" | "pass" | "fail" | "retry" | "gap" | "error";

const stateOf = (kind: string): ItemState =>
  kind === "pass" || kind === "done" ? "pass" : kind === "fail" ? "fail" : kind === "retry" ? "retry" : kind === "gap" ? "gap" : kind === "error" ? "error" : "working";

/** The latest state of each checklist item for one agent, with how many rounds it took. */
export function itemStates(events: Ev[], agent: string | string[]) {
  const who = new Set(Array.isArray(agent) ? agent : [agent]);
  const out = new Map<string, { state: ItemState; rounds: number; message: string; at: string }>();
  // events arrive newest first; walk oldest first so the latest wins
  for (const e of [...events].reverse()) {
    if (!who.has(e.agent) || !e.item) continue;
    const prev = out.get(e.item);
    const rounds = Math.max(prev?.rounds ?? 0, e.round ?? (e.kind === "retry" || e.kind === "fail" ? (prev?.rounds ?? 0) + 1 : prev?.rounds ?? 1));
    out.set(e.item, { state: stateOf(e.kind), rounds, message: e.message, at: e.at });
  }
  return out;
}

export const latestFor = (events: Ev[], agent: string) => events.find((e) => e.agent === agent) ?? null;

/** When each station started and finished for an order, from the events (falling back to the timeline). */
export function stationTimes(events: Ev[], timeline: Record<string, unknown> | null) {
  const t: Partial<Record<AgentId, { start?: string; end?: string }>> = {};
  for (const e of [...events].reverse()) {
    const a = e.agent as AgentId;
    if (!agents.some((x) => x.id === a)) continue;
    const s = (t[a] ??= {});
    if (!s.start) s.start = e.at;
    s.end = e.at;
  }
  const tl = timeline ?? {};
  const str = (k: string) => (typeof tl[k] === "string" ? (tl[k] as string) : undefined);
  if (!t.scout?.start && str("research_started")) t.scout = { start: str("research_started") };
  if (!t.mik?.start && str("ready_for_review")) t.mik = { start: str("ready_for_review") };
  return t;
}

export function since(iso: string | null | undefined, now = Date.now()) {
  if (!iso) return "";
  const m = Math.max(0, Math.round((now - Date.parse(iso)) / 60000));
  if (m < 1) return "just now";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h} h ${m % 60} min`;
  return `${Math.floor(h / 24)} days`;
}

export const minutesSince = (iso: string | null | undefined, now = Date.now()) => (iso ? (now - Date.parse(iso)) / 60000 : 0);

export const STALL_MINUTES = 90;
export const isActive = (status: string) => ["research", "writing", "validating", "qa"].includes(status);
