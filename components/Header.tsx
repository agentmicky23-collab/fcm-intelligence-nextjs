"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  return (
    <header className="sticky top-0 z-50 bg-night">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-4" aria-label={`${site.owner}, FCM Intelligence home`}>
          <Image src="/brand/logo-mark-white.png" alt="" width={729} height={177} className="h-6 w-auto" priority />
          <span className="h-5 w-px bg-white/25" aria-hidden />
          <span className="text-sm font-medium text-white/85">{site.owner}</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 text-sm transition-colors ${active ? "text-white" : "text-white/75 hover:text-white"}`}
              >
                {item.label}
                {active && <span aria-hidden className="absolute -bottom-1 left-0 h-[2px] w-full bg-red" />}
              </Link>
            );
          })}
          <Link href="/account" className="text-sm text-white/75 transition-colors hover:text-white">
            Join free
          </Link>
          <Link href="/contact" className="bg-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-dark">
            Book a consultation
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center text-white lg:hidden"
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
        <nav id="mobile-menu" className="border-t border-white/10 bg-night px-5 pb-6 pt-2 lg:hidden" aria-label="Mobile">
          {[...nav, { href: "/account", label: "Join free" }].map((item) => (
            <Link key={item.href} href={item.href} className="block border-b border-white/10 py-4 text-white">
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="mt-5 block bg-red py-3.5 text-center font-semibold text-white">
            Book a consultation
          </Link>
        </nav>
      )}
    </header>
  );
}
