import type { ReactNode } from "react";
import { arr, mapsOf, num, rec, str, strs, type Rec, type Report } from "@/lib/report-data";
import { Badge, Bars, Callout, Cards, Heading, List, Para, Pictures, StatBoxes, Table, View } from "./parts";

// One renderer per section of fcm-report-schema-v2. Every field the agents write is shown somewhere.

const money = (v: unknown) => {
  const n = num(v);
  return n === null ? str(v) : `£${n.toLocaleString("en-GB")}`;
};

function S1({ s }: { s: Rec }) {
  const scores = arr(s.category_scores)
    .map((c) => ({ label: str(c.category), value: num(c.score) ?? 0, grade: str(c.grade) }))
    .filter((c) => c.label);
  return (
    <>
      <StatBoxes items={s.stat_boxes} />
      {(str(s.verdict) || str(s.verdict_detail)) && (
        <div className="border-l-[3px] border-red pl-5">
          <p className="font-display text-xl font-bold text-navy">{str(s.verdict)}</p>
          <p className="mt-2 max-w-3xl leading-relaxed text-ink">{str(s.verdict_detail)}</p>
        </div>
      )}
      <Bars title="Scores by area" rows={scores.map((c) => ({ label: `${c.label}${c.grade ? ` (${c.grade})` : ""}`, value: c.value }))} />
      <div className="grid gap-8 lg:grid-cols-2">
        <Cards title="Strengths" items={s.strengths} tone="good" />
        <Cards title="Concerns" items={s.concerns} tone="bad" />
      </div>
      <View text={str(s.assessment_quote)} />
    </>
  );
}

function S2({ s }: { s: Rec }) {
  const status = str(s.data_status);
  const statusText: Record<string, string> = { verified: "Based on verified accounts", listing_only: "Based on the sale listing only", unavailable: "No financial data was available" };
  return (
    <>
      {status && <p><Badge value={statusText[status] ?? status} /></p>}
      {num(s.asking_price) !== null && (
        <p className="font-display text-3xl font-bold text-navy">{money(s.asking_price)} <span className="text-base font-normal text-muted">asking price</span></p>
      )}
      <Table title="What the asking price includes" rows={s.asking_price_components} cols={[{ key: "component", label: "Component", strong: true }, { key: "value", label: "Value" }, { key: "notes", label: "Notes" }]} />
      <Table title="Against the benchmarks" rows={s.benchmark_comparison} cols={[{ key: "metric", label: "Measure", strong: true }, { key: "this_business", label: "This business" }, { key: "benchmark", label: "Benchmark" }, { key: "assessment", label: "Assessment" }]} />
      <FiledAccounts v={s.filed_accounts} />
      <Table title="What the seller has stated (not yet verified)" rows={s.listing_figures} cols={[{ key: "item", label: "Item", strong: true }, { key: "value", label: "Stated" }, { key: "source", label: "Where" }, { key: "note", label: "Note" }]} />
      <Table title="Where sources disagree" rows={s.source_conflicts} cols={[{ key: "item", label: "Item", strong: true }, { key: "source_a", label: "One source says" }, { key: "source_b", label: "Another says" }, { key: "action", label: "What to check" }]} />
      <Callout title="Gap in the financial information" text={str(s.financial_gap_warning)} />
      <View text={str(s.key_insight)} />
    </>
  );
}

function S3({ s }: { s: Rec }) {
  return (
    <>
      <StatBoxes items={s.stat_boxes} />
      <dl className="grid gap-4 sm:grid-cols-3">
        {[["Contract type", s.contract_type], ["Network status", s.network_status], ["Estimated Post Office income", s.est_po_income_range]].map(([l, v]) =>
          str(v) ? (
            <div key={l as string} className="border border-line bg-white p-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-muted">{l as string}</dt>
              <dd className="mt-1 font-medium text-navy">{str(v)}</dd>
            </div>
          ) : null,
        )}
      </dl>
      <Table title="Income streams" rows={s.income_streams} cols={[{ key: "service", label: "Service", strong: true }, { key: "percentage", label: "Share" }, { key: "est_annual", label: "Est. per year" }, { key: "trend", label: "Trend", badge: true }]} />
      <Callout title="Bank closure opportunity" text={str(s.bank_closure_opportunity)} />
      <View text={str(s.key_insight)} />
    </>
  );
}

