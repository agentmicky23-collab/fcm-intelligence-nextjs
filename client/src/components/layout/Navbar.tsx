import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tighter">
              FCM <span className="text-gold">Intelligence</span>
            </span>
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={`text-sm font-medium transition-colors hover:text-gold ${
                  location === link.href ? "text-gold" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </a>
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border">
            <Link href="/insiders">
              <a className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                Sign In
              </a>
            </Link>
            <Link href="/insiders">
              <a className="btn-primary py-1.5 px-4 min-h-0 text-sm">
                Become an Insider
              </a>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={`text-base font-medium py-2 ${
                  location === link.href ? "text-gold" : "text-muted-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
            <Link href="/insiders">
              <a className="btn-secondary w-full" onClick={() => setIsMobileMenuOpen(false)}>
                Sign In
              </a>
            </Link>
            <Link href="/insiders">
              <a className="btn-primary w-full" onClick={() => setIsMobileMenuOpen(false)}>
                Become an Insider
              </a>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
