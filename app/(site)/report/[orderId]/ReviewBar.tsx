import type { Tier } from "@/lib/report";
import type { ReportCheck } from "@/lib/report-check";

/** Mikesh's bar above a report preview: what the customer will see, the automatic check, and the button to send it. */
export function ReviewBar({ orderId, token, status, tier, email, deliveredAt, asCustomer, check }: {
  orderId: string;
  token: string;
  status: string;
  tier: Tier;
  email: string;
  deliveredAt: string | null;
  asCustomer: boolean;
  check: ReportCheck;
}) {
  const sent = status === "delivered";
  const base = `/report/${encodeURIComponent(orderId)}?review=${token}`;
  return (
    <div className="no-print bg-navy text-white">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <p className="text-sm">
          <span className="font-semibold">Preview for Mikesh.</span>{" "}
          {asCustomer
            ? `Showing exactly what the customer sees (${tier === "intelligence" ? "Intelligence, all 15 sections" : "Insight, 10 sections"}).`
            : tier === "intelligence"
              ? "Intelligence: the customer sees all 15 sections."
              : "Insight: the customer sees the 10 Insight sections; the others are marked here."}{" "}
          {sent ? <>Sent to {email}{deliveredAt ? ` on ${new Date(deliveredAt).toLocaleDateString("en-GB")}` : ""}.</> : <>Will go to {email}.</>}{" "}
          <a className="underline underline-offset-4" href={asCustomer ? base : `${base}&view=customer`}>{asCustomer ? "Show all sections" : "View as the customer"}</a>
        </p>
        {sent ? (
          <span className="border border-white/30 px-4 py-2 text-sm font-semibold">Sent</span>
        ) : (
          <form method="post" action={`/api/reports/${encodeURIComponent(orderId)}/approve`}>
            <input type="hidden" name="review" value={token} />
            <button type="submit" className="min-h-10 bg-red px-5 text-sm font-semibold text-white hover:bg-red-dark">Approve &amp; send to customer</button>
          </form>
        )}
      </div>
      {(check.critical.length > 0 || check.warnings.length > 0) && (
        <details className="border-t border-white/15">
          <summary className="mx-auto max-w-[1280px] cursor-pointer px-5 py-3 text-sm sm:px-8">
            Automatic check:{" "}
            {check.critical.length > 0 ? <span className="font-semibold text-red-200">{check.critical.length} problem{check.critical.length > 1 ? "s" : ""} to fix before sending</span> : <span className="font-semibold">no blocking problems</span>}
            {check.warnings.length > 0 && `, ${check.warnings.length} warning${check.warnings.length > 1 ? "s" : ""}`}
            {check.computed.score !== null && ` · calculated overall ${check.computed.score} (${check.computed.grade}), ${check.computed.verdict}`}
          </summary>
          <ul className="mx-auto max-w-[1280px] space-y-1.5 px-5 pb-4 text-[13px] text-white/80 sm:px-8">
            {[...check.critical, ...check.warnings].slice(0, 40).map((i, n) => (
              <li key={n}>
                <span className={i.level === "critical" ? "font-semibold text-red-200" : "text-white/60"}>{i.level === "critical" ? "Fix" : "Note"}</span> · {i.where}: {i.problem}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
