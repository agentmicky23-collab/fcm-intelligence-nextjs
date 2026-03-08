/**
 * Listing Card Component (RICH VERSION)
 * Displays comprehensive business opportunity listing with all FCM intelligence
 */

import Link from 'next/link';
import type { Listing } from '@/types/listing';
import { ArrowRight, MapPin, ExternalLink, Star } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

// Region emoji mapping
const regionEmojis: Record<string, string> = {
  'Scotland': '🏴',
  'Yorkshire': '🌹',
  'North West': '🌊',
  'North East': '🏰',
  'East Anglia': '🌾',
  'East Midlands': '🏭',
  'West Midlands': '🏭',
  'Midlands': '🏭',
  'South West': '🌊',
  'South East': '🏛️',
  'London': '🏙️',
  'Wales': '🐉',
};

// Get region tag style
const getRegionTag = (region: string) => {
  const emoji = regionEmojis[region] || '📍';
  return { emoji, text: region.toUpperCase() };
};

// Determine if listing is FCM Pick
const isFCMPick = (listing: Listing): boolean => {
  return listing.confidence === 'HIGH' && listing.score >= 85;
};

export function ListingCard({ listing }: ListingCardProps) {
  const fcmPick = isFCMPick(listing);
  const region = getRegionTag(listing.region);

  // Format currency
  const formatPrice = (price: string | null) => {
    if (!price || price === '0') return null;
    return `£${parseInt(price).toLocaleString()}`;
  };

  // Format business type
  const formatType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const price = formatPrice(listing.askingPrice);
  const turnover = formatPrice(listing.yearlyTurnover);
  const weeklyTurnover = formatPrice(listing.weeklyTurnover);
  const fees = formatPrice(listing.annualFees);

  // Get verification date (using current date as placeholder - should come from data)
  const verifiedDate = "6 Mar 2026";

  return (
    <div className="bg-fcm-card border border-gray-800 rounded-lg overflow-hidden hover:border-fcm-gold transition-all duration-300 group">
      
      {/* Header with badges */}
      <div className="p-6 pb-4 border-b border-gray-800/50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-wrap gap-2">
            {/* FCM Pick Badge */}
            {fcmPick && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-gold/20 border border-gold/40 rounded-full text-gold text-xs font-bold">
                <Star size={12} fill="currentColor" />
                <span>FCM PICK</span>
              </div>
            )}
            
            {/* Region Tag */}
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-card/50 border border-gray-700 rounded-full text-gray-300 text-xs font-bold">
              <span>{region.emoji}</span>
              <span>{region.text}</span>
            </div>
          </div>

          {/* Confidence badge */}
          <div className={`text-xs font-mono px-2 py-1 rounded ${
            listing.confidence === 'HIGH' ? 'bg-green-500/20 text-green-400' :
            listing.confidence === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {listing.confidence}
          </div>
        </div>

        {/* Business Type */}
        <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">
          {formatType(listing.businessType)}
        </div>

        {/* Business Name */}
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
          {listing.businessName}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-300 text-sm mb-4">
          <MapPin size={14} className="mr-1 text-gold" />
          <span>{listing.location}</span>
        </div>

        {/* Price */}
        {price && (
          <div className="mb-2">
            <div className="text-gold font-mono text-3xl font-bold">
              {price}
            </div>
            <div className="text-gray-400 text-sm">
              {listing.askingPrice && parseInt(listing.askingPrice) > 300000 ? 'Premium Asset' : 'Asking Price'}
            </div>
          </div>
        )}
      </div>

      {/* Financial Metrics */}
      <div className="p-6 py-4 bg-black/30 border-b border-gray-800/50">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {fees && fees !== '£0' && (
            <div>
              <div className="text-gray-400 text-xs mb-1">PO Revenue</div>
              <div className="text-gold font-mono font-bold">{fees}</div>
            </div>
          )}
          {turnover && turnover !== '£0' && (
            <div>
              <div className="text-gray-400 text-xs mb-1">Turnover</div>
              <div className="text-gold font-mono font-bold">{turnover}</div>
            </div>
          )}
          {weeklyTurnover && weeklyTurnover !== '£0' && (
            <div>
              <div className="text-gray-400 text-xs mb-1">Weekly Sales</div>
              <div className="text-gold font-mono font-bold">{weeklyTurnover}</div>
            </div>
          )}
          {listing.sessionsPerMonth > 0 && (
            <div>
              <div className="text-gray-400 text-xs mb-1">Daily Sessions</div>
              <div className="text-gold font-mono font-bold">{Math.round(listing.sessionsPerMonth / 30)}</div>
            </div>
          )}
        </div>

        {/* Score */}
        <div className="mt-4 pt-3 border-t border-gray-800/50 flex items-center justify-between">
          <span className="text-gray-400 text-xs">FCM Score</span>
          <span className={`font-mono font-bold text-lg ${
            listing.score >= 85 ? 'text-gold' :
            listing.score >= 70 ? 'text-green-400' :
            'text-yellow-400'
          }`}>
            {listing.score}/100
          </span>
        </div>
      </div>

      {/* Expert Commentary */}
      <div className="p-6 py-4 border-b border-gray-800/50">
        <div className="text-gray-300 text-sm leading-relaxed">
          {listing.notes}
        </div>
      </div>

      {/* Source Attribution */}
      <div className="px-6 py-3 bg-black/20 border-b border-gray-800/50">
        <div className="text-xs text-gray-400">
          <span className="font-medium">Source:</span> {listing.source} • <span className="text-gray-500">Verified {verifiedDate}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-4 space-y-3">
        {/* Get Report CTA */}
        <Link 
          href="/reports"
          className="flex items-center justify-center gap-2 w-full py-3 bg-fcm-red hover:bg-red-600 text-white font-bold rounded-md transition-colors"
        >
          <span>Get Report £149</span>
        </Link>

        {/* View Original Listing */}
        {listing.sourceUrl && (
          <a 
            href={listing.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 bg-transparent border border-gray-700 hover:border-gold text-gray-300 hover:text-gold font-medium rounded-md transition-colors text-sm"
          >
            <span>View Listing</span>
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
