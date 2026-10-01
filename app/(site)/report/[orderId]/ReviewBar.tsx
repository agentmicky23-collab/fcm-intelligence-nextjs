import type { Tier } from "@/lib/report";

/** Mikesh's bar above a report preview: what the customer will see, and the button to send it. */
export function ReviewBar({ orderId, token, status, tier, email, deliveredAt }: { orderId: string; token: string; status: string; tier: Tier; email: string; deliveredAt: string | null }) {
  const sent = status === "delivered";
  return (
    <div className="no-print bg-navy text-white">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <p className="text-sm">
          <span className="font-semibold">Preview for Mikesh.</span> {tier === "intelligence" ? "Intelligence: the customer sees all 15 sections." : "Insight: the customer sees the 10 Insight sections; the others are marked here."}{" "}
          {sent ? <>Sent to {email}{deliveredAt ? ` on ${new Date(deliveredAt).toLocaleDateString("en-GB")}` : ""}.</> : <>Will go to {email}.</>}
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
    </div>
  );
}
