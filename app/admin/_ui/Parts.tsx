import Link from "next/link";
import type { AdminOrder } from "@/lib/server/admin";
import { agents, isActive, minutesSince, since, STALL_MINUTES, stationFor, statusLabel, type Ev, type ItemState } from "@/lib/pipeline-view";
import { Station, type StationState } from "./Floor";

const order: string[] = agents.map((a) => a.id);

/** Where an order is along the six stations. */
export function stationStates(o: AdminOrder): StationState[] {
  const at = stationFor[o.status];
  if (at === "sent") return order.map(() => "done");
  if (at === "paid") return order.map(() => "todo");
  if (at === "error") {
    // Stopped: before a report exists it stopped in research (Scout); after, in the checks (Sentinel).
    const reached = o.report_status ? 2 : 0;
    return order.map((_, i) => (i < reached ? "done" : i === reached ? "error" : "todo"));
  }
  const idx = order.indexOf(at);
  return order.map((_, i) => (i < idx ? "done" : i === idx ? (at === "mik" ? "waiting" : "working") : "todo"));
}

export function Tracker({ o, size = 30 }: { o: AdminOrder; size?: number }) {
  const states = stationStates(o);
  return (
    <div className="flex items-center">
      {agents.map((a, i) => (
        <div key={a.id} className="flex items-center" title={`${a.name}: ${a.role}`}>
          {i > 0 && <span className={`h-[2px] w-4 sm:w-6 ${states[i] === "done" || states[i] === "working" || states[i] === "waiting" ? "bg-emerald-400/60" : "bg-white/10"}`} />}
          <Station id={a.id} colour={a.colour} state={states[i]} size={size} />
        </div>
      ))}
    </div>
  );
}

export function StatusChip({ status, stalled }: { status: string; stalled?: boolean }) {
  const tone =
    status === "error" || stalled
      ? "bg-red/20 text-red-light"
      : status === "awaiting_approval"
        ? "bg-amber-400/15 text-amber-300"
        : status === "delivered"
          ? "bg-emerald-400/15 text-emerald-300"
          : status === "received"
            ? "bg-white/10 text-white/70"
            : "bg-sky-400/15 text-sky-300";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone}`}>
      {isActive(status) && !stalled && <span className="pulse h-1.5 w-1.5 rounded-full bg-current" />}
      {stalled ? "Stalled? No change for over 90 min" : statusLabel[status] ?? status}
    </span>
  );
}

export function OrderRow({ o, now }: { o: AdminOrder; now: number }) {
  const stalled = isActive(o.status) && minutesSince(o.updated_at, now) > STALL_MINUTES;
  return (
    <Link href={`/admin/orders/${o.id}`} className="rise grid gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/25 hover:bg-white/[0.06] lg:grid-cols-[1.3fr_auto_1fr] lg:items-center">
      <div className="min-w-0">
        <p className="truncate font-display text-base font-bold">{o.business_name || "Unnamed business"}</p>
        <p className="mt-0.5 text-xs text-white/55">
          {o.id} · {o.report_tier === "intelligence" ? "Intelligence" : "Insight"} · {o.business_postcode ?? ""} · paid {since(o.created_at, now)} ago
        </p>
      </div>
      <Tracker o={o} />
      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        <StatusChip status={o.status} stalled={stalled} />
        {o.overall_grade && (
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold">
            {o.overall_grade} {o.overall_score ?? ""} · {o.overall_verdict}
          </span>
        )}
      </div>
      {o.status === "error" && o.error_message && <p className="text-xs text-red-light lg:col-span-3">{o.error_message}</p>}
    </Link>
  );
}

const agentColour = (id: string) => agents.find((a) => a.id === id)?.colour ?? "#8b949e";
const agentName = (id: string) => agents.find((a) => a.id === id)?.name ?? (id === "runner" ? "Runner" : id);

const kindMark: Record<string, string> = { pass: "✓", done: "✓", fail: "✕", error: "!", retry: "↻", gap: "–", waiting: "…", start: "▸", progress: "•", info: "•" };

/** The live feed of everything the agents report. */
export function Feed({ events, showOrder = true, limit = 60 }: { events: Ev[]; showOrder?: boolean; limit?: number }) {
  if (!events.length)
    return <p className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/50">Nothing reported yet. Steps appear here as the agents report them.</p>;
  return (
    <ol className="max-h-[520px] overflow-y-auto rounded-xl border border-white/10 bg-white/[0.03] font-mono text-[12px]">
      {events.slice(0, limit).map((e, i) => (
        <li key={`${e.at}-${i}`} className={`flex gap-3 border-b border-white/5 px-4 py-2 last:border-0 ${i === 0 ? "rise" : ""}`}>
          <span className="w-12 shrink-0 text-white/40">{new Date(e.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" })}</span>
          <span className="w-16 shrink-0 font-semibold" style={{ color: agentColour(e.agent) }}>{agentName(e.agent)}</span>
          <span className={`w-3 shrink-0 ${e.kind === "fail" || e.kind === "error" ? "text-red-light" : e.kind === "pass" || e.kind === "done" ? "text-emerald-300" : "text-white/50"}`}>{kindMark[e.kind] ?? "•"}</span>
          <span className="min-w-0 flex-1 text-white/85">
            {showOrder && <span className="text-white/40">{e.order_id} · </span>}
            {e.item && <span className="text-white/55">[{e.item}{e.round ? ` r${e.round}` : ""}] </span>}
            {e.message}
          </span>
        </li>
      ))}
    </ol>
  );
}

const stateStyle: Record<ItemState, string> = {
  todo: "border-white/10 bg-white/[0.02] text-white/40",
  working: "scan relative overflow-hidden border-sky-400/40 bg-sky-400/10 text-sky-200",
  pass: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  fail: "border-red/50 bg-red/15 text-red-light",
  retry: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  gap: "border-white/20 bg-white/5 text-white/60",
  error: "border-red/50 bg-red/15 text-red-light",
};
const stateWord: Record<ItemState, string> = { todo: "Not reported", working: "Working", pass: "Passed", fail: "Failed", retry: "Redoing", gap: "Gap", error: "Error" };

/** A grid of checklist items (sources, sections, checks), each lit by its latest state. */
export function Checklist({ items, states, extra }: { items: { key: string; label: string }[]; states: Map<string, { state: ItemState; rounds: number; message: string }>; extra?: (key: string) => string | null }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((it) => {
        const s = states.get(it.key) ?? [...states.entries()].find(([k]) => it.key.startsWith(`${k}_`))?.[1];
        const st: ItemState = s?.state ?? "todo";
        const more = extra?.(it.key);
        return (
          <li key={it.key} className={`rounded-lg border px-3 py-2 text-xs ${stateStyle[st]}`} title={s?.message}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-white/90">{it.label}</span>
              <span className="shrink-0 text-[10px] uppercase tracking-[0.12em]">
                {stateWord[st]}
                {s && s.rounds > 1 ? ` · ${s.rounds} rounds` : ""}
              </span>
            </div>
            {(s?.message || more) && <p className="mt-1 line-clamp-2 text-[11px] text-white/60">{[more, s?.message].filter(Boolean).join(" · ")}</p>}
          </li>
        );
      })}
    </ul>
  );
}
