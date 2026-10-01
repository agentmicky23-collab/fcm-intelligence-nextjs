"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { setMapsConsent, useMapsConsent } from "@/lib/consent";

type Ring = { metres: number; label: string };
type Marker = { east: number; north: number; label: string; kind: "full" | "partial" | "place" };

const EARTH = 156543.03392; // metres per pixel at zoom 0 on the equator (256px tiles)
const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;

/**
 * A real Google map, centred on the branch, with distance rings and markers drawn on top.
 * The map is fixed in place so the overlay stays aligned; a link opens it in Google Maps.
 * Google sets cookies, so the map itself only loads after the visitor agrees; until then the rings sit on a plain panel.
 */
export function MapPanel({ lat, lng, rings, markers = [], label, className = "", heightClass = "h-[360px] sm:h-[440px]" }: {
  lat: number;
  lng: number;
  rings: Ring[];
  markers?: Marker[];
  label: string;
  className?: string;
  heightClass?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 900, h: 440 });
  const allowed = useMapsConsent();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pick the closest zoom at which the outer ring still fits inside the panel.
  const cos = Math.cos((lat * Math.PI) / 180);
  const outer = Math.max(...rings.map((r) => r.metres));
  const fitPx = Math.min(size.w, size.h) / 2 - 18;
  const zoom = Math.min(18, Math.floor(Math.log2((EARTH * cos * fitPx) / outer)));
  const mpp = (EARTH * cos) / 2 ** zoom;
  const px = (m: number) => m / mpp;

  const src = key
    ? `https://www.google.com/maps/embed/v1/view?key=${key}&center=${lat},${lng}&zoom=${zoom}&maptype=roadmap`
    : `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;

  return (
    <figure className={className}>
      <div ref={ref} className={`relative overflow-hidden border border-line bg-light ${heightClass}`}>
        {allowed ? (
          <>
            <iframe
              key={src}
              title={label}
              src={src}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full grayscale-[85%]"
              tabIndex={-1}
            />
            {/* Holds the map still so the rings stay true to scale */}
            <div className="absolute inset-0" aria-hidden />
          </>
        ) : (
          <div className="no-print absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-white/95 px-4 py-3 text-xs text-muted">
            <span>
              The street map comes from Google, which sets its own cookies. <Link href="/cookies" className="font-medium text-red-dark underline underline-offset-2">Cookies policy</Link>
            </span>
            <button type="button" onClick={() => setMapsConsent(true)} className="min-h-9 bg-navy px-4 text-xs font-semibold text-white hover:bg-red">
              Show the map
            </button>
          </div>
        )}

        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <g transform={`translate(${size.w / 2} ${size.h / 2})`}>
            {rings.map((r, i) => (
              <g key={r.metres}>
                <motion.circle
                  r={px(r.metres)}
                  fill={i === 0 ? "rgba(224,36,27,0.07)" : "none"}
                  stroke="var(--color-navy)"
                  strokeWidth="1.5"
                  strokeDasharray="6 5"
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.18 }}
                />
                <g transform={`translate(0 ${-px(r.metres)})`}>
                  <rect x="-24" y="-10" width="48" height="20" fill="var(--color-navy)" />
                  <text textAnchor="middle" y="4" fontSize="11" fontWeight="600" fill="#fff">{r.label}</text>
                </g>
              </g>
            ))}
            {markers.map((m, i) => {
              const x = px(m.east), y = -px(m.north);
              const right = x + 30 + m.label.length * 6.6 < size.w / 2;
              return (
                <motion.g key={m.label} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.8 + i * 0.12 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  {m.kind === "partial"
                    ? <rect x={x - 7} y={y - 7} width="14" height="14" fill="#fff" stroke="var(--color-navy)" strokeWidth="3" />
                    : <rect x={x - 8} y={y - 8} width="16" height="16" fill="var(--color-navy)" stroke="#fff" strokeWidth="2" />}
                  <rect x={right ? x + 12 : x - 12 - m.label.length * 6.6 - 12} y={y - 11} width={m.label.length * 6.6 + 12} height="22" fill="#fff" stroke="var(--color-line)" />
                  <text x={right ? x + 18 : x - 18} y={y + 4} fontSize="12" fontWeight="600" textAnchor={right ? "start" : "end"} fill="var(--color-navy)">{m.label}</text>
                </motion.g>
              );
            })}
            <circle r="11" fill="var(--color-red)" stroke="#fff" strokeWidth="3" />
          </g>
        </svg>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>{label}</span>
        <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank" rel="noopener noreferrer" className="no-print font-medium text-red-dark hover:text-red">
          Open in Google Maps →
        </a>
      </figcaption>
    </figure>
  );
}
