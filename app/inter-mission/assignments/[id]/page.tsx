"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { EXPERTISE_TRACKS } from "@/lib/im-constants";
import { MapPin, Calendar, AlertTriangle, ArrowLeft, Star, Send } from "lucide-react";

export default function AssignmentDetail() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalRate, setProposalRate] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [demoManagerId, setDemoManagerId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/inter-mission/people?userType=manager&limit=1")
      .then((r) => r.json())
      .then((profiles) => {
        const p = Array.isArray(profiles) ? profiles[0] : null;
        if (p) setDemoManagerId(p.id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`/api/inter-mission/assignments/${params.id}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/inter-mission/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: data.assignment.id,
          managerId: demoManagerId || 1,
          proposedRate: proposalRate,
          message: proposalMessage,
        }),
      });
      setShowProposalForm(false);
      const refreshed = await fetch(`/api/inter-mission/assignments/${params.id}`).then((r) => r.json());
      setData(refreshed);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!data?.assignment) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-[#888888]">Assignment not found.</p>
        <Link href="/inter-mission/assignments" className="im-btn-secondary mt-4 inline-block">Back to Assignments</Link>
      </div>
    );
  }

  const { assignment, proposals, operator } = data;
  const track = EXPERTISE_TRACKS.find((t) => t.id === assignment.expertiseTrack);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl pb-24 md:pb-8">
      <Link href="/inter-mission/assignments" className="text-[#888888] hover:text-[#00FF88] text-sm flex items-center gap-1 mb-6">
        <ArrowLeft size={16} /> Back to Assignments
      </Link>

      <div className="im-card mb-6">
        <div className="flex items-start gap-3 mb-4">
          {assignment.urgency === "urgent" && (
            <span className="inline-flex items-center gap-1 bg-[#FF444420] text-[#FF4444] text-xs font-semibold px-2 py-0.5 rounded im-pulse-urgent">
              <AlertTriangle size={12} /> URGENT
            </span>
          )}
          <span className="text-xs bg-[#00FF8815] text-[#00FF88] px-2 py-0.5 rounded">
            {track?.icon} {track?.name}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded ${assignment.status === "open" ? "bg-[#00FF8815] text-[#00FF88]" : "bg-[#88888820] text-[#888888]"}`}>
            {assignment.status}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-4" data-testid="text-assignment-title">{assignment.title}</h1>

        {assignment.description && <p className="text-[#888888] mb-6">{assignment.description}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <span className="text-[#888888] text-xs block mb-1">Location</span>
            <span className="text-white text-sm flex items-center gap-1"><MapPin size={14} /> {assignment.branchName || assignment.locationPostcode}</span>
          </div>
          <div>
            <span className="text-[#888888] text-xs block mb-1">Dates</span>
            <span className="text-white text-sm flex items-center gap-1"><Calendar size={14} /> {new Date(assignment.startDate).toLocaleDateString("en-GB")} — {new Date(assignment.endDate).toLocaleDateString("en-GB")}</span>
          </div>
          <div>
            <span className="text-[#888888] text-xs block mb-1">Budget</span>
            <span className="im-font-financial text-lg">{assignment.dailyBudget ? `£${parseFloat(assignment.dailyBudget).toFixed(0)}/day` : "Open"}</span>
          </div>
          <div>
            <span className="text-[#888888] text-xs block mb-1">Duration</span>
            <span className="text-white text-sm">{assignment.durationType?.replace(/_/g, " ") || "Flexible"}</span>
          </div>
        </div>

        {operator && (
          <div className="border-t border-[#1A3A25] pt-4">
            <span className="text-[#888888] text-xs block mb-2">Posted by</span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1A3A25] flex items-center justify-center text-[#00FF88] font-bold text-sm">
                {operator.name?.charAt(0)}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{operator.name}</p>
                <p className="text-[#888888] text-xs">{operator.branchName}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {assignment.status === "open" && !showProposalForm && (
        <button onClick={() => setShowProposalForm(true)} className="im-btn-primary w-full text-lg py-3 mb-6" data-testid="button-interested">
          I&apos;m Interested <Send size={18} className="ml-2" />
        </button>
      )}

      {showProposalForm && (
        <form onSubmit={handleProposal} className="im-card mb-6 im-glow">
          <h3 className="text-white font-semibold mb-4">Submit Your Proposal</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-white text-sm font-medium mb-1">Your Daily Rate (£) *</label>
              <input type="number" required value={proposalRate} onChange={(e) => setProposalRate(e.target.value)} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white focus:border-[#00FF88] focus:outline-none" placeholder="200" data-testid="input-proposal-rate" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-1">Message (optional)</label>
            <textarea value={proposalMessage} onChange={(e) => setProposalMessage(e.target.value)} rows={3} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none resize-none" placeholder="Why you're a great fit..." data-testid="input-proposal-message" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="im-btn-primary flex-1" data-testid="button-submit-proposal">
              {submitting ? "Submitting..." : "Submit Proposal"}
            </button>
            <button type="button" onClick={() => setShowProposalForm(false)} className="im-btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          Proposals <span className="text-[#888888] text-sm font-normal">({proposals?.length || 0})</span>
        </h2>
        {proposals?.length > 0 ? (
          <div className="space-y-3">
            {proposals.map((p: any) => (
              <div key={p.id} className="im-card" data-testid={`card-proposal-${p.id}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1A3A25] flex items-center justify-center text-[#00FF88] font-bold text-sm">
                      {p.manager?.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{p.manager?.name || "Manager"}</p>
                      {p.manager?.averageRating && parseFloat(p.manager.averageRating) > 0 && (
                        <span className="text-[#888888] text-xs flex items-center gap-1">
                          <Star size={12} className="text-[#00FF88]" fill="#00FF88" />
                          {parseFloat(p.manager.averageRating).toFixed(1)} ({p.manager.reviewCount} reviews)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="im-font-financial text-lg">£{parseFloat(p.proposedRate).toFixed(0)}</span>
                    <span className="text-[#888888] text-xs block">/day</span>
                  </div>
                </div>
                {p.message && <p className="text-[#888888] text-sm mt-3 italic">&ldquo;{p.message}&rdquo;</p>}
                <div className="flex items-center gap-2 mt-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${p.status === "accepted" ? "bg-[#00FF8815] text-[#00FF88]" : p.status === "declined" ? "bg-[#FF444420] text-[#FF4444]" : "bg-[#88888820] text-[#888888]"}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#888888] text-center py-8">No proposals yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}
