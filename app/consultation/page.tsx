"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";

interface ConsultationType {
  id: string;
  icon: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  bestValue?: boolean;
}

const quickSupport: ConsultationType[] = [
  {
    id: 'helpline-101',
    icon: '🆘',
    name: 'Helpline 101',
    price: '£101',
    duration: '20 minutes • One-time',
    description: 'Urgent help when you need it. Cash discrepancies, compliance issues, immediate guidance.',
    features: [
      '20-minute emergency call',
      'Cash & compliance guidance',
      'Quick problem resolution',
      'One-time fee, no commitment',
    ],
  },
  {
    id: 'discovery-call',
    icon: '💬',
    name: 'Discovery Call',
    price: '£150',
    duration: '1 hour',
    description: 'Initial consultation to assess your situation, answer questions, and explore options.',
    features: [
      '60-minute video call',
      'Situation assessment',
      'Q&A on any topic',
      'Recommendations & next steps',
    ],
  },
];

const premiumPackages: ConsultationType[] = [
  {
    id: 'strategic-session',
    icon: '🎯',
    name: 'Strategic Session',
    price: '£497',
    duration: '1 hour • Standalone',
    description: 'Quick validation, red flags check, go/no-go decision on a specific opportunity.',
    features: [
      '60-minute deep-dive video call',
      'Opportunity assessment & viability check',
      'Initial due diligence guidance',
      'Q&A on specific concerns',
      'Follow-up email summary with action points',
    ],
  },
  {
    id: 'acquisition-advisory',
    icon: '📊',
    name: 'Acquisition Advisory',
    price: '£1,997',
    duration: 'Premium Report + 3 Hours',
    description: 'Expert guidance through the entire acquisition process. Includes FCM Intelligence Premium Report.',
    features: [
      'FCM Intelligence Premium Report (£449 value)',
      '3× 60-minute consultation sessions',
      'Session 1: Pre-acquisition strategy',
      'Session 2: Due diligence review',
      'Session 3: Negotiation prep & closing',
      'Email/WhatsApp support between sessions',
      'Deal structure recommendations',
    ],
    bestValue: true,
  },
  {
    id: 'full-support',
    icon: '🏆',
    name: 'Full Acquisition Support',
    price: '£4,997',
    duration: 'Elite Package • 3 Months',
    description: 'Complete hand-holding for first-time buyers or complex acquisitions.',
    features: [
      'FCM Intelligence Elite Report included',
      '6× 60-minute consultation sessions',
      'Unlimited email/WhatsApp support',
      'On-site visit option (travel separate)',
      'Post-acquisition operations planning',
      '30-day post-acquisition check-in',
    ],
  },
  {
    id: 'retainer',
    icon: '🤝',
    name: 'Advisory Retainer',
    price: '£997',
    duration: '/month • 3-month minimum',
    description: 'Ongoing support for operators building portfolios or wanting continuous expert access.',
    features: [
      '2× 60-minute calls per month',
      'Unlimited email/WhatsApp support',
      'Portfolio strategy & expansion planning',
      'Operations troubleshooting',
      'Exclusive opportunities before public listing',
    ],
  },
];

