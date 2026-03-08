"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Opportunity, ScanConfig } from "@/shared/schema";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardMobileNav } from "@/components/layout/MobileBottomNav";
import {
  Radar, SlidersHorizontal, Search, ChevronDown, ChevronUp,
  MapPin, Building2, Star, ExternalLink, Eye, Bookmark, TrendingUp,
  Filter, RotateCcw,
} from "lucide-react";

const BUSINESS_TYPES = [
  { value: "post_office", label: "Post Office" },
  { value: "forecourt", label: "Forecourt" },
  { value: "convenience_store", label: "Convenience Store" },
  { value: "newsagent", label: "Newsagent" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "off_licence", label: "Off Licence" },
];

const REGIONS = [
  "West Midlands", "East Midlands", "North West", "North East",
  "South West", "South East", "London", "Yorkshire", "East Anglia", "Scotland", "Wales",
];

const SOURCES = ["RightBiz", "Daltons", "Christie & Co", "BusinessesForSale", "Franchise Direct", "FirmsForSale", "Post Office Ltd"];

function formatCurrency(val: string | number | null | undefined) {
  if (!val) return "—";
  const n = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(n)) return "—";
  if (n >= 1000000) return `£${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `£${(n / 1000).toFixed(0)}k`;
  return `£${n.toFixed(0)}`;
}

function scoreColor(score: number | null | undefined) {
  if (!score) return "text-muted-foreground";
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

function scoreBg(score: number | null | undefined) {
  if (!score) return "bg-muted";
  if (score >= 80) return "bg-green-500/20 border-green-500/30";
  if (score >= 60) return "bg-yellow-500/20 border-yellow-500/30";
  if (score >= 40) return "bg-orange-500/20 border-orange-500/30";
  return "bg-red-500/20 border-red-500/30";
}

export default function MarketScan() {
  const { toast } = useToast();

  const [minFees, setMinFees] = useState(50000);
  const [minSessions, setMinSessions] = useState(1000);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [minTurnover, setMinTurnover] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["post_office", "forecourt", "convenience_store"]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const [feeWeight, setFeeWeight] = useState(1.0);
  const [sessionsWeight, setSessionsWeight] = useState(1.0);
  const [locationWeight, setLocationWeight] = useState(1.0);
  const [typeWeight, setTypeWeight] = useState(1.0);
  const [priceWeight, setPriceWeight] = useState(1.0);

  const [sortBy, setSortBy] = useState<"score" | "annualFees" | "askingPrice">("score");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: opportunities = [] } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities"],
    queryFn: () => fetch("/api/opportunities").then(r => r.json()),
  });

  const { data: scanConfig } = useQuery<ScanConfig>({
    queryKey: ["/api/scan/config"],
    queryFn: () => fetch("/api/scan/config").then(r => r.json()),
  });

  useEffect(() => {
    if (scanConfig) {
      if (scanConfig.minAnnualFees) setMinFees(parseFloat(scanConfig.minAnnualFees));
      if (scanConfig.minSessions) setMinSessions(scanConfig.minSessions);
      if (scanConfig.maxAskingPrice) setMaxPrice(parseFloat(scanConfig.maxAskingPrice));
      if (scanConfig.minWeeklyTurnover) setMinTurnover(parseFloat(scanConfig.minWeeklyTurnover));
      if (scanConfig.feeWeight) setFeeWeight(parseFloat(scanConfig.feeWeight));
      if (scanConfig.sessionsWeight) setSessionsWeight(parseFloat(scanConfig.sessionsWeight));
      if (scanConfig.locationWeight) setLocationWeight(parseFloat(scanConfig.locationWeight));
      if (scanConfig.typeWeight) setTypeWeight(parseFloat(scanConfig.typeWeight));
      if (scanConfig.priceWeight) setPriceWeight(parseFloat(scanConfig.priceWeight));
      if (Array.isArray(scanConfig.businessTypes) && scanConfig.businessTypes.length > 0) setSelectedTypes(scanConfig.businessTypes as string[]);
      if (Array.isArray(scanConfig.regions) && scanConfig.regions.length > 0) setSelectedRegions(scanConfig.regions as string[]);
      if (Array.isArray(scanConfig.sources) && scanConfig.sources.length > 0) setSelectedSources(scanConfig.sources as string[]);
    }
  }, [scanConfig]);

  const saveConfig = useMutation({
    mutationFn: () => fetch("/api/scan/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        minAnnualFees: minFees.toString(),
        minSessions,
        maxAskingPrice: maxPrice.toString(),
        minWeeklyTurnover: minTurnover.toString(),
        businessTypes: selectedTypes,
        regions: selectedRegions,
        sources: selectedSources,
        feeWeight: feeWeight.toString(),
        sessionsWeight: sessionsWeight.toString(),
        locationWeight: locationWeight.toString(),
        typeWeight: typeWeight.toString(),
        priceWeight: priceWeight.toString(),
      }),
    }).then(r => r.json()),
    onSuccess: () => {
      toast({ title: "Configuration Saved", description: "Scan parameters have been saved." });
    },
  });

  const triggerScan = useMutation({
    mutationFn: () => fetch("/api/scan/trigger", { method: "POST", headers: { "Content-Type": "application/json" } }).then(r => r.json()),
    onSuccess: () => {
      toast({ title: "Scan Triggered", description: "Market scan initiated. Results will update shortly." });
    },
  });

  const filtered = useMemo(() => {
    let results = opportunities.filter(opp => {
      const fees = opp.annualFees ? parseFloat(opp.annualFees) : 0;
      const sessions = opp.sessionsPerMonth || 0;
      const price = opp.askingPrice ? parseFloat(opp.askingPrice) : 0;
      const turnover = opp.weeklyTurnover ? parseFloat(opp.weeklyTurnover) : 0;

      if (fees < minFees) return false;
      if (sessions < minSessions) return false;
      if (maxPrice > 0 && price > maxPrice) return false;
      if (minTurnover > 0 && turnover < minTurnover) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(opp.businessType)) return false;
      if (selectedRegions.length > 0 && opp.region && !selectedRegions.includes(opp.region)) return false;
      if (selectedSources.length > 0 && opp.source && !selectedSources.includes(opp.source)) return false;

      return true;
    });

    results.sort((a, b) => {
      let aVal = 0, bVal = 0;
      if (sortBy === "score") {
        aVal = a.score || 0;
        bVal = b.score || 0;
      } else if (sortBy === "annualFees") {
        aVal = a.annualFees ? parseFloat(a.annualFees) : 0;
        bVal = b.annualFees ? parseFloat(b.annualFees) : 0;
      } else if (sortBy === "askingPrice") {
        aVal = a.askingPrice ? parseFloat(a.askingPrice) : 0;
        bVal = b.askingPrice ? parseFloat(b.askingPrice) : 0;
      }
      return sortDir === "desc" ? bVal - aVal : aVal - bVal;
    });

    return results;
  }, [opportunities, minFees, minSessions, maxPrice, minTurnover, selectedTypes, selectedRegions, selectedSources, sortBy, sortDir]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const toggleSource = (source: string) => {
    setSelectedSources(prev =>
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    );
  };

  const resetFilters = () => {
    setMinFees(50000);
    setMinSessions(1000);
    setMaxPrice(500000);
    setMinTurnover(0);
    setSelectedTypes(["post_office", "forecourt", "convenience_store"]);
    setSelectedRegions([]);
    setSelectedSources([]);
    setFeeWeight(1.0);
    setSessionsWeight(1.0);
    setLocationWeight(1.0);
    setTypeWeight(1.0);
    setPriceWeight(1.0);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar active="/dashboard/market-scan" />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="flex flex-col lg:flex-row">
          <aside className="lg:w-80 xl:w-96 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-border bg-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <SlidersHorizontal size={20} className="text-gold" />
                Scan Parameters
              </h2>
              <button
                onClick={resetFilters}
                className="text-xs text-muted-foreground hover:text-white flex items-center gap-1"
                data-testid="button-reset-filters"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 flex justify-between">
                  <span>Min Annual Fees</span>
                  <span className="font-mono text-gold">{formatCurrency(minFees)}</span>
                </label>
                <input
                  type="range"
                  min={0} max={200000} step={5000}
                  value={minFees}
                  onChange={e => setMinFees(parseInt(e.target.value))}
                  className="w-full accent-[hsl(51,100%,50%)]"
                  data-testid="slider-min-fees"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 flex justify-between">
                  <span>Min Sessions/Month</span>
                  <span className="font-mono text-gold">{minSessions.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min={0} max={5000} step={100}
                  value={minSessions}
                  onChange={e => setMinSessions(parseInt(e.target.value))}
                  className="w-full accent-[hsl(51,100%,50%)]"
                  data-testid="slider-min-sessions"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 flex justify-between">
                  <span>Max Asking Price</span>
                  <span className="font-mono text-gold">{formatCurrency(maxPrice)}</span>
                </label>
                <input
                  type="range"
                  min={0} max={2000000} step={25000}
                  value={maxPrice}
                  onChange={e => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-[hsl(51,100%,50%)]"
                  data-testid="slider-max-price"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 flex justify-between">
                  <span>Min Weekly Turnover</span>
                  <span className="font-mono text-gold">{formatCurrency(minTurnover)}</span>
                </label>
                <input
                  type="range"
                  min={0} max={50000} step={1000}
                  value={minTurnover}
                  onChange={e => setMinTurnover(parseInt(e.target.value))}
                  className="w-full accent-[hsl(51,100%,50%)]"
                  data-testid="slider-min-turnover"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Business Types</h3>
              <div className="space-y-1">
                {BUSINESS_TYPES.map(bt => (
                  <label key={bt.value} className="flex items-center gap-2 text-sm cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(bt.value)}
                      onChange={() => toggleType(bt.value)}
                      className="accent-[hsl(51,100%,50%)] rounded"
                      data-testid={`checkbox-type-${bt.value}`}
                    />
                    <span className={selectedTypes.includes(bt.value) ? "text-white" : "text-muted-foreground"}>
                      {bt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Regions</h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {REGIONS.map(region => (
                  <label key={region} className="flex items-center gap-2 text-sm cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedRegions.includes(region)}
                      onChange={() => toggleRegion(region)}
                      className="accent-[hsl(51,100%,50%)] rounded"
                      data-testid={`checkbox-region-${region.replace(/\s/g, '-')}`}
                    />
                    <span className={selectedRegions.includes(region) ? "text-white" : "text-muted-foreground"}>
                      {region}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sources</h3>
              <div className="space-y-1">
                {SOURCES.map(source => (
                  <label key={source} className="flex items-center gap-2 text-sm cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(source)}
                      onChange={() => toggleSource(source)}
                      className="accent-[hsl(51,100%,50%)] rounded"
                      data-testid={`checkbox-source-${source}`}
                    />
                    <span className={selectedSources.includes(source) ? "text-white" : "text-muted-foreground"}>
                      {source}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Scoring Weights</h3>
              <div className="space-y-3">
                {[
                  { label: "Fees", value: feeWeight, set: setFeeWeight, id: "fee" },
                  { label: "Sessions", value: sessionsWeight, set: setSessionsWeight, id: "sessions" },
                  { label: "Location", value: locationWeight, set: setLocationWeight, id: "location" },
                  { label: "Type", value: typeWeight, set: setTypeWeight, id: "type" },
                  { label: "Price", value: priceWeight, set: setPriceWeight, id: "price" },
                ].map(w => (
                  <div key={w.id}>
                    <label className="text-xs text-muted-foreground flex justify-between mb-1">
                      <span>{w.label}</span>
                      <span className="font-mono text-gold">{w.value.toFixed(1)}x</span>
                    </label>
                    <input
                      type="range"
                      min={0} max={2} step={0.1}
                      value={w.value}
                      onChange={e => w.set(parseFloat(e.target.value))}
                      className="w-full accent-[hsl(51,100%,50%)]"
                      data-testid={`slider-weight-${w.id}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => saveConfig.mutate()}
                disabled={saveConfig.isPending}
                className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
                data-testid="button-save-config"
              >
                {saveConfig.isPending ? "Saving..." : "Save Configuration"}
              </button>
              <button
                onClick={() => triggerScan.mutate()}
                disabled={triggerScan.isPending}
                className="btn-primary w-full flex items-center justify-center gap-2"
                data-testid="button-trigger-scan"
              >
                <Radar size={16} className={triggerScan.isPending ? "animate-spin" : ""} />
                {triggerScan.isPending ? "Scanning..." : "Trigger Market Scan"}
              </button>
            </div>
          </aside>

          <div className="flex-1 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Radar size={24} className="text-gold" />
                  Market Scan Command Centre
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""} matching criteria
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs text-muted-foreground">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-card border border-border rounded px-3 py-1.5 text-sm text-white"
                  data-testid="select-sort-by"
                >
                  <option value="score">FCM Score</option>
                  <option value="annualFees">Annual Fees</option>
                  <option value="askingPrice">Asking Price</option>
                </select>
                <button
                  onClick={() => setSortDir(d => d === "desc" ? "asc" : "desc")}
                  className="p-1.5 border border-border rounded hover:border-gold transition-colors"
                  data-testid="button-sort-direction"
                >
                  {sortDir === "desc" ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Search size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No results match your criteria</p>
                <p className="text-sm mt-1">Try adjusting your scan parameters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(opp => {
                  const isExpanded = expandedId === opp.id;
                  return (
                    <div
                      key={opp.id}
                      className="bg-card border border-border rounded-lg overflow-hidden hover:border-gold/50 transition-colors"
                      data-testid={`card-result-${opp.id}`}
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-lg truncate" data-testid={`text-business-name-${opp.id}`}>
                                {opp.businessName}
                              </h3>
                              <span className="text-xs px-2 py-0.5 bg-muted rounded font-mono">
                                {opp.businessType?.replace(/_/g, " ")}
                              </span>
                              {opp.status && (
                                <span className={`text-xs px-2 py-0.5 rounded font-semibold uppercase ${
                                  opp.status === "pursue" ? "bg-gold/20 text-gold" :
                                  opp.status === "watch" ? "bg-yellow-500/20 text-yellow-400" :
                                  opp.status === "new" ? "bg-blue-500/20 text-blue-400" :
                                  "bg-green-500/20 text-green-400"
                                }`}>
                                  {opp.status}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {opp.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin size={14} /> {opp.location}
                                </span>
                              )}
                              {opp.region && (
                                <span className="flex items-center gap-1">
                                  <Building2 size={14} /> {opp.region}
                                </span>
                              )}
                              {opp.source && (
                                <span className="text-xs font-mono opacity-60">{opp.source}</span>
                              )}
                            </div>
                          </div>

                          <div className={`flex-shrink-0 w-16 h-16 rounded-lg border flex flex-col items-center justify-center ${scoreBg(opp.score)}`}>
                            <span className={`text-2xl font-bold font-mono ${scoreColor(opp.score)}`} data-testid={`text-score-${opp.id}`}>
                              {opp.score || "—"}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase">FCM</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                          <div className="bg-background rounded p-3 border border-border">
                            <div className="text-xs text-muted-foreground mb-1">Annual Fees</div>
                            <div className="font-financial text-lg" data-testid={`text-fees-${opp.id}`}>
                              {formatCurrency(opp.annualFees)}
                            </div>
                          </div>
                          <div className="bg-background rounded p-3 border border-border">
                            <div className="text-xs text-muted-foreground mb-1">Sessions/Mo</div>
                            <div className="font-financial text-lg" data-testid={`text-sessions-${opp.id}`}>
                              {opp.sessionsPerMonth?.toLocaleString() || "—"}
                            </div>
                          </div>
                          <div className="bg-background rounded p-3 border border-border">
                            <div className="text-xs text-muted-foreground mb-1">Asking Price</div>
                            <div className="font-financial text-lg" data-testid={`text-price-${opp.id}`}>
                              {formatCurrency(opp.askingPrice)}
                            </div>
                          </div>
                          <div className="bg-background rounded p-3 border border-border">
                            <div className="text-xs text-muted-foreground mb-1">Weekly Turnover</div>
                            <div className="font-financial text-lg" data-testid={`text-turnover-${opp.id}`}>
                              {formatCurrency(opp.weeklyTurnover)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex gap-2">
                            <button
                              className="text-xs px-3 py-1.5 border border-border rounded hover:border-gold hover:text-gold transition-colors flex items-center gap-1"
                              onClick={() => {
                                toast({ title: "Shortlisted", description: `${opp.businessName} added to watchlist.` });
                              }}
                              data-testid={`button-shortlist-${opp.id}`}
                            >
                              <Bookmark size={12} /> Shortlist
                            </button>
                            <button
                              className="text-xs px-3 py-1.5 border border-border rounded hover:border-gold hover:text-gold transition-colors flex items-center gap-1"
                              onClick={() => {
                                toast({ title: "Detailed Report", description: `Generating full report for ${opp.businessName}...` });
                              }}
                              data-testid={`button-report-${opp.id}`}
                            >
                              <Eye size={12} /> Full Report
                            </button>
                            {opp.sourceUrl && (
                              <a
                                href={opp.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-3 py-1.5 border border-border rounded hover:border-gold hover:text-gold transition-colors flex items-center gap-1"
                                data-testid={`link-source-${opp.id}`}
                              >
                                <ExternalLink size={12} /> Source
                              </a>
                            )}
                          </div>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                            className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 transition-colors"
                            data-testid={`button-expand-${opp.id}`}
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {isExpanded ? "Hide Details" : "Show Details"}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-border bg-background/50 p-5 space-y-3">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <TrendingUp size={14} className="text-gold" /> Report Summary
                          </h4>
                          {opp.notes ? (
                            <p className="text-sm text-muted-foreground leading-relaxed">{opp.notes}</p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No report summary available for this opportunity.</p>
                          )}

                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <span className="text-xs text-muted-foreground">Confidence</span>
                              <div className="font-semibold text-sm mt-1">
                                {opp.confidence ? (
                                  <span className={
                                    opp.confidence === "high" ? "text-green-400" :
                                    opp.confidence === "medium" ? "text-yellow-400" :
                                    "text-red-400"
                                  }>
                                    {opp.confidence.charAt(0).toUpperCase() + opp.confidence.slice(1)}
                                  </span>
                                ) : "—"}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">Yearly Turnover</span>
                              <div className="font-financial text-sm mt-1">
                                {formatCurrency(opp.yearlyTurnover)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <DashboardMobileNav active="/dashboard/market-scan" />
    </div>
  );
}
