"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Star } from "lucide-react";

export default function MyReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inter-mission/people?userType=manager&limit=1")
      .then((r) => r.json())
      .then((profiles) => {
        const p = Array.isArray(profiles) ? profiles[0] : null;
        if (p) {
          setProfile(p);
          return fetch(`/api/inter-mission/reviews/${p.id}`).then((r) => r.json());
        }
        return [];
      })
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avgRating = profile?.averageRating ? parseFloat(profile.averageRating) : 0;

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <Link href="/inter-mission/dashboard" className="text-[#888888] hover:text-[#00FF88] text-sm flex items-center gap-1 mb-6">
        <ArrowLeft size={16} /> Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6" data-testid="text-my-reviews-title">
        My <span className="text-[#00FF88]">Reviews</span>
      </h1>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="im-card text-center">
              <span className="im-font-financial text-3xl" data-testid="text-avg-review-rating">{avgRating.toFixed(1)}</span>
              <span className="text-[#888888] text-sm block mt-1">Average Rating</span>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={18} className={n <= Math.round(avgRating) ? "text-[#00FF88]" : "text-[#1A3A25]"} fill={n <= Math.round(avgRating) ? "#00FF88" : "none"} />
                ))}
              </div>
            </div>
            <div className="im-card text-center">
              <span className="im-font-financial text-3xl" data-testid="text-total-reviews">{reviews.length}</span>
              <span className="text-[#888888] text-sm block mt-1">Total Reviews</span>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((r) => {
                const overallScore = ((r.reliabilityScore || 0) + (r.competenceScore || 0) + (r.professionalismScore || 0) + (r.communicationScore || 0)) / 4;
                return (
                  <div key={r.id} className="im-card" data-testid={`card-review-${r.id}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} size={14} className={n <= Math.round(overallScore) ? "text-[#00FF88]" : "text-[#1A3A25]"} fill={n <= Math.round(overallScore) ? "#00FF88" : "none"} />
                        ))}
                        <span className="im-font-financial text-sm ml-2">{overallScore.toFixed(1)}</span>
                      </div>
                      <span className="text-[#888888] text-xs">{new Date(r.createdAt).toLocaleDateString("en-GB")}</span>
                    </div>
                    {r.writtenFeedback && <p className="text-[#888888] text-sm italic">&ldquo;{r.writtenFeedback}&rdquo;</p>}
                    <div className="flex gap-4 mt-3 text-xs text-[#888888]">
                      <span>Reliability: {r.reliabilityScore}/5</span>
                      <span>Competence: {r.competenceScore}/5</span>
                      <span>Professionalism: {r.professionalismScore}/5</span>
                      <span>Communication: {r.communicationScore}/5</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#888888] mb-4">No reviews yet. Complete assignments to start building your reputation.</p>
              <Link href="/inter-mission/assignments" className="im-btn-secondary text-sm">Browse Assignments</Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