function S4({ s }: { s: Rec }) {
  return (
    <>
      <Table title="Employment costs" rows={s.employment_costs} cols={[{ key: "component", label: "Cost", strong: true }, { key: "rate", label: "Rate" }, { key: "notes", label: "Notes" }]} />
      {(str(s.true_hourly_cost) || str(s.true_hourly_uplift)) && (
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 bg-light px-5 py-4">
          <span className="text-sm text-muted">True cost of an hour&apos;s staff time</span>
          <span className="font-display text-2xl font-bold text-navy">{str(s.true_hourly_cost)}</span>
          {str(s.true_hourly_uplift) && <span className="text-sm text-red-dark">{str(s.true_hourly_uplift)}</span>}
        </div>
      )}
      <WorkedExample v={s.worked_example} />
      <Table title="Hidden costs" rows={s.hidden_costs} cols={[{ key: "cost", label: "Cost", strong: true }, { key: "amount", label: "Amount" }, { key: "frequency", label: "How often" }]} />
      <Callout title="TUPE" text={str(s.tupe_note)} />
      <View text={str(s.key_insight)} />
    </>
  );
}

function Discrepancy({ v }: { v: unknown }) {
  const d = rec(v);
  if (!d.found && !str(d.detail)) return null;
  return (
    <Callout
      title="Address discrepancy"
      text={[str(d.detail), str(d.listing_address) && `Listing: ${str(d.listing_address)}`, str(d.actual_address) && `Actual: ${str(d.actual_address)}`].filter(Boolean).join(" · ")}
    />
  );
}

function S5({ s, report }: { s: Rec; report: Report }) {
  const listings = arr(s.google_business_listings);
  return (
    <>
      <Discrepancy v={s.address_discrepancy} />
      {listings.map((g, i) => (
        <div key={i} className="border border-line bg-white p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-semibold text-navy">{str(g.business_name)}</p>
            <p className="text-sm text-muted">
              <span className="font-display text-xl font-bold text-navy">{str(g.rating) || "-"}</span> ★ · {str(g.review_count) || 0} reviews
              {str(g.response_rate) && ` · replies to ${str(g.response_rate)}`}
            </p>
          </div>
          {str(g.address) && <p className="mt-1 text-sm text-muted">{str(g.address)}</p>}
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <List title="What customers like" items={strs(g.positive_themes)} />
            <List title="What they complain about" items={strs(g.negative_themes)} />
          </div>
        </div>
      ))}
      {num(s.combined_review_count) !== null && listings.length > 1 && <p className="text-sm text-muted">{str(s.combined_review_count)} reviews across all listings.</p>}
      <Table title="Social media" rows={s.social_media_audit} cols={[{ key: "platform", label: "Platform", strong: true }, { key: "status", label: "Status" }, { key: "assessment", label: "Assessment" }]} />
      <List title="Quick wins" items={strs(s.quick_wins)} />
      <Pictures title="Photos from Google" images={report.images.photos.slice(0, 4)} />
    </>
  );
}

function S6({ s, report }: { s: Rec; report: Report }) {
  const lc = rec(s.location_classification);
  return (
    <>
      <Discrepancy v={s.address_discrepancy} />
      {str(lc.type) && <Callout title={`Location type: ${str(lc.type)}`} text={str(lc.description)} />}
      <Pictures images={mapsOf(report, "location")} />
      <Pictures title="Street view" images={report.images.streetView} />
      <Table title="Nearby landmarks" rows={s.landmarks} cols={[{ key: "name", label: "Place", strong: true }, { key: "type", label: "Type" }, { key: "distance", label: "Distance" }, { key: "impact", label: "Impact", badge: true }, { key: "note", label: "Note" }]} />
      <Table title="Parking" rows={s.parking} cols={[{ key: "type", label: "Parking", strong: true }, { key: "distance", label: "Distance" }, { key: "availability", label: "Availability" }]} />
    </>
  );
}

