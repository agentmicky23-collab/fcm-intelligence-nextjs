import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OrderForm } from "@/components/OrderForm";
import { Container, Eyebrow } from "@/components/ui";
import { isOrderTier, orderTiers } from "@/lib/checkout";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMeta("/reports/order", "Order a report", "Tell me about the branch you're looking at and pay securely. VAT is added at checkout."),
  robots: { index: false },
};

export default async function OrderPage(props: PageProps<"/reports/order">) {
  const { report, cancelled } = await props.searchParams;
  const tier = isOrderTier(report) ? report : "insight";
  // Until online payment is switched on, orders go through the enquiry form.
  if (!process.env.STRIPE_SECRET_KEY) redirect(`/contact?service=${orderTiers[tier].service}`);

  return (
    <section>
      <Container className="grid gap-14 py-20 md:grid-cols-[1fr_1.5fr] md:py-24">
        <div>
          <Eyebrow>Order a report</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-[-0.02em] text-navy">Tell me about the branch.</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            A name and postcode is enough to start. Add the listing link if you have one, then pay on the next page.
          </p>
          <ul className="mt-8 space-y-3 text-[15px] text-ink">
            {[
              "Prices are plus VAT, shown on its own line at checkout",
              "You get a receipt and a VAT invoice by email",
              "I'll email you if I need anything else from you",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-[7px] h-2.5 w-1.5 shrink-0 -skew-x-[18deg] bg-red" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-line bg-white p-7 sm:p-10">
          <OrderForm initialTier={tier} cancelled={cancelled === "1"} />
        </div>
      </Container>
    </section>
  );
}
