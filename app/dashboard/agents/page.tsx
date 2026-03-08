"use client";

import { useQuery } from "@tanstack/react-query";
import type { AgentHealth } from "@/shared/schema";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardMobileNav } from "@/components/layout/MobileBottomNav";

export default function DashboardAgents() {
  const { data: agents = [] } = useQuery<AgentHealth[]>({
    queryKey: ["/api/agents"],
    queryFn: () => fetch("/api/agents").then(r => r.json()),
  });

  const agentMeta: Record<string, { role: string; model: string; description: string }> = {
    Main: { role: "Orchestrator", model: "Claude Sonnet", description: "Central coordination agent managing task delegation and system-wide decision making." },
    Henry: { role: "Content Creator", model: "Claude Sonnet", description: "Produces thought leadership content for LinkedIn, blog posts, and email campaigns." },
    Claudia: { role: "UI/UX Engineer", model: "Claude Sonnet", description: "Manages the FCM Intelligence platform design, builds and maintains the web application." },
    Harper: { role: "HR Advisor", model: "Claude Sonnet", description: "Provides employment law guidance, risk assessment, and HR case management." },
    Rex: { role: "Content Reviewer", model: "Claude Haiku", description: "Quality assurance agent that scores and reviews all content before publication." },
    Sentinel: { role: "Risk Monitor", model: "Gemini", description: "Monitors HR cases, compliance issues, and flags potential risks across the network." },
    Watchtower: { role: "Market Scanner", model: "Claude Sonnet", description: "Scans listing sites for new opportunities, scores them, and feeds the pipeline." },
  };

  const statusColor = (s: string) => {
    if (s === "active") return "text-green-400";
    if (s === "idle") return "text-yellow-400";
    return "text-red-400";
  };

  const formatTime = (t: string | Date | null) => {
    if (!t) return "N/A";
    return new Date(t).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar active="/dashboard/agents" />
      <main className="flex-1 overflow-y-auto p-6 pb-20 md:p-8 md:pb-8">
        <h1 className="text-3xl font-bold mb-8">AI Agent Swarm</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => {
            const meta = agentMeta[agent.agentName] || { role: "Agent", model: "Unknown", description: "" };
            return (
              <div key={agent.agentName} className="fcm-card" data-testid={`agent-detail-${agent.agentName}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{agent.agentName}</h2>
                    <div className="text-sm text-muted-foreground">{meta.role}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${statusColor(agent.status)}`}>{agent.status.toUpperCase()}</span>
                    <span className={`h-3 w-3 rounded-full ${agent.status === "active" ? "bg-green-500" : agent.status === "idle" ? "bg-yellow-500" : "bg-red-500"}`}></span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{meta.description}</p>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div>
                    <div className="text-xs text-muted-foreground">Model</div>
                    <div className="text-sm font-mono">{meta.model}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Last Output</div>
                    <div className="text-sm font-mono">{formatTime(agent.lastOutput)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Hours Since</div>
                    <div className="font-financial text-sm">{agent.hoursSinceOutput ? parseFloat(agent.hoursSinceOutput).toFixed(1) : "N/A"}h</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <DashboardMobileNav active="/dashboard/agents" />
    </div>
  );
}
