import type { Metadata } from "next";
import { RemunerationAnalyser } from "@/components/tools/RemunerationAnalyser";
import { ButtonLink, Container, Eyebrow, Slant } from "@/components/ui";
import { isAdmin } from "@/lib/server/admin";

// Paid tool. Until payment is set up, only Mikesh (signed in to the control room) can use it;
// everyone else sees what it does.
export const metadata: Metadata = {
  title: "Remuneration Analyser",
  description: "See where your Post Office remuneration comes from and what extra business would be worth. Your statement never leaves your device.",
  robots: { index: false, follow: false },
};

const features = [
  ["Every line, every stream", "Mail, banking, travel, government services and the rest, with the share each one brings in and the rates you're paid."],
  ["What growth is worth", "Five more banking customers a week, £1,000 more currency, ten more parcels: move a slider and see the money a week and a year."],
  ["A year at a glance", "Add up to 13 statements and see the whole year, including the seasonal swings."],
  ["Private by design", "Your statement is read on your own device. It's never uploaded or stored."],
];

export default async function RemunerationAnalyserPage() {
  const allowed = await isAdmin();

  return (
    <>
      <section className="relative overflow-hidden bg-night">
        <Slant className="inset-y-0 right-[-12%] hidden w-[30%] bg-navy md:block" />
        <Slant className="inset-y-0 right-[16%] hidden w-[2.5%] bg-red md:block" />
        <Container className="relative py-14 md:py-16">
          <Eyebrow light>Tools for postmasters</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-5xl">Remuneration Analyser</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">See exactly where your Post Office money comes from, and what growing each service would be worth.</p>
        </Container>
      </section>

      <section className="bg-night">
        <Container className="pb-20">
          {allowed ? (
            <>
              <p className="mb-5 inline-block rounded-full border border-white/15 px-3 py-1 text-xs text-white/60">Preview: only you can see this until payment is switched on.</p>
              <RemunerationAnalyser />
            </>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map(([t, d]) => (
                <div key={t} className="border border-white/10 bg-white/[0.03] p-6 text-white">
                  <p className="font-display text-lg font-bold">{t}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{d}</p>
                </div>
              ))}
              <div className="sm:col-span-2 mt-4 flex flex-wrap items-center gap-6">
                <p className="text-white/70">Coming soon for members.</p>
                <ButtonLink href="/contact">Ask me about it</ButtonLink>
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
