import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12 mt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="block mb-4">
            <span className="text-2xl font-extrabold italic text-red-600">FCM</span>
            <span className="block text-xs font-bold tracking-widest text-red-600">FIRST CLASS MANAGERIAL</span>
            <span className="block text-xs font-bold tracking-widest text-gold">INTELLIGENCE</span>
          </Link>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Data-driven intelligence for Post Office acquisitions. 15+ years of operational experience. 40+ branches operated.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 text-white">Navigation</h4>
          <ul className="space-y-2 flex flex-col">
            <li><Link href="/" className="text-muted-foreground hover:text-gold text-sm transition-colors">Home</Link></li>
            <li><Link href="/opportunities" className="text-muted-foreground hover:text-gold text-sm transition-colors">Live Listings</Link></li>
            <li><Link href="/blog" className="text-muted-foreground hover:text-gold text-sm transition-colors">Blog</Link></li>
            <li><Link href="/consultation" className="text-muted-foreground hover:text-gold text-sm transition-colors">Consultation</Link></li>
            <li><Link href="/reports" className="text-muted-foreground hover:text-gold text-sm transition-colors">Reports</Link></li>
            <li><Link href="/contact" className="text-muted-foreground hover:text-gold text-sm transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-white">Explore</h4>
          <ul className="space-y-2 flex flex-col">
            <li><Link href="/insiders" className="text-gold hover:text-[#fff0a8] text-sm transition-colors">⭐ Insider</Link></li>
            <li><Link href="/inter-mission" className="text-[#00FF88] hover:text-[#00FF88]/80 text-sm transition-colors">Inter-Mission</Link></li>
            <li><Link href="/business-republic" className="text-muted-foreground hover:text-gold text-sm transition-colors">Business Republic</Link></li>
            <li><a href="https://discord.gg/52MsbGBhyr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold text-sm transition-colors">💬 Community</a></li>
            <li><Link href="/dashboard" className="text-muted-foreground hover:text-gold text-sm font-semibold transition-colors">🔧 Admin Dashboard</Link></li>
            <li><Link href="/dashboard" className="text-muted-foreground hover:text-gold text-sm transition-colors pl-2">↳ Overview</Link></li>
            <li><Link href="/dashboard/swarm" className="text-muted-foreground hover:text-gold text-sm transition-colors pl-2">↳ Agent Swarm</Link></li>
            <li><Link href="/dashboard/opportunities" className="text-muted-foreground hover:text-gold text-sm transition-colors pl-2">↳ Opportunities</Link></li>
            <li><Link href="/dashboard/market-scan" className="text-muted-foreground hover:text-gold text-sm transition-colors pl-2">↳ Market Scan</Link></li>
            <li><Link href="/dashboard/content" className="text-muted-foreground hover:text-gold text-sm transition-colors pl-2">↳ Content Control</Link></li>
            <li><Link href="/dashboard/costs" className="text-muted-foreground hover:text-gold text-sm transition-colors pl-2">↳ Costs</Link></li>
            <li><Link href="/dashboard/hr" className="text-muted-foreground hover:text-gold text-sm transition-colors pl-2">↳ Ask Harper</Link></li>
            <li><Link href="/dashboard/agents" className="text-muted-foreground hover:text-gold text-sm transition-colors pl-2">↳ Agents</Link></li>
            <li><Link href="/dashboard/settings" className="text-muted-foreground hover:text-gold text-sm transition-colors pl-2">↳ Settings</Link></li>
            <li><a href="https://www.fcmgt.co.uk" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold text-sm transition-colors">FC Management</a></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} FCM Intelligence. A division of <a href="https://www.fcmgt.co.uk" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">First Class Managerial Ltd</a>. All rights reserved.</p>
        <p className="mt-2">FCM Intelligence provides market intelligence for informational purposes. This is not financial advice. Always conduct your own due diligence.</p>
      </div>
    </footer>
  );
}
