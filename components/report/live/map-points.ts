import { latLng, metresBetween, type LatLng } from "@/lib/geo";
import { arr, num, str, type Rec } from "@/lib/report-data";
import type { MapPoint, MapPointKind } from "./SiteMap";

// Turns the rows the agents write (competitors, footfall generators, landmarks, crime locations) into map points.
// Rows without coordinates stay in the tables; they just don't appear on the map.

const at = (r: Rec): LatLng | null => latLng(r.lat ?? r.latitude, r.lng ?? r.lon ?? r.longitude);

/** The branch itself, listed among its competitors: same place, or marked as the subject. */
const isSubject = (r: Rec, centre: LatLng, p: LatLng | null) =>
  /subject|this branch/i.test(`${str(r.branch_name)} ${str(r.distance)}`) || (p !== null && metresBetween(p, centre) < 25);

export function placeKind(text: string): MapPointKind {
  if (/bus|rail|station|tram|transport|metro|ferry/i.test(text)) return "transport";
  if (/school|education|college|nursery|academy|universit/i.test(text)) return "school";
  if (/\bgp\b|health|medical|pharmac|hospital|dental|dentist|surgery|clinic/i.test(text)) return "health";
  if (/retail|shop|supermarket|convenience|store|grocer|tesco|co-?op|aldi|lidl|spar|asda|sainsbury|morrisons/i.test(text)) return "shop";
  return "other";
}

export const poKind = (r: Rec): MapPointKind =>
  /outreach|hub|drop|parcel|collect|limited|mobile|partner|part[- ]time/i.test(`${str(r.type)} ${str(r.branch_name)}`) ? "partial" : "po";

export type Numbered = Rec & { map_n?: number };

/**
 * Numbers the rows that have coordinates (continuing from `start`) and returns them as map points,
 * plus the rows with a `map_n` added so the table can show the same number.
 */
export function numbered(rows: unknown, centre: LatLng, label: (r: Rec) => string, kind: (r: Rec) => MapPointKind, start = 1) {
  let n = start;
  const points: MapPoint[] = [];
  const out: Numbered[] = arr(rows).map((r) => {
    const p = at(r);
    if (!p || isSubject(r, centre, p)) return r;
    const row = { ...r, map_n: n };
    points.push({ ...p, label: label(r), kind: kind(r), n });
    n++;
    return row;
  });
  return { points, rows: out, next: n };
}

/** Crime locations, sized by the number of crimes recorded there. */
export function weighted(rows: unknown): MapPoint[] {
  return arr(rows).flatMap((r) => {
    const p = at(r);
    const w = num(r.count) ?? num(r.crimes) ?? 1;
    return p && w > 0 ? [{ ...p, label: `${w} crimes`, kind: "crime" as const, weight: w }] : [];
  });
}
