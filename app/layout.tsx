import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "FCM Intelligence",
  description: "40+ Post Offices. One Intelligence System.",
  openGraph: {
    title: "FCM Intelligence",
    description: "40+ Post Offices. One Intelligence System.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FCM Intelligence",
    description: "40+ Post Offices. One Intelligence System.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
