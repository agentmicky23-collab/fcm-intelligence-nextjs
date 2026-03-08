"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, MapPin, LayoutDashboard, ArrowLeft, Menu, X } from "lucide-react";
import { useState } from "react";

const mobileNavItems = [
  { href: "/inter-mission", label: "Home", icon: Home },
  { href: "/inter-mission/assignments", label: "Assignments", icon: Briefcase },
  { href: "/inter-mission/map", label: "Map", icon: MapPin },
  { href: "/inter-mission/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function InterMissionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="im-section min-h-screen bg-black">
      <header className="border-b border-[#1A3A25] bg-black/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/inter-mission" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tighter text-white">
              INTER<span className="text-[#00FF88]">-MISSION</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/inter-mission/assignments"
              className={`text-sm font-medium transition-colors hover:text-[#00FF88] ${pathname?.startsWith("/inter-mission/assignments") ? "text-[#00FF88]" : "text-[#888888]"}`}
            >
              Assignments
            </Link>
            <Link
              href="/inter-mission/people"
              className={`text-sm font-medium transition-colors hover:text-[#00FF88] ${pathname?.startsWith("/inter-mission/people") ? "text-[#00FF88]" : "text-[#888888]"}`}
            >
              People
            </Link>
            <Link
              href="/inter-mission/map"
              className={`text-sm font-medium transition-colors hover:text-[#00FF88] ${pathname === "/inter-mission/map" ? "text-[#00FF88]" : "text-[#888888]"}`}
            >
              Map
            </Link>
            <Link
              href="/inter-mission/dashboard"
              className={`text-sm font-medium transition-colors hover:text-[#00FF88] ${pathname?.startsWith("/inter-mission/dashboard") ? "text-[#00FF88]" : "text-[#888888]"}`}
            >
              Dashboard
            </Link>
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-[#1A3A25]">
              <Link href="/inter-mission/register" className="im-btn-primary text-sm px-4 py-1.5 min-h-0" data-testid="link-register">
                Join Network
              </Link>
              <Link href="/" className="text-sm text-[#888888] hover:text-white transition-colors flex items-center gap-1">
                <ArrowLeft size={14} /> FCM
              </Link>
            </div>
          </nav>

          <button
            className="md:hidden p-2 text-[#888888] hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="button-mobile-menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-[#1A3A25] bg-[#0A1A0F] p-4 flex flex-col gap-3">
            {mobileNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 py-2 text-base font-medium ${pathname === item.href ? "text-[#00FF88]" : "text-[#888888]"}`}
                onClick={() => setMenuOpen(false)}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
            <Link href="/inter-mission/people" className="flex items-center gap-3 py-2 text-base font-medium text-[#888888]" onClick={() => setMenuOpen(false)}>
              People
            </Link>
            <div className="flex flex-col gap-2 pt-3 border-t border-[#1A3A25] mt-2">
              <Link href="/inter-mission/register" className="im-btn-primary w-full text-center text-sm" onClick={() => setMenuOpen(false)}>
                Join Network
              </Link>
              <Link href="/" className="text-sm text-[#888888] text-center py-2 flex items-center justify-center gap-1" onClick={() => setMenuOpen(false)}>
                <ArrowLeft size={14} /> Back to FCM Intelligence
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-[#1A3A25] bg-black py-8 mt-16">
        <div className="container mx-auto px-4">
          <p className="text-xs text-[#888888] leading-relaxed max-w-4xl">
            Inter-Mission is a marketplace operated by Firstclass Managerial Ltd (FCM Intelligence).
            We connect Post Office professionals with branch operators. FCM Intelligence is not an
            employment agency, employer, or contractor. All arrangements are made directly between
            parties. FCM Intelligence accepts no liability for the quality of work performed,
            financial losses, employment disputes, or any other matters arising from connections
            made through this platform. All users are responsible for their own tax, insurance,
            and legal obligations. By using Inter-Mission you agree to these terms.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <Link href="/" className="text-xs text-[#888888] hover:text-[#00FF88] transition-colors">
              FCM Intelligence
            </Link>
            <span className="text-[#1A3A25]">|</span>
            <Link href="/contact" className="text-xs text-[#888888] hover:text-[#00FF88] transition-colors">
              Contact
            </Link>
            <span className="text-[#1A3A25]">|</span>
            <span className="text-xs text-[#888888]">support@fcmgt.co.uk</span>
          </div>
        </div>
      </footer>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-[#1A3A25] z-50">
        <div className="flex items-center justify-around py-2">
          {mobileNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 text-xs ${pathname === item.href ? "text-[#00FF88]" : "text-[#888888]"}`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