function S7({ s }: { s: Rec }) {
  const c = rec(s.catchment_populations);
  const e = rec(s.economic_profile);
  const hi = rec(s.household_income_comparison);
  const pop = [["Within 500m", c.radius_500m], ["Within 1km", c.radius_1km], ["Within 3km", c.radius_3km], ["Households within 3km", c.households_3km]].filter(([, v]) => num(v) !== null);
  return (
    <>
      <StatBoxes items={s.stat_boxes} />
      {pop.length > 0 && <StatBoxes items={pop.map(([label, v]) => ({ label, value: (num(v) ?? 0).toLocaleString("en-GB") }))} />}
      <Bars
        title="Age profile"
        suffix="%"
        max={Math.max(30, ...arr(s.age_distribution).map((a) => Math.max(num(a.local_pct) ?? 0, num(a.national_pct) ?? 0)))}
        rows={arr(s.age_distribution).map((a) => ({ label: str(a.band), value: num(a.local_pct) ?? 0, compare: num(a.national_pct) ?? undefined }))}
      />
      {num(s.aged_50_plus_pct) !== null && (
        <p className="text-sm text-muted">Aged 50 and over: <span className="font-semibold text-navy">{str(s.aged_50_plus_pct)}%</span>{num(s.aged_50_plus_national) !== null && ` (national ${str(s.aged_50_plus_national)}%)`}</p>
      )}
      <Table
        title="Economic profile"
        rows={[
          { k: "Median income", v: [str(e.median_income), str(e.median_income_vs_national)].filter(Boolean).join(" · ") },
          { k: "Employment rate", v: str(e.employment_rate) },
          { k: "Home ownership", v: str(e.home_ownership) },
          { k: "Deprivation decile (1 = most deprived)", v: str(e.imd_decile) },
          { k: "Benefits claimants", v: str(e.benefits_claimant_rate) },
          { k: "Household income", v: num(hi.local) !== null ? `${money(hi.local)} locally vs ${money(hi.national)} nationally${str(hi.headline) ? ` · ${str(hi.headline)}` : ""}` : "" },
        ].filter((r) => r.v)}
        cols={[{ key: "k", label: "Measure", strong: true }, { key: "v", label: "This area" }]}
      />
      <Bars title="Housing" suffix="%" rows={arr(s.housing_breakdown).map((h) => ({ label: str(h.type), value: num(h.percentage) ?? 0 }))} />
      <Para label="Community character" text={str(s.community_character)} />
      <View text={str(s.key_insight)} />
    </>
  );
}

function S8({ s, report }: { s: Rec; report: Report }) {
  return (
    <>
      {str(s.overall_vs_average) && <p className="font-display text-xl font-semibold text-navy">{str(s.overall_vs_average)}</p>}
      <Table title="Recorded crime" rows={s.crime_data} cols={[{ key: "crime_type", label: "Type", strong: true }, { key: "incidents", label: "Incidents" }, { key: "vs_average", label: "Vs average" }, { key: "level", label: "Level", badge: true }, { key: "assessment", label: "Assessment" }]} />
      <Pictures title="Crime heatmap" images={mapsOf(report, "crime_heatmap")} />
      <Table title="Security recommendations" rows={s.security_recommendations} cols={[{ key: "item", label: "Measure", strong: true }, { key: "priority", label: "Priority", badge: true }, { key: "est_cost", label: "Est. cost" }, { key: "reasoning", label: "Why" }]} />
      <Para label="In practice" text={str(s.practical_context) || str(s.narrative)} />
    </>
  );
}

