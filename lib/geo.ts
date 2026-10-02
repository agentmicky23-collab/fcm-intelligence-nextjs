// Small geography helpers for the report maps: coordinates, distances and distance rings.

export type LatLng = { lat: number; lng: number };

const R = 6371008.8; // mean Earth radius in metres
const rad = (d: number) => (d * Math.PI) / 180;

/** A latitude/longitude pair inside (or just around) the UK, or null. */
export function latLng(lat: unknown, lng: unknown): LatLng | null {
  const a = typeof lat === "string" ? Number(lat) : lat;
  const b = typeof lng === "string" ? Number(lng) : lng;
  if (typeof a !== "number" || typeof b !== "number" || !Number.isFinite(a) || !Number.isFinite(b)) return null;
  return inUK({ lat: a, lng: b }) ? { lat: a, lng: b } : null;
}

/** Rough box around the UK, Channel Islands and Isle of Man; catches swapped or missing coordinates. */
export const inUK = (p: LatLng) => p.lat > 49.8 && p.lat < 60.9 && p.lng > -8.7 && p.lng < 1.9;

/** Straight-line distance in metres. */
export function metresBetween(a: LatLng, b: LatLng) {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** The point a given distance north of another (for placing ring labels). */
export const northOf = (p: LatLng, metres: number): LatLng => ({ lat: p.lat + (metres / R) * (180 / Math.PI), lng: p.lng });

/** A circle of the given radius as a closed ring of [lng, lat] points (for GeoJSON). */
export function circle(p: LatLng, metres: number, steps = 96): [number, number][] {
  const out: [number, number][] = [];
  const d = metres / R;
  const lat1 = rad(p.lat);
  const lng1 = rad(p.lng);
  for (let i = 0; i <= steps; i++) {
    const brg = (i / steps) * 2 * Math.PI;
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(brg));
    const lng2 = lng1 + Math.atan2(Math.sin(brg) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));
    out.push([(lng2 * 180) / Math.PI, (lat2 * 180) / Math.PI]);
  }
  return out;
}

/** Reads a written distance ("3.03km", "200m", "0.5 miles", "~1.5 km", "800 metres") as metres, or null. */
export function parseDistance(v: unknown): number | null {
  if (typeof v === "number") return null; // a bare number has no unit
  if (typeof v !== "string") return null;
  const m = v.replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*(km|kilomet(?:re|er)s?|m(?![a-z])|met(?:re|er)s?|mi(?:les?)?|yards?|yds?)\b/i);
  if (!m) return null;
  const n = Number(m[1]);
  const u = m[2].toLowerCase();
  if (u.startsWith("k")) return n * 1000;
  if (u.startsWith("mi")) return n * 1609.344;
  if (u.startsWith("y")) return n * 0.9144;
  return n;
}

/** "200 m" under a kilometre, "3.2 km" above. */
export const distanceText = (metres: number) => (metres < 1000 ? `${Math.round(metres / 10) * 10} m` : `${(metres / 1000).toFixed(1)} km`);
