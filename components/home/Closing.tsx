"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ease, inView } from "./anim";

export function Closing() {
  return (
    <section className="relative overflow-hidden bg-red">
      <motion.span
        aria-hidden
        className="absolute inset-y-0 right-[8%] block w-[22%] bg-black/12"
        style={{ skewX: -18 }}
        initial={{ x: "30vw" }}
        whileInView={{ x: 0 }}
        viewport={inView}
        transition={{ duration: 1.1, ease }}
      />
      <div className="relative mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 px-5 py-20 text-white sm:px-8 md:flex-row md:items-center">
        <h2 className="max-w-[28ch] font-display text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-[40px]">
          Considering a Post Office? Talk to someone who runs 43.
        </h2>
        <Link href="/contact" className="shrink-0 bg-white px-7 py-4 text-[15px] font-semibold text-navy transition-colors hover:bg-light">
          Book a consultation
        </Link>
      </div>
    </section>
  );
}
