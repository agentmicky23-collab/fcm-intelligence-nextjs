"use client";

import { useState } from "react";

export interface RegionData {
  id: string;
  name: string;
  managers: number;
  assignments: number;
}

interface UKMapProps {
  regions: RegionData[];
  hoveredRegion: string | null;
  selectedRegion: string | null;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  show: "both" | "managers" | "assignments";
}

const REGION_PATHS: Record<string, { d: string; labelX: number; labelY: number }> = {
  scotland: {
    d: "M180,10 L210,8 L230,25 L250,15 L265,30 L255,50 L270,65 L260,85 L240,78 L235,95 L250,110 L240,125 L255,135 L245,150 L220,145 L210,155 L195,148 L185,160 L170,150 L160,135 L155,120 L165,105 L150,95 L155,80 L140,70 L150,55 L165,50 L170,35 L180,25 Z",
    labelX: 205, labelY: 90,
  },
  northern_ireland: {
    d: "M80,130 L110,120 L130,130 L135,148 L125,160 L110,165 L95,158 L80,150 Z",
    labelX: 107, labelY: 143,
  },
  north_east: {
    d: "M240,155 L260,150 L270,165 L265,185 L250,195 L235,190 L225,175 L230,162 Z",
    labelX: 248, labelY: 173,
  },
  north_west: {
    d: "M185,165 L210,158 L225,175 L235,190 L230,210 L220,225 L205,230 L190,222 L180,208 L175,190 L180,175 Z",
    labelX: 205, labelY: 195,
  },
  yorkshire: {
    d: "M235,190 L250,195 L265,185 L280,195 L285,215 L275,230 L258,235 L240,228 L230,215 L230,210 Z",
    labelX: 258, labelY: 212,
  },
  wales: {
    d: "M155,230 L175,225 L185,240 L190,260 L185,280 L175,295 L160,300 L145,290 L135,275 L138,255 L145,240 Z",
    labelX: 163, labelY: 265,
  },
  west_midlands: {
    d: "M190,225 L220,228 L235,240 L232,260 L220,272 L205,270 L190,262 L185,245 Z",
    labelX: 210, labelY: 248,
  },
  east_midlands: {
    d: "M235,240 L258,235 L275,245 L280,265 L268,278 L250,275 L235,268 L232,260 Z",
    labelX: 255, labelY: 258,
  },
  east: {
    d: "M275,265 L295,260 L310,275 L315,295 L305,310 L290,315 L275,305 L268,285 Z",
    labelX: 292, labelY: 288,
  },
  south_east: {
    d: "M220,295 L250,285 L275,305 L290,315 L305,310 L310,330 L295,345 L275,350 L255,345 L235,335 L220,320 L215,305 Z",
    labelX: 262, labelY: 322,
  },
  london: {
    d: "M250,285 L268,278 L275,290 L275,305 L260,300 L250,295 Z",
    labelX: 263, labelY: 292,
  },
  south_west: {
    d: "M145,295 L175,295 L190,305 L215,305 L220,320 L210,340 L195,355 L175,365 L155,360 L135,345 L120,325 L125,308 Z",
    labelX: 170, labelY: 330,
  },
};

export default function UKMap({ regions, hoveredRegion, selectedRegion, onHover, onClick, show }: UKMapProps) {
  const maxCount = Math.max(...regions.map((r) => {
    if (show === "managers") return r.managers;
    if (show === "assignments") return r.assignments;
    return r.managers + r.assignments;
  }), 1);

  const getRegionCount = (id: string) => {
    const r = regions.find((reg) => reg.id === id);
    if (!r) return 0;
    if (show === "managers") return r.managers;
    if (show === "assignments") return r.assignments;
    return r.managers + r.assignments;
  };

  const getIntensity = (id: string) => {
    const count = getRegionCount(id);
    return count / maxCount;
  };

  const getFill = (id: string) => {
    const intensity = getIntensity(id);
    const isHovered = hoveredRegion === id;
    const isSelected = selectedRegion === id;
    if (isHovered || isSelected) return `rgba(0, 255, 136, ${0.35 + intensity * 0.45})`;
    if (intensity === 0) return "rgba(10, 26, 15, 0.8)";
    return `rgba(0, 255, 136, ${0.06 + intensity * 0.25})`;
  };

  const getStroke = (id: string) => {
    const isHovered = hoveredRegion === id;
    const isSelected = selectedRegion === id;
    if (isHovered || isSelected) return "#00FF88";
    const intensity = getIntensity(id);
    if (intensity > 0) return `rgba(0, 255, 136, ${0.3 + intensity * 0.4})`;
    return "rgba(26, 58, 37, 0.6)";
  };

  const getStrokeWidth = (id: string) => {
    const isHovered = hoveredRegion === id;
    const isSelected = selectedRegion === id;
    if (isHovered || isSelected) return 2.5;
    return 1;
  };

  return (
    <div className="relative w-full max-w-[380px] mx-auto">
      <svg viewBox="60 0 270 380" className="w-full h-auto drop-shadow-2xl" style={{ filter: "drop-shadow(0 0 30px rgba(0, 255, 136, 0.08))" }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-strong">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="pulse-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00FF88" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
          </radialGradient>
        </defs>

        {Object.entries(REGION_PATHS).map(([id, { d, labelX, labelY }]) => {
          const count = getRegionCount(id);
          const isHovered = hoveredRegion === id;
          const isSelected = selectedRegion === id;
          const isActive = isHovered || isSelected;
          const region = regions.find((r) => r.id === id);

          return (
            <g key={id}
              onMouseEnter={() => onHover(id)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onClick(id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(id); } }}
              onFocus={() => onHover(id)}
              onBlur={() => onHover(null)}
              className="cursor-pointer"
              style={{ transition: "all 0.3s ease" }}
              tabIndex={0}
              role="button"
              aria-label={`${region?.name || id}: ${count} active`}
            >
              <path
                d={d}
                fill={getFill(id)}
                stroke={getStroke(id)}
                strokeWidth={getStrokeWidth(id)}
                strokeLinejoin="round"
                className="transition-all duration-300 ease-out"
                filter={isActive ? "url(#glow-strong)" : count > 0 ? "url(#glow)" : undefined}
                style={{ transform: isActive ? "scale(1.02)" : "scale(1)", transformOrigin: `${labelX}px ${labelY}px` }}
                data-testid={`map-region-${id}`}
              />

              {count > 0 && (
                <circle
                  cx={labelX}
                  cy={labelY}
                  r={isActive ? 8 : 5}
                  className={isActive ? "im-map-pulse-dot" : "im-map-dot"}
                  fill="url(#pulse-grad)"
                  style={{ transition: "r 0.3s ease" }}
                />
              )}

              {count > 0 && (
                <circle
                  cx={labelX}
                  cy={labelY}
                  r="3"
                  fill="#00FF88"
                  className="transition-all duration-300"
                  style={{ opacity: isActive ? 1 : 0.7 }}
                />
              )}

              {isActive && region && (
                <g className="im-animate-in pointer-events-none">
                  <rect
                    x={labelX - 30}
                    y={labelY - 28}
                    width="60"
                    height="18"
                    rx="4"
                    fill="rgba(0, 0, 0, 0.85)"
                    stroke="#00FF88"
                    strokeWidth="0.5"
                  />
                  <text x={labelX} y={labelY - 16} textAnchor="middle" fill="#00FF88" fontSize="8" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
                    {count}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
