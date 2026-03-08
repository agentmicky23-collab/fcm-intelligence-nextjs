"use client";

import { useEffect, useState, useRef } from "react";
import { UK_REGIONS } from "@/lib/im-constants";
import Link from "next/link";
import UKMap, { RegionData } from "@/components/inter-mission/UKMap";
import { Users, Briefcase, MapPin, Star, Trophy, Zap, Shield, TrendingUp, ChevronRight, Award, Target, Crown } from "lucide-react";

interface MapData {
  managers: { id: number; name: string; locationPostcode: string | null; expertiseTracks: any; averageRating?: string; verificationStatus?: string }[];
  assignments: { id: number; title: string; locationPostcode: string | null; expertiseTrack: string; status: string; dailyBudget?: string; urgency?: string }[];
}

function getRegionForPostcode(postcode: string | null): string | null {
  if (!postcode) return null;
  const prefix = postcode.replace(/\s/g, "").match(/^[A-Z]{1,2}/i)?.[0]?.toUpperCase();
  if (!prefix) return null;
  for (const region of UK_REGIONS) {
    if (region.postcodes.includes(prefix)) return region.id;
  }
  return null;
}

function AnimatedCounter({ target, duration = 1500, prefix = "", suffix = "" }: { target: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) { setCount(target); return; }
    hasAnimated.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

export default function MapPage() {
  const [data, setData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [show, setShow] = useState<"both" | "managers" | "assignments">("both");
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setFetchError(false);
    fetch("/api/inter-mission/map-data")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setData)
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const regionData: RegionData[] = UK_REGIONS.map((region) => {
    const managers = data?.managers?.filter((m) => getRegionForPostcode(m.locationPostcode) === region.id).length || 0;
    const assignments = data?.assignments?.filter((a) => getRegionForPostcode(a.locationPostcode) === region.id).length || 0;
    return { id: region.id, name: region.name, managers, assignments };
  });

  const totalManagers = data?.managers?.length || 0;
  const totalAssignments = data?.assignments?.length || 0;
  const activeRegions = regionData.filter((r) => r.managers + r.assignments > 0).length;
  const coveragePercent = Math.round((activeRegions / UK_REGIONS.length) * 100);
  const networkScore = totalManagers * 10 + totalAssignments * 15 + activeRegions * 25;

  const activeRegionId = hoveredRegion || selectedRegion;
  const activeRegionData = activeRegionId ? regionData.find((r) => r.id === activeRegionId) : null;
  const activeRegionManagers = activeRegionId ? data?.managers?.filter((m) => getRegionForPostcode(m.locationPostcode) === activeRegionId) || [] : [];
  const activeRegionAssignments = activeRegionId ? data?.assignments?.filter((a) => getRegionForPostcode(a.locationPostcode) === activeRegionId) || [] : [];

  const getRegionStatus = (r: RegionData) => {
    const total = r.managers + r.assignments;
    if (total >= 5) return { label: "Hotspot", icon: "🔥", color: "#FF6B35" };
    if (total >= 2) return { label: "Growing", icon: "🆕", color: "#00FF88" };
    if (total >= 1) return { label: "Active", icon: "✓", color: "#64B5F6" };
    return { label: "Needs Coverage", icon: "⚡", color: "#888888" };
  };

  const achievements = [
    { id: "first_region", label: "First Region", desc: "1 region active", icon: <MapPin size={16} />, unlocked: activeRegions >= 1 },
    { id: "five_regions", label: "5 Regions", desc: "5 regions covered", icon: <Target size={16} />, unlocked: activeRegions >= 5 },
    { id: "full_coverage", label: "Full Coverage", desc: "All 12 regions", icon: <Crown size={16} />, unlocked: activeRegions >= 12 },
    { id: "ten_managers", label: "Squad Up", desc: "10+ managers", icon: <Users size={16} />, unlocked: totalManagers >= 10 },
    { id: "five_assignments", label: "In Demand", desc: "5+ assignments", icon: <Briefcase size={16} />, unlocked: totalAssignments >= 5 },
    { id: "hotspot", label: "Hotspot", desc: "A region with 5+", icon: <Zap size={16} />, unlocked: regionData.some((r) => r.managers + r.assignments >= 5) },
  ];

  const handleRegionClick = (id: string) => {
    setSelectedRegion(selectedRegion === id ? null : id);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#888888]">Loading network intelligence...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <MapPin size={40} className="text-[#FF4444] mx-auto mb-4" />
        <p className="text-white font-medium mb-2">Failed to load network data</p>
        <p className="text-[#888888] text-sm mb-4">Could not connect to the server. Please try again.</p>
        <button onClick={loadData} className="im-btn-primary text-sm px-6 py-2" data-testid="button-retry">Retry</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white" data-testid="text-map-title">
            Network <span className="text-[#00FF88]">Command</span>
          </h1>
          <p className="text-[#888888] text-sm mt-1">Live coverage intelligence across the UK</p>
        </div>
        <div className="text-right">
          <div className="im-font-financial text-2xl im-score-glow" data-testid="text-network-score">
            <AnimatedCounter target={networkScore} />
          </div>
          <span className="text-[#888888] text-[10px] uppercase tracking-wider">Network Score</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="im-card !p-3 text-center">
          <div className="im-font-financial text-xl" data-testid="stat-managers">
            <AnimatedCounter target={totalManagers} />
          </div>
          <div className="flex items-center justify-center gap-1 text-[#888888] text-[10px] mt-1">
            <Users size={10} /> Managers
          </div>
        </div>
        <div className="im-card !p-3 text-center">
          <div className="text-xl font-bold text-orange-400" style={{ fontFamily: "'JetBrains Mono', monospace" }} data-testid="stat-assignments">
            <AnimatedCounter target={totalAssignments} />
          </div>
          <div className="flex items-center justify-center gap-1 text-[#888888] text-[10px] mt-1">
            <Briefcase size={10} /> Assignments
          </div>
        </div>
        <div className="im-card !p-3 text-center">
          <div className="im-font-financial text-xl" data-testid="stat-regions">
            <AnimatedCounter target={activeRegions} suffix={`/${UK_REGIONS.length}`} />
          </div>
          <div className="flex items-center justify-center gap-1 text-[#888888] text-[10px] mt-1">
            <MapPin size={10} /> Regions
          </div>
        </div>
        <div className="im-card !p-3 text-center">
          <div className="im-font-financial text-xl" data-testid="stat-coverage">
            <AnimatedCounter target={coveragePercent} suffix="%" />
          </div>
          <div className="flex items-center justify-center gap-1 text-[#888888] text-[10px] mt-1">
            <Shield size={10} /> Coverage
          </div>
        </div>
      </div>

      <div className="im-card !p-3 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#888888] text-xs flex items-center gap-1"><TrendingUp size={12} /> Network Coverage</span>
          <span className="im-font-financial text-xs">{coveragePercent}%</span>
        </div>
        <div className="h-2 bg-[#0A1A0F] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full im-progress-bar"
            style={{
              width: `${coveragePercent}%`,
              background: coveragePercent === 100
                ? "linear-gradient(90deg, #00FF88, #FFD700)"
                : "linear-gradient(90deg, #00FF88, #00CC6A)",
            }}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(["both", "managers", "assignments"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setShow(mode)}
            className={`text-xs px-4 py-2 rounded-lg transition-all font-medium ${show === mode ? "bg-[#00FF88] text-black font-semibold" : "bg-[#0A1A0F] border border-[#1A3A25] text-[#888888] hover:border-[#00FF88] hover:text-white"}`}
            data-testid={`toggle-${mode}`}
          >
            {mode === "both" ? "All Activity" : mode === "managers" ? "👤 Managers" : "📋 Assignments"}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3">
          <div className="im-card relative overflow-hidden" data-testid="map-container">
            <div className="absolute inset-0 im-shimmer pointer-events-none" />
            <UKMap
              regions={regionData}
              hoveredRegion={hoveredRegion}
              selectedRegion={selectedRegion}
              onHover={setHoveredRegion}
              onClick={handleRegionClick}
              show={show}
            />
            <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-[#888888]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00FF88]" /> Managers</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400" /> Assignments</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#1A3A25]" /> No coverage</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {activeRegionData ? (
            <div className="im-card im-glow im-animate-in" data-testid="panel-region-detail">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">{activeRegionData.name}</h3>
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ backgroundColor: `${getRegionStatus(activeRegionData).color}20`, color: getRegionStatus(activeRegionData).color }}
                >
                  {getRegionStatus(activeRegionData).icon} {getRegionStatus(activeRegionData).label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#0A1A0F] rounded-lg p-3 text-center">
                  <div className="im-font-financial text-2xl">{activeRegionData.managers}</div>
                  <div className="text-[#888888] text-xs flex items-center justify-center gap-1 mt-1"><Users size={11} /> Managers</div>
                  <div className="h-1 bg-[#1A3A25] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-[#00FF88] rounded-full transition-all duration-500" style={{ width: `${Math.min((activeRegionData.managers / Math.max(totalManagers, 1)) * 100 * 3, 100)}%` }} />
                  </div>
                </div>
                <div className="bg-[#0A1A0F] rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-orange-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{activeRegionData.assignments}</div>
                  <div className="text-[#888888] text-xs flex items-center justify-center gap-1 mt-1"><Briefcase size={11} /> Assignments</div>
                  <div className="h-1 bg-[#1A3A25] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full transition-all duration-500" style={{ width: `${Math.min((activeRegionData.assignments / Math.max(totalAssignments, 1)) * 100 * 3, 100)}%` }} />
                  </div>
                </div>
              </div>

              {activeRegionManagers.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-[#888888] text-xs uppercase tracking-wider mb-2 flex items-center gap-1"><Users size={11} /> Top Managers</h4>
                  <div className="space-y-2">
                    {activeRegionManagers.slice(0, 4).map((m) => (
                      <Link href={`/inter-mission/people/${m.id}`} key={m.id} className="flex items-center gap-2 bg-[#0A1A0F] rounded-lg p-2 hover:bg-[#0D1F14] transition-colors group" data-testid={`region-manager-${m.id}`}>
                        <div className="w-8 h-8 rounded-full bg-[#1A3A25] flex items-center justify-center text-[#00FF88] font-bold text-xs shrink-0">
                          {m.name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium truncate group-hover:text-[#00FF88] transition-colors">{m.name}</p>
                          {m.averageRating && parseFloat(m.averageRating) > 0 && (
                            <span className="text-[#888888] text-[10px] flex items-center gap-0.5">
                              <Star size={9} className="text-[#00FF88]" fill="#00FF88" /> {parseFloat(m.averageRating).toFixed(1)}
                            </span>
                          )}
                        </div>
                        <ChevronRight size={14} className="text-[#1A3A25] group-hover:text-[#00FF88] transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {activeRegionAssignments.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-[#888888] text-xs uppercase tracking-wider mb-2 flex items-center gap-1"><Briefcase size={11} /> Open Assignments</h4>
                  <div className="space-y-2">
                    {activeRegionAssignments.slice(0, 3).map((a) => (
                      <Link href={`/inter-mission/assignments`} key={a.id} className="block bg-[#0A1A0F] rounded-lg p-2 hover:bg-[#0D1F14] transition-colors group" data-testid={`region-assignment-${a.id}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-medium truncate group-hover:text-[#00FF88] transition-colors">{a.title}</p>
                            {a.urgency === "urgent" && <span className="text-[#FF4444] text-[10px] font-semibold">⚡ URGENT</span>}
                          </div>
                          {a.dailyBudget && (
                            <span className="im-font-financial text-xs shrink-0">£{parseFloat(a.dailyBudget).toFixed(0)}</span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href={`/inter-mission/people`}
                className="im-btn-primary w-full text-center text-sm py-2"
                data-testid="button-explore-region"
              >
                Explore {activeRegionData.name} <ChevronRight size={16} className="ml-1 inline" />
              </Link>
            </div>
          ) : (
            <div className="im-card text-center py-12">
              <div className="im-float inline-block mb-4">
                <MapPin size={40} className="text-[#1A3A25]" />
              </div>
              <p className="text-white font-medium mb-1">Select a Region</p>
              <p className="text-[#888888] text-sm">Hover or tap a region on the map to see activity details</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {regionData
          .sort((a, b) => (b.managers + b.assignments) - (a.managers + a.assignments))
          .map((region) => {
            const status = getRegionStatus(region);
            const total = region.managers + region.assignments;
            const isActive = activeRegionId === region.id;
            return (
              <button
                key={region.id}
                onClick={() => handleRegionClick(region.id)}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                className={`im-card !p-3 text-left transition-all ${isActive ? "!border-[#00FF88] im-glow" : ""}`}
                data-testid={`region-card-${region.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-xs font-semibold truncate">{region.name}</span>
                  <span className="text-[10px]" style={{ color: status.color }}>{status.icon}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex gap-3">
                    <div>
                      <span className="im-font-financial text-lg">{region.managers}</span>
                      <span className="text-[#888888] text-[10px] block">mgrs</span>
                    </div>
                    <div>
                      <span className="text-lg font-bold text-orange-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{region.assignments}</span>
                      <span className="text-[#888888] text-[10px] block">jobs</span>
                    </div>
                  </div>
                  {total > 0 && (
                    <div className="w-8 h-8 rounded-full border border-[#1A3A25] flex items-center justify-center">
                      <span className="im-font-financial text-[10px]">{total}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
      </div>

      <div className="im-card" data-testid="panel-achievements">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={18} className="text-[#FFD700]" />
          <h3 className="text-white font-bold">Network Achievements</h3>
          <span className="text-[#888888] text-xs ml-auto">{achievements.filter((a) => a.unlocked).length}/{achievements.length} unlocked</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {achievements.map((achievement, i) => (
            <div
              key={achievement.id}
              className={`rounded-lg p-3 text-center transition-all ${achievement.unlocked ? "bg-[#00FF8810] border border-[#00FF8840] im-badge" : "bg-[#0A1A0F] border border-[#1A3A25] opacity-50"}`}
              style={{ animationDelay: achievement.unlocked ? `${i * 0.1}s` : undefined }}
              data-testid={`achievement-${achievement.id}`}
            >
              <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${achievement.unlocked ? "bg-[#00FF8820] text-[#00FF88]" : "bg-[#1A3A25] text-[#555]"}`}>
                {achievement.icon}
              </div>
              <p className={`text-xs font-semibold mb-0.5 ${achievement.unlocked ? "text-white" : "text-[#555]"}`}>{achievement.label}</p>
              <p className={`text-[10px] ${achievement.unlocked ? "text-[#888888]" : "text-[#444]"}`}>{achievement.desc}</p>
              {achievement.unlocked && <span className="text-[#00FF88] text-[10px] mt-1 block">✓ Unlocked</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
