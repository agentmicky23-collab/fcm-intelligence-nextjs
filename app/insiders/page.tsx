"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Bell, ChevronRight } from "lucide-react";
import type { Opportunity, Content } from "@/shared/schema";
import { InsidersSidebar } from "@/components/layout/InsidersSidebar";
import { InsidersMobileNav } from "@/components/layout/MobileBottomNav";

export default function InsidersHome() {
  const { data: opps = [] } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities/insider"],
    queryFn: () => fetch("/api/opportunities/insider").then(r => r.json()),
  });

  const { data: posts = [] } = useQuery<Content[]>({
    queryKey: ["/api/content/published"],
    queryFn: () => fetch("/api/content/published").then(r => r.json()),
  });

  const latestOpps = opps.slice(0, 3);
  const latestPosts = posts.slice(0, 2);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <InsidersSidebar active="/insiders" />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <header className="border-b border-border bg-card/50 px-6 py-4 flex justify-between items-center sticky top-0 backdrop-blur z-10">
          <h1 className="text-xl font-bold">Welcome back, Partner</h1>
          <button className="relative p-2 text-muted-foreground hover:text-gold transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full"></span>
          </button>
        </header>

        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-r from-gold/20 to-transparent border border-gold/30 rounded-lg p-4 flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-gold mb-1">New Opportunities</div>
                <div className="text-xs text-muted-foreground">Since your last visit</div>
              </div>
              <div className="text-3xl font-financial">{opps.filter(o => o.status === "new").length}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
              <div>
                <div className="text-sm font-medium mb-1">New Market Insights</div>
                <div className="text-xs text-muted-foreground">Published this week</div>
              </div>
              <div className="text-3xl font-financial text-white">{posts.length}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-end">
                <h2 className="text-xl font-bold">Latest Premium Listings</h2>
                <Link href="/insiders/listings" className="text-sm text-gold hover:underline flex items-center">View all <ChevronRight size={16} /></Link>
              </div>

              {latestOpps.map((opp) => (
                <div key={opp.id} className="fcm-card p-0 overflow-hidden relative" data-testid={`insider-opp-${opp.id}`}>
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur border border-gold/50 text-gold text-xs font-bold px-2 py-1 rounded">
                    SCORE: {opp.score}/100
                  </div>
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      <span className="text-xs font-bold bg-blue-500/20 text-blue-400 px-2 py-1 rounded">{opp.businessType.replace(/_/g, " ").toUpperCase()}</span>
                      {opp.region && <span className="text-xs font-bold bg-card border border-border px-2 py-1 rounded">{opp.region}</span>}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{opp.businessName}</h3>
                    {opp.notes && <p className="text-muted-foreground text-sm mb-6">{opp.notes}</p>}

                    <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
                      {opp.annualFees && parseFloat(opp.annualFees) > 0 && (
                        <div>
                          <div className="text-xs text-muted-foreground uppercase">PO Remuneration</div>
                          <div className="font-financial text-lg">£{Number(opp.annualFees).toLocaleString()}</div>
                        </div>
                      )}
                      {opp.yearlyTurnover && parseFloat(opp.yearlyTurnover) > 0 && (
                        <div>
                          <div className="text-xs text-muted-foreground uppercase">Annual T/O</div>
                          <div className="font-financial text-lg text-white">£{Number(opp.yearlyTurnover).toLocaleString()}</div>
                        </div>
                      )}
                      {opp.askingPrice && parseFloat(opp.askingPrice) > 0 && (
                        <div>
                          <div className="text-xs text-muted-foreground uppercase">Asking Price</div>
                          <div className="font-financial text-lg text-white">£{Number(opp.askingPrice).toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-background px-6 py-4 flex justify-between items-center border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Added {opp.createdAt && new Date(opp.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </span>
                    <Link href="/contact" className="btn-secondary text-sm py-1.5 h-auto min-h-0">Request Full Dossier</Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold mb-6">Market Pulse</h2>
                <div className="bg-card border border-border rounded-lg p-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium">Avg PO Fees (Mains)</span>
                    <span className="text-green-500 text-xs font-bold">+2.4%</span>
                  </div>
                  <div className="font-financial text-3xl mb-1 text-gold">£68,400</div>
                  <div className="text-xs text-muted-foreground">Rolling 3-month average across UK.</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-xl font-bold">Latest Intelligence</h2>
                </div>
                <div className="space-y-4">
                  {latestPosts.map((post) => (
                    <div key={post.id} className="group cursor-pointer">
                      <div className="text-xs text-gold font-mono mb-1">{post.track === "po_insider" ? "PO INSIDER" : "UK BUSINESS STRATEGY"}</div>
                      <h3 className="font-bold text-white group-hover:text-gold transition-colors leading-tight mb-2">{post.title}</h3>
                      <div className="text-xs text-muted-foreground">
                        {Math.ceil((post.body?.length || 0) / 1000)} min read
                        {post.publishedAt && ` • ${new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <InsidersMobileNav active="/insiders" />
    </div>
  );
}
