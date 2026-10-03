import Link from "next/link";
import type { AdminOrder } from "@/lib/server/admin";
import { agents, isActive, latestFor, minutesSince, since, STALL_MINUTES, stationFor, type Ev } from "@/lib/pipeline-view";
import { AgentIcon } from "./icons";

export type StationState = "idle" | "working" | "done" | "waiting" | "error" | "todo";

/** One agent as a round station: a spinning ring while it works, a tick when done, red when stopped. */
export function Station({ id, colour, state, size = 64 }: { id: string; colour: string; state: StationState; size?: number }) {
  const ring =
    state === "working"
      ? { borderColor: `${colour} transparent ${colour} transparent` }
      : state === "done"
        ? { borderColor: "#34d399" }
        : state === "error"
          ? { borderColor: "#e0241b" }
          : state === "waiting"
            ? { borderColor: "#e0241b" }
            : { borderColor: "rgba(255,255,255,.12)" };
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center rounded-full ${state === "waiting" ? "glow" : ""}`} style={{ width: size, height: size }}>
      <span className={`absolute inset-0 rounded-full border-[3px] ${state === "working" ? "spin" : ""}`} style={ring} />
      <span
        className="flex items-center justify-center rounded-full"
        style={{ width: size - 14, height: size - 14, background: state === "idle" || state === "todo" ? "rgba(255,255,255,.05)" : `${colour}22`, color: state === "idle" || state === "todo" ? "rgba(255,255,255,.45)" : colour }}
      >
        <AgentIcon id={id} className={size > 50 ? "h-6 w-6" : "h-4 w-4"} />
      </span>
      {state === "done" && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[11px] font-bold text-[#020816]">✓</span>
      )}
      {state === "error" && <span className="pulse absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-[#020816] bg-red" />}
    </span>
  );
}

/** The agent floor: every agent, what it's doing right now, and the work flowing between them. */
export function Floor({ orders, events, now }: { orders: AdminOrder[]; events: Ev[]; now: number }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[880px] grid-cols-6 items-start">
        {agents.map((a, i) => {
          const here = orders.filter((o) => stationFor[o.status] === a.id);
          const last = latestFor(events, a.id);
          const busy = here.length > 0;
          const stalled = here.some((o) => isActive(o.status) && minutesSince(o.updated_at, now) > STALL_MINUTES);
          const state: StationState = stalled ? "error" : busy ? (a.id === "mik" ? "waiting" : "working") : "idle";
          const flowing = busy && i > 0;
          return (
            <div key={a.id} className="relative flex flex-col items-center px-2 text-center">
              {i > 0 && (
                <span
                  aria-hidden
                  className={`absolute left-[-50%] right-[50%] top-8 h-[2px] ${flowing ? "flow" : "bg-white/10"}`}
                  style={flowing ? ({ "--c": a.colour } as React.CSSProperties) : undefined}
                />
              )}
              <span className="relative z-10 rounded-full bg-[#020816] p-1">
                <Station id={a.id} colour={a.colour} state={state} />
              </span>
              <p className="mt-3 font-display text-sm font-bold">{a.name}</p>
              <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: a.colour }}>{a.role}</p>
              <div className="mt-3 min-h-[92px] w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-left text-xs">
                {busy ? (
                  here.slice(0, 2).map((o) => (
                    <Link key={o.id} href={`/admin/orders/${o.id}`} className="block hover:text-white">
                      <span className="block truncate font-semibold text-white">{o.business_name || o.id}</span>
                      <span className={`block ${stalled ? "text-red-light" : "text-white/55"}`}>
                        {a.id === "mik" ? "Waiting " : "Working "}
                        {since(o.updated_at, now)}
                        {stalled && " · stalled?"}
                      </span>
                    </Link>
                  ))
                ) : (
                  <span className="text-white/40">Idle{last ? ` · last active ${since(last.at, now)} ago` : ""}</span>
                )}
                {busy && last && last.order_id === here[0].id && <span className="mt-2 block line-clamp-3 text-white/70">{last.message}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
