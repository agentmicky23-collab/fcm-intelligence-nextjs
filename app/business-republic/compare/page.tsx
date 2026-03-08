/**
 * Business Republic Comparison Tool
 * Side-by-side comparison of multiple listings
 */

'use client';

import { useState, useMemo } from 'react';
import { listings } from '@/lib/listings-data';
import { enhanceListingsWithValuation } from '@/lib/valuation-logic';
import { ValuationBadgeCompact } from '@/components/valuation-badge';
import { TrafficLightGrid } from '@/components/traffic-lights';
import type { ListingWithValuation } from '@/types/valuation';

const MAX_COMPARISONS_FREE = 2;
const MAX_COMPARISONS_INSIDER = 5;

export default function ComparisonToolPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isInsider] = useState(false); // TODO: Get from auth context
  
  const enhancedListings = useMemo(() => 
    enhanceListingsWithValuation(listings), 
    []
  );
  
  const maxComparisons = isInsider ? MAX_COMPARISONS_INSIDER : MAX_COMPARISONS_FREE;
  
  const selectedListings = useMemo(() => 
    enhancedListings.filter(l => selectedIds.includes(l.id)),
    [enhancedListings, selectedIds]
  );
  
  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else if (selectedIds.length < maxComparisons) {
      setSelectedIds([...selectedIds, id]);
    }
  };
  
  const clearAll = () => setSelectedIds([]);
  
  return (
    <div className="min-h-screen bg-[var(--fcm-dark)] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Comparison <span className="text-[var(--fcm-gold)]">Tool</span>
          </h1>
          <p className="text-gray-400">
            Compare up to {maxComparisons} listings side-by-side
            {!isInsider && ' (Upgrade to Insider for 5 comparisons)'}
          </p>
        </div>
      </div>
      
      {/* Selection Count */}
      <div className="border-b border-gray-800 py-4 px-4 bg-[var(--fcm-card)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-sm">
            <span className="font-semibold text-[var(--fcm-gold)]">{selectedIds.length}</span>
            <span className="text-gray-400"> of {maxComparisons} selected</span>
          </div>
          {selectedIds.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-red-400 hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {selectedIds.length === 0 ? (
            <SelectionView
              listings={enhancedListings}
              selectedIds={selectedIds}
              onToggle={toggleSelection}
              maxReached={selectedIds.length >= maxComparisons}
            />
          ) : selectedIds.length === 1 ? (
            <div>
              <div className="mb-6 p-4 bg-[var(--fcm-card)] border border-gray-800 rounded-lg">
                <p className="text-gray-400">
                  Select at least one more listing to compare
                </p>
              </div>
              <SelectionView
                listings={enhancedListings}
                selectedIds={selectedIds}
                onToggle={toggleSelection}
                maxReached={selectedIds.length >= maxComparisons}
              />
            </div>
          ) : (
            <div>
              <ComparisonView listings={selectedListings} />
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Add More Listings</h3>
                <SelectionView
                  listings={enhancedListings}
                  selectedIds={selectedIds}
                  onToggle={toggleSelection}
                  maxReached={selectedIds.length >= maxComparisons}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface SelectionViewProps {
  listings: ListingWithValuation[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  maxReached: boolean;
}

function SelectionView({ listings, selectedIds, onToggle, maxReached }: SelectionViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.slice(0, 12).map(listing => {
        const isSelected = selectedIds.includes(listing.id);
        const isDisabled = !isSelected && maxReached;
        
        return (
          <button
            key={listing.id}
            onClick={() => !isDisabled && onToggle(listing.id)}
            disabled={isDisabled}
            className={`
              text-left p-4 rounded-lg border transition-all
              ${isSelected 
                ? 'bg-[var(--fcm-gold)]/10 border-[var(--fcm-gold)]' 
                : 'bg-[var(--fcm-card)] border-gray-800 hover:border-gray-600'
              }
              ${isDisabled && 'opacity-50 cursor-not-allowed'}
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`
                w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1
                ${isSelected 
                  ? 'border-[var(--fcm-gold)] bg-[var(--fcm-gold)]' 
                  : 'border-gray-600'
                }
              `}>
                {isSelected && (
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1 truncate">{listing.businessName}</h4>
                <p className="text-xs text-gray-500 mb-2">{listing.location}</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--fcm-gold)]">
                    {listing.score}
                  </span>
                  <span className="font-mono text-xs text-gray-400">
                    £{(parseInt(listing.askingPrice || '0') / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ComparisonView({ listings }: { listings: ListingWithValuation[] }) {
  // Find best in each category
  const bestScore = Math.max(...listings.map(l => l.score));
  const lowestPrice = Math.min(...listings.map(l => parseInt(l.askingPrice || '999999999')));
  const highestFees = Math.max(...listings.map(l => parseInt(l.annualFees || '0')));
  
  const bestValue = listings.reduce((best, current) => {
    const bestRatio = parseInt(best.askingPrice || '999999999') / parseInt(best.annualFees || '1');
    const currentRatio = parseInt(current.askingPrice || '999999999') / parseInt(current.annualFees || '1');
    return currentRatio < bestRatio ? current : best;
  });
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left p-4 text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Metric
            </th>
            {listings.map(listing => (
              <th key={listing.id} className="p-4 text-left">
                <div className="font-semibold text-white mb-1">{listing.businessName}</div>
                <div className="text-xs text-gray-500">{listing.location}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <ComparisonRow
            label="FCM Score"
            values={listings.map(l => ({ value: l.score.toString(), isBest: l.score === bestScore }))}
          />
          <ComparisonRow
            label="Asking Price"
            values={listings.map(l => ({
              value: `£${parseInt(l.askingPrice || '0').toLocaleString()}`,
              isBest: parseInt(l.askingPrice || '999999999') === lowestPrice
            }))}
          />
          <ComparisonRow
            label="Annual Fees"
            values={listings.map(l => ({
              value: `£${parseInt(l.annualFees || '0').toLocaleString()}`,
              isBest: parseInt(l.annualFees || '0') === highestFees
            }))}
          />
          <ComparisonRow
            label="Price-to-Fee Ratio"
            values={listings.map(l => {
              const ratio = parseInt(l.askingPrice || '0') / parseInt(l.annualFees || '1');
              return {
                value: `${ratio.toFixed(2)}x`,
                isBest: l.id === bestValue.id
              };
            })}
          />
          <ComparisonRow
            label="Valuation Badge"
            values={listings.map(l => ({
              value: <ValuationBadgeCompact 
                badge={l.valuation?.valuationBadge || 'insufficient_data'}
                priceVsMarket={l.valuation?.priceVsMarket || null}
              />,
              isBest: false
            }))}
          />
          <tr className="border-t border-gray-800">
            <td className="p-4 text-sm font-semibold text-gray-400 uppercase">
              Health Indicators
            </td>
            {listings.map(listing => (
              <td key={listing.id} className="p-4">
                {listing.valuation && (
                  <TrafficLightGrid
                    revenueHealth={listing.valuation.revenueHealth}
                    locationStrength={listing.valuation.locationStrength}
                    riskLevel={listing.valuation.riskLevel}
                    compact
                  />
                )}
              </td>
            ))}
          </tr>
          <tr className="border-t border-gray-800 bg-[var(--fcm-gold)]/5">
            <td className="p-4 text-sm font-semibold text-[var(--fcm-gold)] uppercase">
              Best Overall Value
            </td>
            {listings.map(listing => (
              <td key={listing.id} className="p-4">
                {listing.id === bestValue.id && (
                  <span className="text-2xl">⭐</span>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

interface ComparisonRowProps {
  label: string;
  values: Array<{ value: React.ReactNode; isBest: boolean }>;
}

function ComparisonRow({ label, values }: ComparisonRowProps) {
  return (
    <tr className="border-t border-gray-800">
      <td className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wide">
        {label}
      </td>
      {values.map((item, i) => (
        <td key={i} className="p-4">
          <div className={`font-mono ${item.isBest ? 'text-[var(--fcm-gold)] font-bold' : 'text-white'}`}>
            {item.value}
            {item.isBest && <span className="ml-2">★</span>}
          </div>
        </td>
      ))}
    </tr>
  );
}
