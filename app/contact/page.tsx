"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useState } from "react";
import { Mail, Clock, CheckCircle } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    reportPackage: "",
  });

  const mutation = useMutation({
    mutationFn: (data: typeof form) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => setSubmitted(true),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (submitted) {
    return (
      <AppLayout>
        <div className="pt-32 pb-20 container mx-auto px-4 text-center">
          <CheckCircle className="mx-auto text-gold mb-6" size={64} />
          <h1 className="text-4xl font-bold mb-4">Message Sent</h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            Thank you for reaching out. We'll be in touch within 24 hours.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Get in <span className="text-gold">Touch</span>
            </h1>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Whether you're exploring acquisition support, need operational expertise, or want to discuss a bespoke intelligence package, we're here to help.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-card border border-border rounded-lg">
                  <Mail className="text-gold" size={20} />
                </div>
                <div>
                  <div className="font-semibold mb-1">Email Us</div>
                  <a href="mailto:mikesh@interimenterprises.co.uk" className="text-gold hover:underline text-sm">
                    mikesh@interimenterprises.co.uk
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-card border border-border rounded-lg">
                  <Clock className="text-gold" size={20} />
                </div>
                <div>
                  <div className="font-semibold mb-1">Response Time</div>
                  <p className="text-sm text-muted-foreground">Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-3 fcm-card space-y-5" data-testid="contact-form">
            <div>
              <label className="text-sm font-medium block mb-2">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                data-testid="input-name"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium block mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                  data-testid="input-email"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                  data-testid="input-phone"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Report Package</label>
              <select
                value={form.reportPackage}
                onChange={(e) => setForm({ ...form, reportPackage: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                data-testid="select-package"
              >
                <option value="">Select a package (optional)</option>
                <option value="acquisition_support">Acquisition Support</option>
                <option value="full_management">Full Office Management</option>
                <option value="audit_compliance">Audit & Compliance</option>
                <option value="intelligence_report">Intelligence Report</option>
                <option value="other">Other / General Enquiry</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors resize-none"
                data-testid="input-message"
              />
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary w-full text-base py-3"
              data-testid="button-submit"
            >
              {mutation.isPending ? "Sending..." : "Send Message"}
            </button>
            {mutation.isError && (
              <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
