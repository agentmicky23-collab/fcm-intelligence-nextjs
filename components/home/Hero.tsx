"use client";

import Link from "next/link";
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ExplainerVideo } from "@/components/ExplainerVideo";
import { explainers } from "@/lib/explainer";
import { ease } from "./anim";

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [n, setN] = useState(1);
  useEffect(() => {
    if (!seen) return;
    const c = animate(1, to, { duration: reduce ? 0 : 1.8, delay: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [seen, reduce, to]);
  return <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>{n}</span>;
}

const bars = [
  { cls: "right-[-8%] w-[46%] bg-navy", delay: 0.05 },
  { cls: "right-[30%] w-[5%] bg-red", delay: 0.2 },
  { cls: "right-[37%] w-[1.2%] bg-red/55", delay: 0.3 },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-night">
      <motion.div aria-hidden style={{ x: drift }} className="absolute inset-0 hidden md:block">
        {bars.map((b) => (
          <motion.span
            key={b.cls}
            className={`absolute inset-y-0 block ${b.cls}`}
            style={{ skewX: -18 }}
            initial={{ x: "40vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.1, ease, delay: b.delay }}
          />
        ))}
      </motion.div>
      <span aria-hidden className="absolute bottom-0 right-[-10%] block h-28 w-[45%] -skew-x-[18deg] bg-navy md:hidden" />
      <span aria-hidden className="absolute bottom-0 right-[30%] block h-28 w-[4%] -skew-x-[18deg] bg-red md:hidden" />

      <div className="relative mx-auto grid max-w-[1280px] gap-12 px-5 pb-24 pt-14 sm:px-8 md:grid-cols-[1.15fr_1fr] md:pb-28 md:pt-20">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-sm font-medium text-white/60">
            Post Office advisory
          </motion.p>
          <h1 className="mt-6 font-display text-[44px] font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-[60px] md:text-[76px]">
            {["The Post Office", "expert in", "your corner."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={`block ${i === 2 ? "text-red" : ""}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease, delay: 0.15 + i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.7 }}>
            <p className="mt-7 max-w-[40ch] text-lg leading-relaxed text-white/70 sm:text-[19px]">
              Advice from the operator of 43 branches and 200+ staff.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link href="/contact" className="bg-red px-7 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark">
                Book a consultation
              </Link>
              <Link href="#practice-areas" className="group text-[15px] font-medium text-white">
                Explore practice areas <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="relative self-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.5 }}
        >
          <ExplainerVideo video={explainers.welcome} />
          <div className="flex items-end justify-between gap-6 bg-night py-4 md:px-5">
            <p className="text-sm text-white/60">
              A 30-second welcome from Mikesh.
              <span className="mt-1 block text-xs text-white/40">{explainers.welcome.aiLabel}</span>
            </p>
            <p className="shrink-0 text-right">
              <span className="block font-display text-6xl font-extrabold italic leading-none tracking-[-0.05em] text-white">
                <CountUp to={43} />
              </span>
              <span className="mt-1 block text-xs font-medium uppercase tracking-[0.2em] text-white/60">Branches operated</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
