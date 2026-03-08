"use client";

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

const GB_OUTLINE = "M115,65 L147.5,27.5 L230,20 L250,27.5 L300,65 L310,75 L300,96.5 L310,106.5 L275,113.5 L257.5,132.5 L265,140 L242.5,145 L225,147.5 L210,145 L242.5,152.5 L265,152.5 L300,161.5 L320,170 L322.5,182.5 L329,200 L341.5,220 L370,225 L380,236 L396,244 L406,271 L417,293 L407.5,302.5 L425,307.5 L465,303.5 L488,326.5 L487.5,347 L480,355 L470,359 L457.5,363.5 L447.5,363.5 L436,373 L471,381.5 L468.5,393.5 L449,404 L412.5,413.5 L392.5,409 L361,413.5 L343.5,414 L335,414 L320,413.5 L311,413.5 L277.5,413.5 L252,413.5 L227.5,419 L224,422.5 L204,420 L166.5,425 L147.5,446.5 L131.5,447 L114.5,446.5 L116,448 L123.5,446.5 L147.5,446.5 L166.5,433 L179,433.5 L197,430.5 L210,424 L221.5,416 L228,409 L236,397 L245,389 L236,381 L240,372.5 L217,369 L209,369 L193,369 L182,367 L165.5,366.5 L145,361 L136.5,356.5 L141,350 L152,346.5 L146.5,339 L161.5,328 L168.5,320.5 L196.5,311 L179,297.5 L172,293 L181.5,289 L198,289 L225.5,285.5 L242.5,287.5 L247,279 L247.5,259 L256.5,246.5 L253,240.5 L241.5,226.5 L230,216 L230,202.5 L247,201.5 L220,207.5 L210,205 L197.5,210 L176.5,209 L157.5,218.5 L145,212 L145.5,199 L132,188 L120,180 L113.5,169 L119,160.5 L121,148 L106.5,139.5 L110,122 L128,117.5 L137.5,123.5 L117,106 L101.5,89 L125,80.5 L120,72 Z";
const NI_OUTLINE = "M100,191 L106.5,186 L128.5,188 L117.5,198 L106,210 L93,221 L67,228.5 L34,227 L7.5,213 L18.5,201 L42,197.5 L76.5,188 Z";
const SHETLAND = "M350,8 L358,5 L364,12 L360,22 L352,18 Z";
const ORKNEY = "M280,18 L295,12 L305,18 L300,28 L288,25 Z";

