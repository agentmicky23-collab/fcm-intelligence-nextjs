"use client";

import Link from "next/link";
import { setMapsConsent, useMapsConsent } from "@/lib/consent";
import type { LatLng } from "@/lib/geo";

// The premises on Google Street View, shown live from Google (never copied or stored).
// With an embed key it opens in the page once the visitor agrees to Google's cookies; without one it opens Google Maps.

const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;

export function StreetView({ at, heading, address }: { at: LatLng; heading?: number | null; address: string }) {
  const allowed = useMapsConsent();
  const pov = typeof heading === "number" && Number.isFinite(heading) ? `&heading=${Math.round(heading)}` : "";
  const openUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${at.lat},${at.lng}${pov}`;
  const embed = key ? `https://www.google.com/maps/embed/v1/streetview?key=${key}&location=${at.lat},${at.lng}${pov}&fov=80` : null;

  return (
    <figure>
      <div className="relative aspect-[16/10] w-full overflow-hidden border border-line bg-[linear-gradient(180deg,#d4dde6,#ece8df_62%,#d9d3c7)]">
        {embed && allowed ? (
          <iframe title={`Street View of ${address}`} src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="absolute inset-0 h-full w-full" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <svg viewBox="0 0 24 24" width="36" height="36" className="shrink-0 text-navy" aria-hidden>
              <circle cx="12" cy="5.5" r="3" fill="currentColor" />
              <path d="M7.5 22v-8.5a4.5 4.5 0 0 1 9 0V22" fill="currentColor" />
            </svg>
            <p className="font-display text-base font-semibold text-navy">{address}</p>
            {embed ? (
              <button type="button" onClick={() => setMapsConsent(true)} className="no-print min-h-10 bg-red px-5 text-sm font-semibold text-white hover:bg-red-dark">
                Show the street
              </button>
            ) : (
              <a href={openUrl} target="_blank" rel="noopener noreferrer" className="no-print inline-flex min-h-10 items-center bg-red px-5 text-sm font-semibold text-white hover:bg-red-dark">
                Show the street on Google ↗
              </a>
            )}
            <p className="max-w-sm text-xs text-muted">
              {embed ? (
                <>Loads live from Google, which sets its own cookies. <Link href="/cookies" className="underline underline-offset-2">Cookies policy</Link></>
              ) : (
                "Opens Google Street View, so you can look around, zoom in and check the neighbours."
              )}
            </p>
          </div>
        )}
      </div>
      <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>Street View is Google&apos;s latest imagery and may be a few years old. Check the frontage when you visit.</span>
        <a href={openUrl} target="_blank" rel="noopener noreferrer" className="no-print font-medium text-red-dark hover:text-red">Open in Google Maps →</a>
      </figcaption>
    </figure>
  );
}
