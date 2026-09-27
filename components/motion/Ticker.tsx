"use client";

import { motion } from "motion/react";
import { cond, gold, navy } from "./tokens";

const places = ["Didsbury Village", "Eccles", "Leeds Markets", "Old Swan", "Hyde", "Leigh", "Salford City", "Prestwich", "Barnes Green", "Breck Road", "Alsager Banking Hub", "Oldham"];

export function Ticker() {
  const row = [...places, ...places];
  return (
    <div className="overflow-hidden py-5" style={{ background: gold, color: navy }} aria-label="Some of Mikesh's branches">
      <motion.div className="flex w-max gap-10 whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
        {row.map((p, i) => (
          <span key={i} className="flex items-center gap-10 text-[34px] leading-none" style={cond}>
            {p}
            <span aria-hidden className="inline-block h-3 w-3 rotate-45" style={{ background: navy }} />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
