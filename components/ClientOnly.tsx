"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Providers } from "@/app/providers";

export function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}

export function ClientApp({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000000" }} />
    );
  }
  return <Providers>{children}</Providers>;
}
