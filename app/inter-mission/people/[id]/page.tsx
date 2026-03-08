"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { EXPERTISE_TRACKS } from "@/lib/im-constants";
import { MapPin, Star, ArrowLeft, Calendar, Shield, Clock } from "lucide-react";

export default function ProfileDetail() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/inter-mission/people/${params.id}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!data?.profile) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-[#888888]">Profile not found.</p>
        <Link href="/inter-mission/people" className="im-btn-secondary mt-4 inline-block">Back to People</Link>
      </div>
    );
  }

  const { profile, reviews } = data;
  const tracks = Array.isArray(profile.expertiseTracks) ? profile.expertiseTracks : [];
  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const rating = parseFloat(profile.averageRating || "0");

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl pb-24 md:pb-8">
      <Link href="/inter-mission/people" className="text-[#888888] hover:text-[#00FF88] text-sm flex items-center gap-1 mb-6">
        <ArrowLeft size={16} /> Back to People
      </Link>

      <div className="im-card mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1A3A25] flex items-center justify-center text-[#00FF88] font-bold text-2xl flex-shrink-0">
            {profile.stealthMode ? "?" : profile.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white" data-testid="text-profile-name">
                {profile.stealthMode ? `${profile.name.split(" ")[0]} ${profile.name.split(" ")[1]?.charAt(0) || ""}.` : profile.name}
              </h1>
              {profile.verificationStatus === "vetted" && (
                <span className="inline-flex items-center gap-1 text-xs bg-[#00FF8815] text-[#00FF88] px-2 py-0.5 rounded">
                  <Shield size={12} /> Vetted
                </span>
              )}
            </div>
            <p className="text-[#888888] capitalize">{profile.userType}{profile.yearsExperience ? ` · ${profile.yearsExperience} years experience` : ""}</p>

            {rating > 0 && (
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={18} className={n <= Math.round(rating) ? "text-[#00FF88]" : "text-[#1A3A25]"} fill={n <= Math.round(rating) ? "#00FF88" : "none"} />
                ))}
                <span className="text-white ml-1">{rating.toFixed(1)}</span>
                <span className="text-[#888888] text-sm">({profile.reviewCount} reviews)</span>
              </div>
            )}
          </div>
        </div>

        {profile.bio && <p className="text-[#888888] mb-6">{profile.bio}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {profile.locationPostcode && (
            <div>
              <span className="text-[#888888] text-xs block mb-1">Location</span>
              <span className="text-white text-sm flex items-center gap-1"><MapPin size={14} /> {profile.locationPostcode}</span>
            </div>
          )}
          {profile.travelRadius && (
            <div>
              <span className="text-[#888888] text-xs block mb-1">Travel Radius</span>
              <span className="text-white text-sm">{profile.travelRadius >= 999 ? "Nationwide" : `${profile.travelRadius} miles`}</span>
            </div>
          )}
          {profile.dailyRate && profile.verificationStatus === "vetted" && (
            <div>
              <span className="text-[#888888] text-xs block mb-1">Daily Rate</span>
              <span className="im-font-financial text-lg">£{parseFloat(profile.dailyRate).toFixed(0)}</span>
            </div>
          )}
          {profile.assignmentsCompleted > 0 && (
            <div>
              <span className="text-[#888888] text-xs block mb-1">Completed</span>
              <span className="text-white text-sm">{profile.assignmentsCompleted} assignments</span>
            </div>
          )}
        </div>

        {tracks.length > 0 && (
          <div className="mb-4">
            <span className="text-white text-sm font-medium block mb-2">Expertise</span>
            <div className="flex flex-wrap gap-2">
              {tracks.map((trackId: string) => {
                const track = EXPERTISE_TRACKS.find((t) => t.id === trackId);
                return track ? (
                  <span key={trackId} className="text-sm bg-[#00FF8815] text-[#00FF88] px-3 py-1 rounded">
                    {track.icon} {track.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <span className="text-white text-sm font-medium block mb-2">Skills</span>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill: string) => (
                <span key={skill} className="text-xs bg-[#0A1A0F] border border-[#1A3A25] text-[#888888] px-2 py-1 rounded">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {profile.branchName && (
          <div className="border-t border-[#1A3A25] pt-4 mt-6">
            <span className="text-[#888888] text-xs block mb-1">Branch</span>
            <p className="text-white">{profile.branchName} {profile.fadCode ? `(FAD: ${profile.fadCode})` : ""}</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          Reviews <span className="text-[#888888] text-sm font-normal">({reviews?.length || 0})</span>
        </h2>
        {reviews?.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((r: any) => (
              <div key={r.id} className="im-card" data-testid={`card-review-${r.id}`}>
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const avg = ((r.reliabilityScore || 0) + (r.competenceScore || 0) + (r.professionalismScore || 0) + (r.communicationScore || 0)) / 4;
                    return <Star key={n} size={14} className={n <= Math.round(avg) ? "text-[#00FF88]" : "text-[#1A3A25]"} fill={n <= Math.round(avg) ? "#00FF88" : "none"} />;
                  })}
                  <span className="text-[#888888] text-xs ml-2 flex items-center gap-1">
                    <Clock size={12} /> {new Date(r.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
                {r.writtenReview && <p className="text-[#888888] text-sm italic">&ldquo;{r.writtenReview}&rdquo;</p>}
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-[#888888]">
                  <span>Reliability: {r.reliabilityScore}/5</span>
                  <span>Competence: {r.competenceScore}/5</span>
                  <span>Professionalism: {r.professionalismScore}/5</span>
                  <span>Communication: {r.communicationScore}/5</span>
                </div>
                {r.wouldWorkAgain !== null && (
                  <p className="text-xs mt-2">{r.wouldWorkAgain ? <span className="text-[#00FF88]">Would work again ✓</span> : <span className="text-[#FF4444]">Would not work again ✗</span>}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#888888] text-center py-8">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
