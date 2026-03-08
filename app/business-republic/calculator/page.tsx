/**
 * Business Republic Offer Calculator
 * Data-backed offer recommendations (Insider Only)
 */

'use client';

import { useState, useMemo } from 'react';
import { listings } from '@/lib/listings-data';
import { enhanceListingsWithValuation, calculateOffer } from '@/lib/valuation-logic';
import type { ListingWithValuation } from '@/types/valuation';
import Link from 'next/link';

export default function OfferCalculatorPage() {
  const [isInsider] = useState(false); // TODO: Get from auth context
  const [selectedListingId, setSelectedListingId] = useState<string>('');
  
  const enhancedListings = useMemo(() => 
    enhanceListingsWithValuation(listings), 
    []
  );
  
  const selectedListing = enhancedListings.find(l => l.id === selectedListingId);
  const calculation = selectedListing ? calculateOffer(selectedListing) : null;
  
  // Non-Insider Gate
  if (!isInsider) {
    return (
      <div className="min-h-screen bg-[var(--fcm-dark)] text-white flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-4xl font-bold mb-4">
            Offer Calculator — <span className="text-[var(--fcm-gold)]">Insider Only</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Get data-backed offer recommendations with detailed reasoning, comparable sales analysis, 
            and negotiation guidance.
          </p>
          <div className="p-6 bg-[var(--fcm-card)] border border-gray-800 rounded-lg mb-8">
            <h3 className="font-semibold text-lg mb-3">What You Get:</h3>
            <ul className="text-left text-gray-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[var(--fcm-gold)] mt-1">✓</span>
                <span>Recommended offer range (low / mid / high)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--fcm-gold)] mt-1">✓</span>
                <span>Detailed reasoning for each price point</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--fcm-gold)] mt-1">✓</span>
                <span>Comparable sales data supporting the valuation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--fcm-gold)] mt-1">✓</span>
                <span>Risk factors that should push the price down</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--fcm-gold)] mt-1">✓</span>
                <span>Value factors that justify a higher price</span>
              </li>
            </ul>
          </div>
          <Link 
            href="/insiders"
            className="inline-block px-8 py-4 bg-[var(--fcm-gold)] text-[var(--fcm-dark)] font-semibold rounded-lg hover:bg-[var(--fcm-gold-hover)] transition-colors"
          >
            Become an Insider — £15/mo
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[var(--fcm-dark)] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Offer <span className="text-[var(--fcm-gold)]">Calculator</span>
          </h1>
          <p className="text-gray-400">
            Data-backed offer recommendations with detailed reasoning
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Listing Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Select Listing
            </label>
            <select
              value={selectedListingId}
              onChange={(e) => setSelectedListingId(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--fcm-card)] border border-gray-700 rounded-lg focus:outline-none focus:border-[var(--fcm-gold)] text-white"
            >
              <option value="">Choose a listing...</option>
              {enhancedListings.map(listing => (
                <option key={listing.id} value={listing.id}>
                  {listing.businessName} — £{parseInt(listing.askingPrice || '0').toLocaleString()} — Score {listing.score}
                </option>
              ))}
            </select>
          </div>
          
          {/* Calculation Results */}
          {calculation && selectedListing && (
            <div className="space-y-6">
              {/* Offer Range */}
              <div className="p-8 bg-[var(--fcm-card)] border border-gray-800 rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Recommended Offer Range</h2>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-[var(--fcm-dark)] rounded-lg border border-gray-700">
                    <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Low</div>
                    <div className="font-mono text-2xl font-bold text-white">
                      £{calculation.lowOffer.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Conservative</div>
                  </div>
                  
                  <div className="text-center p-4 bg-[var(--fcm-gold)]/10 rounded-lg border-2 border-[var(--fcm-gold)]">
                    <div className="text-sm text-[var(--fcm-gold)] uppercase tracking-wide mb-2">Recommended</div>
                    <div className="font-mono text-3xl font-bold text-[var(--fcm-gold)]">
                      £{calculation.recommendedOffer.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Best starting point</div>
                  </div>
                  
                  <div className="text-center p-4 bg-[var(--fcm-dark)] rounded-lg border border-gray-700">
                    <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">High</div>
                    <div className="font-mono text-2xl font-bold text-white">
                      £{calculation.highOffer.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Maximum</div>
                  </div>
                </div>
                
                {/* Asking Price Comparison */}
                <div className="text-center text-sm text-gray-400">
                  Asking price: <span className="font-mono text-white">£{parseInt(selectedListing.askingPrice || '0').toLocaleString()}</span>
                  {' • '}
                  Difference: <span className={`font-mono font-semibold ${
                    calculation.recommendedOffer < parseInt(selectedListing.askingPrice || '0') 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {calculation.recommendedOffer < parseInt(selectedListing.askingPrice || '0') ? '-' : '+'}
                    £{Math.abs(calculation.recommendedOffer - parseInt(selectedListing.askingPrice || '0')).toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* Valuation Reasoning */}
              <div className="p-6 bg-[var(--fcm-card)] border border-gray-800 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Valuation Methodology</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Base Valuation (2x annual fees):</span>
                      <span className="font-mono font-semibold text-white">
                        £{calculation.reasoning.baseValuation.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {calculation.reasoning.adjustments.length > 0 && (
                    <div className="border-t border-gray-700 pt-4">
                      <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                        Adjustments
                      </div>
                      {calculation.reasoning.adjustments.map((adj, i) => (
                        <div key={i} className="flex items-start gap-3 mb-3 p-3 bg-[var(--fcm-dark)] rounded">
                          <span className={`font-bold text-lg ${
                            adj.impact > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {adj.impact > 0 ? '+' : ''}{adj.impact}%
                          </span>
                          <div className="flex-1">
                            <div className="font-semibold text-white mb-1">{adj.factor}</div>
                            <div className="text-sm text-gray-400">{adj.reason}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Value Factors */}
              {calculation.valueFactors.length > 0 && (
                <div className="p-6 bg-green-900/10 border border-green-700 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-green-400">
                    ↑ Value Factors (Support Higher Price)
                  </h3>
                  <ul className="space-y-2">
                    {calculation.valueFactors.map((factor, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Risk Factors */}
              {calculation.riskFactors.length > 0 && (
                <div className="p-6 bg-red-900/10 border border-red-700 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-red-400">
                    ↓ Risk Factors (Justify Lower Offer)
                  </h3>
                  <ul className="space-y-2">
                    {calculation.riskFactors.map((factor, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <span className="text-red-400 mt-1">!</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Comparables */}
              <div className="p-6 bg-[var(--fcm-card)] border border-gray-800 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Comparable Sales</h3>
                <div className="text-sm text-gray-400 mb-4">
                  Based on {calculation.comparables.length} similar businesses in {selectedListing.region}
                </div>
                
                <div className="space-y-3">
                  {calculation.comparables.map(comp => (
                    <div key={comp.id} className="p-4 bg-[var(--fcm-dark)] rounded border border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-white">{comp.businessType.replace('_', ' ')}</div>
                          <div className="text-xs text-gray-500">{comp.region} • {comp.source}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          comp.status === 'sold' 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {comp.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Asking: </span>
                          <span className="font-mono text-white">£{comp.askingPrice.toLocaleString()}</span>
                        </div>
                        {comp.soldPrice && (
                          <div>
                            <span className="text-gray-500">Sold: </span>
                            <span className="font-mono text-[var(--fcm-gold)]">£{comp.soldPrice.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* CTAs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/reports"
                  className="block p-6 bg-[var(--fcm-card)] border border-gray-800 rounded-lg hover:border-[var(--fcm-gold)] transition-colors text-center"
                >
                  <h4 className="font-semibold text-lg mb-2">Get Full Professional Report</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Comprehensive due diligence analysis
                  </p>
                  <span className="text-[var(--fcm-gold)] font-semibold">
                    From £149 →
                  </span>
                </Link>
                
                <Link
                  href="/contact"
                  className="block p-6 bg-[var(--fcm-card)] border border-gray-800 rounded-lg hover:border-[var(--fcm-gold)] transition-colors text-center"
                >
                  <h4 className="font-semibold text-lg mb-2">Start Guided Acquisition</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Expert support from offer to completion
                  </p>
                  <span className="text-[var(--fcm-gold)] font-semibold">
                    Contact Us →
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
