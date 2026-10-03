"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/** Re-reads the page every 15 seconds while it's visible, so the control room stays live. */
export function AutoRefresh({ every = 15 }: { every?: number }) {
  const router = useRouter();
  const [at, setAt] = useState<string>("");
  useEffect(() => {
    const stamp = () => setAt(new Date().toLocaleTimeString("en-GB"));
    stamp();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        router.refresh();
        stamp();
      }
    }, every * 1000);
    return () => clearInterval(id);
  }, [router, every]);
  return (
    <span className="inline-flex items-center gap-2 text-xs text-white/60">
      <span className="pulse inline-block h-2 w-2 rounded-full bg-emerald-400" />
      Live{at && ` · ${at}`}
    </span>
  );
}
