import { Link } from "wouter";
import { Search, Compass, BookOpen, User, Bell, ChevronRight, BarChart2 } from "lucide-react";

function InsidersSidebar() {
  const links = [
    { href: "/insiders", icon: <Compass size={20} />, label: "Intel Feed" },
    { href: "/insiders/listings", icon: <Search size={20} />, label: "Opportunity Scan" },
    { href: "/insiders/market", icon: <BarChart2 size={20} />, label: "Market Data" },
    { href: "/insiders/insights", icon: <BookOpen size={20} />, label: "Insights Library" },
    { href: "/insiders/profile", icon: <User size={20} />, label: "My Profile" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-border">
        <span className="text-xl font-bold tracking-tighter block">
          FCM <span className="text-gold">Insider</span>
        </span>
        <span className="text-xs text-muted-foreground mt-1 block">Premium Access</span>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <a className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              link.href === "/insiders" ? "bg-gold/10 text-gold" : "text-muted-foreground hover:bg-card-border hover:text-white"
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
            ← Public Home
          </a>
        </Link>
      </div>
    </aside>
  );
}

export default function InsidersHome() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <InsidersSidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="border-b border-border bg-card/50 px-6 py-4 flex justify-between items-center sticky top-0 backdrop-blur z-10">
          <h1 className="text-xl font-bold">Welcome back, Partner</h1>
          <button className="relative p-2 text-muted-foreground hover:text-gold transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full"></span>
          </button>
        </header>

        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          {/* Status Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-r from-gold/20 to-transparent border border-gold/30 rounded-lg p-4 flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-gold mb-1">New Opportunities</div>
                <div className="text-xs text-muted-foreground">Since your last visit</div>
              </div>
              <div className="text-3xl font-financial">3</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
              <div>
                <div className="text-sm font-medium mb-1">New Market Insights</div>
                <div className="text-xs text-muted-foreground">Published this week</div>
              </div>
              <div className="text-3xl font-financial text-white">2</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Opportunities */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-end">
                <h2 className="text-xl font-bold">Latest Premium Listings</h2>
                <Link href="/insiders/listings">
                  <a className="text-sm text-gold hover:underline flex items-center">View all <ChevronRight size={16} /></a>
                </Link>
              </div>

              {/* Listing Card */}
              <div className="fcm-card p-0 overflow-hidden relative">
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur border border-gold/50 text-gold text-xs font-bold px-2 py-1 rounded">
                  SCORE: 92/100
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs font-bold bg-blue-500/20 text-blue-400 px-2 py-1 rounded">POST OFFICE</span>
                    <span className="text-xs font-bold bg-card-border px-2 py-1 rounded">WEST MIDLANDS</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">High-Footfall Mains Branch</h3>
                  <p className="text-muted-foreground text-sm mb-6">Excellent secondary retail space (convenience). Secure lease. Strong local monopoly.</p>
                  
                  <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">PO Remuneration</div>
                      <div className="font-financial text-lg">£85,000</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Retail T/O</div>
                      <div className="font-financial text-lg text-white">£420,000</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Asking Price</div>
                      <div className="font-financial text-lg text-white">£165,000</div>
                    </div>
                  </div>
                </div>
                <div className="bg-card-border px-6 py-4 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Scanned 4 hours ago</span>
                  <button className="btn-secondary text-sm py-1.5 h-auto min-h-0">Request Full Dossier</button>
                </div>
              </div>

               {/* Listing Card 2 */}
               <div className="fcm-card p-0 overflow-hidden relative">
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur border border-gold/50 text-gold text-xs font-bold px-2 py-1 rounded">
                  SCORE: 88/100
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs font-bold bg-purple-500/20 text-purple-400 px-2 py-1 rounded">FORECOURT</span>
                    <span className="text-xs font-bold bg-card-border px-2 py-1 rounded">YORKSHIRE</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Prime A-Road Forecourt</h3>
                  <p className="text-muted-foreground text-sm mb-6">Independent fuel supply. High margin shop sales. Scope for hot food expansion.</p>
                  
                  <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
                     <div>
                      <div className="text-xs text-muted-foreground uppercase">Fuel Volume</div>
                      <div className="font-financial text-lg text-white">1.2m L</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Shop T/O</div>
                      <div className="font-financial text-lg text-white">£650,000</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Asking Price</div>
                      <div className="font-financial text-lg text-white">£850,000</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Market & Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold mb-6">Market Pulse</h2>
                <div className="bg-card border border-border rounded-lg p-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium">Avg PO Fees (Mains)</span>
                    <span className="text-green-500 text-xs font-bold flex items-center">+2.4% <ArrowUpRightIcon size={14} /></span>
                  </div>
                  <div className="font-financial text-3xl mb-1 text-gold">£68,400</div>
                  <div className="text-xs text-muted-foreground">Rolling 3-month average across UK.</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-xl font-bold">Latest Intelligence</h2>
                </div>
                <div className="space-y-4">
                  <div className="group cursor-pointer">
                    <div className="text-xs text-gold font-mono mb-1">UK BUSINESS STRATEGY</div>
                    <h3 className="font-bold text-white group-hover:text-gold transition-colors leading-tight mb-2">Why the convenience sector is consolidating faster than predicted</h3>
                    <div className="text-xs text-muted-foreground">5 min read • Published yesterday</div>
                  </div>
                  <hr className="border-border" />
                  <div className="group cursor-pointer">
                    <div className="text-xs text-gold font-mono mb-1">PO INSIDER</div>
                    <h3 className="font-bold text-white group-hover:text-gold transition-colors leading-tight mb-2">Maximizing outreach: The hidden value in banking transactions</h3>
                    <div className="text-xs text-muted-foreground">4 min read • Oct 12</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ArrowUpRightIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round">
      <path d="M7 17l9.2-9.2M17 17V7H7" />
    </svg>
  );
}