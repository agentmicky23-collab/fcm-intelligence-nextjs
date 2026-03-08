"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { ListingCard } from "@/components/listing-card";
import { listings } from "@/lib/listings-data";

export default function Home() {
  // Show first 8 listings as featured
  const featuredListings = listings.slice(0, 8);

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #0d1117 100%)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(201, 162, 39, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm mb-8" style={{ background: 'rgba(201, 162, 39, 0.15)', border: '1px solid #c9a227', color: '#c9a227' }}>
            <span className="flex h-2 w-2 rounded-full bg-[#c9a227] animate-pulse"></span>
            Trusted by 200+ Buyers Since 2009
          </div>

          <h1 className="font-playfair text-5xl md:text-7xl font-bold tracking-tight mb-6" style={{ lineHeight: 1.2 }}>
            Buy Post Offices<br />
            <span style={{ color: '#c9a227' }}>Smarter, Not Harder</span>
          </h1>

          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: '#8b949e' }}>
            Data-driven intelligence reports that reveal the true potential of any Post Office acquisition. <strong className="text-white">Stop guessing. Start knowing.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/reports" className="btn-primary text-lg px-8 py-3 w-full sm:w-auto">
              View Pricing
            </Link>
            <Link href="#report-preview" className="btn-secondary text-lg px-8 py-3 w-full sm:w-auto">
              See Sample Report
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section style={{ borderTop: '1px solid #30363d', borderBottom: '1px solid #30363d', background: 'rgba(22, 27, 34, 0.5)' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-mono text-4xl mb-2" style={{ color: '#c9a227', fontWeight: 700 }}>15+</div>
              <div className="text-sm font-medium uppercase tracking-wider" style={{ color: '#8b949e' }}>Years Industry Experience</div>
            </div>
            <div>
              <div className="font-mono text-4xl mb-2" style={{ color: '#c9a227', fontWeight: 700 }}>40</div>
              <div className="text-sm font-medium uppercase tracking-wider" style={{ color: '#8b949e' }}>Branches Operated</div>
            </div>
            <div>
              <div className="font-mono text-4xl mb-2" style={{ color: '#c9a227', fontWeight: 700 }}>200+</div>
              <div className="text-sm font-medium uppercase tracking-wider" style={{ color: '#8b949e' }}>Reports Delivered</div>
            </div>
            <div>
              <div className="font-mono text-4xl mb-2" style={{ color: '#c9a227', fontWeight: 700 }}>98%</div>
              <div className="text-sm font-medium uppercase tracking-wider" style={{ color: '#8b949e' }}>Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badge Bar */}
      <section className="py-6" style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm" style={{ color: '#8b949e' }}>
            <div className="flex items-center gap-2">
              <span style={{ color: '#c9a227' }}>🔒</span>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: '#c9a227' }}>⭐</span>
              <span>4.9/5 Average Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: '#c9a227' }}>🏆</span>
              <span>15 Years Industry Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: '#c9a227' }}>🇬🇧</span>
              <span>UK Based Team</span>
            </div>
          </div>
        </div>
      </section>

      {/* Curation Explainer */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Curate Opportunities</h2>
          <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto">
            Every listing on this page has been through our quality filter. Here&apos;s what that means:
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="feature-card-old">
            <div className="icon">🔍</div>
            <h3>Daily Scanning</h3>
            <p>We monitor Daltons, RightBiz, BusinessesForSale, and private sellers across the UK every day.</p>
          </div>
          <div className="feature-card-old">
            <div className="icon">✅</div>
            <h3>Verified Active</h3>
            <p>Every listing is checked to confirm it&apos;s still available before we share. No dead links or sold businesses.</p>
          </div>
          <div className="feature-card-old">
            <div className="icon">🎯</div>
            <h3>Quality Filtered</h3>
            <p>Only listings that pass our initial viability check make it here. No overpriced duds or obvious money pits.</p>
          </div>
          <div className="feature-card-old">
            <div className="icon">📊</div>
            <h3>Expert Context</h3>
            <p>Each listing gets our quick assessment. Want the full picture? That&apos;s what our reports are for.</p>
          </div>
        </div>
      </section>

      {/* Why Intelligence Matters */}
      <section className="pb-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div style={{ background: '#161b22', border: '2px solid rgba(201,162,39,0.3)', borderRadius: '16px', padding: '32px' }}>
            <div className="text-3xl mb-4">⏱️</div>
            <h3 className="text-xl font-bold mb-3">Time Is Money</h3>
            <p style={{ color: '#8b949e', lineHeight: 1.7 }}>
              Quality businesses attract multiple buyers. Get the intelligence you need to make decisive offers before your competition.
            </p>
          </div>
          <div style={{ background: '#161b22', border: '2px solid rgba(201,162,39,0.3)', borderRadius: '16px', padding: '32px' }}>
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3">Know Before You Go</h3>
            <p style={{ color: '#8b949e', lineHeight: 1.7 }}>
              Listings only tell half the story. Our reports reveal the full picture — location risks, hidden costs, and real potential.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6" style={{ background: 'rgba(22,27,34,0.5)', borderTop: '1px solid #30363d', borderBottom: '1px solid #30363d' }}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm max-w-4xl mx-auto" style={{ color: '#8b949e', lineHeight: 1.7 }}>
            <strong className="text-white">Important:</strong> Listings are sourced from third-party sites. We do not control original listings and cannot guarantee availability. Links direct to the original source — verify status before proceeding. Listings marked SOLD are removed from this page.
          </p>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 container mx-auto px-4" id="opportunities">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">🔥 Live Opportunities</h2>
          <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto mb-2">
            Businesses For Sale Now
          </p>
          <p style={{ color: '#57606a', fontSize: '0.9rem' }}>
            Showing {featuredListings.length} of {listings.length} opportunities • <Link href="/opportunities" className="underline" style={{ color: '#c9a227' }}>View All</Link>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/opportunities" className="btn-primary text-lg px-10 py-4">
            View All {listings.length} Listings
          </Link>
        </div>
      </section>

      {/* What's Included - Feature Cards */}
      <section className="py-20" style={{ background: '#161b22', borderTop: '1px solid #30363d', borderBottom: '1px solid #30363d' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What&apos;s Included in Every Report</h2>
            <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto">
              Comprehensive intelligence that covers every angle of your potential acquisition.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="feature-card-old">
              <div className="icon">💰</div>
              <h3>Financial Deep-Dive</h3>
              <p>Revenue analysis, profit margins, cash flow projections, and hidden cost identification.</p>
            </div>
            <div className="feature-card-old">
              <div className="icon">📍</div>
              <h3>Location Intelligence</h3>
              <p>Footfall data, demographic analysis, parking, accessibility, and local economic factors.</p>
            </div>
            <div className="feature-card-old">
              <div className="icon">🏪</div>
              <h3>Competition Mapping</h3>
              <p>Nearby Post Offices, convenience stores, and services that could impact your business.</p>
            </div>
            <div className="feature-card-old">
              <div className="icon">📈</div>
              <h3>Revenue Forecasting</h3>
              <p>Growth potential analysis based on local development plans and market trends.</p>
            </div>
            <div className="feature-card-old">
              <div className="icon">⚠️</div>
              <h3>Risk Assessment</h3>
              <p>Lease risks, regulatory changes, technology shifts, and operational vulnerabilities.</p>
            </div>
            <div className="feature-card-old">
              <div className="icon">🚪</div>
              <h3>Exit Strategy</h3>
              <p>Resale potential, asset valuation, and timeline considerations for your exit plan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Report Preview */}
      <section className="py-20 container mx-auto px-4" id="report-preview">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">See What You Get</h2>
          <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto">
            Every report is a comprehensive intelligence document. Here&apos;s a preview of what&apos;s inside.
          </p>
        </div>
        <div className="max-w-4xl mx-auto" style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '16px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, background: '#c9a227', color: '#0d1117', padding: '8px 24px', borderRadius: '0 0 0 16px', fontWeight: 700, fontSize: '0.8rem' }}>
            SAMPLE
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#c9a227' }}>Executive Summary</h3>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                <div className="flex justify-between mb-2">
                  <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>FCM Score</span>
                  <span className="font-mono font-bold" style={{ color: '#c9a227' }}>87/100</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>Confidence</span>
                  <span className="font-mono font-bold" style={{ color: '#22c55e' }}>HIGH</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>Recommendation</span>
                  <span className="font-mono font-bold" style={{ color: '#c9a227' }}>PURSUE</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#c9a227' }}>Financial Snapshot</h3>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '16px' }}>
                <div className="flex justify-between mb-2">
                  <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>Asking Price</span>
                  <span className="font-mono font-bold text-white">£195,000</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>Est. Annual Revenue</span>
                  <span className="font-mono font-bold text-white">£142,000</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>ROI (Year 1)</span>
                  <span className="font-mono font-bold" style={{ color: '#22c55e' }}>18.4%</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>Payback Period</span>
                  <span className="font-mono font-bold text-white">3.2 years</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p style={{ color: '#8b949e', fontSize: '0.9rem', marginBottom: '16px' }}>
              This is just the summary. Full reports include 15-25 pages of detailed analysis.
            </p>
            <Link href="/reports" className="btn-primary px-8 py-3">
              Get Your Full Report
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20" id="pricing" style={{ background: '#0d1117' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Choose Your Level of Insight</h2>
            <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto">
              From quick viability checks to full portfolio analysis. Pick the depth that matches your decision.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Quick Check */}
            <div className="pricing-card-old">
              <h3 className="text-lg font-bold mb-2">Quick Check</h3>
              <div className="price-display">£49</div>
              <div className="price-subtitle">Viability Snapshot</div>
              <ul>
                <li>Postcode check</li>
                <li>Basic competition scan</li>
                <li>Quick risk flags</li>
                <li>Delivered same day</li>
              </ul>
              <Link href="/contact" className="btn-primary w-full">Get Quick Check</Link>
            </div>
            {/* Standard - Most Popular */}
            <div className="pricing-card-old popular">
              <div className="popular-badge">Most Popular</div>
              <h3 className="text-lg font-bold mb-2">Standard Report</h3>
              <div className="price-display">£149</div>
              <div className="price-subtitle">Full Intelligence</div>
              <ul>
                <li>Everything in Quick Check</li>
                <li>Detailed financial analysis</li>
                <li>Location scoring</li>
                <li>Competition mapping</li>
                <li>Revenue forecasting</li>
                <li>Risk assessment</li>
                <li>Delivered in 48 hours</li>
              </ul>
              <Link href="/contact" className="btn-primary w-full">Get Standard Report</Link>
            </div>
            {/* Premium */}
            <div className="pricing-card-old">
              <h3 className="text-lg font-bold mb-2">Premium Report</h3>
              <div className="price-display">£349</div>
              <div className="price-subtitle">Deep Dive</div>
              <ul>
                <li>Everything in Standard</li>
                <li>On-site area assessment</li>
                <li>Customer survey data</li>
                <li>Comparable sales analysis</li>
                <li>Growth projection model</li>
                <li>Personal consultation call</li>
                <li>Delivered in 5-7 days</li>
              </ul>
              <Link href="/contact" className="btn-primary w-full">Get Premium Report</Link>
            </div>
            {/* Enterprise */}
            <div className="pricing-card-old">
              <h3 className="text-lg font-bold mb-2">Enterprise</h3>
              <div className="price-display">£599+</div>
              <div className="price-subtitle">Portfolio Analysis</div>
              <ul>
                <li>Everything in Premium</li>
                <li>Multi-branch analysis</li>
                <li>Portfolio strategy</li>
                <li>Negotiation support</li>
                <li>Ongoing advisory</li>
                <li>Custom reporting</li>
              </ul>
              <Link href="/contact" className="btn-primary w-full">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="old-quote">
          <blockquote>
            &ldquo;Every Post Office tells a story. The numbers reveal the plot, but experience reads between the lines. That&apos;s what we deliver — the insight that no spreadsheet can give you.&rdquo;
          </blockquote>
          <cite>— Mikesh Parekh, FCM Intelligence</cite>
        </div>
      </section>

      {/* Complete Acquisition Support */}
      <section className="py-20" style={{ background: '#161b22', borderTop: '1px solid #30363d', borderBottom: '1px solid #30363d' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Complete Acquisition Support</h2>
            <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto">
              Beyond reports — we support you through every step of the acquisition process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="feature-card-old">
              <div className="icon">🎯</div>
              <h3>Acquisition Strategy</h3>
              <p>Tailored strategy based on your budget, location preferences, and business goals.</p>
            </div>
            <div className="feature-card-old">
              <div className="icon">📊</div>
              <h3>Financial Analysis</h3>
              <p>Deep dive into the numbers — revenue, costs, margins, and cash flow projections.</p>
            </div>
            <div className="feature-card-old">
              <div className="icon">📍</div>
              <h3>Location Assessment</h3>
              <p>Comprehensive area analysis — demographics, footfall, competition, and development plans.</p>
            </div>
            <div className="feature-card-old">
              <div className="icon">⚠️</div>
              <h3>Risk Assessment</h3>
              <p>Identify and quantify every risk — lease terms, regulatory changes, and market threats.</p>
            </div>
            <div className="feature-card-old">
              <div className="icon">🤝</div>
              <h3>Negotiation Support</h3>
              <p>Expert guidance on offer strategy, price negotiation, and deal structuring.</p>
            </div>
            <div className="feature-card-old">
              <div className="icon">📞</div>
              <h3>Ongoing Support</h3>
              <p>Post-acquisition guidance on operations, growth, and portfolio expansion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 container mx-auto px-4" id="contact">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Buy Smarter?</h2>
          <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto">
            Tell us which listing interests you, and we&apos;ll deliver actionable intelligence within 48 hours.
          </p>
        </div>
        <div className="old-contact-form">
          <form action="https://formspree.io/f/xblgnqzj" method="POST">
            <div className="form-group">
              <label htmlFor="listing">Branch / Listing of Interest</label>
              <input type="text" id="listing" name="listing" placeholder="e.g., Keith Post Office, Barnsley Mains..." required />
            </div>
            <div className="form-group">
              <label htmlFor="report-type">Report Type</label>
              <select id="report-type" name="report-type">
                <option value="standard">Standard Report — £149</option>
                <option value="quick">Quick Check — £49</option>
                <option value="premium">Premium Report — £349</option>
                <option value="enterprise">Enterprise — £599+</option>
                <option value="consultation">Consultation Call</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" name="name" placeholder="Full name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="your@email.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone (optional)</label>
              <input type="tel" id="phone" name="phone" placeholder="07xxx xxxxxx" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={4} placeholder="Tell us about your requirements, timeline, and any specific questions..."></textarea>
            </div>
            <button type="submit" className="submit-btn">Get Your Report</button>
          </form>
          <div className="text-center mt-6">
            <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>
              Or call us directly: <strong className="text-white">020 XXXX XXXX</strong>
            </p>
            <p style={{ color: '#57606a', fontSize: '0.8rem', marginTop: '8px' }}>
              Average response time: 2 hours during business hours
            </p>
          </div>
        </div>
      </section>

      {/* FCM Insider Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.1) 0%, rgba(30, 58, 95, 0.2) 100%)', borderTop: '1px solid rgba(201,162,39,0.3)', borderBottom: '1px solid rgba(201,162,39,0.3)' }}>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1 rounded-full mb-6" style={{ background: 'rgba(201,162,39,0.2)', border: '1px solid rgba(201,162,39,0.4)', color: '#c9a227', fontSize: '0.85rem', fontWeight: 600 }}>
            ⭐ Exclusive Membership
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">FCM Insider</h2>
          <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto mb-10 text-lg">
            Get early access to premium listings, exclusive market intelligence, and priority consultation slots.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            <div style={{ background: 'rgba(22,27,34,0.8)', border: '1px solid #30363d', borderRadius: '12px', padding: '24px' }}>
              <div className="text-2xl mb-3">🔔</div>
              <h3 className="font-bold mb-2">Early Access</h3>
              <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>See listings 24-48 hours before they go public.</p>
            </div>
            <div style={{ background: 'rgba(22,27,34,0.8)', border: '1px solid #30363d', borderRadius: '12px', padding: '24px' }}>
              <div className="text-2xl mb-3">📊</div>
              <h3 className="font-bold mb-2">Market Intel</h3>
              <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>Weekly market analysis and trend reports.</p>
            </div>
            <div style={{ background: 'rgba(22,27,34,0.8)', border: '1px solid #30363d', borderRadius: '12px', padding: '24px' }}>
              <div className="text-2xl mb-3">📞</div>
              <h3 className="font-bold mb-2">Priority Access</h3>
              <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>Direct line to the team. Priority consultation slots.</p>
            </div>
          </div>
          <Link href="/insiders" className="btn-primary text-lg px-10 py-4">
            Become an Insider
          </Link>
        </div>
      </section>

      {/* Final Disclaimer */}
      <section className="py-8" style={{ background: 'rgba(22,27,34,0.3)' }}>
        <div className="container mx-auto px-4 text-center">
          <p style={{ color: '#57606a', fontSize: '0.8rem', lineHeight: 1.7 }}>
            FCM Intelligence provides market intelligence and analysis for informational purposes. This is not financial advice. Always conduct your own due diligence and seek professional advice before making any business acquisition decisions. © 2026 FCM Intelligence. All rights reserved.
          </p>
        </div>
      </section>
    </AppLayout>
  );
}
