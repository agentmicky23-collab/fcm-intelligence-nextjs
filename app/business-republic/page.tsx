/**
 * Business Republic Landing Page
 * Intelligence-first business acquisition platform
 */

import Link from 'next/link';
import { listings } from '@/lib/listings-data';
import { enhanceListingsWithValuation } from '@/lib/valuation-logic';
import { ValuationBadgeCompact } from '@/components/valuation-badge';

export const metadata = {
  title: 'Business Republic | FCM Intelligence',
  description: 'Intelligence-first business acquisition platform. From discovery to completion.',
};

export default function BusinessRepublicPage() {
  // Enhance listings with valuation data
  const enhancedListings = enhanceListingsWithValuation(listings);
  
  // Get top 5 highest-scored listings for featured section
  const featuredListings = enhancedListings
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  
  // Calculate market stats
  const totalListings = listings.length;
  const avgPrice = Math.round(
    listings
      .filter(l => l.askingPrice)
      .reduce((sum, l) => sum + parseInt(l.askingPrice!), 0) / 
    listings.filter(l => l.askingPrice).length
  );

  return (
    <div className="min-h-screen bg-[var(--fcm-dark)] text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--fcm-gold)]/10 border border-[var(--fcm-gold)]/30 mb-6">
            <span className="text-[var(--fcm-gold)] text-sm font-semibold">NEW</span>
            <span className="text-sm text-gray-300">Intelligence-First Acquisition Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Business <span className="text-[var(--fcm-gold)]">Republic</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            The buyer's command centre. Intelligence <span className="text-[var(--fcm-gold)]">before</span> broker contact, 
            not after it. From discovery to completion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/business-republic/listings"
              className="px-8 py-4 bg-[var(--fcm-gold)] text-[var(--fcm-dark)] font-semibold rounded-lg hover:bg-[var(--fcm-gold-hover)] transition-colors"
            >
              Explore Listings
            </Link>
            <Link 
              href="/business-republic/quiz"
              className="px-8 py-4 bg-transparent border-2 border-[var(--fcm-gold)] text-[var(--fcm-gold)] font-semibold rounded-lg hover:bg-[var(--fcm-gold)]/10 transition-colors"
            >
              What Business Is Right For Me?
            </Link>
          </div>
        </div>
      </section>

      {/* Market Snapshot */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Market Snapshot</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-[var(--fcm-card)] border border-gray-800 text-center">
              <div className="font-mono text-4xl font-bold text-[var(--fcm-gold)] mb-2">
                {totalListings}
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">
                Active Listings
              </div>
            </div>
            
            <div className="p-6 rounded-lg bg-[var(--fcm-card)] border border-gray-800 text-center">
              <div className="font-mono text-4xl font-bold text-[var(--fcm-gold)] mb-2">
                £{(avgPrice / 1000).toFixed(0)}k
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">
                Average Asking Price
              </div>
            </div>
            
            <div className="p-6 rounded-lg bg-[var(--fcm-card)] border border-gray-800 text-center">
              <div className="font-mono text-4xl font-bold text-[var(--fcm-gold)] mb-2">
                {featuredListings.filter(l => l.valuation?.valuationBadge === 'good_value').length}
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">
                Good Value Opportunities
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            How <span className="text-[var(--fcm-gold)]">Business Republic</span> Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--fcm-gold)]/20 border-2 border-[var(--fcm-gold)] flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[var(--fcm-gold)]">1</span>
              </div>
              <h3 className="font-semibold mb-2">Browse</h3>
              <p className="text-sm text-gray-400">
                Explore listings with valuation scores, traffic lights, and broker insights
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--fcm-gold)]/20 border-2 border-[var(--fcm-gold)] flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[var(--fcm-gold)]">2</span>
              </div>
              <h3 className="font-semibold mb-2">Compare</h3>
              <p className="text-sm text-gray-400">
                Side-by-side comparison tool with automated best-value highlighting
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--fcm-gold)]/20 border-2 border-[var(--fcm-gold)] flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[var(--fcm-gold)]">3</span>
              </div>
              <h3 className="font-semibold mb-2">Calculate</h3>
              <p className="text-sm text-gray-400">
                Offer calculator with data-backed recommendations and negotiation guidance
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--fcm-gold)]/20 border-2 border-[var(--fcm-gold)] flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[var(--fcm-gold)]">4</span>
              </div>
              <h3 className="font-semibold mb-2">Buy</h3>
              <p className="text-sm text-gray-400">
                Guided acquisition timeline with tools, templates, and expert support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Opportunities</h2>
            <Link 
              href="/business-republic/listings"
              className="text-[var(--fcm-gold)] hover:underline text-sm font-semibold"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.slice(0, 3).map(listing => (
              <Link
                key={listing.id}
                href={`/opportunities/${listing.id}`}
                className="group p-6 rounded-lg bg-[var(--fcm-card)] border border-gray-800 hover:border-[var(--fcm-gold)] transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-[var(--fcm-gold)] transition-colors mb-2">
                      {listing.businessName}
                    </h3>
                    <p className="text-sm text-gray-400">{listing.location}</p>
                  </div>
                  <div className="font-mono text-sm font-bold text-[var(--fcm-gold)]">
                    {listing.score}
                  </div>
                </div>
                
                {listing.valuation && (
                  <div className="mb-3">
                    <ValuationBadgeCompact 
                      badge={listing.valuation.valuationBadge}
                      priceVsMarket={listing.valuation.priceVsMarket}
                    />
                  </div>
                )}
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Asking Price</span>
                    <span className="font-mono text-white">
                      £{parseInt(listing.askingPrice || '0').toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Annual Fees</span>
                    <span className="font-mono text-white">
                      £{parseInt(listing.annualFees || '0').toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Intelligence <span className="text-[var(--fcm-gold)]">Tools</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/business-republic/compare"
              className="group p-8 rounded-lg bg-[var(--fcm-card)] border border-gray-800 hover:border-[var(--fcm-gold)] transition-colors"
            >
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--fcm-gold)] transition-colors">
                Comparison Tool
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Compare up to 5 listings side-by-side with automated best-value analysis
              </p>
              <div className="text-[var(--fcm-gold)] text-sm font-semibold">
                Launch Tool →
              </div>
            </Link>
            
            <Link
              href="/business-republic/calculator"
              className="group p-8 rounded-lg bg-[var(--fcm-card)] border border-gray-800 hover:border-[var(--fcm-gold)] transition-colors"
            >
              <div className="text-4xl mb-4">🧮</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--fcm-gold)] transition-colors">
                Offer Calculator
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Get data-backed offer recommendations with detailed reasoning
              </p>
              <div className="text-[var(--fcm-gold)] text-sm font-semibold">
                Calculate Offer →
              </div>
            </Link>
            
            <Link
              href="/business-republic/journey"
              className="group p-8 rounded-lg bg-[var(--fcm-card)] border border-gray-800 hover:border-[var(--fcm-gold)] transition-colors"
            >
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--fcm-gold)] transition-colors">
                Acquisition Timeline
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Step-by-step guidance from research to trading
              </p>
              <div className="text-[var(--fcm-gold)] text-sm font-semibold">
                View Journey →
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to find your <span className="text-[var(--fcm-gold)]">next business</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join FCM Insider for full access to all valuation tools, comparison features, and expert insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/insiders"
              className="px-8 py-4 bg-[var(--fcm-gold)] text-[var(--fcm-dark)] font-semibold rounded-lg hover:bg-[var(--fcm-gold-hover)] transition-colors"
            >
              Become an Insider — £15/mo
            </Link>
            <Link 
              href="/business-republic/listings"
              className="px-8 py-4 bg-transparent border-2 border-[var(--fcm-gold)] text-[var(--fcm-gold)] font-semibold rounded-lg hover:bg-[var(--fcm-gold)]/10 transition-colors"
            >
              Start Browsing (Free)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