function S9({ s, report }: { s: Rec; report: Report }) {
  return (
    <>
      <StatBoxes items={s.stat_boxes} />
      <Callout title="The key distinction" text={str(s.key_distinction)} />
      <Pictures images={mapsOf(report, "competition")} />
      <Table title="Full-service Post Offices nearby" rows={s.full_service_pos} cols={[{ key: "branch_name", label: "Branch", strong: true }, { key: "address", label: "Address" }, { key: "distance", label: "Distance" }, { key: "type", label: "Type" }, { key: "threat_level", label: "Threat", badge: true }]} />
      <Table title="Drop-off and collection points" rows={s.drop_collect_points} cols={[{ key: "location", label: "Location", strong: true }, { key: "address", label: "Address" }, { key: "distance", label: "Distance" }, { key: "threat_level", label: "Threat", badge: true }]} />
      <Table title="Grocery competition" rows={s.grocery_competition} cols={[{ key: "name", label: "Store", strong: true }, { key: "type", label: "Type" }, { key: "distance", label: "Distance" }, { key: "threat_level", label: "Threat", badge: true }, { key: "notes", label: "Notes" }]} />
      <Table title="Bank closures" rows={s.bank_closures} cols={[{ key: "bank", label: "Bank", strong: true }, { key: "former_address", label: "Where" }, { key: "closure_date", label: "Closed" }]} />
      <Callout title="Bank closure opportunity" text={str(s.bank_closure_opportunity)} />
      <View text={str(s.competitive_positioning)} label="Competitive position" />
    </>
  );
}

function S10({ s, report }: { s: Rec; report: Report }) {
  return (
    <>
      <StatBoxes items={s.stat_boxes} />
      <Pictures images={mapsOf(report, "footfall")} />
      <Table title="What brings people past" rows={s.footfall_generators} cols={[{ key: "facility", label: "Place", strong: true }, { key: "type", label: "Type" }, { key: "distance", label: "Distance" }, { key: "impact", label: "Impact", badge: true }, { key: "daily_impact", label: "Daily effect" }]} />
      <Table title="A trading day" rows={s.trading_timeline} cols={[{ key: "time_slot", label: "Time", strong: true }, { key: "intensity", label: "How busy", badge: true }, { key: "drivers", label: "Why" }]} />
      <View text={str(s.key_insight)} />
    </>
  );
}

function S11({ s }: { s: Rec }) {
  return (
    <>
      <Table
        title="Broadband"
        rows={s.broadband}
        cols={[{ key: "provider", label: "Provider", strong: true }, { key: "technology", label: "Technology" }, { key: "max_speed", label: "Max speed" }, { key: "meets_po_requirement", label: "Meets Post Office minimum" }]}
      />
      {str(s.po_minimum_speed) && <p className="text-sm text-muted">Post Office minimum: {str(s.po_minimum_speed)}</p>}
      <Table
        title="Mobile coverage"
        rows={s.mobile_coverage}
        cols={[{ key: "network", label: "Network", strong: true }, { key: "indoor_4g", label: "4G indoors" }, { key: "outdoor_4g", label: "4G outdoors" }, { key: "has_5g", label: "5G" }]}
      />
      <Para label="Why it matters" text={str(s.why_it_matters)} />
      <View text={str(s.recommendation)} label="Recommendation" />
    </>
  );
}

