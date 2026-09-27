import type { Metadata } from "next";
import { JoinCta } from "@/components/JoinCta";
import { ButtonLink, Container, Eyebrow, PhotoPlaceholder } from "@/components/ui";
import { stats } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Mikesh Parekh",
  description:
    "Third-generation subpostmaster. 15 years. From one branch in Oldham to 43 Post Offices, a Banking Hub and two forecourts.",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-navy">
        <Container className="grid items-end gap-12 py-20 md:grid-cols-[1.3fr_1fr] md:py-24">
          <div>
            <Eyebrow>About</Eyebrow>
            <h1 className="mt-5 font-display text-4xl leading-tight text-white sm:text-5xl">Mikesh Parekh</h1>
            <p className="mt-5 max-w-xl text-xl leading-relaxed text-white/75">
              Third-generation subpostmaster. 15 years. From one branch to forty-three.
            </p>
          </div>
          <PhotoPlaceholder label="Portrait of Mikesh" className="aspect-square w-full max-w-sm md:ml-auto" />
        </Container>
      </section>

      <section>
        <Container className="grid gap-16 py-20 md:grid-cols-[1fr_16rem] md:py-24">
          <article className="prose-fcm max-w-2xl">
            <p>
              My dad took on a Post Office in Oldham. Six months in, he couldn&apos;t carry on, so I stepped in and kept it
              running. I didn&apos;t have a playbook. I did every job going: counter clerk, cleaner, bookkeeper, HR,
              manager, and learned it the hard way.
            </p>
            <p>
              That was 2011. Today my companies run 43 Post Office branches, a Banking Hub in Alsager and two petrol
              station forecourts, with just over 200 staff. In 2025 alone we took on ten Crown conversions, including
              Didsbury Village, Eccles, Leeds Markets and Old Swan. Over my career I&apos;ve operated more than 45 branches
              and seven forecourts, and I work directly with Post Office HQ as a strategic partner.
            </p>
            <p>
              It hasn&apos;t been a straight line. I&apos;ve been through robberies, threats, good years and genuinely bad
              ones, profit and debt in cycles.
            </p>
            <blockquote>
              Every time I lose I secretly win, because I discover a lesson within it I will never forget.
            </blockquote>
            <p>
              That&apos;s why I built FCM Intelligence. Buying a Post Office is easy. Buying the <em>right</em> one, at
              the right price, with your eyes open, is not. Most first-time buyers are working from a broker&apos;s
              listing and a gut feeling. I want them working from what I know: ask for five years of accounts, not three.
              Value the property separately from the business. Never spend your whole budget. And before you buy, ask
              what that high street will look like in five years.
            </p>
            <p>
              Everything on this site is here to help you make better decisions, and most of it is free. If you want me
              to look at your deal personally, I can do that too.
            </p>
            <p>
              Away from the branches you&apos;ll usually find me at the gym or on track. I race in the Fun Cup at circuits
              like Oulton Park, the one place where nothing else exists but the next corner.
            </p>
          </article>

          <aside className="space-y-6 md:pt-2">
            {stats.map((s) => (
              <div key={s.label} className="border-l-2 border-gold pl-4">
                <p className="font-display text-3xl text-navy">{s.value}</p>
                <p className="text-sm text-muted">{s.label}</p>
              </div>
            ))}
            <div className="pt-4">
              <ButtonLink href="/services" variant="navy" className="w-full">
                Work with me
              </ButtonLink>
            </div>
          </aside>
        </Container>
      </section>

      <JoinCta />
    </>
  );
}
