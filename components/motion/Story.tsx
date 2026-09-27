"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { bone, cond, deep, gold, label } from "./tokens";

const steps = [
  { n: 1, suffix: "", kicker: "2011", unit: "branch", title: "One branch. Oldham.", body: "My dad took on a Post Office. Six months in, he couldn't carry on, so I stepped in and kept it running." },
  { n: 5, suffix: "", kicker: "The early years", unit: "jobs, one person", title: "Every job going.", body: "Counter clerk, cleaner, bookkeeper, HR, manager. No playbook. I learned it the hard way." },
  { n: 45, suffix: "+", kicker: "Fifteen years", unit: "branches run over my career", title: "Good years and bad ones.", body: "Robberies, threats, profit and debt in cycles. Every time I lose I secretly win, because I find the lesson." },
  { n: 10, suffix: "", kicker: "2025", unit: "Crown conversions in one year", title: "Didsbury Village to Leeds Markets.", body: "Eccles, Old Swan, Hyde, Leigh, Salford City, Prestwich, Barnes Green and Breck Road too." },
  { n: 43, suffix: "", kicker: "Today", unit: "Post Office branches", title: "And just over 200 staff.", body: "Plus a Banking Hub in Alsager and two forecourts. This site is where I share what it all taught me." },
];

export function Story() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(steps[0].n);
  const spring = useSpring(steps[0].n, { stiffness: 90, damping: 20 });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(steps.length - 1, Math.floor(p * steps.length));
    if (i !== active) {
      setActive(i);
      spring.set(steps[i].n);
    }
  });
  useMotionValueEvent(spring, "change", (v) => setShown(Math.round(v)));

  const step = steps[active];

  return (
    <section ref={ref} style={{ height: `${steps.length * 90}vh`, background: deep, color: bone }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1280px] items-center gap-10 px-6 md:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-[13px]" style={{ ...label, color: gold }}>From one to forty-three</p>
            <p className="mt-4 text-[160px] leading-[0.8] sm:text-[220px] md:text-[300px]" style={{ ...cond, color: gold, fontVariantNumeric: "tabular-nums" }}>
              {shown}{step.suffix}
            </p>
            <AnimatePresence mode="wait">
              <motion.p key={step.unit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="mt-4 text-[14px] text-white/70" style={label}>
                {step.unit}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="relative min-h-[260px]">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <p className="text-[13px]" style={{ ...label, color: gold }}>{step.kicker}</p>
                <h2 className="mt-3 text-[54px] leading-[0.9] md:text-[72px]" style={cond}>{step.title}</h2>
                <p className="mt-5 max-w-[40ch] text-[19px] leading-relaxed text-white/75">{step.body}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-10 flex gap-2" aria-hidden>
              {steps.map((s, i) => (
                <span key={s.kicker} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
                  <motion.span className="block h-full" style={{ background: gold }} initial={false} animate={{ width: i <= active ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
