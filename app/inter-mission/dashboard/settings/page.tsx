"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Shield, Eye, EyeOff, Bell } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [stealthMode, setStealthMode] = useState(false);
  const [urgentNotifications, setUrgentNotifications] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inter-mission/people?userType=manager&limit=1")
      .then((r) => r.json())
      .then((profiles) => {
        const p = Array.isArray(profiles) ? profiles[0] : null;
        if (p) {
          setProfile(p);
          setStealthMode(p.stealthMode || false);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStealthToggle = async () => {
    if (!profile) return;
    const newState = !stealthMode;
    setStealthMode(newState);
    try {
      if (newState) {
        await fetch("/api/inter-mission/stealth/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileId: profile.id }),
        });
      } else {
        await fetch("/api/inter-mission/stealth/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileId: profile.id }),
        });
      }
    } catch {
      setStealthMode(!newState);
    }
  };

  const handleSkipVetting = async () => {
    if (!profile) return;
    await fetch("/api/inter-mission/vetting/skip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: profile.id }),
    });
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const verificationLabel = profile?.verificationStatus === "vetted" ? "Vetted" :
    profile?.verificationStatus === "priority_vetting" ? "Priority Vetting (24-48h)" : "Unvetted — Preview Mode";

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl pb-24 md:pb-8">
      <Link href="/inter-mission/dashboard" className="text-[#888888] hover:text-[#00FF88] text-sm flex items-center gap-1 mb-6">
        <ArrowLeft size={16} /> Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-white mb-8" data-testid="text-settings-title">
        <span className="text-[#00FF88]">Settings</span>
      </h1>

      <div className="space-y-6">
        <div className="im-card">
          <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
            <Shield size={18} className="text-[#00FF88]" /> Verification Status
          </h3>
          <div className="flex items-center gap-3 mt-3">
            <span className={`text-xs px-3 py-1 rounded ${profile?.verificationStatus === "vetted" ? "bg-[#00FF8815] text-[#00FF88]" : "bg-[#88888820] text-[#888888]"}`}>
              {verificationLabel}
            </span>
          </div>
          {profile?.verificationStatus !== "vetted" && profile?.verificationStatus !== "priority_vetting" && (
            <>
              <p className="text-[#888888] text-sm mt-3">Complete vetting to unlock full access to the marketplace.</p>
              <button className="im-btn-primary text-sm px-4 py-2 mt-3" data-testid="button-skip-vetting" onClick={handleSkipVetting}>
                Skip the Queue — £3.99
              </button>
            </>
          )}
        </div>

        <div className="im-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-white font-semibold flex items-center gap-2">
                {stealthMode ? <EyeOff size={18} className="text-[#00FF88]" /> : <Eye size={18} className="text-[#888888]" />}
                Stealth Mode
              </h3>
              <p className="text-[#888888] text-sm mt-1">
                Hide your profile from public browsing. Only visible when you bid on assignments.
              </p>
            </div>
            <button
              onClick={handleStealthToggle}
              className={`w-12 h-6 rounded-full transition-colors relative ${stealthMode ? "bg-[#00FF88]" : "bg-[#1A3A25]"}`}
              data-testid="toggle-stealth"
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${stealthMode ? "left-6" : "left-0.5"}`} />
            </button>
          </div>
          {stealthMode && (
            <div className="bg-[#00FF8810] border border-[#1A3A25] rounded-lg p-3 mt-2">
              <p className="text-[#00FF88] text-sm font-semibold">Stealth Mode Active</p>
              <p className="text-[#888888] text-xs mt-1">£5/month subscription. Your name shows as first name + initial only.</p>
            </div>
          )}
        </div>

        <div className="im-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Bell size={18} className="text-[#00FF88]" /> Urgent Notifications
              </h3>
              <p className="text-[#888888] text-sm mt-1">Get notified when urgent assignments match your skills.</p>
            </div>
            <button
              onClick={() => setUrgentNotifications(!urgentNotifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${urgentNotifications ? "bg-[#00FF88]" : "bg-[#1A3A25]"}`}
              data-testid="toggle-notifications"
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${urgentNotifications ? "left-6" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        <div className="im-card border-[#FF444430]">
          <h3 className="text-[#FF4444] font-semibold mb-2">Danger Zone</h3>
          <p className="text-[#888888] text-sm mb-3">Permanently delete your Inter-Mission profile and all associated data.</p>
          <button className="bg-[#FF444420] border border-[#FF4444] text-[#FF4444] rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#FF4444] hover:text-white transition-colors" data-testid="button-delete-account">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
