import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { checkReport } from "@/lib/report-check";
import { isOrderTier } from "@/lib/checkout";
import { normalise, num, str, strs } from "@/lib/report-data";
import { adminEvents, adminOrders, isAdmin, requestTime } from "@/lib/server/admin";
import { getReport, reportPath } from "@/lib/server/reports";
import { agents, isActive, itemStates, minutesSince, oracleChecks, sageSections, scoutSources, sentinelChecks, since, STALL_MINUTES, stationTimes } from "@/lib/pipeline-view";
import { AutoRefresh } from "../../_ui/AutoRefresh";
import { Station } from "../../_ui/Floor";
import { AgentIcon } from "../../_ui/icons";
import { Checklist, Feed, StatusChip, stationStates } from "../../_ui/Parts";

export const dynamic = "force-dynamic";

function Panel({ id, title, sub, children, right }: { id: string; title: string; sub: string; children: React.ReactNode; right?: React.ReactNode }) {
  const a = agents.find((x) => x.id === id);
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: `${a?.colour ?? "#888"}22`, color: a?.colour }}>
          <AgentIcon id={id} />
        </span>
        <div className="flex-1">
          <p className="font-display text-base font-bold">{title}</p>
          <p className="text-xs text-white/50">{sub}</p>
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

export default async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  if (!(await isAdmin())) redirect("/admin");
  const { orderId } = await params;
  const [orders, events, stored] = await Promise.all([adminOrders(), adminEvents(orderId, 1000), getReport(orderId)]);
  const o = orders.find((x) => x.id === orderId);
  if (!o) notFound();

  const now = await requestTime();
  const stalled = isActive(o.status) && minutesSince(o.updated_at, now) > STALL_MINUTES;
  const states = stationStates(o);
  const times = stationTimes(events, o.timeline);
  const report = stored ? normalise(stored.report) : null;
  const check = stored ? checkReport(stored.report, { orderId, tier: isOrderTier(stored.tier) ? stored.tier : "insight" }) : null;
  const summary = (o.approval_summary ?? {}) as Record<string, unknown>;

  const scout = itemStates(events, "scout");
  const sections = itemStates(events, ["sage", "sentinel"]);
  const sentinel = itemStates(events, "sentinel");
  const oracle = itemStates(events, "oracle");
  const sectionGrade = (key: string) => {
    const s = report?.sections[key as keyof typeof report.sections];
    if (!s) return null;
    const g = str(s.grade);
    const sc = num(s.score);
    return g ? `${g}${sc !== null ? ` ${sc}` : ""}` : s.score === null ? "Not scored (gap or unscored section)" : null;
  };
  const counts = (m: Map<string, { state: string }>) => {
    const v = [...m.values()];
    return `${v.filter((x) => x.state === "pass").length} passed · ${v.filter((x) => x.state === "fail" || x.state === "error").length} failed · ${v.filter((x) => x.state === "gap").length} gaps`;
  };

  const summaryGroups: [string, string[]][] = [
    ["Needs your judgement", strs(summary.needs_mik_judgement)],
    ["Data that wasn't available", strs(summary.data_gaps)],
    ["FCM estimates", strs(summary.estimates)],
    ["Documents pending", strs(summary.documents_pending)],
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-8">
      <header className="flex flex-wrap items-center gap-4 border-b border-white/10 py-5">
        <Link href="/admin" className="text-sm text-white/60 hover:text-white">← Control room</Link>
        <span className="flex-1" />
        <AutoRefresh />
      </header>

      <section className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-white/45">{o.id} · {o.report_tier === "intelligence" ? "Intelligence" : "Insight"} report</p>
          <h1 className="mt-1 font-display text-3xl font-bold">{o.business_name || "Unnamed business"}</h1>
          <p className="mt-1 text-sm text-white/60">{[o.business_town, o.business_postcode].filter(Boolean).join(", ")} · paid {since(o.created_at, now)} ago</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusChip status={o.status} stalled={stalled} />
            {o.overall_grade && <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold">{o.overall_grade} {o.overall_score ?? ""} · {o.overall_verdict}</span>}
          </div>
          {o.error_message && <p className="mt-3 max-w-3xl rounded-lg border border-red/40 bg-red/10 p-3 text-sm text-red-light">{o.error_message}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/orders/${o.id}/fact-find`} className="border border-white/20 px-4 py-2.5 text-sm hover:bg-white/10">{o.status === "fact_find" ? "Fill in the fact find" : "Fact find"}</Link>
        </div>
        {stored && (
          <div className="flex flex-wrap gap-2">
            <a href={reportPath(o.id, "review")} className="bg-red px-4 py-2.5 text-sm font-semibold hover:bg-red-dark">Open the report</a>
            <a href={`${reportPath(o.id, "review")}&view=customer`} className="border border-white/20 px-4 py-2.5 text-sm hover:bg-white/10">As the customer sees it</a>
          </div>
        )}
      </section>

      <section className="mt-8 overflow-x-auto">
        <ol className="grid min-w-[760px] grid-cols-6">
          {agents.map((a, i) => {
            const t = times[a.id];
            return (
              <li key={a.id} className="relative flex flex-col items-center text-center">
                {i > 0 && <span aria-hidden className={`absolute left-[-50%] right-[50%] top-8 h-[2px] ${states[i] === "working" || states[i] === "waiting" ? "flow" : states[i] === "done" ? "bg-emerald-400/50" : "bg-white/10"}`} style={{ "--c": a.colour } as React.CSSProperties} />}
                <span className="relative z-10 rounded-full bg-[#020816] p-1"><Station id={a.id} colour={a.colour} state={states[i]} /></span>
                <p className="mt-2 text-sm font-bold">{a.name}</p>
                <p className="text-[11px] text-white/50">
                  {t?.start ? (t.end && t.end !== t.start ? since(t.start, Date.parse(t.end)) : `at ${new Date(t.start).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" })}`) : "—"}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel id="scout" title="Scout: research" sub={`17 sources · ${counts(scout)}`}>
          <Checklist items={scoutSources} states={scout} />
        </Panel>

        <Panel id="sage" title="Sage: writing, checked section by section" sub={`15 sections · ${counts(sections)}`}>
          <Checklist items={sageSections} states={sections} extra={sectionGrade} />
        </Panel>

        <Panel id="sentinel" title="Sentinel: checks" sub="Pack review, then checks A to G on the whole report">
          <Checklist items={sentinelChecks} states={sentinel} />
        </Panel>

        <Panel
          id="website"
          title="Website: automatic check"
          sub={check ? "Run now on the report as stored" : "No report uploaded yet"}
          right={check && <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${check.ok ? "bg-emerald-400/15 text-emerald-300" : "bg-red/20 text-red-light"}`}>{check.ok ? "Passes" : `${check.critical.length} critical`}</span>}
        >
          {check ? (
            <div className="space-y-3 text-sm">
              <p>
                Calculated: <b>{check.computed.score ?? "no score"}</b> · <b>{check.computed.grade ?? "no grade"}</b> · <b>{check.computed.verdict ?? "no verdict"}</b>
                {check.computed.caps.length > 0 && <span className="text-white/60"> ({check.computed.caps.join("; ")})</span>}
              </p>
              {check.critical.length > 0 && (
                <ul className="space-y-1.5">
                  {check.critical.slice(0, 12).map((c, i) => (
                    <li key={i} className="rounded-md border border-red/30 bg-red/10 px-3 py-2 text-xs">
                      <span className="text-red-light">{c.where}</span>: {c.problem}
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-white/50">{check.warnings.length} warnings{report ? ` · ${(o.report_bytes ?? 0) > 0 ? `${Math.round((o.report_bytes ?? 0) / 1024)} KB` : ""}` : ""}</p>
            </div>
          ) : (
            <p className="text-sm text-white/50">The check runs as soon as the report is uploaded.</p>
          )}
        </Panel>

        <Panel id="oracle" title="Oracle: final read on the live page" sub={`10-point read · ${counts(oracle)}`}>
          <Checklist items={oracleChecks} states={oracle} />
        </Panel>

        <Panel id="mik" title="For you" sub="What the agents want you to know before you approve">
          <div className="space-y-4 text-sm">
            {summaryGroups.some(([, v]) => v.length) ? (
              summaryGroups.filter(([, v]) => v.length).map(([title, items]) => (
                <div key={title}>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">{title}</p>
                  <ul className="mt-1.5 list-disc space-y-1 pl-5 text-white/80">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>
                </div>
              ))
            ) : (
              <p className="text-white/50">The approval summary appears once Sentinel and Oracle have written it.</p>
            )}
            {str(summary.retries_used) && <p className="text-xs text-white/50">Rounds used: {str(summary.retries_used)}</p>}
          </div>
        </Panel>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-lg font-bold">Everything that happened</h2>
        <Feed events={events} showOrder={false} limit={1000} />
      </section>
    </div>
  );
}
