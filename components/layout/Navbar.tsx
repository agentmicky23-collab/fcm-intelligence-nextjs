"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/opportunities", label: "Live Listings" },
    { href: "/blog", label: "Blog" },
    { href: "/consultation", label: "Consultation" },
    { href: "/reports", label: "Reports" },
    { href: "/insiders", label: "⭐ Insider", gold: true },
    { href: "/inter-mission", label: "Inter-Mission", highlight: true },
    { href: "/business-republic", label: "Business Republic" },
    { href: "https://discord.gg/52MsbGBhyr", label: "💬 Community", external: true },
  ];

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <Image 
              src="/assets/logos/logo-transparent.png" 
              alt="FCM Intelligence Logo" 
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-tighter">
            <span className="text-red-600">FCM</span> <span className="text-gold">Intelligence</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium px-3 py-2 rounded-md transition-colors hover:text-gold hover:bg-card text-muted-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium px-3 py-2 rounded-md transition-colors hover:text-gold hover:bg-card ${
                  pathname === link.href ? "text-gold bg-card" : 
                  link.highlight ? "text-[#00FF88]" : 
                  link.gold ? "text-gold" :
                  "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          ))}

          {/* CTA Button */}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
            <Link
              href="/contact"
              className="btn-primary py-1.5 px-4 min-h-0 text-sm font-semibold"
            >
              Get Report
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-muted-foreground hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-medium py-2 px-3 rounded-md text-muted-foreground hover:text-white hover:bg-background"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-medium py-2 px-3 rounded-md ${
                    pathname === link.href 
                      ? "text-gold bg-background" 
                      : link.highlight
                      ? "text-[#00FF88] bg-[#00FF88]/10 border border-[#00FF88]/30"
                      : link.gold
                      ? "text-gold"
                      : "text-muted-foreground hover:text-white hover:bg-background"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}
            
            {/* Mobile CTA */}
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border">
              <Link 
                href="/contact" 
                className="btn-primary w-full text-center font-semibold" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Your Report
              </Link>
              <Link 
                href="/insiders" 
                className="btn-secondary w-full text-center" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Become an Insider
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
