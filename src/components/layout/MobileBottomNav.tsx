"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard, Network, Target, FileText, MoreHorizontal,
  Radar, PieChart, MessageSquare, Activity, Settings, X,
  Compass, Search, BarChart2, BookOpen, User,
} from "lucide-react";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function BottomNavBar({ items, moreItems, active }: { items: NavItem[]; moreItems?: NavItem[]; active: string }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {showMore && moreItems && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="absolute bottom-16 left-0 right-0 bg-[#1A1A1A] border-t border-border rounded-t-xl p-4 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-bold text-white">More</span>
              <button
                onClick={() => setShowMore(false)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-white/10"
                data-testid="button-close-more-menu"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {moreItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 min-h-[64px] rounded-lg transition-colors ${
                    active === item.href
                      ? "bg-gold/10 text-gold"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setShowMore(false)}
                  data-testid={`mobile-more-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {item.icon}
                  <span className="text-[10px] font-medium leading-tight text-center">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav
        className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#1A1A1A] border-t border-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        data-testid="mobile-bottom-nav"
      >
        <div className="flex items-stretch">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-1.5 transition-colors relative ${
                active === item.href
                  ? "text-gold"
                  : "text-muted-foreground"
              }`}
              data-testid={`mobile-tab-${item.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              {active === item.href && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gold rounded-full" />
              )}
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
          {moreItems && (
            <button
              onClick={() => setShowMore(!showMore)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-1.5 transition-colors relative ${
                showMore || moreItems.some((m) => m.href === active)
                  ? "text-gold"
                  : "text-muted-foreground"
              }`}
              data-testid="mobile-tab-more"
            >
              {(showMore || moreItems.some((m) => m.href === active)) && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gold rounded-full" />
              )}
              <MoreHorizontal size={20} />
              <span className="text-[10px] font-medium">More</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
}

export function DashboardMobileNav({ active }: { active: string }) {
  const mainTabs: NavItem[] = [
    { href: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Overview" },
    { href: "/dashboard/swarm", icon: <Network size={20} />, label: "Swarm" },
    { href: "/dashboard/opportunities", icon: <Target size={20} />, label: "Pipeline" },
    { href: "/dashboard/content", icon: <FileText size={20} />, label: "Content" },
  ];

  const moreItems: NavItem[] = [
    { href: "/dashboard/market-scan", icon: <Radar size={20} />, label: "Market Scan" },
    { href: "/dashboard/costs", icon: <PieChart size={20} />, label: "Costs" },
    { href: "/dashboard/hr", icon: <MessageSquare size={20} />, label: "Ask Harper" },
    { href: "/dashboard/agents", icon: <Activity size={20} />, label: "Agents" },
    { href: "/dashboard/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return <BottomNavBar items={mainTabs} moreItems={moreItems} active={active} />;
}

export function InsidersMobileNav({ active }: { active: string }) {
  const tabs: NavItem[] = [
    { href: "/insiders", icon: <Compass size={20} />, label: "Feed" },
    { href: "/insiders/listings", icon: <Search size={20} />, label: "Listings" },
    { href: "/insiders/market", icon: <BarChart2 size={20} />, label: "Market" },
    { href: "/insiders/insights", icon: <BookOpen size={20} />, label: "Insights" },
    { href: "/insiders/profile", icon: <User size={20} />, label: "Profile" },
  ];

  return <BottomNavBar items={tabs} active={active} />;
}
