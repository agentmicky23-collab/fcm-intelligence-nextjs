"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ease, inView } from "./anim";

function Card({ tag, title, href, cta, children }: { tag: string; title: string; href: string; cta: string; children: ReactNode }) {
  return (
    <motion.div initial="hidden" whileInView="shown" viewport={inView}>
      <Link href={href} className="group flex h-full flex-col bg-navy p-8 transition-colors hover:bg-navy-700">
        <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-white/55">{tag}</p>
        <div className="mt-8" aria-hidden>{children}</div>
        <p className="mt-8 font-display text-xl font-semibold leading-snug">{title}</p>
        <span className="mt-auto pt-6 text-sm text-white/70 group-hover:text-white">
          {cta} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </span>
      </Link>
    </motion.div>
  );
}

const grow = (delay = 0) => ({ hidden: { scaleX: 0 }, shown: { scaleX: 1, transition: { duration: 1, ease, delay } } });
const rise = (delay = 0) => ({ hidden: { scaleY: 0 }, shown: { scaleY: 1, transition: { duration: 0.7, ease, delay } } });

/** Three of Mikesh's buying rules, each drawn as a small diagram. */
export function Rules() {
  return (
    <section className="bg-night text-white">
      <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 md:py-24">
        <h2 className="font-display text-3xl font-bold tracking-[-0.02em] sm:text-[40px]">The rules I buy by.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card tag="Budget" title="Never spend your whole budget." href="/insights/never-spend-your-whole-budget" cta="Read the rule">
            <div className="flex h-16 w-full">
              <motion.div variants={grow()} className="flex w-[62%] origin-left items-end bg-white/15 p-3 font-display text-[13px] font-semibold">Spend</motion.div>
              <motion.div variants={grow(0.6)} className="flex flex-1 origin-left items-end bg-red p-3 font-display text-[13px] font-semibold">Keep 35–40%</motion.div>
            </div>
          </Card>
          <Card tag="Accounts" title="Ask for five years, not three." href="/insights/five-years-of-accounts" cta="Read why">
            <div className="flex h-16 items-end gap-2">
              {[0, 1, 2, 3, 4].map((y) => (
                <motion.div key={y} variants={rise(y * 0.12)} className={`h-full flex-1 origin-bottom ${y < 2 ? "bg-red" : "bg-white/15"}`} />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[11px] uppercase tracking-[0.14em] text-white/50">
              <span>+2 most never see</span>
              <span>The usual 3</span>
            </div>
          </Card>
          <Card tag="Due diligence" title="Ten checks before any purchase." href="/insights/ten-things-i-check-before-buying-a-post-office" cta="See the list">
            <div className="grid h-16 grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="flex items-center justify-center border-[1.5px] border-white/30">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
                    <motion.path
                      d="M3 8.5l3 3 7-7"
                      fill="none"
                      stroke="var(--color-red)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1, transition: { duration: 0.35, delay: 0.2 + i * 0.1 } } }}
                    />
                  </svg>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
