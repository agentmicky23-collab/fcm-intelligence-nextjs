"use client";

import { useQuery } from "@tanstack/react-query";
import type { CostRecord } from "@shared/schema";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid } from "recharts";
import { AlertTriangle } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardMobileNav } from "@/components/layout/MobileBottomNav";

export default function DashboardCosts() {
  const { data: records = [] } = useQuery<CostRecord[]>({
    queryKey: ["/api/costs"],
    queryFn: () => fetch("/api/costs?days=30").then(r => r.json()),
  });

  const { data: summary } = useQuery<{ today: string; week: string; projected: string }>({
    queryKey: ["/api/costs/summary"],
    queryFn: () => fetch("/api/costs/summary").then(r => r.json()),
  });

  const chartData = [...records].reverse().map(r => ({
    date: new Date(r.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    total: parseFloat(r.totalCost),
  }));

  const modelTotals = records.reduce((acc, r) => {
    acc.Sonnet += parseFloat(r.sonnetCost || "0");
    acc.Haiku += parseFloat(r.haikuCost || "0");
    acc.Gemini += parseFloat(r.geminiCost || "0");
    acc.Opus += parseFloat(r.opusCost || "0");
    return acc;
  }, { Sonnet: 0, Haiku: 0, Gemini: 0, Opus: 0 } as Record<string, number>);

  const pieData = Object.entries(modelTotals).filter(([_, v]) => v > 0).map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }));
  const PIE_COLORS = ["#FFD700", "#E6C200", "#888888", "#555555"];

  const agentTotals = records.reduce((acc, r) => {
    acc.Main += parseFloat(r.mainAgentCost || "0");
    acc.Henry += parseFloat(r.henryCost || "0");
    acc.Claudia += parseFloat(r.claudiaCost || "0");
    acc.Harper += parseFloat(r.harperCost || "0");
    acc.Rex += parseFloat(r.rexCost || "0");
    acc.Sentinel += parseFloat(r.sentinelCost || "0");
    acc.Watchtower += parseFloat(r.watchtowerCost || "0");
    return acc;
  }, { Main: 0, Henry: 0, Claudia: 0, Harper: 0, Rex: 0, Sentinel: 0, Watchtower: 0 } as Record<string, number>);

  const barData = Object.entries(agentTotals).map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }));

  const dailyAvg = records.length > 0 ? records.reduce((s, r) => s + parseFloat(r.totalCost), 0) / records.length : 0;
  const overBudget = dailyAvg > 20;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar active="/dashboard/costs" />
      <main className="flex-1 overflow-y-auto p-6 pb-20 md:p-8 md:pb-8">
        <h1 className="text-3xl font-bold mb-8">Cost Analytics</h1>

        {overBudget && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="text-red-500" size={20} />
            <span className="text-sm text-red-400">Daily average exceeds £20 threshold. Review agent usage.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="fcm-card">
            <div className="text-xs text-muted-foreground mb-1">Current Month Total</div>
            <div className="text-3xl font-financial">£{summary?.week || "0.00"}</div>
          </div>
          <div className="fcm-card">
            <div className="text-xs text-muted-foreground mb-1">Daily Average</div>
            <div className="text-3xl font-financial">£{dailyAvg.toFixed(2)}</div>
          </div>
          <div className="fcm-card">
            <div className="text-xs text-muted-foreground mb-1">Projected Month-End</div>
            <div className="text-3xl font-financial">£{summary?.projected || "0.00"}</div>
          </div>
        </div>

        <div className="fcm-card mb-8">
          <h2 className="font-bold mb-6">Daily Cost (Last 14 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" tick={{ fill: "#888", fontSize: 12 }} />
              <YAxis tick={{ fill: "#888", fontSize: 12 }} tickFormatter={v => `£${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "8px" }}
                labelStyle={{ color: "#fff" }}
                formatter={(v: number) => [`£${v.toFixed(2)}`, "Total"]}
              />
              <Line type="monotone" dataKey="total" stroke="#FFD700" strokeWidth={2} dot={{ fill: "#FFD700", r: 3 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="fcm-card">
            <h2 className="font-bold mb-6">Cost by Model</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: £${value}`}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "8px" }} formatter={(v: number) => `£${v.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="fcm-card">
            <h2 className="font-bold mb-6">Cost by Agent</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 11 }} />
                <YAxis tick={{ fill: "#888", fontSize: 11 }} tickFormatter={v => `£${v}`} />
                <Tooltip contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "8px" }} formatter={(v: number) => `£${v.toFixed(2)}`} />
                <Bar dataKey="value" fill="#FFD700" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
      <DashboardMobileNav active="/dashboard/costs" />
    </div>
  );
}
