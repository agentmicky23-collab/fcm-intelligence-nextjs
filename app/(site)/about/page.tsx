import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Movement } from "@/components/about/Movement";
import { JoinCta } from "@/components/JoinCta";
import { ButtonLink, Container, Eyebrow, Slant } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Mikesh Parekh",
  description:
    "Fifteen years, up to 100 branches, 43 today and a management team built from scratch. A profile of the Post Office operator behind FCM Intelligence.",
};

const numbers = [
  { value: "15", label: "years operating Post Offices" },
  { value: "100", label: "branches run, at the peak" },
  { value: "43", label: "branches today" },
  { value: "200+", label: "staff" },
  { value: "10", label: "Crown conversions in 2025" },
  { value: "7", label: "forecourts run, 2 today" },
];

const team = [
  { role: "HR manager", line: "Contracts, TUPE and people matters, in-house" },
  { role: "Bookkeeper", line: "Accounts and remuneration, in-house" },
  { role: "Regional managers", line: "Branch performance across the estate" },
  { role: "Operational support", line: "Compliance, cash and day-to-day running" },
  { role: "Sales managers", line: "Retail and service growth" },
];

function Quote({ children, by = "Mikesh Parekh" }: { children: ReactNode; by?: string }) {
  return (
    <figure className="my-14 border-l-[3px] border-red pl-6 sm:pl-8">
      <p className="font-display text-2xl font-semibold leading-snug tracking-[-0.01em] text-navy sm:text-[28px]">&ldquo;{children}&rdquo;</p>
      <figcaption className="mt-4 text-sm text-muted">{by}</figcaption>
    </figure>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-night">
        <Slant className="inset-y-0 right-[-12%] hidden w-[34%] bg-navy md:block" />
        <Slant className="inset-y-0 right-[20%] hidden w-[3%] bg-red md:block" />
        <Slant className="inset-y-0 right-[25%] hidden w-[0.8%] bg-red/55 md:block" />
        <Container className="relative py-20 md:py-28">
          <Eyebrow light>Profile</Eyebrow>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-[56px]">
            He has done every job in a Post Office. Now his team runs 43 of them.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
            Fifteen years, up to 100 branches, robberies, closures and a management team built from scratch. A profile of
            Mikesh Parekh, the operator behind FCM Intelligence.
          </p>
        </Container>
      </section>

      <section className="border-b border-line bg-white">
        <dl className="mx-auto grid max-w-[1280px] grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-6">
          {numbers.map((n) => (
            <div key={n.label} className="flex flex-col-reverse bg-white px-5 py-7 sm:px-8">
              <dt className="mt-1 text-sm text-muted">{n.label}</dt>
              <dd className="font-display text-4xl font-bold tracking-[-0.03em] text-navy">{n.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <Container className="max-w-3xl py-16 md:py-20">
          <article className="prose-fcm">
            <h2 className="!mt-0">It started with six months in Oldham</h2>
            <p>
              In 2011, Mikesh Parekh&apos;s father took on a Post Office in Oldham. Six months later he couldn&apos;t carry on,
              and his son stepped in to keep the doors open. There was no handover pack and no head office to ring. Parekh
              served on the counter, cleaned the floors, did the books, dealt with the staff and managed the lot, often in the
              same day. He is the third generation of his family to work in Post Offices.
            </p>
            <p>
              It was an education nobody would choose, and it is why he still talks about branches from the counter up. Ask him
              about a Post Office and he starts with how the cash moves, who is on the rota and what customers are saying in the
              Google reviews. The asking price comes later.
            </p>

            <h2>Growth, and the other direction</h2>
            <p>
              From that one branch he built an operation that has, at its height, run up to 100 Post Office branches. Today it
              runs 43, alongside a Banking Hub in Alsager and two petrol station forecourts, with more than 200 staff. In 2025
              alone it took on ten Crown conversions, branches previously run directly by Post Office, including Didsbury
              Village, Eccles, Leeds Markets and Old Swan.
            </p>
            <p>
              The numbers haven&apos;t only gone up. Of the seven forecourts he has run, two remain. Branches have been opened,
              turned around, sold and, when they stopped working, closed. Parekh is unusually open about that. He has been through
              robberies and threats, good years and genuinely bad ones, with profit and debt coming in cycles. With three Post
              Offices, he says, he could have lived simply. With everything he has built, it is harder: bigger businesses, bigger
              bills and a tough economy.
            </p>
          </article>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="grid gap-12 py-16 md:grid-cols-[0.8fr_1.2fr] md:py-20">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-navy">Growth isn&apos;t a straight line.</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Businesses are opened, grown, sold and sometimes closed. Over fifteen years, Parekh&apos;s team has done all four,
              which is exactly the experience a buyer needs on their side.
            </p>
          </div>
          <Movement />
        </Container>
      </section>

      <section>
        <Container className="max-w-3xl py-16 md:py-20">
          <article className="prose-fcm">
            <Quote>Every time I lose I secretly win, because I discover a lesson within it which I will never forget.</Quote>
            <p>
              That is the part of the story first-time buyers rarely hear, and the part he thinks matters most. &ldquo;It is very
              easy to purchase it,&rdquo; he says of a Post Office. &ldquo;It is very, very tough to sell it.&rdquo;
            </p>

            <h2>From doing every job to building a team</h2>
            <p>
              For years, Parekh was the whole management structure. As the business grew, that stopped being possible, and he
              built the team that runs it now. Firstclass Managerial Ltd, the FCM in FCM Intelligence, is a management team of
              professionals who have operated Post Offices and retail businesses for the past decade.
            </p>
            <p>
              That team is the difference between his advice and an opinion. A question about staffing, TUPE, accounts or
              compliance is answered by people who deal with it across 43 branches every week.
            </p>
          </article>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-night text-white">
        <Container className="py-16 md:py-20">
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em]">The team behind the advice</h2>
          <div className="mt-10 flex flex-col items-center">
            <div className="border border-white/20 bg-navy px-8 py-5 text-center">
              <p className="font-display text-lg font-semibold">Mikesh Parekh</p>
              <p className="text-sm text-white/60">Founder, Firstclass Managerial Ltd</p>
            </div>
            <span aria-hidden className="h-8 w-px bg-white/30" />
            <span aria-hidden className="hidden h-px w-[80%] bg-white/30 lg:block" />
            <ul className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
              {team.map((t) => (
                <li key={t.role} className="relative border-t-[3px] border-red bg-white/[0.04] p-5 lg:mt-8">
                  <span aria-hidden className="absolute -top-[35px] left-1/2 hidden h-8 w-px bg-white/30 lg:block" />
                  <p className="font-display font-semibold">{t.role}</p>
                  <p className="mt-1 text-sm text-white/60">{t.line}</p>
                </li>
              ))}
            </ul>
            <span aria-hidden className="h-8 w-px bg-white/30" />
            <div className="border border-red/60 px-8 py-4 text-center">
              <p className="font-display font-semibold">43 branches · 200+ staff</p>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="max-w-3xl py-16 md:py-20">
          <article className="prose-fcm">
            <h2 className="!mt-0">How he thinks about a branch</h2>
            <p>
              His rules are cautious, which surprises people who expect a salesman. Never spend your whole budget: with
              £200,000, buy at around £150,000 and keep 35 to 40 per cent back for the surprises that always come. Ask for five
              years of accounts and remuneration statements, not three. Value the property separately from the business,
              because a business valuer isn&apos;t a property valuer. Prefer freehold where you can, because rent reviews quietly
              eat margin. And before you buy, ask what the high street will look like in five years.
            </p>
            <p>
              He is just as direct about running one. Spend a day a week out of the branch, seeing what staff and customers see.
              Treat Google reviews as free advice on what to fix. Fix what you have before chasing the next site.
            </p>
            <Quote>
              You need to zoom out. If you&apos;re in the deep end, time can fly, your whole year&apos;s gone, and you&apos;ve not got
              anywhere. You&apos;ve just been busy.
            </Quote>

            <h2>Off the clock</h2>
            <p>
              Parekh has a life outside the branches, and he keeps most of it that way. What he does share is motorsport. He has
              wanted to race since he was a boy, earned his racing licence in 2025 and now competes in the Fun Cup, at circuits
              including Oulton Park. The rest of his weekends go on the gym, family and friends.
            </p>
            <Quote>When I get into a car and I drive, I am in full control of that vehicle. For that moment in time, I feel completely free.</Quote>

            <h2>Why FCM Intelligence</h2>
            <p>
              Parekh started FCM Intelligence because he kept meeting buyers working from a broker&apos;s listing and a gut
              feeling. The reports, insights and consultations are his way of passing on what he learned the expensive way:
              straight answers from someone who runs Post Offices every day, backed by a team that has seen most problems before.
            </p>
          </article>
          <div className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Book a consultation</ButtonLink>
            <ButtonLink href="/insights" variant="outline">Read his insights</ButtonLink>
          </div>
        </Container>
      </section>

      <JoinCta />
    </>
  );
}
