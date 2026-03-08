/**
 * Reports Page
 * Due diligence reports and intelligence products
 */

import Link from 'next/link';
import { reports } from '@/lib/reports-data';

export const metadata = {
  title: 'Due Diligence Reports | FCM Intelligence',
  description: 'Professional business intelligence and location analysis reports for franchise buyers',
};

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-[var(--fcm-dark)] text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Due Diligence <span className="text-[var(--fcm-gold)]">Reports</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Professional intelligence and analysis before you commit. 
            From quick sanity checks to comprehensive acquisition reports.
          </p>
        </div>
      </section>

      {/* Reports Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>
      </section>

      {/* Why FCM Reports Section */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Why <span className="text-[var(--fcm-gold)]">FCM Intelligence</span> Reports?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-semibold text-lg mb-2">Operator Perspective</h3>
              <p className="text-sm text-gray-400">
                Written by operators running 40+ branches, not consultants who've never run one
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-semibold text-lg mb-2">Data-Driven Analysis</h3>
              <p className="text-sm text-gray-400">
                Real market comparables, location intelligence, and financial deep-dives
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-semibold text-lg mb-2">Fast Turnaround</h3>
              <p className="text-sm text-gray-400">
                Most reports delivered within 3-5 business days, not weeks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Not sure which report you need?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Get in touch and we'll recommend the right level of analysis for your situation
          </p>
          <Link 
            href="/contact"
            className="inline-block px-8 py-4 bg-[var(--fcm-gold)] text-[var(--fcm-dark)] font-semibold rounded-lg hover:bg-[var(--fcm-gold-hover)] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

function ReportCard({ report }: { report: any }) {
  return (
    <Link
      href={`/reports/${report.slug}`}
      className={`
        group block p-8 rounded-lg border transition-all
        ${report.mostPopular 
          ? 'bg-[var(--fcm-gold)]/5 border-[var(--fcm-gold)] ring-2 ring-[var(--fcm-gold)]/20' 
          : 'bg-[var(--fcm-card)] border-gray-800 hover:border-[var(--fcm-gold)]'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {report.mostPopular && (
            <div className="inline-block px-3 py-1 bg-[var(--fcm-gold)] text-[var(--fcm-dark)] text-xs font-bold uppercase rounded mb-3">
              Most Popular
            </div>
          )}
          <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--fcm-gold)] transition-colors">
            {report.title}
          </h3>
          <p className="text-sm text-gray-400">
            {report.description}
          </p>
        </div>
      </div>
      
      {/* Price */}
      <div className="mb-6 pb-6 border-b border-gray-700">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-4xl font-bold text-[var(--fcm-gold)]">
            £{report.price}
          </span>
          <span className="text-gray-500">one-time</span>
        </div>
        {report.bundleDiscount && (
          <div className="text-sm text-green-400 mt-2">
            ✓ {report.bundleDiscount}
          </div>
        )}
      </div>
      
      {/* Features */}
      <div className="space-y-3 mb-6">
        {report.features.map((feature: string, i: number) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="text-[var(--fcm-gold)] mt-1">✓</span>
            <span className="text-gray-300">{feature}</span>
          </div>
        ))}
      </div>
      
      {/* Metadata */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
        {report.pageCount && (
          <span>{report.pageCount} pages</span>
        )}
        {report.consultationIncluded && (
          <span>• {report.consultationMinutes} min consultation</span>
        )}
        <span>• {report.deliveryFormat}</span>
      </div>
      
      {/* Best For */}
      {report.bestFor && (
        <div className="p-4 bg-[var(--fcm-dark)] rounded-lg border border-gray-700">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Best For</div>
          <div className="text-sm text-gray-300">{report.bestFor}</div>
        </div>
      )}
      
      {/* CTA */}
      <div className="mt-6">
        <div className="text-[var(--fcm-gold)] font-semibold group-hover:underline">
          View Details →
        </div>
      </div>
    </Link>
  );
}
