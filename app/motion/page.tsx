import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import { Closing } from "@/components/motion/Closing";
import { Hero } from "@/components/motion/Hero";
import { Stamps } from "@/components/motion/Stamps";
import { Story } from "@/components/motion/Story";
import { Ticker } from "@/components/motion/Ticker";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--f-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-mono" });

export const metadata: Metadata = { title: "Motion prototype", robots: { index: false, follow: false } };

export default function MotionPrototype() {
  return (
    <div className={`${archivo.variable} ${mono.variable} overflow-x-clip`} style={{ fontFamily: "var(--f-sans)", background: "#07142A" }}>
      <MotionConfig reducedMotion="user">
        <Hero />
        <Ticker />
        <Story />
        <Stamps />
        <Closing />
      </MotionConfig>
    </div>
  );
}
