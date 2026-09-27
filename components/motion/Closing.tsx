"use client";

import { motion } from "motion/react";
import { cond, deep, gold, label, red } from "./tokens";

export function Closing() {
  const words = ["Want", "me", "to", "look", "at", "your", "deal?"];
  return (
    <section className="border-t border-white/10" style={{ background: deep }}>
      <div className="mx-auto grid max-w-[1280px] items-end gap-12 px-6 py-24 md:grid-cols-[1.2fr_1fr]">
        <h2 className="text-[64px] leading-[0.88] text-[#F1EDE4] md:text-[96px]" style={cond}>
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="mr-[0.2em] inline-block"
                style={{ color: w === "your" ? gold : undefined }}
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h2>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.4 }}>
          <p className="text-[18px] leading-relaxed text-white/75">Reports from £199, a straight-talking hour with me from £150, or hands-on help from first viewing to handover.</p>
          <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="mt-8 inline-block px-8 py-4 text-[16px] text-white" style={{ ...cond, fontWeight: 700, fontStretch: "85%", letterSpacing: "0.04em", background: red }}>
            See how I can help →
          </motion.a>
          <p className="mt-10 text-[11px] text-white/40" style={label}>Motion prototype · FCM Intelligence</p>
        </motion.div>
      </div>
    </section>
  );
}
