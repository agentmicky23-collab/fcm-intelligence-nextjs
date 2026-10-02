"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import type { Map as MapLibreMap } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { circle, northOf, type LatLng } from "@/lib/geo";

// FCM's own report maps: OpenStreetMap streets with the branch, rings and points drawn on top.
// The streets come from OpenFreeMap (free, no key, no cookies, nothing stored in the browser).
// If the street map can't load, the rings and points still show on a plain background.

export type MapPointKind = "po" | "partial" | "shop" | "transport" | "school" | "health" | "other" | "crime";
export type MapPoint = LatLng & { label: string; kind: MapPointKind; n?: number; weight?: number };

const STYLE = process.env.NEXT_PUBLIC_MAP_STYLE_URL || "https://tiles.openfreemap.org/styles/positron";
const PLAIN = { version: 8 as const, sources: {}, layers: [{ id: "bg", type: "background" as const, paint: { "background-color": "#f3f0e9" } }] };

export const kindStyle: Record<MapPointKind, { label: string; colour: string; shape: "dot" | "ring" | "square" }> = {
  po: { label: "Full-service Post Office", colour: "#06173a", shape: "dot" },
  partial: { label: "Limited or parcels-only point", colour: "#06173a", shape: "ring" },
  shop: { label: "Shop", colour: "#8a93a3", shape: "square" },
  transport: { label: "Bus stop or station", colour: "#2f7fc1", shape: "dot" },
  school: { label: "School", colour: "#2e9e5b", shape: "dot" },
  health: { label: "Health", colour: "#8a4fbf", shape: "dot" },
  other: { label: "Other", colour: "#e8a317", shape: "dot" },
  crime: { label: "Recorded crime (size = number of crimes)", colour: "#e0241b", shape: "dot" },
};

function markerEl(p: MapPoint) {
  const s = kindStyle[p.kind];
  const el = document.createElement("div");
  const size = p.n ? 24 : 16;
  el.style.cssText = [
    `width:${size}px`, `height:${size}px`, "display:flex", "align-items:center", "justify-content:center",
    "font:700 11px/1 system-ui,sans-serif", "box-shadow:0 1px 3px rgba(0,0,0,.25)",
    s.shape === "square" ? "border-radius:3px" : "border-radius:50%",
    s.shape === "ring" ? `background:#fff;color:${s.colour};border:2.5px solid ${s.colour}` : `background:${s.colour};color:#fff;border:2px solid #fff`,
  ].join(";");
  if (p.n) el.textContent = String(p.n);
  el.title = p.label;
  el.setAttribute("aria-hidden", "true");
  return el;
}

function pill(text: string, dark: boolean) {
  const el = document.createElement("div");
  el.style.cssText = `padding:3px 9px;font:600 11px/1.3 system-ui,sans-serif;white-space:nowrap;${dark ? "background:#06173a;color:#fff" : "background:#fff;color:#06173a;border:1px solid #e5e1d8"}`;
  el.textContent = text;
  el.setAttribute("aria-hidden", "true");
  return el;
}

