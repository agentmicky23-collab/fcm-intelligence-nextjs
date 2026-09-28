// Branded share images (Open Graph) for links posted on LinkedIn, WhatsApp, X and in search results.

import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

const logo = `data:image/png;base64,${fs.readFileSync(path.join(process.cwd(), "public/brand/logo-full-white.png")).toString("base64")}`;

export function ogImage({ eyebrow, title, footer }: { eyebrow: string; title: string; footer?: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#081427", color: "white", overflow: "hidden" }}>
        {/* The slanted stripes from the site header. */}
        <div style={{ position: "absolute", top: -40, bottom: -40, right: -120, width: 380, background: "#0B1D3A", transform: "skewX(-18deg)" }} />
        <div style={{ position: "absolute", top: -40, bottom: -40, right: 300, width: 34, background: "#E0241B", transform: "skewX(-18deg)" }} />
        <div style={{ position: "absolute", top: -40, bottom: -40, right: 360, width: 10, background: "rgba(224,36,27,0.55)", transform: "skewX(-18deg)" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "70px 80px", width: 860 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" height={56} style={{ objectFit: "contain", objectPosition: "left" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 24, letterSpacing: 5, textTransform: "uppercase", color: "#E0241B", fontWeight: 700 }}>{eyebrow}</div>
            <div style={{ marginTop: 22, fontSize: title.length > 60 ? 54 : 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1.5 }}>{title}</div>
          </div>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.65)" }}>{footer ?? "fcmintelligence.com"}</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
