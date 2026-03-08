"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { EXPERTISE_TRACKS, DURATION_TYPES } from "@/lib/im-constants";
import { MapPin, Calendar, AlertTriangle, Plus, Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Eye } from "lucide-react";

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
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

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
    return assignments.filter((a) => {
      return a.startDate <= dateStr && a.endDate >= dateStr;
    });
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
    setSelectedAssignment(null);
    setShowPostModal(true);
  };

  const handleDayClick = (day: number, month: number, year: number) => {
    const dayAssigns = getAssignmentsForDay(day, month, year);
    if (dayAssigns.length === 0) {
      openPostForDate(day, month, year);
    }
  };

  const handleAssignmentClick = (a: Assignment, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAssignment(a);
    setShowPostModal(false);
  };

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
          <div className="im-card mb-6">
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
                return (
                  <div
                    key={idx}
                    onClick={() => handleDayClick(cell.day, cell.month, cell.year)}
                    className={`bg-[#0A1A0F] min-h-[80px] md:min-h-[100px] p-1 cursor-pointer hover:bg-[#0D1F14] transition-colors relative group ${!cell.isCurrentMonth ? "opacity-40" : ""}`}
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
                            onClick={(e) => handleAssignmentClick(a, e)}
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
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            {EXPERTISE_TRACKS.map((t) => (
              <button key={t.id} onClick={() => setTrackFilter(trackFilter === t.id ? "" : t.id)} className="flex items-center gap-1.5 text-xs" data-testid={`legend-${t.id}`}>
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: getTrackColor(t.id) }} />
                <span className={trackFilter === t.id ? "text-white font-semibold" : "text-[#888888]"}>{t.name}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAssignment(null)}>
          <div className="im-card im-glow max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} data-testid="modal-assignment-detail">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                {selectedAssignment.urgency === "urgent" && (
                  <span className="inline-flex items-center gap-1 bg-[#FF444420] text-[#FF4444] text-xs font-semibold px-2 py-0.5 rounded im-pulse-urgent">
                    <AlertTriangle size={12} /> URGENT
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${getTrackColor(selectedAssignment.expertiseTrack)}20`, color: getTrackColor(selectedAssignment.expertiseTrack) }}>
                  {getTrackIcon(selectedAssignment.expertiseTrack)} {getTrackName(selectedAssignment.expertiseTrack)}
                </span>
              </div>
              <button onClick={() => setSelectedAssignment(null)} className="text-[#888888] hover:text-white p-1" data-testid="button-close-detail"><X size={20} /></button>
            </div>

            <h2 className="text-xl font-bold text-white mb-3" data-testid="text-modal-title">{selectedAssignment.title}</h2>
            {selectedAssignment.description && <p className="text-[#888888] text-sm mb-4">{selectedAssignment.description}</p>}

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#0A1A0F] rounded-lg p-3">
                <span className="text-[#888888] text-xs block mb-1">Location</span>
                <span className="text-white text-sm flex items-center gap-1"><MapPin size={14} /> {selectedAssignment.branchName || selectedAssignment.locationPostcode}</span>
              </div>
              <div className="bg-[#0A1A0F] rounded-lg p-3">
                <span className="text-[#888888] text-xs block mb-1">Budget</span>
                <span className="im-font-financial text-lg">{selectedAssignment.dailyBudget ? `£${parseFloat(selectedAssignment.dailyBudget).toFixed(0)}/day` : "Open"}</span>
              </div>
              <div className="bg-[#0A1A0F] rounded-lg p-3">
                <span className="text-[#888888] text-xs block mb-1">Dates</span>
                <span className="text-white text-sm flex items-center gap-1"><Calendar size={14} /> {new Date(selectedAssignment.startDate).toLocaleDateString("en-GB")} — {new Date(selectedAssignment.endDate).toLocaleDateString("en-GB")}</span>
              </div>
              <div className="bg-[#0A1A0F] rounded-lg p-3">
                <span className="text-[#888888] text-xs block mb-1">Duration</span>
                <span className="text-white text-sm">{selectedAssignment.durationType ? getDurationLabel(selectedAssignment.durationType) : "Flexible"}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href={`/inter-mission/assignments/${selectedAssignment.id}`} className="im-btn-primary flex-1 text-center text-sm py-2.5" data-testid="link-view-full-detail" onClick={() => setSelectedAssignment(null)}>
                <Eye size={16} className="mr-1.5 inline" /> View Full Details & Apply
              </Link>
            </div>
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
