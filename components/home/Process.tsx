"use client";

import { motion } from "motion/react";
import { steps } from "@/lib/home";
import { ease, inView } from "./anim";

export function Process() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 md:py-24">
      <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-navy sm:text-[40px]">How it works</h2>
      <motion.ol className="relative mt-14 grid gap-10 md:grid-cols-3" initial="hidden" whileInView="shown" viewport={inView}>
        <motion.span
          aria-hidden
          className="absolute left-0 right-0 top-[22px] hidden h-[2px] origin-left bg-navy/12 md:block"
          variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1, transition: { duration: 1.2, ease } } }}
        />
        {steps.map((s, i) => (
          <motion.li
            key={s.title}
            className="relative"
            variants={{ hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease, delay: 0.25 + i * 0.3 } } }}
          >
            <span className={`flex h-11 w-14 -skew-x-[18deg] items-center justify-center font-display text-[15px] font-bold text-white ${i === steps.length - 1 ? "bg-red" : "bg-navy"}`}>
              <span className="skew-x-[18deg]">{i + 1}</span>
            </span>
            <h3 className="mt-6 font-display text-[22px] font-semibold text-navy">{s.title}</h3>
            <p className="mt-2 max-w-[32ch] text-[15px] leading-relaxed text-muted">{s.line}</p>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
