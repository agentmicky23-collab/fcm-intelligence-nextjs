import type { Metadata } from "next";
import { Instrument_Sans, Schibsted_Grotesk } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const head = Schibsted_Grotesk({ variable: "--font-head", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const body = Instrument_Sans({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.owner} | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.tagline,
  openGraph: {
    siteName: site.name,
    locale: "en_GB",
    type: "website",
  },
  applicationName: site.name,
  authors: [{ name: site.owner, url: `${site.url}/about` }],
  creator: site.owner,
  publisher: site.company,
  twitter: { card: "summary_large_image" },
  robots: site.indexable
    ? { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
    : { index: false, follow: false },
  // Ownership checks for Google Search Console and Bing Webmaster Tools, added as Vercel settings.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${head.variable} ${body.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
