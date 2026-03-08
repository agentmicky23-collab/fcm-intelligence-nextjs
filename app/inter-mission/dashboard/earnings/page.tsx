"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, TrendingUp } from "lucide-react";

export default function EarningsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inter-mission/people?userType=manager&limit=1")
      .then((r) => r.json())
      .then((profiles) => {
        const p = Array.isArray(profiles) ? profiles[0] : null;
        if (p) return fetch(`/api/inter-mission/earnings?managerId=${p.id}`).then((r) => r.json());
        return { summary: { totalEarnings: "0", monthEarnings: "0", totalAssignments: 0, avgDailyRate: "0" }, earnings: [] };
      })
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const summary = data?.summary || {};
  const monthlyData = summary.monthlyEarnings || [];

  const maxMonthly = Math.max(...monthlyData.map((m: any) => parseFloat(m.total || 0)), 1);

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <Link href="/inter-mission/dashboard" className="text-[#888888] hover:text-[#00FF88] text-sm flex items-center gap-1 mb-6">
        <ArrowLeft size={16} /> Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6" data-testid="text-earnings-title">
        Your <span className="text-[#00FF88]">Earnings</span>
      </h1>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="im-card text-center im-glow">
              <span className="im-font-financial text-3xl" data-testid="text-total-earnings">£{parseFloat(summary.totalEarnings || 0).toLocaleString("en-GB", { minimumFractionDigits: 0 })}</span>
              <span className="text-[#888888] text-xs block mt-1">Total Earned</span>
            </div>
            <div className="im-card text-center">
              <span className="im-font-financial text-2xl" data-testid="text-month-earnings">£{parseFloat(summary.monthEarnings || 0).toLocaleString("en-GB", { minimumFractionDigits: 0 })}</span>
              <span className="text-[#888888] text-xs block mt-1">This Month</span>
            </div>
            <div className="im-card text-center">
              <span className="im-font-financial text-2xl" data-testid="text-assignments-done">{summary.totalAssignments || 0}</span>
              <span className="text-[#888888] text-xs block mt-1">Assignments Done</span>
            </div>
            <div className="im-card text-center">
              <span className="im-font-financial text-2xl" data-testid="text-avg-rate">£{parseFloat(summary.avgDailyRate || 0).toFixed(0)}</span>
              <span className="text-[#888888] text-xs block mt-1">Avg Daily Rate</span>
            </div>
          </div>

          <div className="im-card mb-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#00FF88]" /> Monthly Earnings
            </h3>
            {monthlyData.length > 0 ? (
              <div className="h-40 flex items-end justify-center gap-2">
                {monthlyData.slice(-6).map((m: any) => {
                  const height = Math.max(8, (parseFloat(m.total) / maxMonthly) * 130);
                  const monthLabel = new Date(m.month + "-01").toLocaleDateString("en-GB", { month: "short" });
                  return (
                    <div key={m.month} className="flex flex-col items-center gap-1">
                      <span className="im-font-financial text-xs">£{parseFloat(m.total).toFixed(0)}</span>
                      <div className="w-8 bg-[#00FF88] rounded-t opacity-70" style={{ height: `${height}px` }} />
                      <span className="text-[#888888] text-xs">{monthLabel}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-40 flex items-end justify-center gap-2">
                {["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].map((month) => (
                  <div key={month} className="flex flex-col items-center gap-1">
                    <div className="w-8 bg-[#1A3A25] rounded-t" style={{ height: "8px" }} />
                    <span className="text-[#888888] text-xs">{month}</span>
                  </div>
                ))}
              </div>
            )}
            {monthlyData.length === 0 && (
              <p className="text-[#888888] text-center text-sm mt-4">Complete assignments to see your earnings chart here</p>
            )}
          </div>

          {data?.earnings?.length > 0 && (
            <div className="im-card mb-8">
              <h3 className="text-white font-semibold mb-4">Recent Earnings</h3>
              <div className="space-y-2">
                {data.earnings.slice(0, 10).map((e: any) => (
                  <div key={e.id} className="flex items-center justify-between py-2 border-b border-[#1A3A25] last:border-0">
                    <div>
                      <span className="text-white text-sm">{e.description || "Assignment payment"}</span>
                      <span className="text-[#888888] text-xs block">{new Date(e.loggedAt).toLocaleDateString("en-GB")}</span>
                    </div>
                    <span className="im-font-financial">£{parseFloat(e.amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="im-card bg-[#00FF8808]">
            <h3 className="text-[#00FF88] font-semibold mb-2">Rate Guidance</h3>
            <p className="text-[#888888] text-sm">
              Managers with your experience typically charge £180-250/day. Add more expertise tracks and skills to attract higher-paying assignments.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
