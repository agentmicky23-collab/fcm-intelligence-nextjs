/**
 * Opportunities Listing Page
 * Public-facing page showing all 35 business opportunities
 */

'use client';

import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ListingCard } from '@/components/listing-card';
import { ListingsFilter, type FilterState } from '@/components/listings-filter';
import { listings, getUniqueRegions, getUniqueBusinessTypes, filterListings } from '@/lib/listings-data';
import type { Listing } from '@/types/listing';

export default function OpportunitiesPage() {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    region: '',
    businessType: '',
    status: '',
    minPrice: '',
    maxPrice: '',
  });

  // Get unique values for filters
  const regions = useMemo(() => getUniqueRegions(), []);
  const businessTypes = useMemo(() => getUniqueBusinessTypes(), []);

  // Filter listings based on current filters
  const filteredListings = useMemo(() => {
    return filterListings({
      region: filters.region || undefined,
      businessType: filters.businessType || undefined,
      status: filters.status || undefined,
      minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
      searchQuery: filters.searchQuery || undefined,
    });
  }, [filters]);

  return (
    <AppLayout>

      {/* Hero section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-black to-gray-950">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Business Opportunities
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Explore {listings.length} curated franchise and business opportunities across the UK. 
              From Post Offices to convenience stores, find your next acquisition.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-fcm-card border border-gray-800 rounded-lg px-6 py-4">
                <div className="text-3xl font-bold text-fcm-gold font-mono">{listings.length}</div>
                <div className="text-sm text-gray-400">Active Listings</div>
              </div>
              <div className="bg-fcm-card border border-gray-800 rounded-lg px-6 py-4">
                <div className="text-3xl font-bold text-fcm-gold font-mono">{regions.length}</div>
                <div className="text-sm text-gray-400">Regions</div>
              </div>
              <div className="bg-fcm-card border border-gray-800 rounded-lg px-6 py-4">
                <div className="text-3xl font-bold text-fcm-gold font-mono">{businessTypes.length}</div>
                <div className="text-sm text-gray-400">Business Types</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          {/* Filters */}
          <ListingsFilter 
            regions={regions}
            businessTypes={businessTypes}
            onFilterChange={setFilters}
          />

          {/* Results count */}
          <div className="mb-6 text-gray-400">
            {filteredListings.length === listings.length ? (
              <p>Showing all {listings.length} opportunities</p>
            ) : (
              <p>Found {filteredListings.length} of {listings.length} opportunities</p>
            )}
          </div>

          {/* Listings grid */}
          {filteredListings.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No listings found</h3>
              <p className="text-gray-400">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

    </AppLayout>
  );
}
