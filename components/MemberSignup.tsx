"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Honeypot } from "@/components/EnquiryStatus";
import { situations, type JoinResult } from "@/lib/member";

type State = { status: "idle" | "sending" } | { status: "sent"; email: string } | { status: "failed"; error: "invalid" | "rate_limited" | "unavailable" };

const messages = {
  invalid: "Please check your name and email address, and tick the box to say I can email you.",
  rate_limited: "That's a lot of sign-ups in a short time. Please wait a few minutes and try again.",
  unavailable: "Sorry, that didn't go through. Please try again in a moment.",
};

/** The free membership form. Sends a confirmation email; membership starts when the link is clicked. */
export function MemberSignup() {
  const shownAt = useRef(0);
  const [state, setState] = useState<State>({ status: "idle" });
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    setState({ status: "sending" });
    try {
      const res = await fetch("/api/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: get("name"),
          email: get("email"),
          situation: get("situation"),
          consent: d.get("consent") === "on",
          company_url: get("company_url"),
          sourcePath: window.location.pathname,
          elapsedMs: Date.now() - shownAt.current,
        }),
      });
      const result = (await res.json()) as JoinResult;
      setState(result.ok ? { status: "sent", email: get("email") } : { status: "failed", error: result.error });
    } catch {
      setState({ status: "failed", error: "unavailable" });
    }
  }

  if (state.status === "sent") {
    return (
      <div role="status">
        <span aria-hidden className="block h-5 w-3 -skew-x-[18deg] bg-red" />
        <h2 className="mt-5 font-display text-2xl font-bold tracking-[-0.02em] text-navy">Check your inbox.</h2>
        <p className="mt-3 leading-relaxed text-muted">
          I&apos;ve sent a link to <span className="text-navy">{state.email}</span>. Click it to confirm and you&apos;re in.
          It can take a minute, and it&apos;s worth checking your junk folder.
        </p>
      </div>
    );
  }

  const field = "mt-2 block w-full border border-line bg-white px-4 py-3 text-ink focus:border-red focus:outline-none focus:ring-2 focus:ring-red/30";
  return (
    <form onSubmit={onSubmit} className="relative space-y-5">
      <Honeypot />
      <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-navy">Join free</h2>
      <label className="block text-sm font-medium text-navy">
        Name
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="block text-sm font-medium text-navy">
        Email
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="block text-sm font-medium text-navy">
        Where are you now?
        <select name="situation" defaultValue="Researching" className={field}>
          {situations.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
        <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-red)]" />
        <span>Email me the resources and new insights. I can unsubscribe with one click, any time.</span>
      </label>
      {state.status === "failed" && (
        <p role="alert" className="border-l-[3px] border-red bg-red/5 px-4 py-3 text-sm">{messages[state.error]}</p>
      )}
      <button
        type="submit"
        disabled={state.status === "sending"}
        className="w-full bg-red px-7 py-4 text-[15px] font-semibold text-white hover:bg-red-dark disabled:opacity-60"
      >
        {state.status === "sending" ? "Joining…" : "Join free"}
      </button>
      <p className="text-xs text-muted">
        Your details are only used for membership emails. See the{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-red">privacy policy</Link>.
      </p>
    </form>
  );
}
