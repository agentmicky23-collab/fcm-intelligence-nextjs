import { Link } from "wouter";
import { ArrowRight, BarChart3, Search, Shield, Target } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

export default function Home() {
  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-background to-background -z-10" />
        
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="flex h-2 w-2 rounded-full bg-gold animate-pulse"></span>
            Intelligence System Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            40+ Post Offices.<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-[#fff0a8]"> One Intelligence System.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Exclusive market scanning, thought leadership, and operational support for premium franchise operators.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
            <Link href="/insiders">
              <a className="btn-primary w-full sm:w-auto text-lg px-8 py-3">
                Become an FCM Insider
              </a>
            </Link>
            <Link href="/services">
              <a className="btn-secondary w-full sm:w-auto text-lg px-8 py-3">
                Learn More
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="pt-4 md:pt-0">
              <div className="font-financial text-4xl mb-2">40+</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Branches Managed</div>
            </div>
            <div className="pt-8 md:pt-0">
              <div className="font-financial text-4xl mb-2">17+</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Years Experience</div>
            </div>
            <div className="pt-8 md:pt-0">
              <div className="font-financial text-4xl mb-2">£1m+</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Invested</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">What is FCM Intelligence?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A proprietary system designed to surface opportunities, optimize operations, and provide an edge in the retail market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="fcm-card group">
            <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Search className="text-gold" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Opportunity Scanning</h3>
            <p className="text-muted-foreground leading-relaxed">
              Continuous monitoring of the UK market for prime Post Office, forecourt, and convenience store acquisitions.
            </p>
          </div>
          
          <div className="fcm-card group">
            <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="text-gold" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Market Intelligence</h3>
            <p className="text-muted-foreground leading-relaxed">
              Data-driven insights on regional trends, fee structures, and valuation metrics across the sector.
            </p>
          </div>

          <div className="fcm-card group">
            <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="text-gold" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Operational Support</h3>
            <p className="text-muted-foreground leading-relaxed">
              Expert HR, recruitment, and management guidance backed by decades of hands-on multi-site experience.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 border-y border-gold/20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Target className="w-16 h-16 text-gold mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Gain the Insider Edge</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join the FCM network to access proprietary deal flow, expert market analysis, and premium support services.
          </p>
          <Link href="/insiders">
            <a className="btn-primary text-lg px-10 py-4 shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.5)] transition-shadow">
              Apply for Access <ArrowRight className="ml-2" size={20} />
            </a>
          </Link>
        </div>
      </section>
    </AppLayout>
  );
}
