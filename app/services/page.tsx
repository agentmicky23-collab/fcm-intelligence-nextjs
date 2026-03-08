"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { 
  FileCheck, GraduationCap, Store, Users, 
  Palmtree, ClipboardCheck, Building2, ShieldCheck, 
  Briefcase, ArrowRightLeft 
} from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <FileCheck size={28} />,
      title: "Application Support",
      description: "Expert guidance through complex Post Office and retail franchise application processes."
    },
    {
      icon: <GraduationCap size={28} />,
      title: "Training",
      description: "Comprehensive staff training programs focusing on compliance, sales, and service excellence."
    },
    {
      icon: <Store size={28} />,
      title: "Retail Support",
      description: "Store layout optimization, merchandising strategies, and operational efficiency improvements."
    },
    {
      icon: <Users size={28} />,
      title: "Recruitment",
      description: "Sourcing and vetting high-quality management and frontline staff for your branches."
    },
    {
      icon: <Palmtree size={28} />,
      title: "Holiday Cover",
      description: "Reliable, fully-trained locum management to keep your business running smoothly in your absence."
    },
    {
      icon: <ClipboardCheck size={28} />,
      title: "Auditing",
      description: "Rigorous internal audits to ensure complete compliance and identify financial discrepancies."
    },
    {
      icon: <Building2 size={28} />,
      title: "Full Office Management",
      description: "End-to-end management solutions for hands-off investors and multi-site operators."
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Insurance",
      description: "Tailored insurance solutions protecting your specialized retail assets and liabilities."
    },
    {
      icon: <Briefcase size={28} />,
      title: "Business Support",
      description: "Strategic planning, financial forecasting, and high-level advisory for growth."
    },
    {
      icon: <ArrowRightLeft size={28} />,
      title: "Buying & Selling",
      description: "Confidential brokering, valuation, and transition support for retail acquisitions and exits."
    }
  ];

  return (
    <AppLayout>
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Premium <span className="text-gold">Services</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Leverage our 17+ years of operational excellence. We provide comprehensive support across the entire lifecycle of retail ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="fcm-card flex flex-col items-start group">
              <div className="h-14 w-14 rounded-lg bg-card border border-border flex items-center justify-center mb-6 text-gold group-hover:bg-gold/10 transition-colors shadow-sm">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gold transition-colors">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