const REGION_PATHS: Record<string, { d: string; labelX: number; labelY: number }> = {
  scotland: {
    d: "M115,65 L147.5,27.5 L230,20 L250,27.5 L300,65 L310,75 L300,96.5 L310,106.5 L275,113.5 L257.5,132.5 L265,140 L242.5,145 L225,147.5 L210,145 L242.5,152.5 L265,152.5 L300,161.5 L285,179 L272.5,195 L261.5,200 L247,201.5 L230,202.5 L220,207.5 L210,205 L197.5,210 L176.5,209 L157.5,218.5 L145,212 L145.5,199 L132,188 L120,180 L113.5,169 L119,160.5 L121,148 L106.5,139.5 L110,122 L128,117.5 L137.5,123.5 L117,106 L101.5,89 L125,80.5 L120,72 Z M280,18 L295,12 L305,18 L300,28 L288,25 Z M350,8 L358,5 L364,12 L360,22 L352,18 Z",
    labelX: 220, labelY: 110,
  },
  northern_ireland: {
    d: "M100,191 L106.5,186 L128.5,188 L117.5,198 L106,210 L93,221 L67,228.5 L34,227 L7.5,213 L18.5,201 L42,197.5 L76.5,188 Z",
    labelX: 75, labelY: 206,
  },
  north_east: {
    d: "M300,161.5 L320,170 L322.5,182.5 L329,200 L341.5,220 L312.5,223.5 L292,225.5 L282.5,210 L272.5,195 L285,179 Z",
    labelX: 306, labelY: 197,
  },
  north_west: {
    d: "M272.5,195 L282.5,210 L292,225.5 L295,242.5 L297.5,259 L302.5,270 L310,277.5 L307.5,287.5 L300,300 L285,301 L267.5,300 L252.5,297.5 L247.5,292.5 L242.5,287.5 L247,279 L247.5,259 L256.5,246.5 L253,240.5 L241.5,226.5 L230,216 L230,202.5 L247,201.5 L261.5,200 Z",
    labelX: 268, labelY: 253,
  },
  yorkshire: {
    d: "M341.5,220 L370,225 L380,236 L396,244 L406,271 L385,274 L357.5,277.5 L330,280 L310,277.5 L302.5,270 L297.5,259 L295,242.5 L292,225.5 L312.5,223.5 Z",
    labelX: 341, labelY: 252,
  },
  wales: {
    d: "M242.5,287.5 L225.5,285.5 L198,289 L181.5,289 L172,293 L179,297.5 L196.5,311 L168.5,320.5 L161.5,328 L146.5,339 L152,346.5 L141,350 L136.5,356.5 L145,361 L165.5,366.5 L182,367 L193,369 L209,369 L217,369 L240,372.5 L255,371 L267.5,369 L255,352.5 L247.5,340 L245,325 L247.5,310 L252.5,297.5 L247.5,292.5 Z",
    labelX: 200, labelY: 330,
  },
  west_midlands: {
    d: "M252.5,297.5 L267.5,300 L285,301 L300,300 L309,310 L317.5,322.5 L335,335 L332.5,346 L320,357.5 L285,364 L267.5,369 L255,352.5 L247.5,340 L245,325 L247.5,310 Z",
    labelX: 288, labelY: 332,
  },
  east_midlands: {
    d: "M310,277.5 L330,280 L357.5,277.5 L385,274 L406,271 L417,293 L407.5,302.5 L395,315 L385,330 L375,347.5 L355,341 L335,335 L317.5,322.5 L309,310 L300,300 L307.5,287.5 Z",
    labelX: 354, labelY: 308,
  },
  east: {
    d: "M407.5,302.5 L425,307.5 L465,303.5 L488,326.5 L487.5,347 L480,355 L470,359 L457.5,363.5 L447.5,363.5 L436,373 L412.5,376 L400,369 L387.5,366 L375,366 L375,357.5 L375,347.5 L385,330 L395,315 Z",
    labelX: 435, labelY: 340,
  },
  london: {
    d: "M375,366 L387.5,366 L400,369 L412.5,376 L405,382.5 L395,385 L382.5,382.5 L375,375 Z",
    labelX: 393, labelY: 375,
  },
  south_east: {
    d: "M375,375 L382.5,382.5 L395,385 L405,382.5 L412.5,376 L436,373 L471,381.5 L468.5,393.5 L449,404 L412.5,413.5 L392.5,409 L361,413.5 L343.5,414 L335,414 L327.5,387.5 L325,372.5 L320,357.5 L332.5,346 L335,335 L355,341 L375,347.5 L375,357.5 L375,366 Z",
    labelX: 390, labelY: 392,
  },
  south_west: {
    d: "M240,372.5 L236,381 L245,389 L236,397 L228,409 L221.5,416 L210,424 L197,430.5 L179,433.5 L166.5,433 L152,439 L147.5,446.5 L131.5,447 L114.5,446.5 L116,448 L123.5,446.5 L147.5,446.5 L166.5,425 L204,420 L224,422.5 L227.5,419 L252,413.5 L277.5,413.5 L311,413.5 L320,413.5 L335,414 L327.5,387.5 L325,372.5 L320,357.5 L285,364 L267.5,369 L255,371 Z",
    labelX: 240, labelY: 410,
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

  const getIntensity = (id: string) => getRegionCount(id) / maxCount;

  const getFill = (id: string) => {
    const intensity = getIntensity(id);
    const isHovered = hoveredRegion === id;
    const isSelected = selectedRegion === id;
    if (isHovered || isSelected) return `rgba(0, 255, 136, ${0.3 + intensity * 0.5})`;
    if (intensity === 0) return "rgba(10, 26, 15, 0.6)";
    return `rgba(0, 255, 136, ${0.05 + intensity * 0.22})`;
  };

  const getStroke = (id: string) => {
    const isHovered = hoveredRegion === id;
    const isSelected = selectedRegion === id;
    if (isHovered || isSelected) return "#00FF88";
    const intensity = getIntensity(id);
    if (intensity > 0) return `rgba(0, 255, 136, ${0.25 + intensity * 0.35})`;
    return "rgba(26, 58, 37, 0.5)";
  };

  const getStrokeWidth = (id: string) => {
    const isHovered = hoveredRegion === id;
    const isSelected = selectedRegion === id;
    return (isHovered || isSelected) ? 2.5 : 1;
  };

  return (
    <div className="relative w-full max-w-[440px] mx-auto">
      <svg viewBox="-5 -2 505 460" className="w-full h-auto" style={{ filter: "drop-shadow(0 0 40px rgba(0, 255, 136, 0.06))" }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-strong">
            <feGaussianBlur stdDeviation="6" result="blur" />
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

        <path d={GB_OUTLINE} fill="rgba(10, 26, 15, 0.25)" stroke="rgba(26, 58, 37, 0.2)" strokeWidth="0.5" strokeLinejoin="round" />
        <path d={NI_OUTLINE} fill="rgba(10, 26, 15, 0.25)" stroke="rgba(26, 58, 37, 0.2)" strokeWidth="0.5" strokeLinejoin="round" />
        <path d={SHETLAND} fill="rgba(10, 26, 15, 0.25)" stroke="rgba(26, 58, 37, 0.2)" strokeWidth="0.5" strokeLinejoin="round" />
        <path d={ORKNEY} fill="rgba(10, 26, 15, 0.25)" stroke="rgba(26, 58, 37, 0.2)" strokeWidth="0.5" strokeLinejoin="round" />

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
                style={{ transform: isActive ? "scale(1.015)" : "scale(1)", transformOrigin: `${labelX}px ${labelY}px` }}
                data-testid={`map-region-${id}`}
              />

              {count > 0 && (
                <>
                  <circle cx={labelX} cy={labelY} r={isActive ? 10 : 6} className={isActive ? "im-map-pulse-dot" : "im-map-dot"} fill="url(#pulse-grad)" />
                  <circle cx={labelX} cy={labelY} r="3.5" fill="#00FF88" style={{ opacity: isActive ? 1 : 0.7 }} className="transition-all duration-300" />
                </>
              )}

              {isActive && region && (
                <g className="im-animate-in pointer-events-none">
                  <rect x={labelX - 35} y={labelY - 32} width="70" height="22" rx="5" fill="rgba(0, 0, 0, 0.92)" stroke="#00FF88" strokeWidth="0.7" />
                  <text x={labelX} y={labelY - 18} textAnchor="middle" fill="#00FF88" fontSize="10" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
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
