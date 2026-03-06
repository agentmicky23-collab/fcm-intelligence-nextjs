import { useState } from "react";
import { DashboardSidebar } from "./DashboardHome";
import { useQuery } from "@tanstack/react-query";
import { Network, Filter, ChevronDown, ChevronUp, Zap, Search, RefreshCw, ArrowRight } from "lucide-react";
import type { AgentHealth, AgentActivity } from "@shared/schema";

const AGENTS = [
  { name: "Main", role: "Orchestrator", model: "Claude Sonnet", color: "#FFD700", x: 300, y: 180 },
  { name: "Henry", role: "Content Creator", model: "Claude Sonnet", color: "#3B82F6", x: 140, y: 80 },
  { name: "Claudia", role: "UI/UX Engineer", model: "Claude Sonnet", color: "#A855F7", x: 460, y: 80 },
  { name: "Harper", role: "HR Advisor", model: "Claude Sonnet", color: "#EC4899", x: 100, y: 280 },
  { name: "Rex", role: "Content Reviewer", model: "Claude Haiku", color: "#F97316", x: 500, y: 280 },
  { name: "Sentinel", role: "Risk Monitor", model: "Gemini", color: "#EF4444", x: 200, y: 360 },
  { name: "Watchtower", role: "Market Scanner", model: "Claude Sonnet", color: "#10B981", x: 400, y: 360 },
];

const CONNECTIONS = [
  { from: "Main", to: "Henry" },
  { from: "Main", to: "Claudia" },
  { from: "Main", to: "Harper" },
  { from: "Main", to: "Rex" },
  { from: "Main", to: "Sentinel" },
  { from: "Main", to: "Watchtower" },
  { from: "Henry", to: "Rex" },
  { from: "Harper", to: "Sentinel" },
  { from: "Watchtower", to: "Main" },
];

function getAgentPos(name: string) {
  return AGENTS.find(a => a.name === name) || { x: 300, y: 200 };
}

function getStatusColor(status: string) {
  if (status === "active") return "#22C55E";
  if (status === "idle") return "#EAB308";
  return "#EF4444";
}

