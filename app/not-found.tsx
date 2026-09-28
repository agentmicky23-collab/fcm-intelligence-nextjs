import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ButtonLink, Container } from "@/components/ui";

const suggestions = [
  { href: "/insights", label: "Insights", line: "What I've learned running 43 branches" },
  { href: "/services", label: "Practice areas", line: "How I can help, and what it costs" },
  { href: "/reports", label: "Reports", line: "Insight and Intelligence reports on any branch" },
  { href: "/contact", label: "Get in touch", line: "Tell me where you are" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <Container className="max-w-3xl py-24 md:py-32">
          <p className="font-display text-6xl font-bold tracking-[-0.02em] text-red">404</p>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-[-0.02em] text-navy sm:text-4xl">That page isn&apos;t here.</h1>
          <p className="mt-4 text-lg text-muted">
            It may have moved when the site was rebuilt. One of these should get you where you were going.
          </p>
          <ul className="mt-10 grid gap-px bg-line sm:grid-cols-2">
            {suggestions.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="group block h-full bg-white p-6 transition-colors hover:bg-light">
                  <span className="font-display text-lg font-semibold text-navy group-hover:text-red-dark">{s.label} →</span>
                  <span className="mt-1 block text-sm text-muted">{s.line}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <ButtonLink href="/" variant="navy">Back to the homepage</ButtonLink>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
