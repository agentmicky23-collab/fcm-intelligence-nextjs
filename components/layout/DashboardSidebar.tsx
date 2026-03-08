"use client";

import Link from "next/link";
import { LayoutDashboard, Target, FileText, PieChart, Users, Settings, Activity, Network, Radar, MessageSquare } from "lucide-react";

export function DashboardSidebar({ active = "/dashboard" }: { active?: string }) {
  const links = [
    { href: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Overview" },
    { href: "/dashboard/swarm", icon: <Network size={20} />, label: "Agent Swarm" },
    { href: "/dashboard/opportunities", icon: <Target size={20} />, label: "Opportunities" },
    { href: "/dashboard/market-scan", icon: <Radar size={20} />, label: "Market Scan" },
    { href: "/dashboard/content", icon: <FileText size={20} />, label: "Content Control" },
    { href: "/dashboard/costs", icon: <PieChart size={20} />, label: "Costs" },
    { href: "/dashboard/hr", icon: <MessageSquare size={20} />, label: "Ask Harper" },
    { href: "/dashboard/agents", icon: <Activity size={20} />, label: "Agents" },
    { href: "/dashboard/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 flex-col hidden md:flex">
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="text-xl font-bold tracking-tighter block">
          FCM <span className="text-gold">Admin</span>
        </Link>
        <span className="text-xs text-muted-foreground font-mono mt-1 block">mikeshparekh@gmail.com</span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white">
          ← Exit to Public Site
        </Link>
      </div>
    </aside>
  );
}
