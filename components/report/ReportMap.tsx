"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { inTier, reportSections, tiers, type Tier } from "@/lib/report";

/** The 15 report sections as a grid. Choosing a tier lights up what it includes. */
export function ReportMap() {
  const [tier, setTier] = useState<Tier>("insight");
  const current = tiers.find((t) => t.id === tier)!;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6">
        <div role="radiogroup" aria-label="Report" className="inline-flex border border-navy/15 bg-white p-1">
          {tiers.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={tier === t.id}
              onClick={() => setTier(t.id)}
              className={`px-5 py-2.5 text-sm font-semibold transition-colors ${tier === t.id ? "bg-navy text-white" : "text-navy hover:bg-light"}`}
            >
              {t.name} <span className={tier === t.id ? "text-white/60" : "text-muted"}>{t.price} + VAT</span>
            </button>
          ))}
        </div>
        <p className="text-sm text-muted" aria-live="polite">
          <span className="font-display text-lg font-bold text-navy">{current.count}</span> of 15 sections
        </p>
      </div>

      <ol className="mt-8 grid grid-cols-2 gap-px bg-navy/12 sm:grid-cols-3 lg:grid-cols-5">
        {reportSections.map((s) => {
          const on = inTier(s, tier);
          return (
            <li key={s.n} className="relative bg-white">
              <motion.div
                className="absolute inset-0 origin-left bg-navy"
                initial={false}
                animate={{ scaleX: on ? 1 : 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: on ? s.n * 0.025 : 0 }}
                aria-hidden
              />
              <div className="relative flex min-h-28 flex-col justify-between p-4 sm:p-5">
                <span className={`font-display text-[13px] font-semibold ${on ? "text-red-light" : "text-navy/35"}`}>
                  {String(s.n).padStart(2, "0")}
                </span>
                <span className={`mt-4 font-display text-[15px] font-semibold leading-snug transition-colors ${on ? "text-white" : "text-navy/40"}`}>
                  {s.title}
                  <span className="sr-only">{on ? " (included)" : " (Intelligence only)"}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