function formatTimeAgo(dateStr: string | Date | null) {
  if (!dateStr) return "N/A";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AgentSwarm() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [filterAgent, setFilterAgent] = useState<string>("all");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const { data: agents = [] } = useQuery<AgentHealth[]>({
    queryKey: ["/api/agents"],
    queryFn: () => fetch("/api/agents").then(r => r.json()),
  });

  const { data: activities = [] } = useQuery<AgentActivity[]>({
    queryKey: ["/api/agents/activity"],
    queryFn: () => fetch("/api/agents/activity?limit=100").then(r => r.json()),
  });

  const agentStatusMap: Record<string, string> = {};
  agents.forEach(a => { agentStatusMap[a.agentName] = a.status; });

  const filteredActivities = activities.filter(a => {
    if (filterAgent !== "all" && a.agentName !== filterAgent) return false;
    if (filterAction !== "all" && a.actionType !== filterAction) return false;
    return true;
  });

  const actionTypes = Array.from(new Set(activities.map(a => a.actionType)));

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar active="/dashboard/swarm" />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Network className="text-gold" size={28} />
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-page-title">Agent Swarm</h1>
              <p className="text-sm text-muted-foreground">Live network visualization &amp; activity feed</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">{agents.filter(a => a.status === "active").length}/{agents.length} active</span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
        </div>

        <div className="fcm-card mb-6" data-testid="agent-network-viz">
          <h2 className="text-lg font-bold mb-4">Network Topology</h2>
          <svg viewBox="0 0 600 440" className="w-full max-w-3xl mx-auto" style={{ minHeight: 300 }}>
            {CONNECTIONS.map((conn, i) => {
              const from = getAgentPos(conn.from);
              const to = getAgentPos(conn.to);
              const fromStatus = agentStatusMap[conn.from] || "idle";
              const toStatus = agentStatusMap[conn.to] || "idle";
              const bothActive = fromStatus === "active" && toStatus === "active";
              return (
                <line
                  key={i}
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke={bothActive ? "#FFD70066" : "#33333366"}
                  strokeWidth={bothActive ? 2 : 1}
                  strokeDasharray={bothActive ? "none" : "4 4"}
                />
              );
            })}
            {AGENTS.map(agent => {
              const status = agentStatusMap[agent.name] || "idle";
              const statusCol = getStatusColor(status);
              const isSelected = selectedAgent === agent.name;
              const radius = agent.name === "Main" ? 32 : 24;
              return (
                <g
                  key={agent.name}
                  onClick={() => setSelectedAgent(isSelected ? null : agent.name)}
                  className="cursor-pointer"
                  data-testid={`node-agent-${agent.name}`}
                >
                  {status === "active" && (
                    <circle cx={agent.x} cy={agent.y} r={radius + 6} fill="none" stroke={statusCol} strokeWidth={1} opacity={0.4}>
                      <animate attributeName="r" from={radius + 4} to={radius + 10} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={agent.x} cy={agent.y} r={radius}
                    fill={isSelected ? agent.color + "33" : "#1a1a1a"}
                    stroke={isSelected ? agent.color : statusCol}
                    strokeWidth={isSelected ? 3 : 2}
                  />
                  <text x={agent.x} y={agent.y - 4} textAnchor="middle" fill="white" fontSize={agent.name === "Main" ? 12 : 10} fontWeight="bold">
                    {agent.name}
                  </text>
                  <text x={agent.x} y={agent.y + 10} textAnchor="middle" fill="#888" fontSize={8}>
                    {agent.role.split(" ")[0]}
                  </text>
                  <circle cx={agent.x + radius - 4} cy={agent.y - radius + 4} r={5} fill={statusCol} />
                </g>
              );
            })}
          </svg>
          {selectedAgent && (
            <div className="mt-4 p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-gold">{selectedAgent}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-card border border-border">{AGENTS.find(a => a.name === selectedAgent)?.role}</span>
                <span className={`text-xs font-mono ${agentStatusMap[selectedAgent] === "active" ? "text-green-400" : agentStatusMap[selectedAgent] === "idle" ? "text-yellow-400" : "text-red-400"}`}>
                  {(agentStatusMap[selectedAgent] || "unknown").toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Model: {AGENTS.find(a => a.name === selectedAgent)?.model} · Last {activities.filter(a => a.agentName === selectedAgent).length} activities logged
              </p>
            </div>
          )}
        </div>

        <div className="fcm-card mb-6" data-testid="activity-feed">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Zap size={18} className="text-gold" /> Live Activity Feed
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-muted-foreground" />
                <select
                  value={filterAgent}
                  onChange={e => setFilterAgent(e.target.value)}
                  className="bg-card border border-border rounded px-2 py-1 text-sm text-foreground"
                  data-testid="select-filter-agent"
                >
                  <option value="all">All Agents</option>
                  {AGENTS.map(a => (
                    <option key={a.name} value={a.name}>{a.name}</option>
                  ))}
                </select>
                <select
                  value={filterAction}
                  onChange={e => setFilterAction(e.target.value)}
                  className="bg-card border border-border rounded px-2 py-1 text-sm text-foreground"
                  data-testid="select-filter-action"
                >
                  <option value="all">All Actions</option>
                  {actionTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{filteredActivities.length} events</span>
            </div>
          </div>
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No activity found</div>
            ) : (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-2 rounded hover:bg-card/50 transition-colors group"
                  data-testid={`activity-item-${activity.id}`}
                >
                  <span className="text-xs text-muted-foreground font-mono whitespace-nowrap mt-0.5 min-w-[64px]">
                    {formatTimeAgo(activity.createdAt)}
                  </span>
                  <span
                    className="text-xs font-bold min-w-[80px] mt-0.5"
                    style={{ color: AGENTS.find(a => a.name === activity.agentName)?.color || "#888" }}
                  >
                    {activity.agentName}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-card border border-border text-muted-foreground min-w-[70px] text-center">
                    {activity.actionType}
                  </span>
                  <span className="text-sm text-foreground/80 flex-1">{activity.description}</span>
                  {activity.targetAgent && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <ArrowRight size={10} /> {activity.targetAgent}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Search size={18} className="text-gold" /> Agent Detail Cards
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin" data-testid="agent-cards-scroll">
          {AGENTS.map(agent => {
            const health = agents.find(a => a.agentName === agent.name);
            const status = health?.status || "unknown";
            const isExpanded = expandedCard === agent.name;
            const recentActivities = activities.filter(a => a.agentName === agent.name).slice(0, 5);
            return (
              <div
                key={agent.name}
                className={`flex-shrink-0 w-72 bg-card border rounded-lg p-4 transition-all ${isExpanded ? "border-gold" : "border-border hover:border-gold/50"}`}
                data-testid={`agent-card-${agent.name}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-base" style={{ color: agent.color }}>{agent.name}</h3>
                    <div className="text-xs text-muted-foreground">{agent.role}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-mono ${status === "active" ? "text-green-400" : status === "idle" ? "text-yellow-400" : "text-red-400"}`}>
                      {status.toUpperCase()}
                    </span>
                    <span className={`h-2.5 w-2.5 rounded-full ${status === "active" ? "bg-green-500" : status === "idle" ? "bg-yellow-500" : "bg-red-500"}`}></span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Model</div>
                    <div className="text-xs font-mono">{agent.model}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Last Active</div>
                    <div className="text-xs font-mono">{health?.lastOutput ? formatTimeAgo(health.lastOutput) : "N/A"}</div>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedCard(isExpanded ? null : agent.name)}
                  className="w-full flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors py-1 border-t border-border mt-1"
                  data-testid={`button-expand-${agent.name}`}
                >
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {isExpanded ? "Collapse" : "Recent Activity"}
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-2">
                    {recentActivities.length === 0 ? (
                      <div className="text-xs text-muted-foreground text-center py-2">No recent activity</div>
                    ) : (
                      recentActivities.map(act => (
                        <div key={act.id} className="text-xs p-2 bg-background rounded border border-border">
                          <div className="flex justify-between mb-1">
                            <span className="text-muted-foreground font-mono">{formatTimeAgo(act.createdAt)}</span>
                            <span className="px-1.5 py-0.5 rounded bg-card border border-border text-muted-foreground">{act.actionType}</span>
                          </div>
                          <p className="text-foreground/80">{act.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
