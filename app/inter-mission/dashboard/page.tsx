"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Briefcase, Star, Settings, DollarSign } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [earnings, setEarnings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/inter-mission/stats").then((r) => r.json()).then(setStats).catch(() => {});
    fetch("/api/inter-mission/people?userType=manager&limit=1").then((r) => r.json()).then((data) => {
      const p = Array.isArray(data) ? data[0] : null;
      if (p) {
        setProfile(p);
        fetch(`/api/inter-mission/earnings?managerId=${p.id}`).then((r) => r.json()).then(setEarnings).catch(() => {});
      }
    }).catch(() => {});
  }, []);

  const quickLinks = [
    { href: "/inter-mission/dashboard/assignments", label: "My Assignments", icon: Briefcase, desc: "View and manage your assignments" },
    { href: "/inter-mission/dashboard/reviews", label: "My Reviews", icon: Star, desc: "Reviews given and received" },
    { href: "/inter-mission/dashboard/earnings", label: "Earnings", icon: DollarSign, desc: "Track your income" },
    { href: "/inter-mission/dashboard/settings", label: "Settings", icon: Settings, desc: "Profile, stealth mode, notifications" },
  ];

  const totalEarned = earnings?.summary?.totalEarnings ? `£${parseFloat(earnings.summary.totalEarnings).toLocaleString("en-GB", { minimumFractionDigits: 0 })}` : "£0";
  const assignmentCount = earnings?.summary?.totalAssignments || 0;
  const avgRating = profile?.averageRating ? parseFloat(profile.averageRating).toFixed(1) : "0.0";
  const reviewCount = profile?.reviewCount || 0;

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-white mb-8" data-testid="text-dashboard-title">
        Your <span className="text-[#00FF88]">Dashboard</span>
      </h1>

      {profile?.verificationStatus !== "vetted" && (
        <div className="im-card im-glow mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-[#00FF88] im-pulse-available" />
            <span className="text-[#888888] text-xs">Preview Mode — Complete vetting to unlock full access</span>
          </div>
          <div className="bg-[#00FF8810] border border-[#1A3A25] rounded-lg p-4">
            <p className="text-white text-sm mb-2">Complete your vetting to unlock full access.</p>
            <p className="text-[#888888] text-xs mb-3">Standard: 5-7 business days</p>
            <button
              className="im-btn-primary text-sm px-4 py-2"
              data-testid="button-skip-queue"
              onClick={async () => {
                if (!profile) return;
                await fetch("/api/inter-mission/vetting/skip", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ profileId: profile.id }),
                });
                window.location.reload();
              }}
            >
              Skip the Queue — £3.99 (vetted in 24-48 hours)
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="im-card text-center">
          <span className="im-font-financial text-2xl" data-testid="text-total-earned">{totalEarned}</span>
          <span className="text-[#888888] text-xs block mt-1">Total Earned</span>
        </div>
        <div className="im-card text-center">
          <span className="im-font-financial text-2xl" data-testid="text-assignment-count">{assignmentCount}</span>
          <span className="text-[#888888] text-xs block mt-1">Assignments</span>
        </div>
        <div className="im-card text-center">
          <span className="im-font-financial text-2xl" data-testid="text-avg-rating">{avgRating}</span>
          <span className="text-[#888888] text-xs block mt-1">Avg Rating</span>
        </div>
        <div className="im-card text-center">
          <span className="im-font-financial text-2xl" data-testid="text-review-count">{reviewCount}</span>
          <span className="text-[#888888] text-xs block mt-1">Reviews</span>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className="im-card flex items-center gap-4 group" data-testid={`link-${link.label.toLowerCase().replace(/\s/g, "-")}`}>
            <div className="w-12 h-12 rounded-lg bg-[#00FF8815] flex items-center justify-center flex-shrink-0 group-hover:bg-[#00FF8830] transition-colors">
              <link.icon size={24} className="text-[#00FF88]" />
            </div>
            <div>
              <h3 className="text-white font-semibold group-hover:text-[#00FF88] transition-colors">{link.label}</h3>
              <p className="text-[#888888] text-sm">{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="im-card">
        <h3 className="text-white font-semibold mb-2">Your Referral Link</h3>
        <p className="text-[#888888] text-sm mb-3">Share your referral link to invite others to Inter-Mission</p>
        <div className="flex gap-2">
          <input readOnly value="fcmgt.co.uk/inter-mission/join?ref=YOUR_CODE" className="flex-1 bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-3 py-2 text-sm text-[#888888]" />
          <button className="im-btn-secondary text-sm px-4" data-testid="button-copy-referral">Copy</button>
        </div>
      </div>
    </div>
  );
}
