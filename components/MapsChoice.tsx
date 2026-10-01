"use client";

import { setMapsConsent, useMapsConsent } from "@/lib/consent";

/** Lets a visitor see and change whether Google Maps may load in this browser. */
export function MapsChoice() {
  const allowed = useMapsConsent();
  return (
    <div className="flex flex-wrap items-center gap-4 border border-line bg-light px-4 py-3 text-sm">
      <span className="text-ink" role="status">
        Google Maps in this browser: <strong className="text-navy">{allowed ? "allowed" : "not allowed"}</strong>
      </span>
      <button
        type="button"
        onClick={() => setMapsConsent(!allowed)}
        className="min-h-9 border border-navy px-4 text-xs font-semibold text-navy hover:bg-navy hover:text-white"
      >
        {allowed ? "Stop loading Google Maps" : "Allow Google Maps"}
      </button>
    </div>
  );
}
