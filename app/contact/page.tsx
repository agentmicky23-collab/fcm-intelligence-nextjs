"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";

export default function ContactPage() {
  return (
    <AppLayout>
      {/* Hero */}
      <section className="pt-32 pb-12" style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #0d1117 100%)' }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4">
            Ready to Buy <span style={{ color: '#c9a227' }}>Smarter</span>?
          </h1>
          <p className="text-xl" style={{ color: '#8b949e', maxWidth: '600px', margin: '0 auto' }}>
            Tell us which listing interests you, and we&apos;ll deliver actionable intelligence within 48 hours.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 container mx-auto px-4">
        <div className="old-contact-form">
          <form action="https://formspree.io/f/xblgnqzj" method="POST">
            <div className="form-group">
              <label htmlFor="listing">Branch / Listing of Interest</label>
              <input type="text" id="listing" name="listing" placeholder="e.g., Keith Post Office, Barnsley Mains..." required />
            </div>
            <div className="form-group">
              <label htmlFor="report-type">Report Type</label>
              <select id="report-type" name="report-type">
                <option value="premium">Premium Report — £449</option>
                <option value="professional">Professional Report — £249</option>
                <option value="basic">Basic Report — £149</option>
                <option value="location">Location Intelligence — £99</option>
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

      {/* Alternative Contact Methods */}
      <section className="py-16" style={{ background: '#161b22', borderTop: '1px solid #30363d' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
            <div className="feature-card-old">
              <div className="icon">📞</div>
              <h3>Call Us</h3>
              <p>Speak directly with our team during business hours (Mon-Fri, 9am-6pm).</p>
            </div>
            <div className="feature-card-old">
              <div className="icon">💬</div>
              <h3>Discord Community</h3>
              <p>Join our community for real-time discussions and networking.</p>
              <a href="https://discord.gg/52MsbGBhyr" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm font-semibold" style={{ color: '#c9a227' }}>
                Join Discord →
              </a>
            </div>
            <div className="feature-card-old">
              <div className="icon">📧</div>
              <h3>Email</h3>
              <p>Send us a detailed inquiry and we&apos;ll respond within 2 business hours.</p>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
