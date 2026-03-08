"use client";

import { useEffect, useState } from "react";
import { UK_REGIONS } from "@/lib/im-constants";
import Link from "next/link";

interface MapData {
  managers: { id: number; name: string; locationPostcode: string | null; expertiseTracks: any }[];
  assignments: { id: number; title: string; locationPostcode: string | null; expertiseTrack: string; status: string }[];
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

export default function MapPage() {
  const [data, setData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState<"both" | "managers" | "assignments">("both");

  useEffect(() => {
    fetch("/api/inter-mission/map-data")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const regionCounts = UK_REGIONS.map((region) => {
    const managers = data?.managers?.filter((m) => getRegionForPostcode(m.locationPostcode) === region.id).length || 0;
    const assignments = data?.assignments?.filter((a) => getRegionForPostcode(a.locationPostcode) === region.id).length || 0;
    return { ...region, managers, assignments };
  });

  const maxCount = Math.max(...regionCounts.map((r) => r.managers + r.assignments), 1);

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-white mb-2" data-testid="text-map-title">
        Network <span className="text-[#00FF88]">Map</span>
      </h1>
      <p className="text-[#888888] text-sm mb-6">Supply and demand across the UK</p>

      <div className="flex gap-2 mb-6">
        {(["both", "managers", "assignments"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setShow(mode)}
            className={`text-sm px-4 py-2 rounded-lg transition-all ${show === mode ? "bg-[#00FF88] text-black font-semibold" : "bg-[#0A1A0F] border border-[#1A3A25] text-[#888888] hover:border-[#00FF88]"}`}
            data-testid={`toggle-${mode}`}
          >
            {mode === "both" ? "Show Both" : mode === "managers" ? "Managers" : "Assignments"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#888888]">Loading map data...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {regionCounts.map((region) => {
            const total = (show === "managers" ? region.managers : show === "assignments" ? region.assignments : region.managers + region.assignments);
            const intensity = total / maxCount;
            return (
              <div
                key={region.id}
                className="im-card relative overflow-hidden"
                style={{ borderColor: total > 0 ? `rgba(0, 255, 136, ${0.2 + intensity * 0.6})` : undefined }}
                data-testid={`region-${region.id}`}
              >
                {total > 0 && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00FF8808] to-transparent" style={{ opacity: intensity }} />
                )}
                <div className="relative">
                  <h3 className="text-white font-semibold text-sm mb-3">{region.name}</h3>
                  <div className="flex gap-4">
                    {(show === "both" || show === "managers") && (
                      <div>
                        <span className="im-font-financial text-2xl">{region.managers}</span>
                        <span className="text-[#888888] text-xs block">managers</span>
                      </div>
                    )}
                    {(show === "both" || show === "assignments") && (
                      <div>
                        <span className="text-2xl font-bold text-orange-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{region.assignments}</span>
                        <span className="text-[#888888] text-xs block">assignments</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#888888]">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#00FF88]" /> Available managers</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-400" /> Open assignments</span>
      </div>
    </div>
  );
}
