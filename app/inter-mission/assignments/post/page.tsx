"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EXPERTISE_TRACKS, DURATION_TYPES } from "@/lib/im-constants";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function PostAssignment() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showMore, setShowMore] = useState(false);

  const [form, setForm] = useState({
    expertiseTrack: "",
    locationPostcode: "",
    branchName: "",
    startDate: "",
    endDate: "",
    description: "",
    dailyBudget: "",
    urgency: "standard",
    durationType: "",
    accommodationAvailable: false,
    operatorId: 0,
  });

  useEffect(() => {
    fetch("/api/inter-mission/people?userType=operator&limit=1")
      .then((r) => r.json())
      .then((profiles) => {
        const p = Array.isArray(profiles) ? profiles[0] : null;
        if (p) setForm((prev) => ({ ...prev, operatorId: p.id }));
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const trackName = EXPERTISE_TRACKS.find((t) => t.id === form.expertiseTrack)?.name || form.expertiseTrack;
      const title = `${trackName} — ${form.branchName || form.locationPostcode} — ${form.durationType ? DURATION_TYPES.find((d) => d.value === form.durationType)?.label : "Flexible"}`;

      const res = await fetch("/api/inter-mission/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          title,
          dailyBudget: form.dailyBudget || null,
          durationType: form.durationType || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post assignment");
      }

      const assignment = await res.json();
      router.push(`/inter-mission/assignments/${assignment.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl pb-24 md:pb-8">
      <Link href="/inter-mission/assignments" className="text-[#888888] hover:text-[#00FF88] text-sm flex items-center gap-1 mb-8">
        <ArrowLeft size={16} /> Back to Assignments
      </Link>

      <h1 className="text-2xl font-bold text-white mb-2" data-testid="text-post-title">
        Post an <span className="text-[#00FF88]">Assignment</span>
      </h1>
      <p className="text-[#888888] mb-8">Tell us what you need and we&apos;ll match you with the right person.</p>

      {error && <div className="bg-[#FF444420] border border-[#FF4444] rounded-lg p-4 mb-6 text-[#FF4444] text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white text-sm font-medium mb-1">What do you need? *</label>
          <select required value={form.expertiseTrack} onChange={(e) => setForm({ ...form, expertiseTrack: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white focus:border-[#00FF88] focus:outline-none" data-testid="select-track">
            <option value="">Select expertise area</option>
            {EXPERTISE_TRACKS.map((t) => (
              <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-1">Branch Name</label>
            <input type="text" value={form.branchName} onChange={(e) => setForm({ ...form, branchName: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="e.g. Bolton Crown" data-testid="input-branch" />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Postcode *</label>
            <input type="text" required value={form.locationPostcode} onChange={(e) => setForm({ ...form, locationPostcode: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="BL1 1AA" data-testid="input-postcode" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-1">Start Date *</label>
            <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white focus:border-[#00FF88] focus:outline-none" data-testid="input-start-date" />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">End Date *</label>
            <input type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white focus:border-[#00FF88] focus:outline-none" data-testid="input-end-date" />
          </div>
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-1">Any details?</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none resize-none" placeholder="Must have banking experience, need someone who knows Horizon well..." data-testid="input-description" />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-1">Daily Budget (£)</label>
          <input type="number" value={form.dailyBudget} onChange={(e) => setForm({ ...form, dailyBudget: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="Leave blank — managers will propose" data-testid="input-budget" />
        </div>

        <button type="button" onClick={() => setShowMore(!showMore)} className="text-[#00FF88] text-sm hover:underline">
          {showMore ? "Less details" : "More details"}
        </button>

        {showMore && (
          <div className="space-y-4 border-t border-[#1A3A25] pt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-1">Urgency</label>
                <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white focus:border-[#00FF88] focus:outline-none" data-testid="select-urgency">
                  <option value="standard">Standard</option>
                  <option value="urgent">URGENT (same week)</option>
                </select>
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-1">Duration</label>
                <select value={form.durationType} onChange={(e) => setForm({ ...form, durationType: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white focus:border-[#00FF88] focus:outline-none" data-testid="select-duration">
                  <option value="">Select duration</option>
                  {DURATION_TYPES.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
              <input type="checkbox" checked={form.accommodationAvailable} onChange={(e) => setForm({ ...form, accommodationAvailable: e.target.checked })} className="rounded" data-testid="checkbox-accommodation" />
              Accommodation available
            </label>
          </div>
        )}

        <button type="submit" disabled={submitting} className="im-btn-primary w-full text-lg py-3" data-testid="button-post">
          {submitting ? "Posting..." : "Post Assignment"}
        </button>
      </form>
    </div>
  );
}
