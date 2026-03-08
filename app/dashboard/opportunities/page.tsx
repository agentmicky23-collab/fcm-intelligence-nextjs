"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useState } from "react";
import type { Opportunity } from "@/shared/schema";
import { Eye, ArrowRight, X, Filter } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardMobileNav } from "@/components/layout/MobileBottomNav";

export default function DashboardOpportunities() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  const { data: opps = [], isLoading } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities", statusFilter, typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (typeFilter) params.set("businessType", typeFilter);
      const res = await fetch(`/api/opportunities?${params}`);
      return res.json();
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest("PATCH", `/api/opportunities/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });

  const confidenceColor = (c: string | null) => {
    if (c === "HIGH") return "text-green-400 bg-green-500/10";
    if (c === "MODERATE") return "text-yellow-400 bg-yellow-500/10";
    if (c === "SPECULATIVE") return "text-orange-400 bg-orange-500/10";
    return "text-red-400 bg-red-500/10";
  };

  const statusBadge = (s: string | null) => {
    if (s === "new") return "bg-blue-500/20 text-blue-400";
    if (s === "watch") return "bg-yellow-500/20 text-yellow-400";
    if (s === "pursue") return "bg-gold/20 text-gold";
    if (s === "closed") return "bg-green-500/20 text-green-400";
    return "bg-red-500/20 text-red-400";
  };

  const typeLabel = (t: string) => t.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar active="/dashboard/opportunities" />
      <main className="flex-1 overflow-y-auto p-6 pb-20 md:p-8 md:pb-8">
        <div className="flex justify-between items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold shrink-0">Opportunity Pipeline</h1>
          <div className="flex gap-3 items-center">
            <Filter size={16} className="text-muted-foreground hidden md:block" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-card border border-border rounded-md px-3 py-1.5 text-sm"
              data-testid="filter-status"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="watch">Watch</option>
              <option value="pursue">Pursue</option>
              <option value="closed">Closed</option>
              <option value="dismissed">Dismissed</option>
            </select>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-card border border-border rounded-md px-3 py-1.5 text-sm"
              data-testid="filter-type"
            >
              <option value="">All Types</option>
              <option value="post_office">Post Office</option>
              <option value="forecourt">Forecourt</option>
              <option value="convenience_store">Convenience Store</option>
              <option value="newsagent">Newsagent</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="fcm-card animate-pulse h-20" />)}</div>
        ) : opps.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No opportunities match your filters.</div>
        ) : (
          <div className="space-y-3">
            {opps.map((opp) => (
              <div key={opp.id} className="bg-card border border-border rounded-lg p-4 hover:border-gold/50 transition-colors" data-testid={`opp-row-${opp.id}`}>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono text-muted-foreground">{opp.id}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${statusBadge(opp.status)}`}>{opp.status?.toUpperCase()}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${confidenceColor(opp.confidence)}`}>{opp.confidence}</span>
                    </div>
                    <h3 className="font-bold text-lg text-white">{opp.businessName}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{typeLabel(opp.businessType)}</span>
                      <span>{opp.location}</span>
                      {opp.source && <span>via {opp.source}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {opp.annualFees && parseFloat(opp.annualFees) > 0 && (
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Fees</div>
                        <div className="font-financial text-sm">£{Number(opp.annualFees).toLocaleString()}</div>
                      </div>
                    )}
                    {opp.askingPrice && parseFloat(opp.askingPrice) > 0 && (
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Price</div>
                        <div className="font-financial text-sm">£{Number(opp.askingPrice).toLocaleString()}</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Score</div>
                      <div className="font-financial text-lg">{opp.score}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedOpp(opp)} className="p-2 min-h-[44px] min-w-[44px] border border-border rounded hover:border-gold transition-colors inline-flex items-center justify-center" data-testid={`button-view-${opp.id}`}>
                      <Eye size={16} className="text-muted-foreground" />
                    </button>
                    {opp.status !== "pursue" && opp.status !== "closed" && (
                      <button onClick={() => updateStatus.mutate({ id: opp.id, status: "pursue" })} className="btn-primary text-xs py-1.5 px-3 min-h-[44px] min-w-[44px]" data-testid={`button-pursue-${opp.id}`}>
                        Pursue
                      </button>
                    )}
                    {opp.status !== "watch" && opp.status !== "closed" && (
                      <button onClick={() => updateStatus.mutate({ id: opp.id, status: "watch" })} className="btn-secondary text-xs py-1.5 px-3 min-h-[44px] min-w-[44px]" data-testid={`button-watch-${opp.id}`}>
                        Watch
                      </button>
                    )}
                    {opp.status !== "dismissed" && (
                      <button onClick={() => updateStatus.mutate({ id: opp.id, status: "dismissed" })} className="text-xs py-1.5 px-3 min-h-[44px] min-w-[44px] text-red-400 hover:text-red-300 border border-transparent hover:border-red-500/30 rounded-md transition-colors inline-flex items-center justify-center" data-testid={`button-dismiss-${opp.id}`}>
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedOpp && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOpp(null)}>
            <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-mono text-muted-foreground block mb-1">{selectedOpp.id}</span>
                  <h2 className="text-2xl font-bold">{selectedOpp.businessName}</h2>
                </div>
                <button onClick={() => setSelectedOpp(null)} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-gold"><X size={20} /></button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-background p-3 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Type</div>
                  <div className="font-medium">{typeLabel(selectedOpp.businessType)}</div>
                </div>
                <div className="bg-background p-3 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Location</div>
                  <div className="font-medium">{selectedOpp.location || "Not specified"}</div>
                </div>
                <div className="bg-background p-3 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Score</div>
                  <div className="font-financial text-2xl">{selectedOpp.score}/100</div>
                </div>
                <div className="bg-background p-3 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                  <div className={`font-bold ${confidenceColor(selectedOpp.confidence)} inline-block px-2 py-0.5 rounded`}>{selectedOpp.confidence}</div>
                </div>
              </div>

              <h3 className="font-bold mb-3 text-gold">Financials</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {selectedOpp.annualFees && <div><div className="text-xs text-muted-foreground">Annual Fees</div><div className="font-financial text-lg">£{Number(selectedOpp.annualFees).toLocaleString()}</div></div>}
                {selectedOpp.askingPrice && <div><div className="text-xs text-muted-foreground">Asking Price</div><div className="font-financial text-lg">£{Number(selectedOpp.askingPrice).toLocaleString()}</div></div>}
                {selectedOpp.yearlyTurnover && <div><div className="text-xs text-muted-foreground">Annual Turnover</div><div className="font-financial text-lg">£{Number(selectedOpp.yearlyTurnover).toLocaleString()}</div></div>}
                {selectedOpp.weeklyTurnover && <div><div className="text-xs text-muted-foreground">Weekly Turnover</div><div className="font-financial text-lg">£{Number(selectedOpp.weeklyTurnover).toLocaleString()}</div></div>}
                {selectedOpp.sessionsPerMonth && <div><div className="text-xs text-muted-foreground">Sessions/Month</div><div className="font-financial text-lg">{selectedOpp.sessionsPerMonth}</div></div>}
              </div>

              {selectedOpp.notes && (
                <div className="mb-6">
                  <h3 className="font-bold mb-2">Notes</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{selectedOpp.notes}</p>
                </div>
              )}

              {selectedOpp.source && (
                <div className="text-xs text-muted-foreground">
                  Source: {selectedOpp.source}
                  {selectedOpp.sourceUrl && <a href={selectedOpp.sourceUrl} className="text-gold ml-2 hover:underline" target="_blank" rel="noreferrer">View listing →</a>}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <DashboardMobileNav active="/dashboard/opportunities" />
    </div>
  );
}
