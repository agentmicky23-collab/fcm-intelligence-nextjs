"use client";

import { motion } from "motion/react";
import { Postmark } from "./Postmark";
import { bone, cond, deep, label, navy, red } from "./tokens";

const articles = [
  { t: "The ten things I check before buying any Post Office", d: "After fifteen years and more than forty-five branches, the list I run through on every deal.", m: 6, c: "Buying" },
  { t: "Freehold vs leasehold: the cost that never appears on the listing", d: "Leasehold looks cheaper on day one. Ten years later, the rent reviews have eaten your margin.", m: 4, c: "Buying" },
  { t: "Never spend your whole budget", d: "If your budget is £200k, don't buy at £200k. Why I keep 35 to 40 per cent in reserve.", m: 3, c: "Money" },
];

const rest = [-5, 2, -2];

export function Stamps() {
  const edge = `radial-gradient(circle, ${deep} 4px, transparent 4.5px)`;
  return (
    <section style={{ background: deep, color: bone }}>
      <div className="mx-auto max-w-[1280px] px-6 py-24">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }} className="text-[56px] leading-none md:text-[80px]" style={cond}>
          First class insights
        </motion.h2>
        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {articles.map((a, i) => (
            <motion.a
              key={a.t}
              className="relative block cursor-pointer p-3"
              style={{ background: bone }}
              initial={{ opacity: 0, y: 80, rotate: rest[i] * 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: rest[i] }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 120, damping: 16, delay: i * 0.12 }}
              whileHover={{ rotate: 0, y: -12, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 18 } }}
            >
              <span aria-hidden className="absolute inset-x-0 -top-[6px] h-3" style={{ backgroundImage: edge, backgroundSize: "14px 12px" }} />
              <span aria-hidden className="absolute inset-x-0 -bottom-[6px] h-3" style={{ backgroundImage: edge, backgroundSize: "14px 12px" }} />
              <span aria-hidden className="absolute inset-y-0 -left-[6px] w-3" style={{ backgroundImage: edge, backgroundSize: "12px 14px" }} />
              <span aria-hidden className="absolute inset-y-0 -right-[6px] w-3" style={{ backgroundImage: edge, backgroundSize: "12px 14px" }} />
              <div className="relative flex min-h-[360px] flex-col overflow-hidden border-2 p-6" style={{ borderColor: navy, color: navy }}>
                <div className="flex items-start justify-between">
                  <span className="text-[11px]" style={{ ...label, letterSpacing: "0.12em" }}>{a.c}</span>
                  <span className="text-[34px] leading-none" style={{ ...cond, color: red }}>{a.m}<span className="text-[14px]">MIN</span></span>
                </div>
                <h3 className="mt-8 text-[34px] leading-[0.95]" style={cond}>{a.t}</h3>
                <p className="mt-auto max-w-[80%] pt-6 text-[14px] leading-relaxed" style={{ color: "rgba(11,29,58,0.7)" }}>{a.d}</p>
                <motion.div
                  className="absolute -bottom-7 -right-7"
                  initial={{ opacity: 0, scale: 1.6, rotate: -40 }}
                  whileInView={{ opacity: 0.6, scale: 1, rotate: -10 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.15, type: "spring", stiffness: 380, damping: 14 }}
                >
                  <Postmark color={navy} size={104} center="FCM" sub="INSIGHT" />
                </motion.div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
