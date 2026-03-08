"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { EXPERTISE_TRACKS, DURATION_TYPES } from "@/lib/im-constants";
import { MapPin, Calendar, AlertTriangle, Plus, Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Send, Star, Edit3, Clock, Briefcase, Home, ExternalLink, Heart } from "lucide-react";

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
  operatorId?: number;
  requiredSkills?: string[];
  accommodationAvailable?: boolean;
}

interface FullAssignmentData {
  assignment: Assignment & { matchedManagerId?: number | null };
  proposals: Array<{
    id: number;
    assignmentId: number;
    managerId: number;
    proposedRate: string;
    message: string | null;
    status: string;
    createdAt: string;
    manager?: { id: number; name: string; averageRating?: string; reviewCount?: number; branchName?: string };
  }>;
  operator?: { id: number; name: string; branchName?: string; photoUrl?: string };
}

export default function AssignmentsPage() {
  return <Suspense fallback={<div className="text-center py-16"><div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto" /></div>}><AssignmentsContent /></Suspense>;
}

function AssignmentsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState(searchParams.get("track") || "");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const [showPostModal, setShowPostModal] = useState(false);
  const [postDate, setPostDate] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<{ day: number; month: number; year: number } | null>(null);

  const [detailData, setDetailData] = useState<FullAssignmentData | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const [demoOperatorId, setDemoOperatorId] = useState<number | null>(null);
  const [demoManagerId, setDemoManagerId] = useState<number | null>(null);

  const [proposalRate, setProposalRate] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [favoritedAssignmentIds, setFavoritedAssignmentIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/inter-mission/people?userType=operator&limit=1")
      .then((r) => r.json())
      .then((profiles) => {
        if (Array.isArray(profiles) && profiles[0]) {
          setDemoOperatorId(profiles[0].id);
          fetch(`/api/inter-mission/favorites?profileId=${profiles[0].id}`)
            .then((r) => r.json())
            .then((data) => {
              const ids = new Set<number>((data.favorites || []).filter((f: any) => f.targetType === "assignment").map((f: any) => f.targetId));
              setFavoritedAssignmentIds(ids);
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
    fetch("/api/inter-mission/people?userType=manager&limit=1")
      .then((r) => r.json())
      .then((profiles) => { if (Array.isArray(profiles) && profiles[0]) setDemoManagerId(profiles[0].id); })
      .catch(() => {});
  }, []);

  const toggleAssignmentFavorite = (e: React.MouseEvent, assignmentId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!demoOperatorId) return;
    const wasFav = favoritedAssignmentIds.has(assignmentId);
    setFavoritedAssignmentIds((prev) => {
      const next = new Set(prev);
      if (wasFav) next.delete(assignmentId); else next.add(assignmentId);
      return next;
    });
    fetch("/api/inter-mission/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: demoOperatorId, targetType: "assignment", targetId: assignmentId }),
    }).catch(() => {
      setFavoritedAssignmentIds((prev) => {
        const next = new Set(prev);
        if (wasFav) next.add(assignmentId); else next.delete(assignmentId);
        return next;
      });
    });
  };

  const fetchAssignments = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (trackFilter) params.set("expertiseTrack", trackFilter);
    if (urgencyFilter) params.set("urgency", urgencyFilter);
    if (durationFilter) params.set("durationType", durationFilter);
    if (minBudget) params.set("minBudget", minBudget);
    if (maxBudget) params.set("maxBudget", maxBudget);
    params.set("status", "open");

    fetch(`/api/inter-mission/assignments?${params}`)
      .then((r) => r.json())
      .then((data) => setAssignments(Array.isArray(data) ? data : []))
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, [search, trackFilter, urgencyFilter, durationFilter, minBudget, maxBudget]);

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
  };

  const getTrackName = (id: string) => EXPERTISE_TRACKS.find((t) => t.id === id)?.name || id;
  const getTrackIcon = (id: string) => EXPERTISE_TRACKS.find((t) => t.id === id)?.icon || "📋";
  const getTrackColor = (id: string) => {
    const colors: Record<string, string> = {
      counter_operations: "#00FF88",
      financial_services: "#FFD700",
      compliance_audit: "#FF6B6B",
      training_development: "#64B5F6",
      management_strategy: "#CE93D8",
      retail_commercial: "#FFB74D",
      setup_transitions: "#4DD0E1",
      advisory_consulting: "#AED581",
    };
    return colors[id] || "#00FF88";
  };
  const getDurationLabel = (val: string) => DURATION_TYPES.find((d) => d.value === val)?.label || val;
  const formatDateGB = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-GB");
  };
  const formatDateLong = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  const activeChips: { label: string; onClear: () => void }[] = [];
  if (trackFilter) activeChips.push({ label: getTrackName(trackFilter), onClear: () => setTrackFilter("") });
  if (urgencyFilter) activeChips.push({ label: urgencyFilter === "urgent" ? "Urgent Only" : "Standard Only", onClear: () => setUrgencyFilter("") });
  if (durationFilter) activeChips.push({ label: getDurationLabel(durationFilter), onClear: () => setDurationFilter("") });
  if (minBudget) activeChips.push({ label: `Min £${minBudget}/day`, onClear: () => setMinBudget("") });
  if (maxBudget) activeChips.push({ label: `Max £${maxBudget}/day`, onClear: () => setMaxBudget("") });

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = viewMonth === 0 ? 11 : viewMonth - 1;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    calendarDays.push({ day: d, month: m, year: y, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, month: viewMonth, year: viewYear, isCurrentMonth: true });
  }
  const remaining = 7 - (calendarDays.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const m = viewMonth === 11 ? 0 : viewMonth + 1;
      const y = viewMonth === 11 ? viewYear + 1 : viewYear;
      calendarDays.push({ day: d, month: m, year: y, isCurrentMonth: false });
    }
  }

  const getAssignmentsForDay = (day: number, month: number, year: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return assignments.filter((a) => a.startDate <= dateStr && a.endDate >= dateStr);
  };

  const isToday = (day: number, month: number, year: number) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };
  const goToToday = () => { setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const openPostForDate = (day: number, month: number, year: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setPostDate(dateStr);
    setExpandedDay(null);
    setShowDetail(false);
    setShowPostModal(true);
  };

  const handleDayClick = (day: number, month: number, year: number) => {
    const dayAssigns = getAssignmentsForDay(day, month, year);
    if (dayAssigns.length === 0) {
      openPostForDate(day, month, year);
    } else {
      if (expandedDay && expandedDay.day === day && expandedDay.month === month && expandedDay.year === year) {
        setExpandedDay(null);
      } else {
        setExpandedDay({ day, month, year });
      }
    }
  };

  const openAssignmentDetail = async (assignmentId: number) => {
    setDetailLoading(true);
    setShowDetail(true);
    setExpandedDay(null);
    setShowProposalForm(false);
    setProposalRate("");
    setProposalMessage("");
    try {
      const res = await fetch(`/api/inter-mission/assignments/${assignmentId}`);
      const data = await res.json();
      setDetailData(data);
    } catch {
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const [proposalError, setProposalError] = useState("");

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailData?.assignment || !demoManagerId) return;
    setSubmittingProposal(true);
    setProposalError("");
    try {
      const res = await fetch("/api/inter-mission/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: detailData.assignment.id,
          managerId: demoManagerId,
          proposedRate: proposalRate,
          message: proposalMessage,
        }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to submit proposal"); }
      setShowProposalForm(false);
      const refreshed = await fetch(`/api/inter-mission/assignments/${detailData.assignment.id}`).then((r) => r.json());
      setDetailData(refreshed);
    } catch (err: any) {
      setProposalError(err.message);
    } finally {
      setSubmittingProposal(false);
    }
  };

  const isOperatorOwner = detailData?.assignment?.operatorId !== undefined && detailData.assignment.operatorId === demoOperatorId;

  const expandedDayAssignments = expandedDay ? getAssignmentsForDay(expandedDay.day, expandedDay.month, expandedDay.year) : [];
  const expandedDateStr = expandedDay ? `${expandedDay.year}-${String(expandedDay.month + 1).padStart(2, "0")}-${String(expandedDay.day).padStart(2, "0")}` : "";

  const sortedAssignments = [...assignments].sort((a, b) => a.startDate.localeCompare(b.startDate));

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white" data-testid="text-assignments-title">
            Open <span className="text-[#00FF88]">Assignments</span>
          </h1>
          <p className="text-[#888888] text-sm mt-1">{assignments.length} assignment{assignments.length !== 1 ? "s" : ""} available</p>
        </div>
        <button onClick={() => { setPostDate(null); setShowPostModal(true); }} className="im-btn-primary text-sm px-4 py-2" data-testid="button-post-assignment">
          <Plus size={16} className="mr-1 inline" /> Post Assignment
        </button>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assignments, locations, branches..." className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none transition-colors" data-testid="input-search-assignments" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white" data-testid="button-clear-search"><X size={14} /></button>}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${showFilters || activeFilterCount > 0 ? "bg-[#00FF8815] border-[#00FF88] text-[#00FF88]" : "bg-[#0A1A0F] border-[#1A3A25] text-[#888888] hover:text-white hover:border-[#333]"}`}
            data-testid="button-toggle-filters"
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && <span className="bg-[#00FF88] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>}
          </button>
        </div>

        {showFilters && (
          <div className="im-card im-glow space-y-4 im-animate-in">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Filter Assignments</h3>
              {activeFilterCount > 0 && <button onClick={clearAllFilters} className="text-[#00FF88] text-xs hover:underline" data-testid="button-clear-all-filters">Clear all</button>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[#888888] text-xs block mb-1">Expertise Track</label>
                <select value={trackFilter} onChange={(e) => setTrackFilter(e.target.value)} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none" data-testid="select-track-filter">
                  <option value="">All Tracks</option>
                  {EXPERTISE_TRACKS.map((t) => <option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
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
                  {DURATION_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
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

        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeChips.map((chip) => (
              <span key={chip.label} className="inline-flex items-center gap-1 bg-[#00FF8815] text-[#00FF88] text-xs px-2.5 py-1 rounded-full">
                {chip.label}
                <button onClick={chip.onClear} className="hover:text-white ml-0.5"><X size={12} /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#888888]">Loading assignments...</p>
        </div>
      ) : (
        <>
          <div className="im-card mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-[#1A3A25] text-[#888888] hover:text-white transition-colors" data-testid="button-prev-month"><ChevronLeft size={20} /></button>
                <h2 className="text-white font-bold text-lg min-w-[180px] text-center" data-testid="text-calendar-month">{monthNames[viewMonth]} {viewYear}</h2>
                <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-[#1A3A25] text-[#888888] hover:text-white transition-colors" data-testid="button-next-month"><ChevronRight size={20} /></button>
              </div>
              <button onClick={goToToday} className="text-[#00FF88] text-xs hover:underline font-medium" data-testid="button-today">Today</button>
            </div>

            <div className="grid grid-cols-7 gap-px bg-[#1A3A25] rounded-lg overflow-hidden">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="bg-[#0A1A0F] py-2 text-center text-[#888888] text-xs font-medium">{d}</div>
              ))}

              {calendarDays.map((cell, idx) => {
                const dayAssignments = getAssignmentsForDay(cell.day, cell.month, cell.year);
                const todayCell = isToday(cell.day, cell.month, cell.year);
                const isExpanded = expandedDay && expandedDay.day === cell.day && expandedDay.month === cell.month && expandedDay.year === cell.year;
                return (
                  <div
                    key={idx}
                    onClick={() => handleDayClick(cell.day, cell.month, cell.year)}
                    className={`bg-[#0A1A0F] min-h-[80px] md:min-h-[100px] p-1 cursor-pointer hover:bg-[#0D1F14] transition-colors relative group ${!cell.isCurrentMonth ? "opacity-40" : ""} ${isExpanded ? "ring-1 ring-[#00FF88] bg-[#0D1F14]" : ""}`}
                    data-testid={`cell-day-${cell.year}-${cell.month + 1}-${cell.day}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${todayCell ? "bg-[#00FF88] text-black font-bold" : "text-[#888888]"}`}>
                        {cell.day}
                      </span>
                      <button onClick={(e) => openPostForDate(cell.day, cell.month, cell.year, e)} className="text-[#1A3A25] group-hover:text-[#00FF88] transition-colors hover:scale-125" data-testid={`button-add-${cell.year}-${cell.month + 1}-${cell.day}`}><Plus size={14} /></button>
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                      {dayAssignments.slice(0, 3).map((a) => {
                        const dateStr = `${cell.year}-${String(cell.month + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;
                        const isStart = a.startDate === dateStr;
                        const isEnd = a.endDate === dateStr;
                        const color = getTrackColor(a.expertiseTrack);
                        return (
                          <button
                            key={a.id}
                            onClick={(e) => { e.stopPropagation(); openAssignmentDetail(a.id); }}
                            className={`w-full text-left px-1.5 py-0.5 text-[10px] md:text-xs truncate block hover:brightness-125 transition-all ${isStart && isEnd ? "rounded" : isStart ? "rounded-l" : isEnd ? "rounded-r" : ""}`}
                            style={{ backgroundColor: `${color}20`, color, borderLeft: isStart ? `3px solid ${color}` : undefined, borderRight: isEnd ? `3px solid ${color}` : undefined, opacity: isStart ? 1 : 0.8 }}
                            data-testid={`cal-assignment-${a.id}`}
                          >
                            {isStart ? `${a.urgency === "urgent" ? "⚡ " : ""}${a.branchName || a.locationPostcode}` : ""}
                          </button>
                        );
                      })}
                      {dayAssignments.length > 3 && (
                        <span className="text-[#888888] text-[10px] px-1">+{dayAssignments.length - 3} more</span>
                      )}
                    </div>
                    {dayAssignments.length > 0 && (
                      <div className="absolute bottom-1 right-1">
                        <span className="text-[#00FF88] text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">{isExpanded ? "▲" : "▼"}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {expandedDay && expandedDayAssignments.length > 0 && (
            <div className="im-card im-glow mb-4 im-animate-in" data-testid="panel-expanded-day">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-[#00FF88]" />
                  <h3 className="text-white font-bold">
                    {formatDateLong(expandedDateStr)}
                  </h3>
                  <span className="bg-[#00FF8815] text-[#00FF88] text-xs px-2 py-0.5 rounded-full font-medium">
                    {expandedDayAssignments.length} assignment{expandedDayAssignments.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => openPostForDate(expandedDay.day, expandedDay.month, expandedDay.year, e)} className="text-[#00FF88] hover:text-white text-xs flex items-center gap-1 transition-colors" data-testid="button-post-on-expanded-day">
                    <Plus size={14} /> Post here
                  </button>
                  <button onClick={() => setExpandedDay(null)} className="text-[#888888] hover:text-white p-1" data-testid="button-close-expanded-day"><X size={18} /></button>
                </div>
              </div>
              <div className="space-y-2">
                {expandedDayAssignments.map((a) => {
                  const color = getTrackColor(a.expertiseTrack);
                  return (
                    <button
                      key={a.id}
                      onClick={() => openAssignmentDetail(a.id)}
                      className="w-full text-left bg-[#0A1A0F] hover:bg-[#0D1F14] rounded-lg p-3 transition-colors group/card"
                      style={{ borderLeft: `3px solid ${color}` }}
                      data-testid={`expanded-assignment-${a.id}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {a.urgency === "urgent" && (
                              <span className="inline-flex items-center gap-1 bg-[#FF444420] text-[#FF4444] text-[10px] font-semibold px-1.5 py-0.5 rounded">
                                <AlertTriangle size={10} /> URGENT
                              </span>
                            )}
                            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${color}20`, color }}>
                              {getTrackIcon(a.expertiseTrack)} {getTrackName(a.expertiseTrack)}
                            </span>
                          </div>
                          <p className="text-white text-sm font-medium truncate">{a.title}</p>
                          <div className="flex items-center gap-3 mt-1 text-[#888888] text-xs">
                            <span className="flex items-center gap-1"><MapPin size={11} /> {a.branchName || a.locationPostcode}</span>
                            <span className="flex items-center gap-1"><Calendar size={11} /> {formatDateGB(a.startDate)} — {formatDateGB(a.endDate)}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="im-font-financial text-sm">{a.dailyBudget ? `£${parseFloat(a.dailyBudget).toFixed(0)}` : "Open"}</span>
                          <span className="text-[#888888] text-[10px] block">/day</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-6">
            {EXPERTISE_TRACKS.map((t) => (
              <button key={t.id} onClick={() => setTrackFilter(trackFilter === t.id ? "" : t.id)} className="flex items-center gap-1.5 text-xs" data-testid={`legend-${t.id}`}>
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: getTrackColor(t.id) }} />
                <span className={trackFilter === t.id ? "text-white font-semibold" : "text-[#888888]"}>{t.name}</span>
              </button>
            ))}
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase size={18} className="text-[#00FF88]" />
                All Assignments
                <span className="text-[#888888] text-sm font-normal">({sortedAssignments.length})</span>
              </h2>
            </div>

            {sortedAssignments.length === 0 ? (
              <div className="im-card text-center py-12">
                <Briefcase size={40} className="text-[#1A3A25] mx-auto mb-3" />
                <p className="text-[#888888]">No assignments match your filters.</p>
                {activeFilterCount > 0 && (
                  <button onClick={clearAllFilters} className="text-[#00FF88] text-sm mt-2 hover:underline">Clear all filters</button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {sortedAssignments.map((a) => {
                  const color = getTrackColor(a.expertiseTrack);
                  const [sy, sm, sd] = a.startDate.split("-").map(Number);
                  const [ey, em, ed] = a.endDate.split("-").map(Number);
                  const startD = new Date(sy, sm - 1, sd);
                  const endD = new Date(ey, em - 1, ed);
                  const days = Math.ceil((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                  return (
                    <button
                      key={a.id}
                      onClick={() => openAssignmentDetail(a.id)}
                      className="w-full text-left im-card hover:border-[#00FF8840] transition-all group/list"
                      style={{ borderLeft: `3px solid ${color}` }}
                      data-testid={`list-assignment-${a.id}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {a.urgency === "urgent" && (
                              <span className="inline-flex items-center gap-1 bg-[#FF444420] text-[#FF4444] text-xs font-semibold px-2 py-0.5 rounded im-pulse-urgent">
                                <AlertTriangle size={12} /> URGENT
                              </span>
                            )}
                            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${color}20`, color }}>
                              {getTrackIcon(a.expertiseTrack)} {getTrackName(a.expertiseTrack)}
                            </span>
                            {a.durationType && (
                              <span className="text-[#888888] text-xs flex items-center gap-1">
                                <Clock size={11} /> {getDurationLabel(a.durationType)}
                              </span>
                            )}
                          </div>
                          <p className="text-white font-semibold text-sm md:text-base mb-1 group-hover/list:text-[#00FF88] transition-colors">{a.title}</p>
                          {a.description && <p className="text-[#888888] text-xs line-clamp-1 mb-2">{a.description}</p>}
                          <div className="flex items-center gap-4 text-[#888888] text-xs flex-wrap">
                            <span className="flex items-center gap-1"><MapPin size={12} /> {a.branchName || a.locationPostcode}</span>
                            <span className="flex items-center gap-1"><Calendar size={12} /> {formatDateGB(a.startDate)} — {formatDateGB(a.endDate)}</span>
                            <span className="text-[#555]">{days} day{days !== 1 ? "s" : ""}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0 flex flex-col items-end gap-2">
                          <button
                            onClick={(e) => toggleAssignmentFavorite(e, a.id)}
                            className={`p-1.5 rounded-full transition-all ${favoritedAssignmentIds.has(a.id) ? "text-[#FF4466] bg-[#FF444620]" : "text-[#555] hover:text-[#FF4466] hover:bg-[#FF444610]"}`}
                            data-testid={`button-favorite-assignment-${a.id}`}
                            aria-label={favoritedAssignmentIds.has(a.id) ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Heart size={16} fill={favoritedAssignmentIds.has(a.id) ? "#FF4466" : "none"} />
                          </button>
                          <div>
                            <span className="im-font-financial text-lg">{a.dailyBudget ? `£${parseFloat(a.dailyBudget).toFixed(0)}` : "Open"}</span>
                            <span className="text-[#888888] text-xs block">/day</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {showDetail && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => { setShowDetail(false); setDetailData(null); }}>
          <div className="im-card im-glow max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} data-testid="modal-assignment-detail">
            {detailLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-[#888888] text-sm">Loading assignment details...</p>
              </div>
            ) : !detailData?.assignment ? (
              <div className="text-center py-12">
                <p className="text-[#888888]">Could not load assignment details.</p>
                <button onClick={() => { setShowDetail(false); setDetailData(null); }} className="text-[#00FF88] text-sm mt-2 hover:underline">Close</button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {detailData.assignment.urgency === "urgent" && (
                      <span className="inline-flex items-center gap-1 bg-[#FF444420] text-[#FF4444] text-xs font-semibold px-2 py-0.5 rounded im-pulse-urgent">
                        <AlertTriangle size={12} /> URGENT
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${getTrackColor(detailData.assignment.expertiseTrack)}20`, color: getTrackColor(detailData.assignment.expertiseTrack) }}>
                      {getTrackIcon(detailData.assignment.expertiseTrack)} {getTrackName(detailData.assignment.expertiseTrack)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${detailData.assignment.status === "open" ? "bg-[#00FF8815] text-[#00FF88]" : "bg-[#88888820] text-[#888888]"}`}>
                      {detailData.assignment.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleAssignmentFavorite(e, detailData.assignment.id)}
                      className={`p-1.5 rounded-full transition-all ${favoritedAssignmentIds.has(detailData.assignment.id) ? "text-[#FF4466] bg-[#FF444620]" : "text-[#555] hover:text-[#FF4466] hover:bg-[#FF444610]"}`}
                      data-testid="button-favorite-detail"
                      aria-label={favoritedAssignmentIds.has(detailData.assignment.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart size={18} fill={favoritedAssignmentIds.has(detailData.assignment.id) ? "#FF4466" : "none"} />
                    </button>
                    <button onClick={() => { setShowDetail(false); setDetailData(null); }} className="text-[#888888] hover:text-white p-1" data-testid="button-close-detail"><X size={20} /></button>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-2" data-testid="text-detail-title">{detailData.assignment.title}</h2>
                {detailData.assignment.description && <p className="text-[#888888] text-sm mb-4">{detailData.assignment.description}</p>}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-[#0A1A0F] rounded-lg p-3">
                    <span className="text-[#888888] text-xs block mb-1">Location</span>
                    <span className="text-white text-sm flex items-center gap-1"><MapPin size={14} /> {detailData.assignment.branchName || detailData.assignment.locationPostcode}</span>
                  </div>
                  <div className="bg-[#0A1A0F] rounded-lg p-3">
                    <span className="text-[#888888] text-xs block mb-1">Budget</span>
                    <span className="im-font-financial text-lg">{detailData.assignment.dailyBudget ? `£${parseFloat(detailData.assignment.dailyBudget).toFixed(0)}/day` : "Open"}</span>
                  </div>
                  <div className="bg-[#0A1A0F] rounded-lg p-3">
                    <span className="text-[#888888] text-xs block mb-1">Dates</span>
                    <span className="text-white text-sm flex items-center gap-1"><Calendar size={14} /> {formatDateGB(detailData.assignment.startDate)} — {formatDateGB(detailData.assignment.endDate)}</span>
                  </div>
                  <div className="bg-[#0A1A0F] rounded-lg p-3">
                    <span className="text-[#888888] text-xs block mb-1">Duration</span>
                    <span className="text-white text-sm">{detailData.assignment.durationType ? getDurationLabel(detailData.assignment.durationType) : "Flexible"}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                  {detailData.assignment.accommodationAvailable && (
                    <span className="inline-flex items-center gap-1 bg-[#64B5F620] text-[#64B5F6] text-xs px-2 py-1 rounded">
                      <Home size={12} /> Accommodation available
                    </span>
                  )}
                  {detailData.assignment.requiredSkills && (detailData.assignment.requiredSkills as string[]).length > 0 && (
                    (detailData.assignment.requiredSkills as string[]).map((skill) => (
                      <span key={skill} className="bg-[#1A3A25] text-[#888888] text-xs px-2 py-1 rounded">{skill}</span>
                    ))
                  )}
                </div>

                {detailData.operator && (
                  <div className="border-t border-[#1A3A25] pt-4 mb-4">
                    <span className="text-[#888888] text-xs block mb-2">Posted by</span>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1A3A25] flex items-center justify-center text-[#00FF88] font-bold text-sm">
                        {detailData.operator.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{detailData.operator.name}</p>
                        {detailData.operator.branchName && <p className="text-[#888888] text-xs">{detailData.operator.branchName}</p>}
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-[#1A3A25] pt-4 mb-4">
                  <div className="flex gap-3">
                    {isOperatorOwner ? (
                      <Link href={`/inter-mission/assignments/${detailData.assignment.id}`} className="im-btn-primary flex-1 text-center text-sm py-2.5" onClick={() => { setShowDetail(false); setDetailData(null); }} data-testid="button-edit-assignment">
                        <Edit3 size={16} className="mr-1.5 inline" /> Edit Assignment
                      </Link>
                    ) : (
                      <>
                        {detailData.assignment.status === "open" && !showProposalForm && (
                          <button onClick={() => setShowProposalForm(true)} className="im-btn-primary flex-1 text-sm py-2.5" data-testid="button-send-proposal">
                            <Send size={16} className="mr-1.5 inline" /> Send Proposal
                          </button>
                        )}
                      </>
                    )}
                    <Link href={`/inter-mission/assignments/${detailData.assignment.id}`} className="im-btn-secondary text-center text-sm py-2.5 px-4" onClick={() => { setShowDetail(false); setDetailData(null); }} data-testid="link-view-full-page">
                      <ExternalLink size={14} className="mr-1 inline" /> Full Page
                    </Link>
                  </div>
                </div>

                {showProposalForm && (
                  <form onSubmit={handleProposalSubmit} className="border-t border-[#1A3A25] pt-4 mb-4 im-animate-in" data-testid="form-inline-proposal">
                    <h3 className="text-white font-semibold text-sm mb-3">Submit Your Proposal</h3>
                    {proposalError && <div className="bg-[#FF444420] border border-[#FF4444] rounded-lg p-2 mb-3 text-[#FF4444] text-xs">{proposalError}</div>}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-[#888888] text-xs mb-1">Your Daily Rate (£) *</label>
                        <input type="number" required value={proposalRate} onChange={(e) => setProposalRate(e.target.value)} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#00FF88] focus:outline-none" placeholder="200" data-testid="input-detail-proposal-rate" />
                      </div>
                      <div className="flex items-end">
                        {detailData.assignment.dailyBudget && (
                          <span className="text-[#888888] text-xs pb-3">Budget: £{parseFloat(detailData.assignment.dailyBudget).toFixed(0)}/day</span>
                        )}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block text-[#888888] text-xs mb-1">Message (optional)</label>
                      <textarea value={proposalMessage} onChange={(e) => setProposalMessage(e.target.value)} rows={2} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#888888] focus:border-[#00FF88] focus:outline-none resize-none" placeholder="Why you're a great fit for this assignment..." data-testid="input-detail-proposal-message" />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" disabled={submittingProposal} className="im-btn-primary flex-1 text-sm py-2" data-testid="button-submit-detail-proposal">
                        {submittingProposal ? "Submitting..." : "Submit Proposal"}
                      </button>
                      <button type="button" onClick={() => setShowProposalForm(false)} className="im-btn-secondary text-sm py-2 px-4">Cancel</button>
                    </div>
                  </form>
                )}

                {detailData.proposals && detailData.proposals.length > 0 && (
                  <div className="border-t border-[#1A3A25] pt-4">
                    <h3 className="text-white font-semibold text-sm mb-3">
                      Proposals <span className="text-[#888888] font-normal">({detailData.proposals.length})</span>
                    </h3>
                    <div className="space-y-2">
                      {detailData.proposals.map((p) => (
                        <div key={p.id} className="bg-[#0A1A0F] rounded-lg p-3" data-testid={`detail-proposal-${p.id}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#1A3A25] flex items-center justify-center text-[#00FF88] font-bold text-xs">
                                {p.manager?.name?.charAt(0) || "?"}
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{p.manager?.name || "Manager"}</p>
                                {p.manager?.averageRating && parseFloat(p.manager.averageRating) > 0 && (
                                  <span className="text-[#888888] text-xs flex items-center gap-1">
                                    <Star size={10} className="text-[#00FF88]" fill="#00FF88" />
                                    {parseFloat(p.manager.averageRating).toFixed(1)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="im-font-financial text-sm">£{parseFloat(p.proposedRate).toFixed(0)}</span>
                              <span className="text-[#888888] text-[10px] block">/day</span>
                            </div>
                          </div>
                          {p.message && <p className="text-[#888888] text-xs mt-2 italic">&ldquo;{p.message}&rdquo;</p>}
                          <span className={`inline-block mt-2 text-[10px] px-1.5 py-0.5 rounded ${p.status === "accepted" ? "bg-[#00FF8815] text-[#00FF88]" : p.status === "declined" ? "bg-[#FF444420] text-[#FF4444]" : "bg-[#88888820] text-[#888888]"}`}>
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {showPostModal && <PostAssignmentModal defaultDate={postDate} onClose={() => setShowPostModal(false)} onCreated={(a) => { setShowPostModal(false); setAssignments((prev) => [a, ...prev]); }} />}
    </div>
  );
}

function PostAssignmentModal({ defaultDate, onClose, onCreated }: { defaultDate: string | null; onClose: () => void; onCreated: (a: Assignment) => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [operatorId, setOperatorId] = useState(0);

  const [form, setForm] = useState({
    expertiseTrack: "",
    locationPostcode: "",
    branchName: "",
    startDate: defaultDate || "",
    endDate: defaultDate || "",
    description: "",
    dailyBudget: "",
    urgency: "standard",
    durationType: "",
    accommodationAvailable: false,
  });

  useEffect(() => {
    fetch("/api/inter-mission/people?userType=operator&limit=1")
      .then((r) => r.json())
      .then((profiles) => {
        const p = Array.isArray(profiles) ? profiles[0] : null;
        if (p) setOperatorId(p.id);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const trackName = EXPERTISE_TRACKS.find((t) => t.id === form.expertiseTrack)?.name || form.expertiseTrack;
      const title = `${trackName} — ${form.branchName || form.locationPostcode} — ${form.durationType ? DURATION_TYPES.find((d) => d.value === form.durationType)?.label : "Flexible"}`;

      const res = await fetch("/api/inter-mission/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, title, operatorId, dailyBudget: form.dailyBudget || null, durationType: form.durationType || null }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to post"); }
      const assignment = await res.json();
      onCreated(assignment);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="im-card im-glow max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} data-testid="modal-post-assignment">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Post an <span className="text-[#00FF88]">Assignment</span></h2>
          <button onClick={onClose} className="text-[#888888] hover:text-white p-1" data-testid="button-close-post"><X size={20} /></button>
        </div>
        <p className="text-[#888888] text-sm mb-6">Tell us what you need and we&apos;ll match you with the right person.</p>

        {error && <div className="bg-[#FF444420] border border-[#FF4444] rounded-lg p-3 mb-4 text-[#FF4444] text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-1">What do you need? *</label>
            <select required value={form.expertiseTrack} onChange={(e) => setForm({ ...form, expertiseTrack: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#00FF88] focus:outline-none" data-testid="modal-select-track">
              <option value="">Select expertise area</option>
              {EXPERTISE_TRACKS.map((t) => <option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white text-sm font-medium mb-1">Branch Name</label>
              <input type="text" value={form.branchName} onChange={(e) => setForm({ ...form, branchName: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="e.g. Bolton Crown" data-testid="modal-input-branch" />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-1">Postcode *</label>
              <input type="text" required value={form.locationPostcode} onChange={(e) => setForm({ ...form, locationPostcode: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="BL1 1AA" data-testid="modal-input-postcode" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white text-sm font-medium mb-1">Start Date *</label>
              <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#00FF88] focus:outline-none" data-testid="modal-input-start" />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-1">End Date *</label>
              <input type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#00FF88] focus:outline-none" data-testid="modal-input-end" />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">Details</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#888888] focus:border-[#00FF88] focus:outline-none resize-none" placeholder="Banking experience, Horizon knowledge..." data-testid="modal-input-description" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-white text-sm font-medium mb-1">Budget (£/day)</label>
              <input type="number" value={form.dailyBudget} onChange={(e) => setForm({ ...form, dailyBudget: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="Open" data-testid="modal-input-budget" />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-1">Urgency</label>
              <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#00FF88] focus:outline-none" data-testid="modal-select-urgency">
                <option value="standard">Standard</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-1">Duration</label>
              <select value={form.durationType} onChange={(e) => setForm({ ...form, durationType: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#00FF88] focus:outline-none" data-testid="modal-select-duration">
                <option value="">Flexible</option>
                {DURATION_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
            <input type="checkbox" checked={form.accommodationAvailable} onChange={(e) => setForm({ ...form, accommodationAvailable: e.target.checked })} className="rounded" data-testid="modal-checkbox-accommodation" />
            Accommodation available
          </label>

          <button type="submit" disabled={submitting} className="im-btn-primary w-full py-3 text-sm font-semibold" data-testid="modal-button-post">
            {submitting ? "Posting..." : "Post Assignment"}
          </button>
        </form>
      </div>
    </div>
  );
}
