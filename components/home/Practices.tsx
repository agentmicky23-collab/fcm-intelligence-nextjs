"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { practices } from "@/lib/home";
import { ease, inView } from "./anim";

const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}z`;

// Each glyph: navy strokes first, then the single red accent.
const glyphs: { navy: string[]; red: string[] }[] = [
  { navy: ["M6 20h24v18H6z", "M4 20l4-8h20l4 8", "M14 38v-9h8v9"], red: [circle(34, 30, 7), "M39 35l5 5"] },
  { navy: ["M6 42h36", "M10 42V30M18 42V24M26 42V18", "M8 22l10-8 8 4 12-10"], red: ["M34 42V10"] },
  { navy: [circle(10, 34, 4), circle(38, 34, 4), circle(24, 38, 4), "M21 16l-9 14M27 16l9 14M24 17v17"], red: [circle(24, 12, 5)] },
  { navy: ["M24 5l16 6v12c0 10-7 17-16 20C15 40 8 33 8 23V11z"], red: ["M16 24l6 6 10-12"] },
  { navy: [rect(4, 6, 8, 8), rect(36, 6, 8, 8), rect(4, 34, 8, 8), rect(36, 34, 8, 8), "M12 12l7 7M36 12l-7 7M12 36l7-7M36 36l-7-7"], red: [rect(19, 19, 10, 10)] },
  { navy: ["M10 4h20l8 8v32H10z", "M30 4v8h8", "M16 30h10M16 36h14"], red: ["M24 24s-6-5-6-9a6 6 0 0 1 12 0c0 4-6 9-6 9z"] },
];

function Glyph({ i }: { i: number }) {
  const g = glyphs[i];
  const draw = (delay: number) => ({
    hidden: { pathLength: 0 },
    shown: { pathLength: 1, transition: { duration: 0.9, ease, delay } },
  });
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {g.navy.map((d, k) => <motion.path key={d} d={d} stroke="var(--color-navy)" strokeWidth={1.6} variants={draw(0.1 + k * 0.1)} />)}
      {g.red.map((d, k) => <motion.path key={d} d={d} stroke="var(--color-red)" strokeWidth={2.2} variants={draw(0.5 + k * 0.15)} />)}
    </svg>
  );
}

export function Practices() {
  return (
    <section id="practice-areas" className="mx-auto max-w-[1280px] scroll-mt-20 px-5 py-20 sm:px-8 md:py-24">
      <div className="flex items-end justify-between gap-6">
        <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-navy sm:text-[40px]">Practice areas</h2>
        <Link href="/services" className="text-[15px] font-medium text-red-dark hover:text-red">View all →</Link>
      </div>
      <div className="mt-12 grid gap-px bg-navy/12 md:grid-cols-3">
        {practices.map((p, i) => (
          <motion.div key={p.title} initial="hidden" whileInView="shown" viewport={inView}>
            <Link href={p.href} className="group relative block h-full bg-white p-8 transition-colors hover:bg-light sm:p-9">
              <div className="flex items-start justify-between">
                <Glyph i={i} />
                <span className="font-display text-[13px] font-semibold text-red">0{i + 1}</span>
              </div>
              <h3 className="mt-7 font-display text-[22px] font-semibold leading-snug tracking-[-0.01em] text-navy">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.line}</p>
              <span className="absolute bottom-0 left-0 h-[3px] w-12 bg-red transition-all duration-500 group-hover:w-full" aria-hidden />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
