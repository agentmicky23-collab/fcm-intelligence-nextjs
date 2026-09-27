"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur supports-[backdrop-filter]:bg-navy/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="FCM Intelligence home">
          <Image src="/brand/logo-mark-gold.png" alt="" width={729} height={177} className="h-6 w-auto" priority />
          <span className="hidden border-l border-white/20 pl-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 sm:inline">
            Intelligence
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${active ? "text-gold" : "text-white/80 hover:text-white"}`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/account"
            className="rounded-full border border-gold/60 px-4 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold hover:text-navy"
          >
            Join free
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpenOn(open ? null : pathname)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" className="border-t border-white/10 bg-navy px-5 pb-6 pt-2 md:hidden" aria-label="Mobile">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="block border-b border-white/10 py-4 text-white">
              {item.label}
            </Link>
          ))}
          <Link href="/account" className="mt-5 block rounded-full bg-gold py-3 text-center font-semibold text-navy">
            Join free
          </Link>
        </nav>
      )}
    </header>
  );
}
