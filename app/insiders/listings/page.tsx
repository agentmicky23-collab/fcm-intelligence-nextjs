"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { Opportunity } from "@/shared/schema";
import { useState } from "react";
import { Filter } from "lucide-react";
import { InsidersSidebar } from "@/components/layout/InsidersSidebar";
import { InsidersMobileNav } from "@/components/layout/MobileBottomNav";

export default function InsiderListings() {
  const [typeFilter, setTypeFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");

  const { data: opps = [], isLoading } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities/insider"],
    queryFn: () => fetch("/api/opportunities/insider").then(r => r.json()),
  });

  const filtered = opps.filter(o => {
    if (typeFilter && o.businessType !== typeFilter) return false;
    if (regionFilter && o.region !== regionFilter) return false;
    return true;
  });

  const regions = [...new Set(opps.map(o => o.region).filter(Boolean))];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <InsidersSidebar active="/insiders/listings" />
      <main className="flex-1 overflow-y-auto p-6 pb-20 md:p-8 md:pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Opportunity Scanner</h1>
          <div className="flex gap-3 items-center">
            <Filter size={16} className="text-muted-foreground" />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-card border border-border rounded-md px-3 py-1.5 text-sm" data-testid="filter-type">
              <option value="">All Types</option>
              <option value="post_office">Post Office</option>
              <option value="forecourt">Forecourt</option>
              <option value="convenience_store">Convenience Store</option>
              <option value="newsagent">Newsagent</option>
            </select>
            <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)} className="bg-card border border-border rounded-md px-3 py-1.5 text-sm" data-testid="filter-region">
              <option value="">All Regions</option>
              {regions.map(r => <option key={r} value={r!}>{r}</option>)}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[1,2,3,4].map(i => <div key={i} className="fcm-card animate-pulse h-64" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No listings match your filters.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(opp => (
              <div key={opp.id} className="fcm-card p-0 overflow-hidden relative" data-testid={`listing-${opp.id}`}>
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur border border-gold/50 text-gold text-xs font-bold px-2 py-1 rounded">
                  {opp.score}/100
                </div>
                <div className="p-5">
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs font-bold bg-blue-500/20 text-blue-400 px-2 py-1 rounded">{opp.businessType.replace(/_/g, " ").toUpperCase()}</span>
                    {opp.region && <span className="text-xs font-bold bg-card border border-border px-2 py-1 rounded">{opp.region}</span>}
                  </div>
                  <h3 className="text-lg font-bold mb-1">{opp.businessName}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{opp.location}</p>

                  <div className="grid grid-cols-3 gap-3 border-t border-border pt-3">
                    {opp.annualFees && parseFloat(opp.annualFees) > 0 && (
                      <div><div className="text-[10px] text-muted-foreground uppercase">Fees</div><div className="font-financial text-sm">£{Number(opp.annualFees).toLocaleString()}</div></div>
                    )}
                    {opp.yearlyTurnover && parseFloat(opp.yearlyTurnover) > 0 && (
                      <div><div className="text-[10px] text-muted-foreground uppercase">T/O</div><div className="font-financial text-sm text-white">£{Number(opp.yearlyTurnover).toLocaleString()}</div></div>
                    )}
                    {opp.askingPrice && parseFloat(opp.askingPrice) > 0 && (
                      <div><div className="text-[10px] text-muted-foreground uppercase">Price</div><div className="font-financial text-sm text-white">£{Number(opp.askingPrice).toLocaleString()}</div></div>
                    )}
                  </div>
                </div>
                <div className="bg-background px-5 py-3 border-t border-border">
                  <Link href="/contact" className="text-sm text-gold hover:underline">Get Intelligence Report →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <InsidersMobileNav active="/insiders/listings" />
    </div>
  );
}