export function SiteMap({ centre, points = [], rings = [], label, branchLabel = "This branch", legendExtra }: {
  centre: LatLng;
  points?: MapPoint[];
  /** Distance rings in metres, smallest first. */
  rings?: { metres: number; label: string }[];
  label: string;
  branchLabel?: string;
  legendExtra?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [plain, setPlain] = useState(false);

  useEffect(() => {
    const container = box.current;
    if (!container) return;
    let map: MapLibreMap | undefined;
    let cancelled = false;

    import("maplibre-gl").then(({ default: ml }) => {
      if (cancelled) return;
      const outer = rings.length ? rings[rings.length - 1].metres : 0;
      const bounds = new ml.LngLatBounds([centre.lng, centre.lat], [centre.lng, centre.lat]);
      for (const p of points) bounds.extend([p.lng, p.lat]);
      if (outer) for (const c of circle(centre, outer, 24)) bounds.extend(c);

      map = new ml.Map({
        container,
        style: STYLE,
        bounds,
        fitBoundsOptions: { padding: 36 },
        maxZoom: 18,
        attributionControl: { compact: true },
        cooperativeGestures: true,
        dragRotate: false,
        pitchWithRotate: false,
        canvasContextAttributes: { preserveDrawingBuffer: true }, // so the map prints
      });
      map.touchZoomRotate.disableRotation();

      let loaded = false;
      map.on("error", () => {
        // The street map didn't load (offline, blocked or the tile service is down): keep the overlays on a plain background.
        if (!loaded && map) {
          loaded = true;
          setPlain(true);
          map.setStyle(PLAIN);
        }
      });

      map.on("style.load", () => {
        loaded = true;
        const m = map!;
        m.addSource("rings", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: rings.map((r, i) => ({ type: "Feature", properties: { i }, geometry: { type: "Polygon", coordinates: [circle(centre, r.metres)] } })),
          },
        });
        m.addLayer({ id: "ring-fill", type: "fill", source: "rings", filter: ["==", ["get", "i"], 0], paint: { "fill-color": "#e0241b", "fill-opacity": 0.06 } });
        m.addLayer({ id: "ring-line", type: "line", source: "rings", paint: { "line-color": "#06173a", "line-width": 1.5, "line-dasharray": [3, 2.5] } });

        const weighted = points.filter((p) => p.weight);
        if (weighted.length) {
          const max = Math.max(...weighted.map((p) => p.weight!));
          m.addSource("weighted", {
            type: "geojson",
            data: { type: "FeatureCollection", features: weighted.map((p) => ({ type: "Feature", properties: { w: p.weight! / max }, geometry: { type: "Point", coordinates: [p.lng, p.lat] } })) },
          });
          m.addLayer({
            id: "weighted",
            type: "circle",
            source: "weighted",
            paint: { "circle-color": "#e0241b", "circle-opacity": 0.45, "circle-stroke-color": "#fff", "circle-stroke-width": 1, "circle-radius": ["+", 4, ["*", 14, ["sqrt", ["get", "w"]]]] },
          });
        }
      });

      for (const r of rings) new ml.Marker({ element: pill(r.label, false), anchor: "center" }).setLngLat(northOf(centre, r.metres)).addTo(map);
      for (const p of points.filter((x) => !x.weight)) new ml.Marker({ element: markerEl(p) }).setLngLat([p.lng, p.lat]).addTo(map);
      const branch = document.createElement("div");
      branch.style.cssText = "width:22px;height:22px;border-radius:50%;background:#e0241b;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)";
      branch.setAttribute("aria-hidden", "true");
      new ml.Marker({ element: branch }).setLngLat([centre.lng, centre.lat]).addTo(map);
      new ml.Marker({ element: pill(branchLabel, true), anchor: "top", offset: [0, 14] }).setLngLat([centre.lng, centre.lat]).addTo(map);
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
    // The map is drawn once per report; the inputs come from the stored report and don't change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const kinds = [...new Set(points.map((p) => p.kind))];
  return (
    <figure>
      <div ref={box} role="img" aria-label={label} className="relative h-[360px] w-full overflow-hidden border border-line bg-[#f3f0e9] sm:h-[460px]" />
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded-full bg-red" />{branchLabel}</span>
        {kinds.map((k) => {
          const s = kindStyle[k];
          return (
            <span key={k} className="inline-flex items-center gap-1.5">
              <i
                className={`inline-block h-3 w-3 ${s.shape === "square" ? "rounded-[2px]" : "rounded-full"}`}
                style={s.shape === "ring" ? { border: `2px solid ${s.colour}`, background: "#fff" } : { background: s.colour }}
              />
              {s.label}
            </span>
          );
        })}
      </div>
      <figcaption className="mt-2 text-xs text-muted">
        {label}. {plain ? "The street map couldn't load, so only the distances and places are shown. " : ""}
        Positions from the sources listed below{legendExtra ? `; ${legendExtra}` : ""}. Map data © OpenStreetMap contributors. Drawn by FCM Intelligence.
      </figcaption>
    </figure>
  );
}
