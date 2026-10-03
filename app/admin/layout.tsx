import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Control room",
  robots: { index: false, follow: false },
};

// The control room has its own dark look, separate from the public site.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin min-h-screen flex-1 bg-[#020816] text-white">
      <style>{`
        @keyframes fcm-spin { to { transform: rotate(360deg) } }
        @keyframes fcm-pulse { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
        @keyframes fcm-glow { 0%,100% { box-shadow: 0 0 0 0 rgba(224,36,27,.0) } 50% { box-shadow: 0 0 28px 2px rgba(224,36,27,.35) } }
        @keyframes fcm-flow { from { background-position: 0 0 } to { background-position: 28px 0 } }
        @keyframes fcm-rise { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
        @keyframes fcm-scan { 0% { transform: translateX(-100%) } 100% { transform: translateX(100%) } }
        .admin .spin { animation: fcm-spin 2.4s linear infinite }
        .admin .pulse { animation: fcm-pulse 1.6s ease-in-out infinite }
        .admin .glow { animation: fcm-glow 2.4s ease-in-out infinite }
        .admin .rise { animation: fcm-rise .35s ease-out both }
        .admin .flow { background-image: repeating-linear-gradient(90deg, var(--c) 0 8px, transparent 8px 14px); background-size: 28px 2px; animation: fcm-flow .9s linear infinite }
        .admin .scan::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent); animation: fcm-scan 2.2s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) { .admin .spin, .admin .pulse, .admin .glow, .admin .flow, .admin .scan::after, .admin .rise { animation: none } }
      `}</style>
      {children}
    </div>
  );
}
