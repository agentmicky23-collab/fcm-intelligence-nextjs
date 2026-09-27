import { MotionConfig } from "motion/react";
import { Closing } from "@/components/home/Closing";
import { Growth } from "@/components/home/Growth";
import { Hero } from "@/components/home/Hero";
import { Practices } from "@/components/home/Practices";
import { Process } from "@/components/home/Process";
import { Rules } from "@/components/home/Rules";
import { credentials } from "@/lib/home";

export default function HomePage() {
  return (
    <MotionConfig reducedMotion="user">
      <Hero />
      <section className="border-b border-navy/8 bg-white">
        <ul className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-14 gap-y-3 px-5 py-7 font-display text-[15px] font-semibold text-navy sm:px-8">
          {credentials.map((c, i) => (
            <li key={c} className="flex items-center gap-14">
              {i > 0 && <span aria-hidden className="hidden h-4 w-px bg-red sm:block" />}
              {c}
            </li>
          ))}
        </ul>
      </section>
      <Growth />
      <Practices />
      <Rules />
      <Process />
      <Closing />
    </MotionConfig>
  );
}
