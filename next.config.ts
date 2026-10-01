import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      // www and the old report site both land on the main site.
      { source: "/:path*", has: [{ type: "host", value: "www.fcmintelligence.com" }], destination: "https://fcmintelligence.com/:path*", permanent: true },
      { source: "/:path*", has: [{ type: "host", value: "(www\\.)?fcmreport\\.com" }], destination: "https://fcmintelligence.com/reports", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
