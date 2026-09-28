"use client";

import { useState } from "react";

/** "Already a member? Email me my link" — for members on a new device. */
export function RequestAccess({ dark = false }: { dark?: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/member/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(new FormData(e.currentTarget).get("email") ?? "") }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p role="status" className={`text-sm ${dark ? "text-white/80" : "text-ink"}`}>
        If that address belongs to a member, a link to your library is on its way. Check your junk folder if it doesn&apos;t arrive.
      </p>
    );
  }
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="access-email">Your email</label>
      <input
        id="access-email"
        aria-label="Your email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Your email"
        className="min-h-12 flex-1 border border-line bg-white px-4 text-ink focus:border-red focus:outline-none focus:ring-2 focus:ring-red/30"
      />
      <button type="submit" disabled={state === "sending"} className={`min-h-12 px-6 text-sm font-semibold ${dark ? "bg-white text-navy hover:bg-light" : "bg-navy text-white hover:bg-navy-700"} disabled:opacity-60`}>
        {state === "sending" ? "Sending…" : "Email me my link"}
      </button>
      {state === "error" && <p role="alert" className="text-sm text-red-dark sm:self-center">That didn&apos;t work. Please try again.</p>}
    </form>
  );
}
