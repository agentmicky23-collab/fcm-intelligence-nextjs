"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EXPERTISE_TRACKS, DURATION_TYPES } from "@/lib/im-constants";
import { MapPin, Calendar, Clock, AlertTriangle, Plus, Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";

interface Assignment {
  id: number;
  title: string;
  expertiseTrack: string;
  description: string | null;
  locationPostcode: string;
  branchName: string | null;
  startDate: string;
  endDate: string;
  dailyBudget: string | null;
  urgency: string;
  durationType: string | null;
  status: string;
  createdAt: string;
}

export default function AssignmentsPage() {
  return <Suspense fallback={<div className="text-center py-16"><div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto" /></div>}><AssignmentsContent /></Suspense>;
}

function AssignmentsContent() {
  const searchParams = useSearchParams();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState(searchParams.get("track") || "");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [sort, setSort] = useState("newest");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAssignments = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (trackFilter) params.set("expertiseTrack", trackFilter);
    if (urgencyFilter) params.set("urgency", urgencyFilter);
    if (durationFilter) params.set("durationType", durationFilter);
    if (minBudget) params.set("minBudget", minBudget);
    if (maxBudget) params.set("maxBudget", maxBudget);
    if (sort !== "newest") params.set("sort", sort);
    params.set("status", "open");

    fetch(`/api/inter-mission/assignments?${params}`)
      .then((r) => r.json())
      .then((data) => setAssignments(Array.isArray(data) ? data : []))
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, [search, trackFilter, urgencyFilter, durationFilter, minBudget, maxBudget, sort]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchAssignments, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [fetchAssignments]);

  const activeFilterCount = [trackFilter, urgencyFilter, durationFilter, minBudget, maxBudget].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearch("");
    setTrackFilter("");
    setUrgencyFilter("");
    setDurationFilter("");
    setMinBudget("");
    setMaxBudget("");
    setSort("newest");
  };

  const getTrackName = (id: string) => EXPERTISE_TRACKS.find((t) => t.id === id)?.name || id;
  const getTrackIcon = (id: string) => EXPERTISE_TRACKS.find((t) => t.id === id)?.icon || "📋";
  const getDurationLabel = (val: string) => DURATION_TYPES.find((d) => d.value === val)?.label || val;

  const activeChips: { label: string; onClear: () => void }[] = [];
  if (trackFilter) activeChips.push({ label: getTrackName(trackFilter), onClear: () => setTrackFilter("") });
  if (urgencyFilter) activeChips.push({ label: urgencyFilter === "urgent" ? "Urgent Only" : "Standard Only", onClear: () => setUrgencyFilter("") });
  if (durationFilter) activeChips.push({ label: getDurationLabel(durationFilter), onClear: () => setDurationFilter("") });
  if (minBudget) activeChips.push({ label: `Min £${minBudget}/day`, onClear: () => setMinBudget("") });
  if (maxBudget) activeChips.push({ label: `Max £${maxBudget}/day`, onClear: () => setMaxBudget("") });

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white" data-testid="text-assignments-title">
            Open <span className="text-[#00FF88]">Assignments</span>
          </h1>
          <p className="text-[#888888] text-sm mt-1">{assignments.length} assignment{assignments.length !== 1 ? "s" : ""} available</p>
        </div>
        <Link href="/inter-mission/assignments/post" className="im-btn-primary text-sm px-4 py-2" data-testid="link-post-assignment">
          <Plus size={16} className="mr-1" /> Post
        </Link>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assignments, locations, branches..."
              className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none transition-colors"
              data-testid="input-search-assignments"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white" data-testid="button-clear-search">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${showFilters || activeFilterCount > 0 ? "bg-[#00FF8815] border-[#00FF88] text-[#00FF88]" : "bg-[#0A1A0F] border-[#1A3A25] text-[#888888] hover:text-white hover:border-[#333]"}`}
            data-testid="button-toggle-filters"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-[#00FF88] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="im-card im-glow space-y-4 im-animate-in">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Filter Assignments</h3>
              {activeFilterCount > 0 && (
                <button onClick={clearAllFilters} className="text-[#00FF88] text-xs hover:underline" data-testid="button-clear-all-filters">Clear all</button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[#888888] text-xs block mb-1">Expertise Track</label>
                <select value={trackFilter} onChange={(e) => setTrackFilter(e.target.value)} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none" data-testid="select-track-filter">
                  <option value="">All Tracks</option>
                  {EXPERTISE_TRACKS.map((t) => (
                    <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#888888] text-xs block mb-1">Urgency</label>
                <select value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none" data-testid="select-urgency-filter">
                  <option value="">Any Urgency</option>
                  <option value="standard">Standard</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="text-[#888888] text-xs block mb-1">Duration</label>
                <select value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none" data-testid="select-duration-filter">
                  <option value="">Any Duration</option>
                  {DURATION_TYPES.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#888888] text-xs block mb-1">Min Budget (£/day)</label>
                <input type="number" value={minBudget} onChange={(e) => setMinBudget(e.target.value)} placeholder="e.g. 150" className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2 text-sm text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" data-testid="input-min-budget" />
              </div>
              <div>
                <label className="text-[#888888] text-xs block mb-1">Max Budget (£/day)</label>
                <input type="number" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} placeholder="e.g. 300" className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2 text-sm text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" data-testid="input-max-budget" />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {activeChips.map((chip) => (
              <span key={chip.label} className="inline-flex items-center gap-1 bg-[#00FF8815] text-[#00FF88] text-xs px-2.5 py-1 rounded-full" data-testid={`chip-${chip.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}>
                {chip.label}
                <button onClick={chip.onClear} className="hover:text-white ml-0.5"><X size={12} /></button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <ArrowUpDown size={14} className="text-[#888888]" />
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent border-none text-sm text-[#888888] focus:text-[#00FF88] focus:outline-none cursor-pointer" data-testid="select-sort">
              <option value="newest">Newest First</option>
              <option value="budget_high">Budget: High → Low</option>
              <option value="budget_low">Budget: Low → High</option>
              <option value="start_date">Start Date: Soonest</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#888888]">Loading assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#888888] text-lg mb-2">No assignments found</p>
          <p className="text-[#888888] text-sm mb-6">
            {activeFilterCount > 0 || search ? "Try adjusting your filters or search terms." : "Be the first to post an assignment."}
          </p>
          {activeFilterCount > 0 || search ? (
            <button onClick={clearAllFilters} className="im-btn-secondary text-sm mr-3" data-testid="button-empty-clear-filters">Clear Filters</button>
          ) : null}
          <Link href="/inter-mission/assignments/post" className="im-btn-primary text-sm">Post an Assignment</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((a) => (
            <Link key={a.id} href={`/inter-mission/assignments/${a.id}`} className="im-card block group" data-testid={`card-assignment-${a.id}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {a.urgency === "urgent" && (
                      <span className="inline-flex items-center gap-1 bg-[#FF444420] text-[#FF4444] text-xs font-semibold px-2 py-0.5 rounded im-pulse-urgent" data-testid={`badge-urgent-${a.id}`}>
                        <AlertTriangle size={12} /> URGENT
                      </span>
                    )}
                    <span className="text-xs bg-[#00FF8815] text-[#00FF88] px-2 py-0.5 rounded">
                      {getTrackIcon(a.expertiseTrack)} {getTrackName(a.expertiseTrack)}
                    </span>
                    {a.durationType && (
                      <span className="text-xs bg-[#88888815] text-[#888888] px-2 py-0.5 rounded">
                        {getDurationLabel(a.durationType)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-lg group-hover:text-[#00FF88] transition-colors truncate">{a.title}</h3>
                  {a.description && <p className="text-[#888888] text-sm mt-1 line-clamp-2">{a.description}</p>}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#888888]">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {a.branchName || a.locationPostcode}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(a.startDate).toLocaleDateString("en-GB")} — {new Date(a.endDate).toLocaleDateString("en-GB")}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {getTimeAgo(a.createdAt)}</span>
                  </div>
                </div>
                {a.dailyBudget && (
                  <div className="text-right flex-shrink-0">
                    <span className="im-font-financial text-xl">£{parseFloat(a.dailyBudget).toFixed(0)}</span>
                    <span className="text-[#888888] text-xs block">/day</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  if (!dateStr) return "recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
