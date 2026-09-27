"use client";

import { motion } from "motion/react";
import { ease, inView } from "./anim";

/** One branch to 43: the first dot stays red all the way through. */
export function Growth() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-[1280px] items-center gap-14 px-5 py-20 sm:px-8 md:grid-cols-[0.9fr_1.4fr] md:py-24">
        <div>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-navy sm:text-[40px]">
            From one branch to forty-three.
          </h2>
          <p className="mt-5 max-w-[38ch] text-[17px] leading-relaxed text-muted">
            It started with my father&apos;s branch. Fifteen years later, I run 43 and two forecourts, with more than 200 staff.
          </p>
        </div>
        <motion.div
          className="flex items-center gap-4 sm:gap-8"
          initial="hidden"
          whileInView="shown"
          viewport={inView}
          role="img"
          aria-label="One branch growing to 43 branches over 15 years"
        >
          <div className="text-center">
            <motion.span
              className="mx-auto block h-8 w-8 rounded-full bg-red sm:h-10 sm:w-10"
              variants={{ hidden: { scale: 0 }, shown: { scale: 1, transition: { type: "spring", stiffness: 300, damping: 16 } } }}
            />
            <p className="mt-3 font-display text-[13px] font-semibold text-navy">1</p>
          </div>
          <div className="relative h-px min-w-8 flex-1">
            <motion.span
              className="absolute inset-0 origin-left bg-navy/25"
              variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1, transition: { duration: 0.9, ease, delay: 0.2 } } }}
            />
            <motion.span
              className="absolute -right-1 -top-[5px] h-[11px] w-[11px] rotate-45 border-r border-t border-navy/40"
              variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { delay: 1 } } }}
            />
            <span className="absolute left-1/2 top-3 hidden -translate-x-1/2 whitespace-nowrap text-xs uppercase tracking-[0.18em] text-muted sm:block">
              15 years
            </span>
          </div>
          <div>
            <motion.div
              className="grid grid-cols-9 gap-1.5 sm:gap-2"
              variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.035, delayChildren: 0.9 } } }}
            >
              {Array.from({ length: 43 }, (_, i) => (
                <motion.span
                  key={i}
                  className={`h-3.5 w-3.5 rounded-full sm:h-6 sm:w-6 ${i === 0 ? "bg-red" : "bg-navy"}`}
                  variants={{ hidden: { scale: 0 }, shown: { scale: 1, transition: { type: "spring", stiffness: 400, damping: 18 } } }}
                />
              ))}
            </motion.div>
            <p className="mt-3 font-display text-[13px] font-semibold text-navy">43</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
