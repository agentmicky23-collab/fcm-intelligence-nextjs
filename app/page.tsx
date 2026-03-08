"use client";

import Link from "next/link";
import { Shield, CheckCircle2, Target, Clock, Eye, MapPin } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

export default function Home() {
  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-background to-background -z-10" />
        
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-gold/30 text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="flex h-2 w-2 rounded-full bg-gold animate-pulse"></span>
            <span className="text-gold font-medium">Trusted by 200+ Buyers Since 2009</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Buy Post Offices<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-[#fff0a8]"> Smarter, Not Harder</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Data-driven intelligence reports that reveal the true potential of any Post Office acquisition. <strong className="text-white">Stop guessing. Start knowing.</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
            <Link href="/reports" className="btn-primary w-full sm:w-auto text-lg px-8 py-3">
              Get Your Report
            </Link>
            <Link href="/opportunities" className="btn-secondary w-full sm:w-auto text-lg px-8 py-3">
              Browse Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y divide-x-0 md:divide-y-0 md:divide-x divide-border">
            <div className="pt-4 md:pt-0">
              <div className="font-financial text-4xl mb-2 text-gold">15+</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Years Industry Experience</div>
            </div>
            <div className="pt-8 md:pt-0">
              <div className="font-financial text-4xl mb-2 text-gold">40</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Branches Operated</div>
            </div>
            <div className="pt-8 md:pt-0">
              <div className="font-financial text-4xl mb-2 text-gold">200+</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Reports Delivered</div>
            </div>
            <div className="pt-8 md:pt-0">
              <div className="font-financial text-4xl mb-2 text-gold">98%</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 bg-black/50 border-b border-gold/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="text-gold" size={16} />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold">⭐</span>
              <span>4.9/5 Average Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold">🏆</span>
              <span>15 Years Industry Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold">🇬🇧</span>
              <span>UK Based Team</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose FCM Intelligence?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We don't just list Post Offices. We provide the intelligence you need to make confident decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="fcm-card group">
            <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Eye className="text-gold" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-2">
              <span className="text-2xl">🔍</span> Daily Scanning
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              We monitor Daltons, RightBiz, BusinessesForSale, and private sellers across the UK every day.
            </p>
          </div>
          
          <div className="fcm-card group">
            <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="text-gold" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-2">
              <span className="text-2xl">✅</span> Verified Active
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Every listing is checked to confirm it's still available before we share. No dead links or sold businesses.
            </p>
          </div>

          <div className="fcm-card group">
            <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="text-gold" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-2">
              <span className="text-2xl">🎯</span> Quality Filtered
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Only listings that pass our initial viability check make it here. No overpriced duds or obvious money pits.
            </p>
          </div>

          <div className="fcm-card group">
            <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="text-gold" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-2">
              <span className="text-2xl">📊</span> Expert Context
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Each listing gets our quick assessment. Want the full picture? That's what our reports are for.
            </p>
          </div>

          <div className="fcm-card group">
            <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clock className="text-gold" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-2">
              <span className="text-2xl">⏱️</span> Time Is Money
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Quality businesses attract multiple buyers. Get the intelligence you need to make decisive offers before your competition.
            </p>
          </div>

          <div className="fcm-card group">
            <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MapPin className="text-gold" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-2">
              <span className="text-2xl">🎯</span> Know Before You Go
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Listings only tell half the story. Our reports reveal the full picture — location risks, hidden costs, and real potential.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-card/30 border-y border-border">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
            <strong className="text-white">Important:</strong> Listings are sourced from third-party sites. We do not control original listings and cannot guarantee availability. Links direct to the original source — verify status before proceeding. Listings marked SOLD are removed from this page.
          </p>
        </div>
      </section>

      {/* CTA to Listings */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 border-y border-gold/20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Next Opportunity?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Browse our current listings and get expert intelligence reports on any Post Office acquisition.
          </p>
          <Link 
            href="/opportunities" 
            className="btn-primary text-lg px-10 py-4 shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.5)] transition-shadow"
          >
            View Live Listings
          </Link>
        </div>
      </section>
    </AppLayout>
  );
}
