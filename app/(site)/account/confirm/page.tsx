import type { Metadata } from "next";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { rpc } from "@/lib/server/supabase";

export const metadata: Metadata = { title: "Confirm membership", robots: { index: false, follow: false } };

async function confirm(token: string) {
  if (!token || token.length > 64) return null;
  try {
    const res = await rpc("confirm_member", { p_token: token });
    if (!res.ok) {
      console.error("member: confirm failed", res.body.slice(0, 300));
      return null;
    }
    return (JSON.parse(res.body) as string | null) ?? null;
  } catch (err) {
    console.error("member: confirm failed", err);
    return null;
  }
}

export default async function ConfirmPage(props: PageProps<"/account/confirm">) {
  const { token } = await props.searchParams;
  const name = await confirm(typeof token === "string" ? token : "");

  return (
    <section>
      <Container className="max-w-2xl py-24 md:py-32">
        <span aria-hidden className="block h-6 w-3.5 -skew-x-[18deg] bg-red" />
        {name ? (
          <>
            <Eyebrow className="mt-8">Free membership</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-[-0.02em] text-navy sm:text-5xl">
              You&apos;re in, {name.split(" ")[0]}.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Your membership is confirmed. I&apos;ll email you each checklist and guide as it&apos;s ready, and a short note
              when I publish something worth reading.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/insights">Read the insights</ButtonLink>
              <ButtonLink href="/services/insurance-review" variant="outline">Try the free insurance review</ButtonLink>
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-8 font-display text-4xl font-bold tracking-[-0.02em] text-navy">That link has expired.</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Confirmation links last seven days. Join again and I&apos;ll send you a fresh one.
            </p>
            <div className="mt-10">
              <ButtonLink href="/account">Join free</ButtonLink>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
