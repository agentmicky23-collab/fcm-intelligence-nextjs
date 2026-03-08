"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, MapPin, Star, Calendar, Briefcase, User, Trash2 } from "lucide-react";
import { EXPERTISE_TRACKS } from "@/lib/im-constants";

interface FavProfile {
  id: number;
  name: string;
  userType: string;
  expertiseTracks: string[] | null;
  averageRating: string;
  reviewCount: number;
  locationPostcode: string | null;
  dailyRate: string | null;
  hourlyRate: string | null;
  yearsExperience: number | null;
  verificationStatus: string;
  stealthMode: boolean;
  favoriteId?: number;
  favoritedAt?: string;
}

interface FavAssignment {
  id: number;
  title: string;
  expertiseTrack: string;
  description: string | null;
  locationPostcode: string;
  branchName: string | null;
  startDate: string;
  endDate: string;
  dailyBudget: string | null;
  status: string;
  urgency: string | null;
  durationType: string | null;
  favoriteId?: number;
  favoritedAt?: string;
}

export default function FavoritesPage() {
  const [tab, setTab] = useState<"profiles" | "assignments">("profiles");
  const [profiles, setProfiles] = useState<FavProfile[]>([]);
  const [assignments, setAssignments] = useState<FavAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/inter-mission/people?userType=operator&limit=1")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data[0]) {
          setCurrentUserId(data[0].id);
          loadFavorites(data[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const loadFavorites = (uid: number) => {
    setLoading(true);
    fetch(`/api/inter-mission/favorites?profileId=${uid}`)
      .then((r) => r.json())
      .then((data) => {
        setProfiles(data.profiles || []);
        setAssignments(data.assignments || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const removeFavorite = (targetType: string, targetId: number) => {
    if (!currentUserId) return;
    if (targetType === "profile") {
      setProfiles((prev) => prev.filter((p) => p.id !== targetId));
    } else {
      setAssignments((prev) => prev.filter((a) => a.id !== targetId));
    }
    fetch("/api/inter-mission/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: currentUserId, targetType, targetId }),
    }).catch(() => {
      if (currentUserId) loadFavorites(currentUserId);
    });
  };

  const getTrackName = (id: string) => EXPERTISE_TRACKS.find((t) => t.id === id)?.name || id;

  const formatDateGB = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  const totalCount = profiles.length + assignments.length;

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2" data-testid="text-favorites-title">
          <Heart size={24} className="text-[#FF4466]" fill="#FF4466" />
          Favorites
          <span className="text-[#888888] text-lg font-normal">({totalCount})</span>
        </h1>
        <p className="text-[#888888] text-sm mt-1">Your saved profiles and assignments for quick access.</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("profiles")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "profiles" ? "bg-[#FF446620] text-[#FF4466] border border-[#FF446640]" : "bg-[#0A1A0F] text-[#888888] border border-[#1A3A25] hover:text-white"}`}
          data-testid="tab-profiles"
        >
          <User size={16} />
          Saved People
          <span className="bg-[#1A3A25] text-[#888888] text-xs px-1.5 py-0.5 rounded-full">{profiles.length}</span>
        </button>
        <button
          onClick={() => setTab("assignments")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "assignments" ? "bg-[#FF446620] text-[#FF4466] border border-[#FF446640]" : "bg-[#0A1A0F] text-[#888888] border border-[#1A3A25] hover:text-white"}`}
          data-testid="tab-assignments"
        >
          <Briefcase size={16} />
          Saved Assignments
          <span className="bg-[#1A3A25] text-[#888888] text-xs px-1.5 py-0.5 rounded-full">{assignments.length}</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-[#FF4466] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#888888]">Loading favorites...</p>
        </div>
      ) : tab === "profiles" ? (
        profiles.length === 0 ? (
          <div className="text-center py-16 im-card">
            <User size={40} className="text-[#1A3A25] mx-auto mb-3" />
            <p className="text-[#888888] text-lg mb-2">No saved people yet</p>
            <p className="text-[#888888] text-sm mb-4">Browse the People directory and tap the heart icon to save profiles here.</p>
            <Link href="/inter-mission/people" className="im-btn-secondary text-sm" data-testid="link-browse-people">Browse People</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((p) => (
              <div key={p.id} className="im-card group relative" data-testid={`fav-profile-${p.id}`}>
                <button
                  onClick={() => removeFavorite("profile", p.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full text-[#FF4466] bg-[#FF444620] hover:bg-[#FF444640] transition-all z-10"
                  data-testid={`button-remove-fav-profile-${p.id}`}
                  aria-label="Remove from favorites"
                >
                  <Trash2 size={14} />
                </button>
                <Link href={`/inter-mission/people/${p.id}`} className="block pr-8">
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

                  {p.expertiseTracks && p.expertiseTracks.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.expertiseTracks.slice(0, 3).map((trackId) => (
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
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )
      ) : (
        assignments.length === 0 ? (
          <div className="text-center py-16 im-card">
            <Briefcase size={40} className="text-[#1A3A25] mx-auto mb-3" />
            <p className="text-[#888888] text-lg mb-2">No saved assignments yet</p>
            <p className="text-[#888888] text-sm mb-4">Browse Assignments and tap the heart icon to save them here.</p>
            <Link href="/inter-mission/assignments" className="im-btn-secondary text-sm" data-testid="link-browse-assignments">Browse Assignments</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.map((a) => (
              <div key={a.id} className="im-card group relative" data-testid={`fav-assignment-${a.id}`}>
                <button
                  onClick={() => removeFavorite("assignment", a.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full text-[#FF4466] bg-[#FF444620] hover:bg-[#FF444640] transition-all z-10"
                  data-testid={`button-remove-fav-assignment-${a.id}`}
                  aria-label="Remove from favorites"
                >
                  <Trash2 size={14} />
                </button>
                <Link href={`/inter-mission/assignments/${a.id}`} className="block pr-8">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {a.urgency === "urgent" && (
                      <span className="inline-flex items-center gap-1 bg-[#FF444420] text-[#FF4444] text-xs font-semibold px-2 py-0.5 rounded">
                        URGENT
                      </span>
                    )}
                    <span className="text-xs bg-[#00FF8810] text-[#00FF88] px-2 py-0.5 rounded">
                      {getTrackName(a.expertiseTrack)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${a.status === "open" ? "bg-[#00FF8815] text-[#00FF88]" : "bg-[#88888820] text-[#888888]"}`}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-white font-semibold text-sm md:text-base mb-1 group-hover:text-[#00FF88] transition-colors">{a.title}</p>
                  {a.description && <p className="text-[#888888] text-xs line-clamp-1 mb-2">{a.description}</p>}
                  <div className="flex items-center gap-4 text-[#888888] text-xs flex-wrap">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {a.branchName || a.locationPostcode}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {formatDateGB(a.startDate)} — {formatDateGB(a.endDate)}</span>
                    {a.dailyBudget && <span className="im-font-financial">£{parseFloat(a.dailyBudget).toFixed(0)}/day</span>}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
