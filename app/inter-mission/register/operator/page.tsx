"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function OperatorRegistration() {
  return <Suspense fallback={<div className="text-center py-16"><div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto" /></div>}><OperatorRegistrationContent /></Suspense>;
}

function OperatorRegistrationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    branchName: "",
    fadCode: "",
    locationPostcode: "",
    referredBy: searchParams.get("ref") || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/inter-mission/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userType: "operator" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <CheckCircle size={64} className="text-[#00FF88] mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Welcome to Inter-Mission!</h1>
        <p className="text-[#888888] mb-8">Your operator profile has been created. Start posting assignments to find help.</p>
        <Link href="/inter-mission/assignments/post" className="im-btn-primary px-8 py-3">
          Post Your First Assignment
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/inter-mission/register" className="text-[#888888] hover:text-[#00FF88] text-sm flex items-center gap-1 mb-8">
        <ArrowLeft size={16} /> Back to role selection
      </Link>

      <h1 className="text-2xl font-bold text-white mb-2" data-testid="text-operator-register-title">
        Register as an <span className="text-[#00FF88]">Operator</span>
      </h1>
      <p className="text-[#888888] mb-8">Find experienced managers and staff for your branch.</p>

      {error && <div className="bg-[#FF444420] border border-[#FF4444] rounded-lg p-4 mb-6 text-[#FF4444] text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-1">Full Name *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="Your full name" data-testid="input-name" />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Email *</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="your@email.com" data-testid="input-email" />
          </div>
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-1">Phone</label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="07XXX XXXXXX" data-testid="input-phone" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-1">Branch Name *</label>
            <input type="text" required value={form.branchName} onChange={(e) => setForm({ ...form, branchName: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="e.g. Bolton Crown" data-testid="input-branch" />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Branch FAD Code *</label>
            <input type="text" required value={form.fadCode} onChange={(e) => setForm({ ...form, fadCode: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="123456" data-testid="input-fad" />
          </div>
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-1">Branch Postcode *</label>
          <input type="text" required value={form.locationPostcode} onChange={(e) => setForm({ ...form, locationPostcode: e.target.value })} className="w-full bg-[#0A1A0F] border border-[#1A3A25] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:border-[#00FF88] focus:outline-none" placeholder="BL1 1AA" data-testid="input-postcode" />
        </div>

        <button type="submit" disabled={submitting} className="im-btn-primary w-full text-lg py-3" data-testid="button-submit">
          {submitting ? "Creating Profile..." : "Create Operator Profile"}
        </button>
      </form>
    </div>
  );
}
