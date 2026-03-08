"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Phone, Mail, Calendar, ArrowRight } from "lucide-react";

export default function ConsultationPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessInterest: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with actual form submission backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/5 via-background to-background -z-10" />
        
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-gold/30 text-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-gold animate-pulse"></span>
            <span className="text-gold font-medium">15+ Years Industry Experience</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
            Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-[#fff0a8]">Consultation</span> Services
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Get personalized guidance from someone who's operated 40+ branches and built a national portfolio from the ground up.
          </p>

          {/* Phone Number - Prominent Display */}
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-gold/10 border border-gold/30 rounded-lg mb-8">
            <Phone className="text-gold" size={24} />
            <div className="text-left">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Call Direct</div>
              <a href="tel:+447886152939" className="text-2xl font-bold text-gold hover:text-[#fff0a8] transition-colors font-mono">
                +44 7886 152939
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Consult Section */}
      <section className="py-16 bg-card/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Get Expert Guidance?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="font-bold text-lg mb-2">40+ Branches</h3>
                <p className="text-sm text-muted-foreground">
                  Real operational experience across the UK
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="text-4xl mb-3">💼</div>
                <h3 className="font-bold text-lg mb-2">£1M+ Invested</h3>
                <p className="text-sm text-muted-foreground">
                  Built from scratch to national scale
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold text-lg mb-2">Data-Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Intelligence-led acquisition strategy
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Book Your Consultation</h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="fcm-card p-8 space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-white">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-white"
                    placeholder="John Smith"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-white">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-white"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2 text-white">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-white"
                    placeholder="+44 7886 152939"
                  />
                </div>

                {/* Business Interest */}
                <div>
                  <label htmlFor="businessInterest" className="block text-sm font-medium mb-2 text-white">
                    What are you interested in? *
                  </label>
                  <select
                    id="businessInterest"
                    name="businessInterest"
                    required
                    value={formData.businessInterest}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-white"
                  >
                    <option value="">Select an option</option>
                    <option value="post_office_acquisition">Post Office Acquisition</option>
                    <option value="convenience_store">Convenience Store</option>
                    <option value="forecourt">Forecourt / Petrol Station</option>
                    <option value="due_diligence">Due Diligence Report</option>
                    <option value="operator_training">Operator Training</option>
                    <option value="advisory_services">Advisory Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-white">
                    Tell us more about your requirements *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-white resize-none"
                    placeholder="What specific guidance are you looking for?"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2"
                >
                  <span>Submit Consultation Request</span>
                  <ArrowRight size={20} />
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to be contacted by FCM Intelligence regarding your inquiry.
                </p>
              </form>
            ) : (
              <div className="fcm-card p-12 text-center">
                <div className="text-6xl mb-6">✅</div>
                <h3 className="text-2xl font-bold mb-4 text-gold">Request Submitted!</h3>
                <p className="text-muted-foreground mb-6">
                  Thank you for your interest. We'll review your request and get back to you within 24 hours.
                </p>
                <p className="text-sm text-muted-foreground">
                  Need to speak urgently? Call us directly at{" "}
                  <a href="tel:+447886152939" className="text-gold hover:underline font-mono">
                    +44 7886 152939
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-card/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Other Ways to Reach Us</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 fcm-card">
                <Phone className="text-gold mx-auto mb-4" size={32} />
                <h3 className="font-bold mb-2">Phone</h3>
                <a href="tel:+447886152939" className="text-gold hover:underline font-mono text-sm">
                  +44 7886 152939
                </a>
              </div>
              
              <div className="text-center p-6 fcm-card">
                <Mail className="text-gold mx-auto mb-4" size={32} />
                <h3 className="font-bold mb-2">Email</h3>
                <a href="mailto:contact@fcmgt.co.uk" className="text-gold hover:underline text-sm">
                  contact@fcmgt.co.uk
                </a>
              </div>
              
              <div className="text-center p-6 fcm-card">
                <Calendar className="text-gold mx-auto mb-4" size={32} />
                <h3 className="font-bold mb-2">Response Time</h3>
                <p className="text-sm text-muted-foreground">
                  Within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Return Home CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <a href="/" className="btn-secondary inline-flex items-center gap-2">
            ← Return to Home
          </a>
        </div>
      </section>
    </AppLayout>
  );
}
