import Link from "next/link";

export function Footer() {
  return (
    <>
    {/* Floating Admin Portal Button */}
    <Link
      href="/dashboard"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-black border border-white/20 hover:border-gold text-white/50 hover:text-gold text-xs font-mono px-3 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-gold/20 hover:shadow-md group"
      title="Admin Portal"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-gold transition-colors">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
      Admin
    </Link>

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
            <li><a href="https://www.fcmgt.co.uk" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold text-sm transition-colors">FC Management</a></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} FCM Intelligence. A division of <a href="https://www.fcmgt.co.uk" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">First Class Managerial Ltd</a>. All rights reserved.</p>
        <p className="mt-2">FCM Intelligence provides market intelligence for informational purposes. This is not financial advice. Always conduct your own due diligence.</p>
      </div>
    </footer>
    </>
  );
}
