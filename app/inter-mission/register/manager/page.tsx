"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { EXPERTISE_TRACKS, SKILLS_BY_TRACK, TRAVEL_RADIUS_OPTIONS } from "@/lib/im-constants";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ManagerRegistration() {
  return <Suspense fallback={<div className="text-center py-16"><div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto" /></div>}><ManagerRegistrationContent /></Suspense>;
}

function ManagerRegistrationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    horizonId: "",
    bio: "",
    yearsExperience: "",
    locationPostcode: "",
    travelRadius: "25",
    dailyRate: "",
    referredBy: searchParams.get("ref") || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/inter-mission/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          userType: "manager",
          yearsExperience: form.yearsExperience ? parseInt(form.yearsExperience) : null,
          travelRadius: parseInt(form.travelRadius),
          dailyRate: form.dailyRate || null,
          expertiseTracks: selectedTracks,
          skills: selectedSkills,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <CheckCircle size={64} className="text-[#00FF88] mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Welcome to Inter-Mission!</h1>
        <p className="text-[#888888] mb-2">Your manager profile has been created.</p>
        <p className="text-[#888888] mb-8">You&apos;re in preview mode. Complete vetting to unlock full access.</p>
        <div className="im-card max-w-md mx-auto mb-8">
          <p className="text-white text-sm mb-2">Standard vetting: 5-7 business days</p>
          <p className="text-[#00FF88] text-sm font-semibold">Skip the queue: £3.99 (vetted in 24-48 hours)</p>
        </div>
        <Link href="/inter-mission/dashboard" className="im-btn-primary px-8 py-3">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/inter-mission/register" className="text-[#888888] hover:text-[#00FF88] text-sm flex items-center gap-1 mb-8">
        <ArrowLeft size={16} /> Back to role selection
      </Link>

      <h1 className="text-2xl font-bold text-white mb-2" data-testid="text-manager-register-title">
        Register as a <span className="text-[#00FF88]">Manager</span>
      </h1>
      <p className="text-[#888888] mb-8">Offer your expertise to branches that need help.</p>

      {error && <div className="bg-[#FF444420] border border-[#FF4444] rounded-lg p-4 mb-6 text-[#FF4444] text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-1">Full Name *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="Your full name" data-testid="input-name" />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Email *</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="your@email.com" data-testid="input-email" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-1">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="07XXX XXXXXX" data-testid="input-phone" />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Horizon User ID *</label>
            <input type="text" required value={form.horizonId} onChange={(e) => setForm({ ...form, horizonId: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="Your Horizon ID" data-testid="input-horizon-id" />
          </div>
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-1">Bio</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none resize-none" placeholder="2-3 sentences about your experience..." data-testid="input-bio" />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-1">Years Experience</label>
            <input type="number" value={form.yearsExperience} onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="15" data-testid="input-years" />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Location (Postcode) *</label>
            <input type="text" required value={form.locationPostcode} onChange={(e) => setForm({ ...form, locationPostcode: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="M1 1AA" data-testid="input-postcode" />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Daily Rate (£)</label>
            <input type="number" value={form.dailyRate} onChange={(e) => setForm({ ...form, dailyRate: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="200" data-testid="input-rate" />
          </div>
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-1">Travel Radius</label>
          <select value={form.travelRadius} onChange={(e) => setForm({ ...form, travelRadius: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white focus:border-[#00FF88] focus:outline-none" data-testid="select-radius">
            {TRAVEL_RADIUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-3">Expertise Tracks</label>
          <div className="grid grid-cols-2 gap-2">
            {EXPERTISE_TRACKS.map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => {
                  setSelectedTracks((prev) =>
                    prev.includes(track.id) ? prev.filter((t) => t !== track.id) : [...prev, track.id]
                  );
                }}
                className={`text-left p-3 rounded-lg border text-sm transition-all ${selectedTracks.includes(track.id) ? "border-[#00FF88] bg-[#00FF8815] text-white" : "border-[#1A3A25] bg-[#0A1A0F] text-[#888888] hover:border-[#00FF88]"}`}
                data-testid={`toggle-track-${track.id}`}
              >
                <span className="mr-2">{track.icon}</span>
                {track.name}
              </button>
            ))}
          </div>
        </div>

        {selectedTracks.length > 0 && (
          <div>
            <label className="block text-white text-sm font-medium mb-3">Specific Skills</label>
            <div className="flex flex-wrap gap-2">
              {selectedTracks.flatMap((trackId) => (SKILLS_BY_TRACK[trackId] || []).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    setSelectedSkills((prev) =>
                      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
                    );
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedSkills.includes(skill) ? "bg-[#00FF88] text-black" : "bg-[#0A1A0F] border border-[#1A3A25] text-[#888888] hover:border-[#00FF88]"}`}
                >
                  {skill}
                </button>
              )))}
            </div>
          </div>
        )}

        <input type="hidden" name="referredBy" value={form.referredBy} />

        <button type="submit" disabled={submitting} className="im-btn-primary w-full text-lg py-3" data-testid="button-submit">
          {submitting ? "Creating Profile..." : "Create Manager Profile"}
        </button>
      </form>
    </div>
  );
}
