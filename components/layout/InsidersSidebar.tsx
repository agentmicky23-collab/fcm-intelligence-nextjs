"use client";

import Link from "next/link";
import { Compass, Search, BarChart2, BookOpen, User } from "lucide-react";

export function InsidersSidebar({ active = "/insiders" }: { active?: string }) {
  const links = [
    { href: "/insiders", icon: <Compass size={20} />, label: "Intel Feed" },
    { href: "/insiders/listings", icon: <Search size={20} />, label: "Opportunity Scan" },
    { href: "/insiders/market", icon: <BarChart2 size={20} />, label: "Market Data" },
    { href: "/insiders/insights", icon: <BookOpen size={20} />, label: "Insights Library" },
    { href: "/insiders/profile", icon: <User size={20} />, label: "My Profile" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 flex-col hidden md:flex">
      <div className="p-6 border-b border-border">
        <Link href="/insiders" className="text-xl font-bold tracking-tighter block">
          FCM <span className="text-gold">Insider</span>
        </Link>
        <span className="text-xs text-muted-foreground mt-1 block">Premium Access</span>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            link.href === active ? "bg-gold/10 text-gold" : "text-muted-foreground hover:text-white"
          }`}>
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white">← Public Home</Link>
      </div>
    </aside>
  );
}
