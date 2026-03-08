"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EXPERTISE_TRACKS } from "@/lib/im-constants";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";

export default function MyAssignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inter-mission/assignments")
      .then((r) => r.json())
      .then((data) => setAssignments(Array.isArray(data) ? data : []))
      .catch(() => [])
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <Link href="/inter-mission/dashboard" className="text-[#888888] hover:text-[#00FF88] text-sm flex items-center gap-1 mb-6">
        <ArrowLeft size={16} /> Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6" data-testid="text-my-assignments-title">
        My <span className="text-[#00FF88]">Assignments</span>
      </h1>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#888888] mb-4">No assignments yet.</p>
          <Link href="/inter-mission/assignments" className="im-btn-secondary text-sm">Browse Assignments</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <Link key={a.id} href={`/inter-mission/assignments/${a.id}`} className="im-card block group" data-testid={`card-my-assignment-${a.id}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-white font-semibold group-hover:text-[#00FF88] transition-colors">{a.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#888888]">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {a.locationPostcode}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(a.startDate).toLocaleDateString("en-GB")}</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${a.status === "open" ? "bg-[#00FF8815] text-[#00FF88]" : a.status === "completed" ? "bg-[#00FF8815] text-[#00FF88]" : "bg-[#88888820] text-[#888888]"}`}>
                  {a.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
