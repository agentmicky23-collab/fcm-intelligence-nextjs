"use client";

import { useState } from "react";

/** Asks before unsubscribing, so email link scanners can't unsubscribe people by accident. */
export function Unsubscribe({ token }: { token: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");

  async function unsubscribe() {
    setState("sending");
    try {
      const res = await fetch("/api/member/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const result = (await res.json()) as { ok: boolean };
      setState(result.ok ? "done" : "failed");
    } catch {
      setState("failed");
    }
  }

  if (state === "done") {
    return (
      <div role="status">
        <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-navy">You&apos;re unsubscribed.</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">You won&apos;t get any more emails from me. You&apos;re welcome back any time.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-navy">Unsubscribe from FCM emails?</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted">You&apos;ll stop getting resources and insight emails from me.</p>
      {state === "failed" && (
        <p role="alert" className="mt-6 border-l-[3px] border-red bg-red/5 px-4 py-3 text-sm">
          That didn&apos;t work. The link may be out of date. Reply to any of my emails and I&apos;ll take you off the list myself.
        </p>
      )}
      <button
        type="button"
        onClick={unsubscribe}
        disabled={state === "sending" || !token}
        className="mt-10 bg-navy px-7 py-4 text-[15px] font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
      >
        {state === "sending" ? "Unsubscribing…" : "Yes, unsubscribe me"}
      </button>
    </div>
  );
}
