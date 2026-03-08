/**
 * Business Republic Listings Page
 * Enhanced listings with valuation data, badges, and traffic lights
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { listings, getUniqueRegions, getUniqueBusinessTypes } from '@/lib/listings-data';
import { enhanceListingsWithValuation } from '@/lib/valuation-logic';
import { ValuationBadgeCompact } from '@/components/valuation-badge';
import { TrafficLightGrid } from '@/components/traffic-lights';
import type { ListingWithValuation } from '@/types/valuation';

export default function BusinessRepublicListingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedValuation, setSelectedValuation] = useState<string>('');
  
  // Enhance all listings with valuation data
  const enhancedListings = useMemo(() => 
    enhanceListingsWithValuation(listings), 
    []
  );
  
  // Get filter options
  const regions = useMemo(() => getUniqueRegions(), []);
  const businessTypes = useMemo(() => getUniqueBusinessTypes(), []);
  
  // Filter listings
  const filteredListings = useMemo(() => {
    return enhancedListings.filter(listing => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches = 
          listing.businessName.toLowerCase().includes(query) ||
          listing.location.toLowerCase().includes(query) ||
          listing.notes.toLowerCase().includes(query);
        if (!matches) return false;
      }
      
      // Region filter
      if (selectedRegion && listing.region !== selectedRegion) {
        return false;
      }
      
      // Business type filter
      if (selectedType && listing.businessType !== selectedType) {
        return false;
      }
      
      // Valuation filter
      if (selectedValuation && listing.valuation) {
        if (selectedValuation === 'good_value' && listing.valuation.valuationBadge !== 'good_value') {
          return false;
        }
        if (selectedValuation === 'fair_price' && listing.valuation.valuationBadge !== 'fair_price') {
          return false;
        }
      }
      
      return true;
    });
  }, [enhancedListings, searchQuery, selectedRegion, selectedType, selectedValuation]);
  
  return (
    <div className="min-h-screen bg-[var(--fcm-dark)] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Business <span className="text-[var(--fcm-gold)]">Listings</span>
          </h1>
          <p className="text-gray-400">
            {filteredListings.length} opportunities with intelligence-first analysis
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="border-b border-gray-800 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 bg-[var(--fcm-card)] border border-gray-700 rounded-lg focus:outline-none focus:border-[var(--fcm-gold)] text-white placeholder-gray-500"
            />
            
            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 bg-[var(--fcm-card)] border border-gray-700 rounded-lg focus:outline-none focus:border-[var(--fcm-gold)] text-white"
            >
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            
            {/* Business Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-[var(--fcm-card)] border border-gray-700 rounded-lg focus:outline-none focus:border-[var(--fcm-gold)] text-white"
            >
              <option value="">All Types</option>
              {businessTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            
            {/* Valuation Filter */}
            <select
              value={selectedValuation}
              onChange={(e) => setSelectedValuation(e.target.value)}
              className="px-4 py-2 bg-[var(--fcm-card)] border border-gray-700 rounded-lg focus:outline-none focus:border-[var(--fcm-gold)] text-white"
            >
              <option value="">All Valuations</option>
              <option value="good_value">Good Value Only</option>
              <option value="fair_price">Fair Price Only</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Listings Grid */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          
          {filteredListings.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-4">No listings match your filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('');
                  setSelectedType('');
                  setSelectedValuation('');
                }}
                className="text-[var(--fcm-gold)] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ListingCard({ listing }: { listing: ListingWithValuation }) {
  const valuation = listing.valuation;
  
  return (
    <Link
      href={`/opportunities/${listing.id}`}
      className="group block p-6 rounded-lg bg-[var(--fcm-card)] border border-gray-800 hover:border-[var(--fcm-gold)] transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white group-hover:text-[var(--fcm-gold)] transition-colors mb-2">
            {listing.businessName}
          </h3>
          <p className="text-sm text-gray-400">{listing.location}</p>
          <p className="text-xs text-gray-500 mt-1">{listing.region}</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl font-bold text-[var(--fcm-gold)]">
            {listing.score}
          </div>
          <div className="text-xs text-gray-500 uppercase">FCM Score</div>
        </div>
      </div>
      
      {/* Valuation Badge */}
      {valuation && (
        <div className="mb-4">
          <ValuationBadgeCompact 
            badge={valuation.valuationBadge}
            priceVsMarket={valuation.priceVsMarket}
          />
        </div>
      )}
      
      {/* Financial Data */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-800">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Asking Price
          </div>
          <div className="font-mono text-lg font-bold text-white">
            £{parseInt(listing.askingPrice || '0').toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Annual Fees
          </div>
          <div className="font-mono text-lg font-bold text-white">
            £{parseInt(listing.annualFees || '0').toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Traffic Lights */}
      {valuation && (
        <div className="mb-4">
          <TrafficLightGrid
            revenueHealth={valuation.revenueHealth}
            locationStrength={valuation.locationStrength}
            riskLevel={valuation.riskLevel}
            compact
          />
        </div>
      )}
      
      {/* Broker Insights Preview */}
      {valuation && valuation.brokerInsights.length > 0 && (
        <div className="pt-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            Broker Insights
          </div>
          <p className="text-sm text-gray-400 line-clamp-2">
            {valuation.brokerInsights[0].description}
          </p>
          <div className="text-xs text-[var(--fcm-gold)] mt-2">
            View {valuation.brokerInsights.length} insight{valuation.brokerInsights.length > 1 ? 's' : ''} →
          </div>
        </div>
      )}
    </Link>
  );
}
