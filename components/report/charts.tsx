"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;
const view = { once: true, amount: 0.4 } as const;

/** A bar that grows from its left edge when it scrolls into view. */
export function Grow({ className = "", delay = 0, children }: { className?: string; delay?: number; children?: ReactNode }) {
  return (
    <motion.div
      className={`origin-left ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={view}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** A bar that rises from the bottom. */
export function Rise({ className = "", delay = 0, style }: { className?: string; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      className={`origin-bottom ${className}`}
      style={style}
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={view}
      transition={{ duration: 0.7, ease, delay }}
    />
  );
}

/** Content that fades up into place. */
export function Reveal({ className = "", delay = 0, children }: { className?: string; delay?: number; children: ReactNode }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={view}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Pops an SVG mark into place. */
export function Pop({ delay = 0, children }: { delay?: number; children: ReactNode }) {
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={view}
      transition={{ type: "spring", stiffness: 320, damping: 18, delay }}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      {children}
    </motion.g>
  );
}

/** Draws an SVG path along its length. */
export function Draw({ d, className = "", delay = 0, ...rest }: { d: string; className?: string; delay?: number } & React.SVGProps<SVGPathElement>) {
  return (
    <motion.path
      d={d}
      className={className}
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={view}
      transition={{ duration: 1.4, ease, delay }}
      {...(rest as object)}
    />
  );
}

/** The overall score as a ring that fills to the score. */
export function ScoreRing({ score, grade, size = 168 }: { score: number; grade: string; size?: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }} role="img" aria-label={`Overall score ${score} out of 100, grade ${grade}`}>
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="10" />
        <motion.circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="var(--color-red)"
          strokeWidth="10"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - score / 100) }}
          viewport={view}
          transition={{ duration: 1.6, ease, delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="font-display text-5xl font-extrabold tracking-[-0.04em]">{score}</span>
        <span className="mt-1 text-xs uppercase tracking-[0.18em] text-white/60">Grade {grade}</span>
      </div>
    </div>
  );
}
