"use client";

import { motion } from "motion/react";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { ease, inView } from "./anim";

const team = ["HR and people matters", "Bookkeeping and remuneration", "Regional managers watching performance", "Help buying and setting up new sites"];

/** Mikesh's team is built for 100 branches and runs 43: the spare capacity is the offer. */
export function Capacity() {
  return (
    <section className="bg-white">
      <Container className="grid items-center gap-14 py-20 md:grid-cols-[1.1fr_1fr] md:py-24">
        <div>
          <Eyebrow>My team, working for you</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-navy sm:text-[40px]">
            Built for 100 branches. Running 43.
          </h2>
          <p className="mt-5 max-w-[48ch] text-[17px] leading-relaxed text-muted">
            The days of running one shop are gone. With wages where they are, hiring your own managers is hard to justify until
            you&apos;re big, and until then you wear every hat yourself. I&apos;ve already built the team, and it has room. Use it to
            buy, run and grow your branches, at a fraction of the cost of employing your own management.
          </p>
          <ul className="mt-7 grid gap-3 text-[15px] text-ink sm:grid-cols-2">
            {team.map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-[7px] h-2.5 w-1.5 shrink-0 -skew-x-[18deg] bg-red" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-9">
            <ButtonLink href="/contact?service=shared-management">Talk to me about it</ButtonLink>
          </div>
        </div>
        <motion.div initial="hidden" whileInView="shown" viewport={inView} role="img" aria-label="Team capacity: built for 100 branches, 43 in use">
          <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-muted">Team capacity</p>
          <div className="relative mt-4 h-14 bg-navy">
            <motion.div
              className="absolute inset-y-0 left-0 w-[43%] origin-left bg-red"
              variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1, transition: { duration: 1.2, ease } } }}
            />
          </div>
          <div className="mt-3 flex justify-between font-display text-sm font-semibold">
            <span className="text-red-dark">43 branches run today</span>
            <span className="text-navy">Built for 100</span>
          </div>
          <p className="mt-8 text-[15px] leading-relaxed text-muted">
            Every year we let go of sites that don&apos;t pay their way and keep the ones that perform. Another ten Post Offices are
            in the pipeline, and there&apos;s still room for yours.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
