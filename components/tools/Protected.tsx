"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Wraps the paid tools. Nothing is ever saved. On top of that it makes copying the figures out awkward
// and traceable: no select/copy/right-click/print/save, the figures hide when the window isn't in use
// or the screenshot key is pressed, the viewer's identity is watermarked across the tool, and the
// statement is cleared after a spell without use. (No web page can stop a camera or the operating
// system's own screenshot tool; the watermark is what makes those traceable.)

const IDLE_MINUTES = 15;

function watermark(text: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="220"><text x="10" y="120" transform="rotate(-22 210 110)" font-family="Arial, sans-serif" font-size="15" fill="#ffffff">${text.replace(/[<>&"]/g, "")}</text></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

export function Protected({ viewer, onIdle, children }: { viewer: string; onIdle: () => void; children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const [cleared, setCleared] = useState(false);
  const last = useRef(0);
  const idle = useRef(onIdle);
  useEffect(() => {
    idle.current = onIdle;
  }, [onIdle]);

  useEffect(() => {
    last.current = Date.now();
    const away = () => setHidden(true);
    const back = () => setHidden(document.visibilityState !== "visible");
    const touch = () => {
      last.current = Date.now();
    };
    const keys = (e: KeyboardEvent) => {
      touch();
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ["p", "s", "c", "x", "a"].includes(k)) e.preventDefault();
      if (k === "printscreen") {
        setHidden(true);
        navigator.clipboard?.writeText(" ").catch(() => {});
        setTimeout(() => setHidden(!document.hasFocus()), 2500);
      }
    };
    const timer = setInterval(() => {
      if (Date.now() - last.current > IDLE_MINUTES * 60_000) {
        idle.current();
        setCleared(true);
        last.current = Date.now();
      }
    }, 30_000);
    window.addEventListener("blur", away);
    window.addEventListener("focus", back);
    document.addEventListener("visibilitychange", back);
    window.addEventListener("keydown", keys, true);
    window.addEventListener("keyup", keys, true);
    window.addEventListener("pointerdown", touch);
    window.addEventListener("input", touch);
    return () => {
      clearInterval(timer);
      window.removeEventListener("blur", away);
      window.removeEventListener("focus", back);
      document.removeEventListener("visibilitychange", back);
      window.removeEventListener("keydown", keys, true);
      window.removeEventListener("keyup", keys, true);
      window.removeEventListener("pointerdown", touch);
      window.removeEventListener("input", touch);
    };
  }, []);

  const stop = (e: React.SyntheticEvent) => e.preventDefault();
  const stamp = `${viewer} · ${new Date().toLocaleDateString("en-GB")} · FCM Intelligence · Confidential`;

  return (
    <>
      <p className="rem-print-note hidden text-center text-lg">This tool can&apos;t be printed or saved.</p>
      <div className="rem-protected relative select-none" onCopy={stop} onCut={stop} onContextMenu={stop} onDragStart={stop}>
        {cleared && (
          <p className="mb-4 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
            Your statement was cleared after {IDLE_MINUTES} minutes without use. Add it again to carry on.{" "}
            <button className="underline" onClick={() => setCleared(false)}>OK</button>
          </p>
        )}
        <div className={`transition-[filter] duration-150 ${hidden ? "blur-xl" : ""}`} aria-hidden={hidden}>
          {children}
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 z-30 opacity-[0.07]" style={{ backgroundImage: watermark(stamp) }} />
        {hidden && (
          <div className="absolute inset-0 z-40 flex items-start justify-center pt-40">
            <p className="rounded-xl border border-white/15 bg-[#030a1b]/95 px-6 py-4 text-sm text-white/80">Hidden while this window isn&apos;t in use. Click here to carry on.</p>
          </div>
        )}
      </div>
    </>
  );
}
