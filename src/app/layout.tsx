import type { Metadata } from "next";
import Script from "next/script";
import { ClientApp } from "@/components/ClientOnly";
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

const hydrationSuppressionScript = `
(function() {
  var origError = console.error;
  console.error = function() {
    var msg = arguments[0];
    if (typeof msg === 'string' && (msg.includes('#418') || msg.includes('#423') || msg.includes('#425') || msg.includes('Hydration'))) return;
    origError.apply(console, arguments);
  };
  window.addEventListener('error', function(e) {
    if (e.message && (e.message.includes('#418') || e.message.includes('#423') || e.message.includes('#425') || e.message.includes('Hydration'))) {
      e.stopImmediatePropagation();
      e.preventDefault();
      return false;
    }
  }, true);
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: hydrationSuppressionScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <ClientApp>{children}</ClientApp>
      </body>
    </html>
  );
}
