import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  // A narrower width passed in (e.g. max-w-3xl for reading) replaces the default rather than competing with it.
  const width = /(^|\s)max-w-/.test(className) ? "" : "max-w-[1280px]";
  return <div className={`mx-auto w-full ${width} px-5 sm:px-8 ${className}`}>{children}</div>;
}

/** The slanted cut from the FCM logo, used as the site's recurring shape. */
export function Slant({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`absolute block -skew-x-[18deg] ${className}`} />;
}

export function Eyebrow({ children, light = false, className = "" }: { children: ReactNode; light?: boolean; className?: string }) {
  return (
    <p className={`flex items-center gap-3 text-sm font-medium ${light ? "text-white/60" : "text-muted"} ${className}`}>
      <span aria-hidden className="inline-block h-3.5 w-2 -skew-x-[18deg] bg-red" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  light = false,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow && <Eyebrow light={light} className="mb-4">{eyebrow}</Eyebrow>}
      <h2 className={`font-display text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-[40px] ${light ? "text-white" : "text-navy"}`}>
        {title}
      </h2>
      {intro && (
        <p className={`mt-4 text-lg leading-relaxed ${light ? "text-white/70" : "text-muted"}`}>{intro}</p>
      )}
    </div>
  );
}

type ButtonProps = ComponentProps<typeof Link> & { variant?: "red" | "outline" | "outline-light" | "navy" | "white" };

export function ButtonLink({ variant = "red", className = "", ...props }: ButtonProps) {
  const styles = {
    red: "bg-red text-white hover:bg-red-dark",
    navy: "bg-navy text-white hover:bg-navy-700",
    white: "bg-white text-navy hover:bg-light",
    outline: "border border-navy/25 text-navy hover:border-navy hover:bg-navy hover:text-white",
    "outline-light": "border border-white/30 text-white hover:border-white hover:bg-white hover:text-navy",
  }[variant];
  return (
    <Link
      className={`inline-flex min-h-12 items-center justify-center gap-2 px-7 py-3.5 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red ${styles} ${className}`}
      {...props}
    />
  );
}

/** A graphic panel in the brand's slanted style, used where a photo would otherwise go. */
export function BrandPanel({ figure, label, className = "" }: { figure: string; label: string; className?: string }) {
  return (
    <div className={`relative flex items-end justify-end overflow-hidden bg-night p-8 ${className}`}>
      <Slant className="inset-y-0 right-[-20%] w-[70%] bg-navy" />
      <Slant className="inset-y-0 left-[18%] w-[9%] bg-red" />
      <Slant className="inset-y-0 left-[31%] w-[2%] bg-red/55" />
      <div className="relative text-right">
        <p className="font-display text-[120px] font-extrabold italic leading-[0.8] tracking-[-0.05em] text-white">{figure}</p>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-white/70">{label}</p>
      </div>
    </div>
  );
}
