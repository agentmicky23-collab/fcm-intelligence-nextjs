"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EXPERTISE_TRACKS } from "@/lib/im-constants";
import { MapPin, Calendar, Clock, AlertTriangle, Plus, Filter } from "lucide-react";

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
  const [trackFilter, setTrackFilter] = useState(searchParams.get("track") || "");
  const [urgencyFilter, setUrgencyFilter] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (trackFilter) params.set("expertiseTrack", trackFilter);
    if (urgencyFilter) params.set("urgency", urgencyFilter);
    params.set("status", "open");

    fetch(`/api/inter-mission/assignments?${params}`)
      .then((r) => r.json())
      .then((data) => setAssignments(Array.isArray(data) ? data : []))
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, [trackFilter, urgencyFilter]);

  const getTrackName = (id: string) => EXPERTISE_TRACKS.find((t) => t.id === id)?.name || id;
  const getTrackIcon = (id: string) => EXPERTISE_TRACKS.find((t) => t.id === id)?.icon || "📋";

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white" data-testid="text-assignments-title">
            Open <span className="text-[#00FF88]">Assignments</span>
          </h1>
          <p className="text-[#888888] text-sm mt-1">{assignments.length} assignments available</p>
        </div>
        <Link href="/inter-mission/assignments/post" className="im-btn-primary text-sm px-4 py-2" data-testid="link-post-assignment">
          <Plus size={16} className="mr-1" /> Post Assignment
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[#888888]" />
          <select value={trackFilter} onChange={(e) => setTrackFilter(e.target.value)} className="bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none" data-testid="select-track-filter">
            <option value="">All Tracks</option>
            {EXPERTISE_TRACKS.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <select value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)} className="bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none" data-testid="select-urgency-filter">
          <option value="">All Urgency</option>
          <option value="standard">Standard</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#888888]">Loading assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#888888] mb-4">No assignments found matching your filters.</p>
          <Link href="/inter-mission/assignments/post" className="im-btn-secondary text-sm">Post an Assignment</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((a) => (
            <Link key={a.id} href={`/inter-mission/assignments/${a.id}`} className="im-card block group" data-testid={`card-assignment-${a.id}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {a.urgency === "urgent" && (
                      <span className="inline-flex items-center gap-1 bg-[#FF444420] text-[#FF4444] text-xs font-semibold px-2 py-0.5 rounded im-pulse-urgent" data-testid={`badge-urgent-${a.id}`}>
                        <AlertTriangle size={12} /> URGENT
                      </span>
                    )}
                    <span className="text-xs bg-[#00FF8815] text-[#00FF88] px-2 py-0.5 rounded">
                      {getTrackIcon(a.expertiseTrack)} {getTrackName(a.expertiseTrack)}
                    </span>
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
