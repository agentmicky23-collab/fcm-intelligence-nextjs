import type { Metadata } from "next";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { orderSummary } from "@/lib/server/emails/order";
import { getCheckoutSession, type CheckoutSession } from "@/lib/server/stripe";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMeta("/reports/thanks", "Thank you for your order", "Your report order is confirmed."),
  robots: { index: false },
};

async function lookup(id: unknown): Promise<CheckoutSession | null> {
  if (typeof id !== "string" || !/^cs_(live|test)_[A-Za-z0-9]+$/.test(id) || !process.env.STRIPE_SECRET_KEY) return null;
  try {
    return await getCheckoutSession(id);
  } catch {
    return null;
  }
}

export default async function ThanksPage(props: PageProps<"/reports/thanks">) {
  const { session_id } = await props.searchParams;
  const session = await lookup(session_id);
  const paid = session?.payment_status === "paid";
  const o = session ? orderSummary(session) : null;

  return (
    <section>
      <Container className="max-w-3xl py-20 md:py-28">
        <Eyebrow>{paid ? "Order confirmed" : "Thank you"}</Eyebrow>
        <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-[-0.02em] text-navy sm:text-5xl">
          {paid && o ? `Thanks${o.name ? `, ${o.name.split(" ")[0]}` : ""}. I'm on it.` : "Thanks for your order."}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          {paid && o
            ? `Your ${o.reportName} on ${o.business}${o.postcode ? `, ${o.postcode}` : ""} is paid for. A confirmation is on its way to ${o.email}, with your receipt and VAT invoice sent separately.`
            : "If your payment went through, a confirmation is on its way by email. If it doesn't arrive in the next few minutes, check your junk folder or get in touch."}
        </p>
        <div className="mt-10 border-l-[3px] border-red bg-light px-6 py-5 text-[15px] leading-relaxed text-ink">
          <p className="font-display font-semibold text-navy">What happens next</p>
          <p className="mt-2">
            I start the research on the branch and the area around it. If you have accounts, the remuneration figure or anything from the seller,
            reply to the confirmation email with it. I&apos;ll email you the finished report.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/reports/example">Read the example report</ButtonLink>
          <ButtonLink href="/resources" variant="navy">Free guides for buyers</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
