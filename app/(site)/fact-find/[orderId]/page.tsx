import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FactFindForm } from "@/components/FactFindForm";
import { Container } from "@/components/ui";
import { checkFactFindToken, getFactFind, publishableKey, storageBase } from "@/lib/server/fact-find";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your fact find", robots: { index: false, follow: false } };

export default async function ClientFactFind({ params, searchParams }: { params: Promise<{ orderId: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { orderId } = await params;
  const { t } = await searchParams;
  if (!checkFactFindToken(orderId, t)) notFound();
  const ff = await getFactFind(orderId);
  if (!ff) notFound();
  const first = (ff.data.client?.name || ff.order.customer_name || "").split(" ")[0];
  return (
    <section className="bg-light py-12 md:py-16">
      <Container className="max-w-4xl">
        <p className="text-sm font-medium text-red">Your FCM report</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.02em] text-navy sm:text-4xl">{ff.order.business_name}: a few questions</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink">
          {first ? `Hi ${first}. ` : ""}Tell us what the seller or broker has given you, and upload any documents. It takes about 10 minutes and saves as you go.
          Leave blank anything you don&apos;t have: we never guess figures, the report will say what&apos;s still needed.
        </p>
        <div className="mt-10">
          <FactFindForm orderId={orderId} token={t ?? null} mode="client" initial={{ data: ff.data, files: ff.files, status: ff.status }} upload={{ base: storageBase(), key: ff.upload_key, apikey: publishableKey() }} />
        </div>
      </Container>
    </section>
  );
}
