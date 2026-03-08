"use client";

import Link from "next/link";
import { Briefcase, Building2, User } from "lucide-react";

const roles = [
  {
    type: "manager",
    title: "Manager / Freelancer",
    subtitle: "I have expertise to offer",
    description: "Former area managers, experienced operators offering their expertise as freelance services to branches that need help.",
    icon: Briefcase,
    cta: "Register as Manager",
  },
  {
    type: "operator",
    title: "Branch Operator",
    subtitle: "I need help at my branch",
    description: "Sub-postmasters and branch operators looking for experienced managers, holiday cover, or specialist support.",
    icon: Building2,
    cta: "Register as Operator",
  },
  {
    type: "employee",
    title: "Job Seeker",
    subtitle: "I'm looking for work",
    description: "Staff looking for permanent or temporary work at Post Office branches. Show your skills and get discovered.",
    icon: User,
    cta: "Register as Employee",
  },
];

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="text-register-title">
          Join the <span className="text-[#00FF88]">Network</span>
        </h1>
        <p className="text-[#888888] text-lg">Choose how you want to participate. Registration takes under 2 minutes.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {roles.map((role) => (
          <Link
            key={role.type}
            href={`/inter-mission/register/${role.type}`}
            className="im-card group cursor-pointer flex flex-col items-center text-center"
            data-testid={`card-register-${role.type}`}
          >
            <div className="w-16 h-16 rounded-full bg-[#00FF8815] flex items-center justify-center mb-4 group-hover:bg-[#00FF8830] transition-colors">
              <role.icon size={32} className="text-[#00FF88]" />
            </div>
            <h2 className="text-white font-bold text-xl mb-1">{role.title}</h2>
            <p className="text-[#00FF88] text-sm mb-3">{role.subtitle}</p>
            <p className="text-[#888888] text-sm mb-6 flex-1">{role.description}</p>
            <span className="im-btn-primary w-full text-sm">{role.cta}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
