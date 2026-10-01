"use client";

import { Grow } from "@/components/report/charts";

const rows = [
  { label: "Post Office branches", peak: 100, peakLabel: "Up to 100 run over 15 years", now: 43, nowLabel: "43 today" },
  { label: "Petrol station forecourts", peak: 7, peakLabel: "7 last year", now: 2, nowLabel: "2 today" },
];

/** Peak against today: businesses are opened, grown, sold and sometimes closed. */
export function Movement() {
  return (
    <div className="space-y-10">
      {rows.map((r, i) => (
        <div key={r.label}>
          <p className="font-display text-lg font-semibold text-navy">{r.label}</p>
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4">
              <div className="h-9 bg-navy/8">
                <Grow delay={i * 0.3} className="h-full bg-navy/30" />
              </div>
              <span className="w-44 text-sm text-muted">{r.peakLabel}</span>
            </div>
            <div className="grid grid-cols-[1fr_auto] items-center gap-4">
              <div className="h-9">
                <div className="h-full" style={{ width: `${(r.now / r.peak) * 100}%` }}>
                  <Grow delay={i * 0.3 + 0.4} className="h-full bg-red" />
                </div>
              </div>
              <span className="w-44 font-display text-sm font-semibold text-navy">{r.nowLabel}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
