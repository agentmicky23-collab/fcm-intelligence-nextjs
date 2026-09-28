import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = { title: "Membership confirmed", robots: { index: false, follow: false } };

export default async function ConfirmPage(props: PageProps<"/account/confirm">) {
  const { token, welcome } = await props.searchParams;
  // Links in the first confirmation emails pointed here directly.
  if (typeof token === "string") redirect(`/api/member/confirm?token=${encodeURIComponent(token)}`);
  const name = typeof welcome === "string" ? welcome.slice(0, 40) : "";

  return (
    <section>
      <Container className="max-w-2xl py-24 md:py-32">
        <span aria-hidden className="block h-6 w-3.5 -skew-x-[18deg] bg-red" />
        {name ? (
          <>
            <Eyebrow className="mt-8">Free membership</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-[-0.02em] text-navy sm:text-5xl">You&apos;re in, {name}.</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Your membership is confirmed and the members&apos; library is open on this device. Every checklist, worksheet and
              guide is waiting for you there.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/resources">Open the library</ButtonLink>
              <ButtonLink href="/insights" variant="outline">Read the insights</ButtonLink>
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-8 font-display text-4xl font-bold tracking-[-0.02em] text-navy">That link has expired.</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">Confirmation links last seven days. Join again and I&apos;ll send you a fresh one.</p>
            <div className="mt-10">
              <ButtonLink href="/account">Join free</ButtonLink>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
