/**
 * Listing Card Component
 * Displays a single business opportunity listing with FCM brand styling
 */

import Link from 'next/link';
import type { Listing } from '@/types/listing';
import { ArrowRight, MapPin } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  // Format currency
  const formatPrice = (price: string | null) => {
    if (!price || price === '0') return null;
    return `£${parseInt(price).toLocaleString()}`;
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-fcm-red text-white',
      available: 'bg-fcm-red text-white',
      watch: 'bg-yellow-500 text-black',
      pursue: 'bg-fcm-gold text-black',
      closed: 'bg-gray-500 text-white',
      'under offer': 'bg-orange-500 text-white',
    };
    return styles[status.toLowerCase()] || 'bg-gray-600 text-white';
  };

  // Format business type
  const formatType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const price = formatPrice(listing.askingPrice);
  const turnover = formatPrice(listing.yearlyTurnover);
  const fees = formatPrice(listing.annualFees);

  return (
    <div className="bg-fcm-card border border-gray-800 rounded-lg overflow-hidden hover:border-fcm-gold transition-all duration-300 group">
      {/* Image or placeholder */}
      <div className="h-48 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all" />
        <div className="relative z-10 text-center">
          <div className="text-fcm-gold text-4xl font-bold mb-2">{formatType(listing.businessType)}</div>
          <div className="text-white/60 text-sm">{listing.region}</div>
        </div>
        {/* Status badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold uppercase rounded ${getStatusBadge(listing.status)}`}>
          {listing.status}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 min-h-[3.5rem]">
          {listing.businessName}
        </h3>

        <div className="flex items-center text-gray-400 text-sm mb-4">
          <MapPin size={14} className="mr-1" />
          <span className="line-clamp-1">{listing.location}</span>
        </div>

        {/* Price */}
        {price && (
          <div className="mb-4">
            <div className="text-fcm-gold font-mono text-2xl font-bold">
              {price}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-800 my-4" />

        {/* Key metrics */}
        <div className="space-y-2 mb-4">
          {turnover && turnover !== '£0' && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Turnover:</span>
              <span className="text-fcm-gold font-mono font-medium">{turnover}</span>
            </div>
          )}
          {fees && fees !== '£0' && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Annual Fees:</span>
              <span className="text-fcm-gold font-mono font-medium">{fees}</span>
            </div>
          )}
          {listing.score && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Score:</span>
              <span className="text-fcm-gold font-mono font-bold text-lg">{listing.score}/100</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-4" />

        {/* View details button */}
        <Link 
          href={`/opportunities/${listing.id}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-fcm-gold text-black font-semibold rounded-md hover:bg-fcm-gold-hover transition-colors group/btn"
        >
          <span>View Details</span>
          <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
