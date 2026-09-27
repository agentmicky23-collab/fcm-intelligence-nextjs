"use client";

import { useEffect, useRef, useState } from "react";
import type { EnquiryPayload, EnquiryResult } from "@/lib/enquiry";

type State =
  | { status: "idle" | "sending" }
  | { status: "sent"; reference: string; email: string; name: string }
  | { status: "failed"; error: "invalid" | "rate_limited" | "unavailable" };

/** Sends an enquiry to /api/enquiry and tracks where it's got to. */
export function useEnquiry() {
  const shownAt = useRef(0);
  const [state, setState] = useState<State>({ status: "idle" });

  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  async function send(payload: Omit<EnquiryPayload, "elapsedMs" | "sourcePath">) {
    setState({ status: "sending" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, sourcePath: window.location.pathname + window.location.search, elapsedMs: Date.now() - shownAt.current }),
      });
      const result = (await res.json()) as EnquiryResult;
      if (result.ok) setState({ status: "sent", reference: result.reference, email: payload.email, name: payload.name });
      else setState({ status: "failed", error: result.error });
    } catch {
      setState({ status: "failed", error: "unavailable" });
    }
  }

  return { state, send, reset: () => setState({ status: "idle" }) };
}
