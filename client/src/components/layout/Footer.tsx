import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12 mt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="text-xl font-bold tracking-tighter block mb-4">
            FCM <span className="text-gold">Intelligence</span>
          </Link>
          <p className="text-muted-foreground mb-6 max-w-sm">
            The premier intelligence system and support network for UK Post Office franchise operators.
          </p>
          <p className="text-sm">
            <a href="mailto:mikesh@interimenterprises.co.uk" className="text-gold hover:underline">
              mikesh@interimenterprises.co.uk
            </a>
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 text-white">Platform</h4>
          <ul className="space-y-2 flex flex-col">
            <li><Link href="/services" className="text-muted-foreground hover:text-gold text-sm transition-colors">Services</Link></li>
            <li><Link href="/blog" className="text-muted-foreground hover:text-gold text-sm transition-colors">Insights</Link></li>
            <li><Link href="/about" className="text-muted-foreground hover:text-gold text-sm transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="text-muted-foreground hover:text-gold text-sm transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-white">Access</h4>
          <ul className="space-y-2 flex flex-col">
            <li><Link href="/insiders" className="text-muted-foreground hover:text-gold text-sm transition-colors">Insider Login</Link></li>
            <li><Link href="/dashboard" className="text-muted-foreground hover:text-gold text-sm transition-colors">Admin Dashboard</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Interim Enterprises Ltd. All rights reserved.</p>
        <p>This is a proprietary business application.</p>
      </div>
    </footer>
  );
}