function S12({ s }: { s: Rec }) {
  const timeline = arr(s.timeline_events).filter((t) => str(t.event));
  return (
    <>
      <StatBoxes items={s.stat_boxes} />
      <Table title="Developments" rows={s.developments} cols={[{ key: "development", label: "Development", strong: true }, { key: "type", label: "Type" }, { key: "distance", label: "Distance" }, { key: "status", label: "Status" }, { key: "impact", label: "Impact", badge: true }]} />
      {timeline.length > 0 && (
        <div>
          <Heading>Timeline</Heading>
          <ol className="mt-4 border-l-2 border-navy/15">
            {timeline.map((t, i) => (
              <li key={i} className="relative pb-5 pl-6 last:pb-0">
                <span aria-hidden className="absolute -left-[5px] top-1.5 h-2 w-2 bg-red" />
                <p className="text-sm font-semibold text-navy">{str(t.year)}</p>
                <p className="text-[15px] text-ink">{str(t.event)}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
      <Para label="The Post Office network" text={str(s.po_network_assessment)} />
      <div>
        {str(s.five_year_rating) && <p className="mb-2"><Badge value={str(s.five_year_rating)} /></p>}
        <Para label="The next five years" text={str(s.five_year_assessment)} />
      </div>
    </>
  );
}

function S13({ s }: { s: Rec }) {
  const grid = arr(s.risk_grid);
  return (
    <>
      {grid.length > 0 && (
        <ul className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3">
          {grid.map((g, i) => (
            <li key={i} className="flex flex-col gap-2 bg-white p-4">
              <Badge value={g.status} />
              <span className="font-semibold text-navy">{str(g.category)}</span>
              <span className="text-sm text-muted">{str(g.label)}</span>
            </li>
          ))}
        </ul>
      )}
      <Table title="The risks in detail" rows={s.detailed_risks} cols={[{ key: "category", label: "Area", strong: true }, { key: "status", label: "Status", badge: true }, { key: "risk", label: "Risk" }, { key: "mitigation", label: "How to manage it" }, { key: "dealbreaker", label: "Walk away if" }]} />
      {(str(s.overall_verdict) || str(s.overall_verdict_detail)) && (
        <div className="border-l-[3px] border-red pl-5">
          <p className="font-display text-xl font-bold text-navy">{str(s.overall_verdict)}</p>
          <p className="mt-2 max-w-3xl leading-relaxed text-ink">{str(s.overall_verdict_detail)}</p>
        </div>
      )}
    </>
  );
}

function S14({ s }: { s: Rec }) {
  return (
    <>
      <Table title="Opportunities" rows={s.opportunities} cols={[{ key: "action", label: "Action", strong: true }, { key: "cost", label: "Cost" }, { key: "annual_benefit", label: "Benefit per year" }, { key: "priority", label: "Priority", badge: true }, { key: "evidence", label: "Evidence", render: (r) => [str(r.evidence), str(r.evidence_section) && `(${str(r.evidence_section)})`].filter(Boolean).join(" ") || "-" }]} />
      <Table title="Quick wins" rows={s.quick_wins} cols={[{ key: "timeframe", label: "When", strong: true }, { key: "action", label: "Action" }]} />
      <View text={str(s.biggest_quick_win)} label="Biggest quick win" />
    </>
  );
}

function S15({ s }: { s: Rec }) {
  const q = rec(s.seller_questions);
  const offer = rec(s.negotiating_range ?? s.suggested_offer_range);
  const neg = rec(s.negotiation);
  const bands = (["low", "mid", "high"] as const).map((k) => ({ k, range: str(rec(offer[k]).range), reasoning: str(rec(offer[k]).reasoning) })).filter((b) => b.range);
  return (
    <>
      <Table title="Documents to ask for" rows={s.documents_checklist} cols={[{ key: "document", label: "Document", strong: true }, { key: "priority", label: "Priority", badge: true }, { key: "purpose", label: "Why" }]} />
      <div className="grid gap-8 lg:grid-cols-3">
        <List title="Questions on the money" items={strs(q.financial)} />
        <List title="Questions on the operation" items={strs(q.operational)} />
        <List title="Questions on the property" items={strs(q.property)} />
      </div>
      <List title="Questions for the landlord" items={strs(s.landlord_questions)} />
      {bands.length > 0 && (
        <div>
          <Heading>Negotiating range (FCM view, not a valuation)</Heading>
          <div className="mt-3 grid gap-px border border-line bg-line sm:grid-cols-3">
            {bands.map((b) => (
              <div key={b.k} className={`bg-white p-5 ${b.k === "mid" ? "border-t-[3px] border-red" : ""}`}>
                <p className="text-xs uppercase tracking-[0.12em] text-muted">{b.k === "low" ? "Opening offer" : b.k === "mid" ? "Target" : "Walk-away"}</p>
                <p className="mt-1 font-display text-xl font-bold text-navy">{str(b.range)}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{str(b.reasoning)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-2">
        <Para label="Your leverage" text={str(neg.buyer_leverage)} />
        <Para label="The seller's leverage" text={str(neg.seller_leverage)} />
      </div>
      <View text={str(neg.approach)} label="How to approach it" />
    </>
  );
}

/** Section 2: the company's filed accounts from Companies House, when found. */
function FiledAccounts({ v }: { v: unknown }) {
  const f = rec(v);
  if (!str(f.company_name) && !str(f.status)) return null;
  const years = arr(f.years);
  const money2 = (x: unknown) => (num(x) === null ? "-" : `£${num(x)!.toLocaleString("en-GB")}`);
  const rows: [string, string][] = [
    ["Net assets", "net_assets"], ["Cash", "cash"], ["Owed within a year", "creditors"], ["Turnover", "turnover"], ["Gross profit", "gross_profit"], ["Staff costs", "staff_costs"], ["Employees", "employees"],
  ];
  const shown = rows.filter(([, k]) => years.some((y) => num(y[k]) !== null));
  return (
    <div className="border border-line bg-white p-5">
      <Heading>Filed accounts (Companies House)</Heading>
      <p className="mt-2 text-sm text-muted">
        {[str(f.company_name), str(f.company_number) && `no. ${str(f.company_number)}`, str(f.status), str(f.accounts_type) && `${str(f.accounts_type)} accounts`].filter(Boolean).join(" · ")}
      </p>
      {years.length > 0 && shown.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-navy text-navy">
                <th className="py-2 pr-4 font-semibold">Year ending</th>
                {years.map((y, i) => <th key={i} className="py-2 pr-4 font-semibold">{str(y.period_end)}</th>)}
              </tr>
            </thead>
            <tbody>
              {shown.map(([label, k]) => (
                <tr key={k} className="border-b border-line">
                  <td className="py-2 pr-4 font-medium text-navy">{label}</td>
                  {years.map((y, i) => <td key={i} className="py-2 pr-4 text-ink">{k === "employees" ? str(y[k]) || "-" : money2(y[k])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <List title="Points to note" items={strs(f.red_flags)} />
      {str(f.note) && <p className="mt-3 text-sm text-muted">{str(f.note)}</p>}
    </div>
  );
}

/** Section 4: one employee's real cost, from the cost-to-employer calculation. */
function WorkedExample({ v }: { v: unknown }) {
  const w = rec(v);
  if (num(w.hourly_rate) === null) return null;
  const rows: [string, unknown][] = [
    ["Wage", w.hourly_rate], ["Holiday pay", w.holiday_per_hour], ["Employer National Insurance", w.ni_per_hour], ["Employer pension", w.pension_per_hour],
  ];
  return (
    <div className="bg-light p-5">
      <Heading>What one {str(w.hours_per_week)}-hour-a-week employee really costs</Heading>
      <table className="mt-3 w-full max-w-md text-sm">
        <tbody>
          {rows.filter(([, x]) => num(x) !== null).map(([l, x]) => (
            <tr key={l} className="border-b border-line"><td className="py-2 text-ink">{l}</td><td className="py-2 text-right font-medium text-navy">£{num(x)!.toFixed(2)}/hr</td></tr>
          ))}
          <tr><td className="py-2 font-semibold text-navy">True cost per hour worked</td><td className="py-2 text-right font-display text-xl font-bold text-navy">£{(num(w.cost_per_worked_hour) ?? 0).toFixed(2)}</td></tr>
        </tbody>
      </table>
      {num(w.annual_cost) !== null && <p className="mt-2 text-sm text-muted">£{Math.round(num(w.annual_cost)!).toLocaleString("en-GB")} a year in total{str(w.uplift) ? `, ${str(w.uplift)} above the hourly rate` : ""}.</p>}
    </div>
  );
}

export const sectionBodies: Record<number, (p: { s: Rec; report: Report }) => ReactNode> = {
  1: S1, 2: S2, 3: S3, 4: S4, 5: S5, 6: S6, 7: S7, 8: S8, 9: S9, 10: S10, 11: S11, 12: S12, 13: S13, 14: S14, 15: S15,
};
