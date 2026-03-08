"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EXPERTISE_TRACKS } from "@/lib/im-constants";
import { MapPin, Star, Search, SlidersHorizontal, X, ArrowUpDown, Heart } from "lucide-react";

interface Profile {
  id: number;
  name: string;
  userType: string;
  bio: string | null;
  locationPostcode: string | null;
  branchName: string | null;
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
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "");
  const [trackFilter, setTrackFilter] = useState(searchParams.get("track") || "");
  const [minRating, setMinRating] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [sort, setSort] = useState("newest");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [favoritedIds, setFavoritedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/inter-mission/people?userType=operator&limit=1")
      .then((r) => r.json())
      .then((profiles) => {
        if (Array.isArray(profiles) && profiles[0]) {
          const uid = profiles[0].id;
          setCurrentUserId(uid);
          fetch(`/api/inter-mission/favorites?profileId=${uid}`)
            .then((r) => r.json())
            .then((data) => {
              const ids = new Set<number>((data.favorites || []).filter((f: any) => f.targetType === "profile").map((f: any) => f.targetId));
              setFavoritedIds(ids);
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  const toggleFavorite = (e: React.MouseEvent, profileId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUserId) return;
    const wasFavorited = favoritedIds.has(profileId);
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      if (wasFavorited) next.delete(profileId); else next.add(profileId);
      return next;
    });
    fetch("/api/inter-mission/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: currentUserId, targetType: "profile", targetId: profileId }),
    }).catch(() => {
      setFavoritedIds((prev) => {
        const next = new Set(prev);
        if (wasFavorited) next.add(profileId); else next.delete(profileId);
        return next;
      });
    });
  };

  const fetchProfiles = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (typeFilter) params.set("userType", typeFilter);
    if (trackFilter) params.set("expertiseTrack", trackFilter);
    if (minRating) params.set("minRating", minRating);
    if (minExperience) params.set("minExperience", minExperience);
    if (sort !== "newest") params.set("sort", sort);

    fetch(`/api/inter-mission/people?${params}`)
      .then((r) => r.json())
      .then((data) => setProfiles(Array.isArray(data) ? data : []))
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false));
  }, [search, typeFilter, trackFilter, minRating, minExperience, sort]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchProfiles, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [fetchProfiles]);

  const activeFilterCount = [typeFilter, trackFilter, minRating, minExperience].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearch("");
    setTypeFilter("");
    setTrackFilter("");
    setMinRating("");
    setMinExperience("");
    setSort("newest");
  };

  const getTrackName = (id: string) => EXPERTISE_TRACKS.find((t) => t.id === id)?.name || id;
  const getTypeLabel = (t: string) => t === "manager" ? "Managers" : t === "employee" ? "Employees" : t === "operator" ? "Operators" : t;
  const getRatingLabel = (r: string) => `${r}+ Stars`;

  const activeChips: { label: string; onClear: () => void }[] = [];
  if (typeFilter) activeChips.push({ label: getTypeLabel(typeFilter), onClear: () => setTypeFilter("") });
  if (trackFilter) activeChips.push({ label: getTrackName(trackFilter), onClear: () => setTrackFilter("") });
  if (minRating) activeChips.push({ label: getRatingLabel(minRating), onClear: () => setMinRating("") });
  if (minExperience) activeChips.push({ label: `${minExperience}+ years exp`, onClear: () => setMinExperience("") });

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white" data-testid="text-people-title">
          Browse <span className="text-[#00FF88]">People</span>
        </h1>
        <p className="text-[#888888] text-sm mt-1">{profiles.length} professional{profiles.length !== 1 ? "s" : ""} in the network</p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, location, or branch..."
              className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none transition-colors"
              data-testid="input-search-people"
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
              <h3 className="text-white font-semibold text-sm">Filter People</h3>
              {activeFilterCount > 0 && (
                <button onClick={clearAllFilters} className="text-[#00FF88] text-xs hover:underline" data-testid="button-clear-all-filters">Clear all</button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[#888888] text-xs block mb-1">Role Type</label>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none" data-testid="select-type-filter">
                  <option value="">All Types</option>
                  <option value="manager">Managers</option>
                  <option value="employee">Employees</option>
                  <option value="operator">Operators</option>
                </select>
              </div>

              <div>
                <label className="text-[#888888] text-xs block mb-1">Expertise</label>
                <select value={trackFilter} onChange={(e) => setTrackFilter(e.target.value)} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none" data-testid="select-track-filter">
                  <option value="">All Expertise</option>
                  {EXPERTISE_TRACKS.map((t) => (
                    <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#888888] text-xs block mb-1">Minimum Rating</label>
                <select value={minRating} onChange={(e) => setMinRating(e.target.value)} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none" data-testid="select-min-rating">
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>

              <div>
                <label className="text-[#888888] text-xs block mb-1">Experience</label>
                <select value={minExperience} onChange={(e) => setMinExperience(e.target.value)} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none" data-testid="select-min-experience">
                  <option value="">Any Experience</option>
                  <option value="1">1+ years</option>
                  <option value="3">3+ years</option>
                  <option value="5">5+ years</option>
                  <option value="10">10+ years</option>
                </select>
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
              <option value="rating_high">Highest Rated</option>
              <option value="experience_high">Most Experienced</option>
              <option value="rate_low">Rate: Low → High</option>
              <option value="rate_high">Rate: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#888888]">Loading profiles...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#888888] text-lg mb-2">No people found</p>
          <p className="text-[#888888] text-sm mb-6">
            {activeFilterCount > 0 || search ? "Try adjusting your filters or search terms." : "No profiles registered yet."}
          </p>
          {(activeFilterCount > 0 || search) && (
            <button onClick={clearAllFilters} className="im-btn-secondary text-sm" data-testid="button-empty-clear-filters">Clear Filters</button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => (
            <Link key={p.id} href={`/inter-mission/people/${p.id}`} className="im-card group relative" data-testid={`card-person-${p.id}`}>
              <button
                onClick={(e) => toggleFavorite(e, p.id)}
                className={`absolute top-3 right-3 p-1.5 rounded-full transition-all z-10 ${favoritedIds.has(p.id) ? "text-[#FF4466] bg-[#FF444620]" : "text-[#555] hover:text-[#FF4466] hover:bg-[#FF444610]"}`}
                data-testid={`button-favorite-person-${p.id}`}
                aria-label={favoritedIds.has(p.id) ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart size={16} fill={favoritedIds.has(p.id) ? "#FF4466" : "none"} />
              </button>
              <div className="flex items-start gap-3 mb-3 pr-8">
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
                  {(p.expertiseTracks as string[]).length > 3 && (
                    <span className="text-xs text-[#888888]">+{(p.expertiseTracks as string[]).length - 3}</span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#1A3A25]">
                {p.locationPostcode && (
                  <span className="text-[#888888] text-xs flex items-center gap-1"><MapPin size={12} /> {p.locationPostcode}</span>
                )}
                {p.dailyRate && p.verificationStatus === "vetted" && (
                  <span className="im-font-financial text-sm">£{parseFloat(p.dailyRate).toFixed(0)}/day</span>
                )}
                {!p.dailyRate && p.hourlyRate && p.verificationStatus === "vetted" && (
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
