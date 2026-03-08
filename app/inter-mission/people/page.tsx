"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EXPERTISE_TRACKS } from "@/lib/im-constants";
import { MapPin, Star, Search, Filter } from "lucide-react";

interface Profile {
  id: number;
  name: string;
  userType: string;
  bio: string | null;
  locationPostcode: string | null;
  dailyRate: string | null;
  hourlyRate: string | null;
  yearsExperience: number | null;
  expertiseTracks: string[];
  averageRating: string;
  reviewCount: number;
  verificationStatus: string;
  stealthMode: boolean;
}

export default function PeoplePage() {
  return <Suspense fallback={<div className="text-center py-16"><div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto" /></div>}><PeopleContent /></Suspense>;
}

function PeopleContent() {
  const searchParams = useSearchParams();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "");
  const [trackFilter, setTrackFilter] = useState(searchParams.get("track") || "");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (typeFilter) params.set("userType", typeFilter);
    if (trackFilter) params.set("expertiseTrack", trackFilter);
    if (search) params.set("search", search);

    fetch(`/api/inter-mission/people?${params}`)
      .then((r) => r.json())
      .then((data) => setProfiles(Array.isArray(data) ? data : []))
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false));
  }, [typeFilter, trackFilter, search]);

  const getTrackName = (id: string) => EXPERTISE_TRACKS.find((t) => t.id === id)?.name || id;

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-white mb-2" data-testid="text-people-title">
        Browse <span className="text-[#00FF88]">People</span>
      </h1>
      <p className="text-[#888888] text-sm mb-6">{profiles.length} professionals in the network</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or location..." className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" data-testid="input-search" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none" data-testid="select-type-filter">
          <option value="">All Types</option>
          <option value="manager">Managers</option>
          <option value="employee">Employees</option>
          <option value="operator">Operators</option>
        </select>
        <select value={trackFilter} onChange={(e) => setTrackFilter(e.target.value)} className="bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none" data-testid="select-track-filter">
          <option value="">All Expertise</option>
          {EXPERTISE_TRACKS.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#888888]">Loading profiles...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#888888]">No profiles found matching your filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => (
            <Link key={p.id} href={`/inter-mission/people/${p.id}`} className="im-card group" data-testid={`card-person-${p.id}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#1A3A25] flex items-center justify-center text-[#00FF88] font-bold text-lg flex-shrink-0">
                  {p.stealthMode ? "?" : p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold group-hover:text-[#00FF88] transition-colors truncate">
                    {p.stealthMode ? `${p.name.split(" ")[0]} ${p.name.split(" ")[1]?.charAt(0) || ""}.` : p.name}
                  </h3>
                  <p className="text-[#888888] text-xs capitalize">{p.userType}{p.yearsExperience ? ` · ${p.yearsExperience}yr exp` : ""}</p>
                </div>
                {p.verificationStatus === "vetted" && (
                  <span className="text-xs bg-[#00FF8815] text-[#00FF88] px-2 py-0.5 rounded flex-shrink-0">Vetted</span>
                )}
              </div>

              {parseFloat(p.averageRating) > 0 && (
                <div className="flex items-center gap-1 mb-2">
                  <Star size={14} className="text-[#00FF88]" fill="#00FF88" />
                  <span className="text-white text-sm">{parseFloat(p.averageRating).toFixed(1)}</span>
                  <span className="text-[#888888] text-xs">({p.reviewCount})</span>
                </div>
              )}

              {p.expertiseTracks && (p.expertiseTracks as string[]).length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {(p.expertiseTracks as string[]).slice(0, 3).map((trackId) => (
                    <span key={trackId} className="text-xs bg-[#00FF8810] text-[#00FF88] px-2 py-0.5 rounded">{getTrackName(trackId)}</span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#1A3A25]">
                {p.locationPostcode && (
                  <span className="text-[#888888] text-xs flex items-center gap-1"><MapPin size={12} /> {p.locationPostcode}</span>
                )}
                {p.dailyRate && p.verificationStatus === "vetted" && (
                  <span className="im-font-financial text-sm">£{parseFloat(p.dailyRate).toFixed(0)}/day</span>
                )}
                {p.hourlyRate && p.verificationStatus === "vetted" && (
                  <span className="im-font-financial text-sm">£{parseFloat(p.hourlyRate).toFixed(0)}/hr</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
