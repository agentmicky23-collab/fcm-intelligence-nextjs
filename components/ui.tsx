import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-xs font-semibold uppercase tracking-[0.25em] text-gold ${className}`}>{children}</p>
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
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <h2 className={`font-display text-3xl leading-tight sm:text-4xl ${light ? "text-white" : "text-navy"}`}>
        {title}
      </h2>
      {intro && (
        <p className={`mt-4 text-lg leading-relaxed ${light ? "text-white/70" : "text-muted"}`}>{intro}</p>
      )}
    </div>
  );
}

type ButtonProps = ComponentProps<typeof Link> & { variant?: "gold" | "outline" | "outline-light" | "navy" };

export function ButtonLink({ variant = "gold", className = "", ...props }: ButtonProps) {
  const styles = {
    gold: "bg-gold text-navy hover:bg-gold-light",
    navy: "bg-navy text-white hover:bg-navy-700",
    outline: "border border-navy/25 text-navy hover:border-navy hover:bg-navy hover:text-white",
    "outline-light": "border border-white/30 text-white hover:border-gold hover:text-gold",
  }[variant];
  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${styles} ${className}`}
      {...props}
    />
  );
}

/** Stand-in for Mikesh's photography until the real photos arrive. */
export function PhotoPlaceholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`relative flex items-end overflow-hidden rounded-2xl bg-gradient-to-br from-navy-700 via-navy to-navy-950 ${className}`}
      role="img"
      aria-label={label}
    >
      <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-gold/20" />
      <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full border border-gold/30" />
      <p className="relative m-5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 backdrop-blur">
        Photo: {label}
      </p>
    </div>
  );
}
