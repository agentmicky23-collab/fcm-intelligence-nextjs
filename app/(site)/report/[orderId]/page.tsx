import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReportView } from "@/components/report/live/ReportView";
import { normalise } from "@/lib/report-data";
import { isOrderTier } from "@/lib/checkout";
import { checkToken, getReport } from "@/lib/server/reports";
import { ReviewBar } from "./ReviewBar";

// A finished report. Customers open it with their private link (?t=…); Mikesh previews it with ?review=….
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your report", robots: { index: false, follow: false } };

export default async function Page(props: { params: Promise<{ orderId: string }>; searchParams: Promise<{ t?: string; review?: string }> }) {
  const { orderId } = await props.params;
  const { t, review } = await props.searchParams;
  const reviewing = checkToken(orderId, review, "review");
  if (!reviewing && !checkToken(orderId, t, "view")) notFound();

  const stored = await getReport(orderId);
  if (!stored) notFound();
  const report = normalise(stored.report);
  const tier = isOrderTier(stored.tier) ? stored.tier : "insight";

  return (
    <ReportView
      report={report}
      tier={tier}
      orderId={orderId}
      showAll={reviewing}
      banner={reviewing ? <ReviewBar orderId={orderId} token={review!} status={stored.status} tier={tier} email={stored.customer_email} deliveredAt={stored.delivered_at} /> : undefined}
    />
  );
}
