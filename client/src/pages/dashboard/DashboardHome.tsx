import { Link } from "wouter";
import { LayoutDashboard, Target, FileText, PieChart, Users, Settings, Activity, AlertTriangle, Briefcase, Mail, Calendar } from "lucide-react";

// This is a simplified layout component specifically for the Dashboard
function DashboardSidebar() {
  const links = [
    { href: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Overview" },
    { href: "/dashboard/opportunities", icon: <Target size={20} />, label: "Opportunities" },
    { href: "/dashboard/content", icon: <FileText size={20} />, label: "Content" },
    { href: "/dashboard/costs", icon: <PieChart size={20} />, label: "Costs" },
    { href: "/dashboard/agents", icon: <Activity size={20} />, label: "Agents" },
    { href: "/dashboard/hr", icon: <Users size={20} />, label: "HR Cases" },
    { href: "/dashboard/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-border">
        <span className="text-xl font-bold tracking-tighter block">
          FCM <span className="text-gold">Admin</span>
        </span>
        <span className="text-xs text-muted-foreground font-mono mt-1 block">mikeshparekh@gmail.com</span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <a className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              link.href === "/dashboard" ? "bg-gold/10 text-gold" : "text-muted-foreground hover:bg-card-border hover:text-white"
            }`}>
              {link.icon}
              {link.label}
            </a>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <Link href="/">
          <a className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white">
            ← Exit to Public Site
          </a>
        </Link>
      </div>
    </aside>
  );
}

export default function DashboardHome() {
  const agents = [
    { name: "Henry", role: "Content", status: "Active", time: "2h ago", indicator: "bg-green-500" },
    { name: "Claudia", role: "UI/UX", status: "Active", time: "1h ago", indicator: "bg-green-500" },
    { name: "Harper", role: "HR", status: "Idle", time: "On-demand", indicator: "bg-yellow-500" },
    { name: "Rex", role: "Reviewer", status: "Idle", time: "Awaiting", indicator: "bg-yellow-500" },
    { name: "Sentinel", role: "Security", status: "Idle", time: "Awaiting", indicator: "bg-yellow-500" },
    { name: "Watchtower", role: "Scanner", status: "Active", time: "Monitoring", indicator: "bg-green-500" },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">System Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              System Online
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Today's Brief */}
          <div className="fcm-card md:col-span-2">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-border pb-2">
               Today's Briefing
            </h2>
            <div className="flex gap-8 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-card-border rounded-lg"><Mail className="text-gold" size={20} /></div>
                <div>
                  <div className="text-2xl font-financial text-white">3</div>
                  <div className="text-xs text-muted-foreground">Urgent Emails</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-card-border rounded-lg"><Calendar className="text-gold" size={20} /></div>
                <div>
                  <div className="text-2xl font-financial text-white">4</div>
                  <div className="text-xs text-muted-foreground">Events Today</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg"><AlertTriangle className="text-red-500" size={20} /></div>
                <div>
                  <div className="text-2xl font-financial text-red-500">1</div>
                  <div className="text-xs text-muted-foreground">HR Escalation</div>
                </div>
              </div>
            </div>
            <div className="bg-card-border rounded p-3 text-sm border-l-2 border-gold">
              <span className="font-semibold text-gold">Top Intel:</span> A high-potential Post Office in the West Midlands just hit the market (Score: 92/100). Watchtower suggests immediate review.
            </div>
          </div>

          {/* Cost Tracker */}
          <div className="fcm-card flex flex-col justify-between">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
               Cost Tracker
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Today's Spend</div>
                <div className="text-3xl font-financial">£14.52</div>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <div>
                  <div className="text-xs text-muted-foreground">This Week</div>
                  <div className="font-financial text-lg text-white">£86.40</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Projected</div>
                  <div className="font-financial text-lg text-white">£412.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Opportunity Pipeline Kanban (Summary) */}
        <h2 className="text-lg font-bold mb-4 mt-8">Opportunity Pipeline</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {["NEW", "WATCH", "PURSUE", "CLOSED"].map((stage, i) => (
            <div key={stage} className="bg-card border border-border rounded-lg p-4 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-gold transition-colors">
              <div className={`absolute top-0 w-full h-1 ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-yellow-500' : i === 2 ? 'bg-gold' : 'bg-green-500'}`}></div>
              <span className="text-3xl font-financial mb-1 mt-2">{[12, 5, 2, 8][i]}</span>
              <span className="text-xs font-bold tracking-wider text-muted-foreground">{stage}</span>
            </div>
          ))}
        </div>

        {/* Agent Status */}
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Activity size={20} className="text-gold" /> AI Agent Swarm Status
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {agents.map((agent) => (
            <div key={agent.name} className="bg-card border border-border rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-sm">{agent.name}</span>
                <span className={`h-2 w-2 rounded-full ${agent.indicator}`}></span>
              </div>
              <div className="text-xs text-muted-foreground mb-3">{agent.role}</div>
              <div className="text-xs font-mono bg-background px-2 py-1 rounded inline-block w-full text-center border border-border">
                {agent.time}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="btn-primary text-sm h-10 px-4">Trigger Market Scan</button>
          <button className="btn-secondary text-sm h-10 px-4">Request Content (Henry)</button>
          <button className="btn-secondary text-sm h-10 px-4 text-white border-border hover:border-gold hover:text-gold">Ask HR Harper</button>
        </div>
      </main>
    </div>
  );
}
