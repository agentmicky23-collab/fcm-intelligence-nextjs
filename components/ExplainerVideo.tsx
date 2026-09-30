"use client";

import { useState } from "react";
import type { Explainer } from "@/lib/explainer";

/**
 * The explainer video. Only the cover image loads with the page; the video itself
 * starts downloading when someone presses play, at the size that suits their screen.
 */
export function ExplainerVideo({ video: explainer }: { video: Explainer }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-night shadow-[0_24px_60px_-30px_rgba(8,20,39,0.6)]">
      {playing ? (
        <video
          className="h-full w-full"
          controls
          autoPlay
          playsInline
          preload="auto"
          poster={explainer.poster}
          aria-label={explainer.title}
        >
          <source src={explainer.sources.sd} type="video/mp4" media="(max-width: 1023px)" />
          <source src={explainer.sources.hd} type="video/mp4" />
          <track kind="captions" src={explainer.captions} srcLang="en-GB" label="English" default />
        </video>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full text-left"
          aria-label={`Play video: ${explainer.title} (${explainer.length})`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={explainer.poster} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
          <span aria-hidden className="absolute inset-0 bg-night/25 transition-colors group-hover:bg-night/10" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-24 -skew-x-[18deg] items-center justify-center bg-red transition-transform group-hover:scale-105 group-focus-visible:ring-4 group-focus-visible:ring-white sm:h-24 sm:w-28">
              <svg viewBox="0 0 24 24" className="h-9 w-9 skew-x-[18deg] fill-white" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
          <span className="absolute bottom-4 right-4 bg-night/80 px-3 py-1 text-sm font-semibold text-white">{explainer.length}</span>
        </button>
      )}
    </div>
  );
}
