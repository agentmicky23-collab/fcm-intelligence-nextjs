"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (
      error.message?.includes("#418") ||
      error.message?.includes("#423") ||
      error.message?.includes("#425") ||
      error.message?.includes("Hydration")
    ) {
      reset();
      return;
    }
  }, [error, reset]);

  return (
    <html lang="en" className="dark">
      <body style={{ backgroundColor: "#000000", color: "#ffffff", fontFamily: "Inter, sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "2rem" }}>
          <h2 style={{ color: "#FFD700", marginBottom: "1rem" }}>Something went wrong</h2>
          <button
            onClick={() => reset()}
            style={{
              backgroundColor: "#FFD700",
              color: "#000000",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
