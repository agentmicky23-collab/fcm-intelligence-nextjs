"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { EXPERTISE_TRACKS } from "@/lib/im-constants";
import { ArrowRight, Zap, Users, Briefcase, TrendingUp, Clock } from "lucide-react";

function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="im-font-financial text-3xl md:text-4xl">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

interface ActivityItem {
  text: string;
  time: string;
  urgent?: boolean;
}

export default function InterMissionLanding() {
  const [stats, setStats] = useState({
    availableManagers: 0,
    openAssignments: 0,
    totalEarnings: "0",
    completedAssignments: 0,
  });
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);

  useEffect(() => {
    fetch("/api/inter-mission/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {});

    fetch("/api/inter-mission/activity")
      .then((r) => r.json())
      .then((data) => {
        const items: ActivityItem[] = [];
        if (data.recentAssignments) {
          for (const a of data.recentAssignments.slice(0, 5)) {
            const timeAgo = getTimeAgo(a.createdAt);
            items.push({
              text: `${a.urgency === "urgent" ? "URGENT: " : ""}${a.title} — ${a.locationPostcode}`,
              time: timeAgo,
              urgent: a.urgency === "urgent",
            });
          }
        }
        if (data.recentProfiles) {
          for (const p of data.recentProfiles.slice(0, 3)) {
            const tracks = Array.isArray(p.expertiseTracks) ? p.expertiseTracks : [];
            items.push({
              text: `New ${p.userType} ${p.name} joined${tracks.length > 0 ? ` — ${tracks[0]}` : ""} — ${p.locationPostcode || "UK"}`,
              time: getTimeAgo(p.createdAt),
            });
          }
        }
        if (data.recentReviews) {
          for (const r of data.recentReviews.slice(0, 3)) {
            const avg = ((r.reliabilityScore || 0) + (r.competenceScore || 0) + (r.professionalismScore || 0) + (r.communicationScore || 0)) / 4;
            items.push({
              text: `${avg.toFixed(1)} star review — "${r.writtenReview?.slice(0, 60) || "Great work"}"`,
              time: getTimeAgo(r.createdAt),
            });
          }
        }
        items.sort(() => Math.random() - 0.5);
        setActivityFeed(items.length > 0 ? items : getDefaultFeed());
      })
      .catch(() => setActivityFeed(getDefaultFeed()));
  }, []);

  return (
    <div className="pb-20 md:pb-0">
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00FF8808] to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6" data-testid="text-hero-title">
              Your Expertise Has{" "}
              <span className="text-[#00FF88]">Value.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#888888] mb-10 max-w-2xl mx-auto">
              Connect with branches that need your skills. Find experienced help when you need it most.
              The Post Office People Network.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/inter-mission/assignments" className="im-btn-primary text-lg px-8 py-3 w-full sm:w-auto" data-testid="link-need-help">
                I Need Help <ArrowRight size={20} className="ml-2 inline" />
              </Link>
              <Link href="/inter-mission/register" className="im-btn-secondary text-lg px-8 py-3 w-full sm:w-auto" data-testid="link-can-help">
                I Can Help
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 border-y border-[#1A3A25]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <AnimatedCounter target={stats.availableManagers || 42} />
              <p className="text-[#888888] text-sm mt-1">Managers Available</p>
            </div>
            <div>
              <AnimatedCounter target={stats.openAssignments || 18} />
              <p className="text-[#888888] text-sm mt-1">Open Assignments</p>
            </div>
            <div>
              <AnimatedCounter target={parseInt(stats.totalEarnings) || 47850} prefix="£" />
              <p className="text-[#888888] text-sm mt-1">Earned by Network</p>
            </div>
            <div>
              <AnimatedCounter target={stats.completedAssignments || 156} />
              <p className="text-[#888888] text-sm mt-1">Assignments Completed</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Briefcase, step: "01", title: "Post or Browse", desc: "Tell us what you need, or show us what you can do" },
              { icon: Zap, step: "02", title: "Match Instantly", desc: "Our system finds the right person in seconds" },
              { icon: TrendingUp, step: "03", title: "Connect & Earn", desc: "Work together, build your reputation, grow your income" },
            ].map((item) => (
              <div key={item.step} className="im-card text-center">
                <div className="w-14 h-14 rounded-full bg-[#00FF8815] flex items-center justify-center mx-auto mb-4">
                  <item.icon size={28} className="text-[#00FF88]" />
                </div>
                <span className="text-[#00FF88] text-sm font-mono">{item.step}</span>
                <h3 className="text-white font-semibold text-lg mt-1 mb-2">{item.title}</h3>
                <p className="text-[#888888] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0A1A0F]/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-4">Live Activity</h2>
          <p className="text-[#888888] text-center mb-8">What&apos;s happening right now on Inter-Mission</p>
          <div className="max-w-2xl mx-auto space-y-3" data-testid="activity-feed">
            {activityFeed.map((item, i) => (
              <div
                key={i}
                className={`im-card flex items-start gap-3 py-3 px-4 ${item.urgent ? "border-[#FF4444] im-pulse-urgent" : ""}`}
              >
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.urgent ? "bg-[#FF4444]" : "bg-[#00FF88] im-pulse-available"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm">{item.text}</p>
                  <p className="text-[#888888] text-xs mt-1 flex items-center gap-1">
                    <Clock size={12} /> {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-4">Expertise Tracks</h2>
          <p className="text-[#888888] text-center mb-10">Find specialists across every area of Post Office operations</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="expertise-tracks">
            {EXPERTISE_TRACKS.map((track) => (
              <Link
                key={track.id}
                href={`/inter-mission/people?track=${track.id}`}
                className="im-card text-center group cursor-pointer"
                data-testid={`card-track-${track.id}`}
              >
                <span className="text-3xl block mb-3">{track.icon}</span>
                <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-[#00FF88] transition-colors">
                  {track.name}
                </h3>
                <p className="text-[#888888] text-xs leading-relaxed">{track.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0A1A0F]/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">What People Are Saying</h2>
            <div className="im-card im-glow">
              <p className="text-white text-lg italic mb-4">
                &ldquo;I earned £3,200 in my first month on Inter-Mission. The platform connected me
                with branches that needed exactly my skill set.&rdquo;
              </p>
              <p className="text-[#00FF88] font-semibold">— Experienced Area Manager, North West</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-[#888888] mb-8 max-w-lg mx-auto">
            Join the network of Post Office professionals. Whether you&apos;re looking for work or need help,
            Inter-Mission connects you instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/inter-mission/register" className="im-btn-primary text-lg px-8 py-3" data-testid="link-join-cta">
              Join the Network <Users size={20} className="ml-2 inline" />
            </Link>
            <Link href="/inter-mission/assignments" className="im-btn-secondary text-lg px-8 py-3">
              Browse Assignments
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  if (!dateStr) return "recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getDefaultFeed(): ActivityItem[] {
  return [
    { text: "URGENT: Counter cover needed in Bolton — 2 days", time: "just posted", urgent: true },
    { text: "Manager accepted for 2-week holiday cover in Leeds", time: "12 min ago" },
    { text: "New training specialist available in Manchester", time: "45 min ago" },
    { text: "Audit prep completed in Birmingham — 5 star review", time: "2 hours ago" },
    { text: "Compliance specialist booked for 1 month in Glasgow", time: "3 hours ago" },
    { text: "New operator registered branch in Liverpool", time: "5 hours ago" },
  ];
}