function ConsultationCard({ item }: { item: ConsultationType }) {
  return (
    <div className="pricing-card-old" style={{ textAlign: 'left', position: 'relative' }}>
      {item.bestValue && (
        <div className="popular-badge">BEST VALUE</div>
      )}
      <div className="text-3xl mb-4">{item.icon}</div>
      <h3 className="text-xl font-bold mb-2">{item.name}</h3>
      <div className="font-mono text-3xl font-bold mb-1" style={{ color: '#c9a227' }}>{item.price}</div>
      <div style={{ color: '#8b949e', fontSize: '0.85rem', marginBottom: '16px' }}>{item.duration}</div>
      <p style={{ color: '#8b949e', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
        {item.description}
      </p>
      <ul>
        {item.features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <Link href="/contact" className="btn-primary w-full mt-4" style={{ display: 'flex', justifyContent: 'center' }}>
        Book Now
      </Link>
    </div>
  );
}

export default function ConsultationPage() {
  return (
    <AppLayout>
      {/* Hero */}
      <section className="pt-32 pb-16" style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #0d1117 100%)' }}>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-5 py-2 rounded-full mb-6" style={{ background: 'rgba(201, 162, 39, 0.15)', border: '1px solid #c9a227', color: '#c9a227', fontSize: '0.85rem', fontWeight: 600 }}>
            15+ Years Industry Experience
          </div>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4">
            Expert <span style={{ color: '#c9a227' }}>Consultation</span> Services
          </h1>
          <p className="text-xl" style={{ color: '#8b949e', maxWidth: '700px', margin: '0 auto' }}>
            Get personalized guidance from someone who&apos;s operated 40+ branches and built a national portfolio from the ground up.
          </p>
        </div>
      </section>

      {/* Quick Support */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-sm font-bold tracking-widest uppercase mb-6" style={{ color: '#c9a227' }}>Quick Support</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {quickSupport.map(item => (
            <ConsultationCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Premium Packages */}
      <section className="py-16" style={{ background: '#161b22', borderTop: '1px solid #30363d', borderBottom: '1px solid #30363d' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-sm font-bold tracking-widest uppercase mb-6" style={{ color: '#c9a227' }}>Premium Packages</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {premiumPackages.map(item => (
              <ConsultationCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20 container mx-auto px-4" id="book">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Book Your Session</h2>
          <p style={{ color: '#8b949e', maxWidth: '600px', margin: '0 auto' }}>
            Choose a service and we&apos;ll get back to you within 2 hours to confirm your booking.
          </p>
        </div>
        <div className="old-contact-form">
          <form action="https://formspree.io/f/xblgnqzj" method="POST">
            <input type="hidden" name="_subject" value="Consultation Booking Request" />
            <div className="form-group">
              <label htmlFor="service">Service Type</label>
              <select id="service" name="service" required>
                <option value="">Select a service...</option>
                <option value="helpline-101">Helpline 101 — £101</option>
                <option value="discovery-call">Discovery Call — £150</option>
                <option value="strategic-session">Strategic Session — £497</option>
                <option value="acquisition-advisory">Acquisition Advisory — £1,997</option>
                <option value="full-support">Full Acquisition Support — £4,997</option>
                <option value="retainer">Advisory Retainer — £997/month</option>
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
              <label htmlFor="phone">Phone</label>
              <input type="tel" id="phone" name="phone" placeholder="07xxx xxxxxx" required />
            </div>
            <div className="form-group">
              <label htmlFor="preferred-date">Preferred Date</label>
              <input type="date" id="preferred-date" name="preferred-date" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Tell us about your situation</label>
              <textarea id="message" name="message" rows={4} placeholder="What are you looking to achieve? Any specific branches or opportunities you're considering?"></textarea>
            </div>
            <button type="submit" className="submit-btn">Request Booking</button>
          </form>
          <div className="text-center mt-6">
            <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>
              Prefer a quick chat? Call us: <strong className="text-white">020 XXXX XXXX</strong>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20" style={{ background: '#161b22', borderTop: '1px solid #30363d' }}>
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: "What happens after I book?", a: "You'll receive a confirmation email within 2 hours with a video call link, preparation materials, and what to bring to the session." },
              { q: "Can I reschedule?", a: "Yes, you can reschedule up to 24 hours before your session at no extra charge." },
              { q: "What if I need more time?", a: "Sessions can be extended at a prorated rate. We'll never cut you off mid-conversation." },
              { q: "Do you offer refunds?", a: "If you're not satisfied with your consultation, we'll either schedule a follow-up at no charge or refund your payment in full." },
              { q: "What's the difference between a report and a consultation?", a: "Reports are detailed written documents with data and analysis. Consultations are live video calls where you can ask questions, get personalized advice, and work through decisions in real-time." },
            ].map((faq, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-question">{faq.q}</summary>
                <div className="faq-answer">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
