/**
 * Listing Types
 * TypeScript interfaces for business opportunity listings
 */

export interface Listing {
  id: string;
  businessName: string;
  businessType: 'post_office' | 'convenience_store' | 'forecourt' | 'newsagent';
  location: string;
  region: string;
  askingPrice: string | null;
  weeklyTurnover: string;
  yearlyTurnover: string;
  annualFees: string;
  sessionsPerMonth: number;
  score: number;
  confidence: 'HIGH' | 'MODERATE' | 'LOW' | 'SPECULATIVE';
  status: 'new' | 'watch' | 'pursue' | 'closed' | 'dismissed';
  source: string;
  sourceUrl: string;
  notes: string;
  insiderVisible: boolean;
}

export type BusinessType = Listing['businessType'];
export type Region = string;
export type ListingStatus = Listing['status'];
export type Confidence = Listing['confidence'];
