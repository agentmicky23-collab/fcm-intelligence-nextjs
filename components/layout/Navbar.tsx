"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/opportunities", label: "Opportunities" },
    { href: "/services", label: "Services" },
    { href: "/reports", label: "Reports" },
    { href: "/business-republic", label: "Business Republic" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tighter">
            FCM <span className="text-gold">Intelligence</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-gold ${
                pathname === link.href ? "text-gold" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border">
            <Link
              href="/inter-mission"
              className="text-sm font-semibold text-[#00FF88] hover:text-[#00CC6A] transition-colors"
              data-testid="link-inter-mission"
            >
              Inter-Mission
            </Link>
            <Link href="/insiders" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/insiders" className="btn-primary py-1.5 px-4 min-h-0 text-sm">
              Become an Insider
            </Link>
          </div>
        </div>

        <button
          className="md:hidden p-2 text-muted-foreground hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base font-medium py-2 ${
                pathname === link.href ? "text-gold" : "text-muted-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
            <Link href="/inter-mission" className="w-full text-center py-2 text-sm font-semibold text-[#00FF88] border border-[#00FF88] rounded-md hover:bg-[#00FF88] hover:text-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Inter-Mission
            </Link>
            <Link href="/insiders" className="btn-secondary w-full text-center" onClick={() => setIsMobileMenuOpen(false)}>
              Sign In
            </Link>
            <Link href="/insiders" className="btn-primary w-full text-center" onClick={() => setIsMobileMenuOpen(false)}>
              Become an Insider
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
