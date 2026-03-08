"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { Content } from "@/shared/schema";
import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardMobileNav } from "@/components/layout/MobileBottomNav";
import {
  FileText, CheckCircle, XCircle, ChevronDown, ChevronRight, RefreshCw, Wand2,
  Filter, Calendar, Clock, Globe, Twitter, Linkedin, Mail, BookOpen, ArrowRight, ArrowLeft,
  Loader2, Eye, Edit3, Check
} from "lucide-react";

const PLATFORMS = [
  { key: "website", label: "Website", icon: Globe },
  { key: "twitter", label: "Twitter/X", icon: Twitter },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin },
  { key: "email", label: "Email", icon: Mail },
  { key: "blog", label: "Blog", icon: BookOpen },
];

const TONES = ["operator", "professional", "casual", "authoritative", "empathetic"];
const STYLES = ["operator_to_operator", "editorial", "newsletter", "social_post", "report"];

const PIPELINE_STAGES = [
  { key: "draft", label: "Draft", color: "bg-blue-500" },
  { key: "review", label: "Rex Review", color: "bg-yellow-500" },
  { key: "approval", label: "Approval", color: "bg-orange-500" },
  { key: "published", label: "Published", color: "bg-green-500" },
];

function getWeekDays() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay() + 1);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDate(d: Date) {
  return d.toISOString().split("T")[0];
}

function dayLabel(d: Date) {
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" });
}

