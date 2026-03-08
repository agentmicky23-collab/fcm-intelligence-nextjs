import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg"],
  allowedDevOrigins: [
    "c0a2917e-9169-4f39-b4d5-8f3e996139c1-00-2i13yaso45kz1.janeway.replit.dev",
    "127.0.0.1",
    "localhost",
  ],
  devIndicators: false,
  output: "standalone",
};

export default nextConfig;
