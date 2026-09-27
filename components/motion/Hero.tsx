"use client";

import Image from "next/image";
import { animate, motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Postmark } from "./Postmark";
import { cond, gold, label, navy, red } from "./tokens";

const ease = [0.22, 1, 0.36, 1] as const;

function CountUp({ to, delay = 0 }: { to: number; delay?: number }) {
  const reduce = useReducedMotion();
  const value = useMotionValue(reduce ? to : 1);
  const [shown, setShown] = useState(reduce ? to : 1);
  useEffect(() => {
    if (reduce) return;
    const controls = animate(value, to, { duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] });
    const unsub = value.on("change", (v) => setShown(Math.round(v)));
    return () => { controls.stop(); unsub(); };
  }, [to, delay, reduce, value]);
  return <span style={{ color: gold, fontVariantNumeric: "tabular-nums" }}>{shown}</span>;
}

/** Wavy franking lines drifting slowly across the background. */
function Franking() {
  const d = Array.from({ length: 24 }, () => "t 30 0").join(" ");
  return (
    <motion.svg
      aria-hidden
      className="pointer-events-none absolute -left-40 top-[18%] w-[140%] opacity-[0.07]"
      viewBox="0 0 1600 120"
      animate={{ x: [0, -60] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    >
      {[10, 40, 70, 100].map((y) => (
        <path key={y} d={`M0 ${y} q 15 -12 30 0 ${d} ${d}`} fill="none" stroke="#fff" strokeWidth="3" />
      ))}
    </motion.svg>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const words = ["Post", "Offices."];

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden" style={{ background: `linear-gradient(180deg,#1b2d4d 0%,#101f39 55%,#07142A 100%)` }}>
      <Franking />
      <motion.div style={{ y: photoY }} className="absolute inset-y-0 right-0 hidden w-[42%] md:block">
        <div className="h-full w-full" style={{ background: "linear-gradient(170deg,#2c4068,#12223f 70%)" }} />
        <span className="absolute bottom-8 left-6 text-[12px] text-white/50" style={{ fontFamily: "var(--f-mono)" }}>[photo of Mikesh behind the counter]</span>
      </motion.div>

      <header className="relative z-10 mx-auto flex h-20 max-w-[1280px] items-center justify-between px-6">
        <Image src="/brand/logo-mark-red.png" alt="FCM" width={729} height={177} className="h-7 w-auto" priority />
        <nav className="hidden items-center gap-8 text-[14px] text-white md:flex" style={{ ...cond, fontWeight: 600, fontStretch: "80%", letterSpacing: "0.06em" }}>
          <a>Insights</a><a>Resources</a><a>About Mikesh</a><a>Work with me</a>
          <a className="border-b-2 pb-0.5" style={{ borderColor: gold, color: gold }}>Join free</a>
        </nav>
      </header>

      <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] max-w-[1280px] flex-col justify-end px-6 pb-20">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease }} className="flex items-center gap-4">
          <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, ease, delay: 0.1 }} className="h-[3px] w-12 origin-left" style={{ background: red }} />
          <p className="text-[13px]" style={{ ...label, color: gold }}>Mikesh Parekh · Subpostmaster since 2011</p>
        </motion.div>

        <h1 className="mt-6 max-w-[11ch] text-[78px] leading-[0.86] text-[#F1EDE4] sm:text-[110px] md:text-[150px]" style={cond}>
          <span className="block overflow-hidden">
            <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease, delay: 0.15 }}>
              I run <CountUp to={43} delay={0.5} />
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            {words.map((w, i) => (
              <motion.span key={w} className="mr-[0.22em] inline-block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease, delay: 0.3 + i * 0.12 }}>
                {w}
              </motion.span>
            ))}
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.8 }} className="max-w-[44ch] text-[19px] leading-relaxed text-white/80">
            Here&apos;s what they taught me. Straight answers on buying and running one, from someone who started behind his dad&apos;s counter in Oldham.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 1 }} className="flex gap-3">
            <a className="group relative overflow-hidden px-7 py-4 text-[15px]" style={{ ...cond, fontWeight: 700, fontStretch: "85%", letterSpacing: "0.04em", background: gold, color: navy }}>
              <span className="relative z-10">Read the insights <span className="inline-block transition-transform group-hover:translate-x-1">→</span></span>
            </a>
            <a className="px-7 py-4 text-[15px] text-white transition-colors hover:bg-white/20" style={{ ...cond, fontWeight: 700, fontStretch: "85%", letterSpacing: "0.04em", background: "rgba(255,255,255,0.1)" }}>Free checklists</a>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute right-[34%] top-[22%] z-20 hidden md:block"
        initial={{ opacity: 0, scale: 1.8, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: -12 }}
        transition={{ delay: 1.4, type: "spring", stiffness: 420, damping: 14 }}
      >
        <Postmark color={gold} size={170} />
      </motion.div>

      <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[11px] text-white/50" style={label}>
        <motion.span className="block" animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>Scroll ↓</motion.span>
      </motion.div>
    </section>
  );
}