export default function ContentPipeline() {
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery<Content[]>({
    queryKey: ["/api/content"],
    queryFn: () => fetch("/api/content").then(r => r.json()),
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [adaptingPlatform, setAdaptingPlatform] = useState<string | null>(null);
  const [regenerating, setRegenating] = useState(false);
  const [approvalPlatforms, setApprovalPlatforms] = useState<string[]>([]);

  const updateContent = useMutation({
    mutationFn: ({ id, ...body }: { id: number; [key: string]: any }) =>
      apiRequest("PATCH", `/api/content/${id}`, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/content"] }),
  });

  const adaptContent = useMutation({
    mutationFn: ({ id, platform }: { id: number; platform: string }) =>
      apiRequest("POST", `/api/content/${id}/adapt`, { platform }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/content"] }),
  });

  const approveContent = useMutation({
    mutationFn: ({ id, platforms }: { id: number; platforms: string[] }) =>
      apiRequest("POST", `/api/content/${id}/approve`, { platforms }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setApprovalPlatforms([]);
    },
  });

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = { draft: 0, review: 0, approval: 0, published: 0 };
    items.forEach(i => { if (counts[i.status || "draft"] !== undefined) counts[i.status || "draft"]++; });
    return counts;
  }, [items]);

  const contentTypes = useMemo(() => {
    const types = new Set(items.map(i => i.contentType));
    return Array.from(types);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(i => {
      if (filterStatus !== "all" && i.status !== filterStatus) return false;
      if (filterType !== "all" && i.contentType !== filterType) return false;
      return true;
    });
  }, [items, filterStatus, filterType]);

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return items.find(i => i.id === selectedId) || null;
  }, [items, selectedId]);

  const weekDays = useMemo(() => getWeekDays(), []);
  const scheduledByDay = useMemo(() => {
    const map: Record<string, Content[]> = {};
    weekDays.forEach(d => { map[formatDate(d)] = []; });
    items.forEach(i => {
      if (i.scheduledDate) {
        const key = typeof i.scheduledDate === "string" ? i.scheduledDate : formatDate(new Date(i.scheduledDate));
        if (map[key]) map[key].push(i);
      }
    });
    return map;
  }, [items, weekDays]);

  const handleAdapt = async (platform: string) => {
    if (!selected) return;
    setAdaptingPlatform(platform);
    await new Promise(r => setTimeout(r, 1500));
    await adaptContent.mutateAsync({ id: selected.id, platform });
    setAdaptingPlatform(null);
  };

  const handleRegenerate = async () => {
    if (!selected) return;
    setRegenating(true);
    await new Promise(r => setTimeout(r, 2000));
    setRegenating(false);
  };

  const verdictBadge = (v: string | null) => {
    if (v === "pass") return "text-green-400 bg-green-500/10";
    if (v === "conditional_pass") return "text-yellow-400 bg-yellow-500/10";
    return "text-red-400 bg-red-500/10";
  };

  const toggleApprovalPlatform = (p: string) => {
    setApprovalPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar active="/dashboard/content" />
      <main className="flex-1 overflow-y-auto p-6 pb-20 md:p-8 md:pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Content Mission Control</h1>
        </div>

        <div className="flex items-center gap-2 mb-6 p-4 bg-card border border-border rounded-lg" data-testid="pipeline-status-bar">
          {PIPELINE_STAGES.map((stage, idx) => (
            <div key={stage.key} className="flex items-center gap-2">
              <button
                onClick={() => setFilterStatus(filterStatus === stage.key ? "all" : stage.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  filterStatus === stage.key ? "bg-white/10 border border-gold text-gold" : "hover:bg-white/5"
                }`}
                data-testid={`button-filter-${stage.key}`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${stage.color}`}></span>
                <span>{stage.label}</span>
                <span className="font-financial text-xs ml-1">{stageCounts[stage.key]}</span>
              </button>
              {idx < PIPELINE_STAGES.length - 1 && <ArrowRight size={14} className="text-muted-foreground" />}
            </div>
          ))}
          <div className="ml-auto">
            <button
              onClick={() => setFilterStatus("all")}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors ${filterStatus === "all" ? "bg-gold text-black" : "text-muted-foreground hover:text-white"}`}
              data-testid="button-filter-all"
            >
              All ({items.length})
            </button>
          </div>
        </div>

        <div className="flex gap-6 mb-6">
          <div className={`w-full md:w-80 md:flex-shrink-0 ${selected ? "hidden md:block" : "block"}`}>
            <div className="flex items-center gap-2 mb-3">
              <Filter size={16} className="text-muted-foreground" />
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="bg-card border border-border rounded-md text-sm px-3 py-1.5 text-foreground flex-1"
                data-testid="select-content-type"
              >
                <option value="all">All Types</option>
                {contentTypes.map(t => (
                  <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 max-h-[calc(100vh-340px)] overflow-y-auto pr-1" data-testid="content-list">
              {filteredItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-lg">
                  No content items match filters
                </div>
              )}
              {filteredItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left bg-card border rounded-lg p-3 transition-colors cursor-pointer ${
                    selectedId === item.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"
                  }`}
                  data-testid={`content-card-${item.id}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-mono text-gold uppercase">{item.contentType.replace(/_/g, " ")}</span>
                    {item.rexVerdict && (
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${verdictBadge(item.rexVerdict)}`}>
                        {item.rexVerdict.replace("_", " ")}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">{item.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>By {item.author}</span>
                    {item.rexScore !== null && <span className="font-financial">Score: {item.rexScore}</span>}
                  </div>
                  <div className="mt-1.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      item.status === "published" ? "bg-green-500/10 text-green-400" :
                      item.status === "approval" ? "bg-orange-500/10 text-orange-400" :
                      item.status === "review" ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-blue-500/10 text-blue-400"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={`flex-1 min-w-0 ${selected ? "block" : "hidden md:block"}`}>
            {!selected ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center" data-testid="content-empty-state">
                <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold mb-2">Select a content item</h2>
                <p className="text-sm text-muted-foreground">Choose from the list to view, edit, adapt, and approve content</p>
              </div>
            ) : (
              <div className="space-y-4" data-testid="content-workbench">
                <div className="bg-card border border-border rounded-lg p-6">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="md:hidden flex items-center gap-1.5 text-sm text-gold mb-4 min-h-[44px]"
                    data-testid="button-back-to-list"
                  >
                    <ArrowLeft size={16} /> Back to list
                  </button>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-xs font-mono text-gold uppercase mb-1 block">{selected.contentType.replace(/_/g, " ")}</span>
                      <h2 className="text-xl font-bold" data-testid="text-selected-title">{selected.title}</h2>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span>By {selected.author}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          selected.status === "published" ? "bg-green-500/10 text-green-400" :
                          selected.status === "approval" ? "bg-orange-500/10 text-orange-400" :
                          selected.status === "review" ? "bg-yellow-500/10 text-yellow-400" :
                          "bg-blue-500/10 text-blue-400"
                        }`}>{selected.status}</span>
                        {selected.rexScore !== null && (
                          <span className="font-financial">Rex Score: {selected.rexScore}/100</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleRegenerate}
                        disabled={regenerating}
                        className="btn-secondary text-xs py-1.5 px-3 min-h-[44px] flex items-center gap-1.5"
                        data-testid="button-regenerate"
                      >
                        {regenerating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                        {regenerating ? "Regenerating..." : "Regenerate"}
                      </button>
                    </div>
                  </div>

                  {selected.keyMessage && (
                    <div className="bg-background rounded-md p-3 mb-4 border-l-2 border-gold">
                      <span className="text-xs font-bold text-gold block mb-1">Key Message</span>
                      <span className="text-sm">{selected.keyMessage}</span>
                    </div>
                  )}

                  <div className="bg-background rounded-md p-4 text-sm leading-relaxed whitespace-pre-wrap border border-border" data-testid="text-content-body">
                    {selected.body || "No content body available."}
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Tone</label>
                      <select
                        value={selected.tone || "operator"}
                        onChange={e => updateContent.mutate({ id: selected.id, tone: e.target.value })}
                        className="bg-background border border-border rounded-md text-sm px-3 py-1.5 text-foreground"
                        data-testid="select-tone"
                      >
                        {TONES.map(t => (
                          <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Style</label>
                      <select
                        value={selected.style || "operator_to_operator"}
                        onChange={e => updateContent.mutate({ id: selected.id, style: e.target.value })}
                        className="bg-background border border-border rounded-md text-sm px-3 py-1.5 text-foreground"
                        data-testid="select-style"
                      >
                        {STYLES.map(s => (
                          <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                    <Globe size={16} className="text-gold" /> Platform Adaptations
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {PLATFORMS.map(p => {
                      const Icon = p.icon;
                      const versions = (selected.platformVersions as Record<string, any>) || {};
                      const hasVersion = !!versions[p.key];
                      const isAdapting = adaptingPlatform === p.key;
                      return (
                        <button
                          key={p.key}
                          onClick={() => handleAdapt(p.key)}
                          disabled={isAdapting}
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                            hasVersion ? "border-green-500/50 bg-green-500/5" : "border-border hover:border-gold/50"
                          }`}
                          data-testid={`button-adapt-${p.key}`}
                        >
                          {isAdapting ? (
                            <Loader2 size={20} className="animate-spin text-gold" />
                          ) : (
                            <Icon size={20} className={hasVersion ? "text-green-400" : "text-muted-foreground"} />
                          )}
                          <span className="text-xs font-medium">{p.label}</span>
                          {hasVersion ? (
                            <span className="text-xs text-green-400 flex items-center gap-1"><Check size={10} /> Adapted</span>
                          ) : (
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Wand2 size={10} /> Adapt</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {(selected.status === "approval" || selected.status === "review") && (
                  <div className="bg-card border border-border rounded-lg p-6" data-testid="approval-section">
                    <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                      <CheckCircle size={16} className="text-gold" /> Approval
                    </h3>
                    <div className="mb-4">
                      <span className="text-xs text-muted-foreground block mb-2">Approve for platforms:</span>
                      <div className="flex flex-wrap gap-3">
                        {PLATFORMS.map(p => {
                          const Icon = p.icon;
                          const checked = approvalPlatforms.includes(p.key);
                          return (
                            <label
                              key={p.key}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                                checked ? "border-gold bg-gold/10 text-gold" : "border-border hover:border-gold/50"
                              }`}
                              data-testid={`checkbox-platform-${p.key}`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleApprovalPlatform(p.key)}
                                className="sr-only"
                              />
                              <Icon size={14} />
                              <span className="text-xs font-medium">{p.label}</span>
                              {checked && <Check size={12} />}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => approveContent.mutate({ id: selected.id, platforms: approvalPlatforms })}
                        disabled={approvalPlatforms.length === 0}
                        className="btn-primary text-sm py-2 px-4 min-h-[44px] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-testid="button-approve-content"
                      >
                        <CheckCircle size={14} /> Approve & Publish
                      </button>
                      <button
                        onClick={() => updateContent.mutate({ id: selected.id, status: "draft" })}
                        className="text-sm py-2 px-4 min-h-[44px] text-red-400 border border-red-500/30 rounded-md hover:bg-red-500/10 transition-colors flex items-center gap-2"
                        data-testid="button-return-draft"
                      >
                        <XCircle size={14} /> Return to Draft
                      </button>
                      {selected.status === "review" && (
                        <button
                          onClick={() => updateContent.mutate({ id: selected.id, status: "approval" })}
                          className="btn-secondary text-sm py-2 px-4 min-h-[44px] flex items-center gap-2"
                          data-testid="button-move-approval"
                        >
                          <ArrowRight size={14} /> Move to Approval
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg" data-testid="content-calendar">
          <button
            onClick={() => setCalendarOpen(!calendarOpen)}
            className="w-full flex items-center justify-between p-4 text-left"
            data-testid="button-toggle-calendar"
          >
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Calendar size={16} className="text-gold" /> Content Calendar — Week View
            </h3>
            {calendarOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {calendarOpen && (
            <div className="border-t border-border p-4">
              <div className="grid grid-cols-7 gap-3">
                {weekDays.map(day => {
                  const key = formatDate(day);
                  const dayItems = scheduledByDay[key] || [];
                  const isToday = formatDate(new Date()) === key;
                  return (
                    <div key={key} className={`rounded-lg border p-3 min-h-[120px] ${isToday ? "border-gold bg-gold/5" : "border-border"}`}>
                      <div className={`text-xs font-bold mb-2 ${isToday ? "text-gold" : "text-muted-foreground"}`}>
                        {dayLabel(day)}
                      </div>
                      <div className="space-y-1.5">
                        {dayItems.map(item => (
                          <button
                            key={item.id}
                            onClick={() => setSelectedId(item.id)}
                            className="w-full text-left text-xs bg-background border border-border rounded p-1.5 hover:border-gold/50 transition-colors cursor-pointer truncate"
                            data-testid={`calendar-item-${item.id}`}
                          >
                            <span className="font-medium block truncate">{item.title}</span>
                            <span className="text-muted-foreground">{item.contentType.replace(/_/g, " ")}</span>
                          </button>
                        ))}
                        {dayItems.length === 0 && (
                          <div className="text-xs text-muted-foreground/50 text-center py-2">—</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      <DashboardMobileNav active="/dashboard/content" />
    </div>
  );
}
