"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";

export default function ReportsPage() {
  return (
    <AppLayout>
      {/* Hero */}
      <section className="pt-32 pb-12" style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #0d1117 100%)' }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4">
            Intelligence <span style={{ color: '#c9a227' }}>Reports</span>
          </h1>
          <p className="text-xl" style={{ color: '#8b949e' }}>
            Data-driven insight for every stage of your acquisition journey.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
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

      {/* What's Included */}
      <section className="py-20" style={{ background: '#161b22', borderTop: '1px solid #30363d', borderBottom: '1px solid #30363d' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What&apos;s Included</h2>
            <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto">
              Every report covers these core areas of intelligence.
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

      {/* Sample Report */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">See What You Get</h2>
        </div>
        <div className="max-w-4xl mx-auto" style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '16px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, background: '#c9a227', color: '#0d1117', padding: '8px 24px', borderRadius: '0 0 0 16px', fontWeight: 700, fontSize: '0.8rem' }}>
            SAMPLE
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#c9a227' }}>Executive Summary</h3>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '16px' }}>
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
              Full reports include 15-25 pages of detailed analysis.
            </p>
            <Link href="/contact" className="btn-primary px-8 py-3">Get Your Full Report</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center" style={{ background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.1) 0%, rgba(30, 58, 95, 0.2) 100%)', borderTop: '1px solid rgba(201,162,39,0.3)' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p style={{ color: '#8b949e' }} className="mb-8 max-w-xl mx-auto">
            Tell us which listing interests you, and we&apos;ll deliver actionable intelligence within 48 hours.
          </p>
          <Link href="/contact" className="btn-primary text-lg px-10 py-4">
            Order Your Report
          </Link>
        </div>
      </section>
    </AppLayout>
  );
}
