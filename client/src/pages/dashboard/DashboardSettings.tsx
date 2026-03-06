import { DashboardSidebar } from "./DashboardHome";
import { useState } from "react";

export default function DashboardSettings() {
  const [autoApprove, setAutoApprove] = useState(90);
  const [notifications, setNotifications] = useState({
    newOpportunity: true,
    contentReady: true,
    hrEscalation: true,
    costAlert: true,
    agentDown: false,
  });

  const agentModels = [
    { agent: "Main", model: "Claude Sonnet 4", editable: false },
    { agent: "Henry", model: "Claude Sonnet 4", editable: true },
    { agent: "Claudia", model: "Claude Sonnet 4", editable: true },
    { agent: "Harper", model: "Claude Sonnet 4", editable: true },
    { agent: "Rex", model: "Claude Haiku", editable: true },
    { agent: "Sentinel", model: "Gemini 2.5 Pro", editable: true },
    { agent: "Watchtower", model: "Claude Sonnet 4", editable: true },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar active="/dashboard/settings" />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <section className="fcm-card mb-8">
          <h2 className="text-xl font-bold mb-6">Model Assignments</h2>
          <div className="space-y-3">
            {agentModels.map((am) => (
              <div key={am.agent} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <div className="font-semibold">{am.agent}</div>
                </div>
                <div className="font-mono text-sm text-gold">{am.model}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="fcm-card mb-8">
          <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium">{key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}</span>
                <button
                  onClick={() => setNotifications({ ...notifications, [key]: !value })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${value ? "bg-gold" : "bg-border"}`}
                  data-testid={`toggle-${key}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-black transition-transform ${value ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="fcm-card">
          <h2 className="text-xl font-bold mb-4">Auto-Approve Threshold</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Content with a Rex score at or above this threshold will be auto-approved for publication.
          </p>
          <div className="flex items-center gap-6">
            <input
              type="range"
              min="50"
              max="100"
              value={autoApprove}
              onChange={(e) => setAutoApprove(parseInt(e.target.value))}
              className="flex-1 accent-[#FFD700]"
              data-testid="slider-auto-approve"
            />
            <span className="font-financial text-2xl w-16 text-right">{autoApprove}</span>
          </div>
        </section>
      </main>
    </div>
  );
}
