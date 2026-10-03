import Link from "next/link";
import { Container, Eyebrow, Slant } from "@/components/ui";

// The header for the members' tools: the Subpostmasters Management Suite.
const tools = [
  { href: "/tools/remuneration-analyser", label: "Remuneration Analyser" },
  { href: "/tools/branch-check", label: "Branch Check" },
];

export function SuiteHeader({ current, title, intro }: { current: string; title: string; intro: string }) {
  return (
    <section className="relative overflow-hidden bg-night">
      <Slant className="inset-y-0 right-[-12%] hidden w-[30%] bg-navy md:block" />
      <Slant className="inset-y-0 right-[16%] hidden w-[2.5%] bg-red md:block" />
      <Container className="relative py-12 md:py-14">
        <Eyebrow light>Subpostmasters Management Suite</Eyebrow>
        <nav aria-label="Suite tools" className="mt-4 flex flex-wrap gap-2">
          {tools.map((t) => (
            <Link key={t.href} href={t.href} aria-current={t.href === current ? "page" : undefined} className={`rounded-full px-4 py-1.5 text-sm ${t.href === current ? "bg-white font-semibold text-navy" : "border border-white/20 text-white/70 hover:text-white"}`}>
              {t.label}
            </Link>
          ))}
        </nav>
        <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/70">{intro}</p>
      </Container>
    </section>
  );
}
