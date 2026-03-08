/**
 * Service Types
 * TypeScript interfaces for services and packages
 */

export interface Service {
  id: string;
  slug: string;
  title: string;
  category: 'preparation' | 'onboarding' | 'ongoing';
  description: string;
  price: number | string; // Can be number or "500-1500" range
  currency: string;
  priceType: 'one-time' | 'monthly';
  altPricing?: string;
  features: string[];
  deliveryFormat?: string;
  deliveryModes?: string[];
  turnaroundDays?: number;
  sessions?: number;
  instructors?: string;
  customized?: boolean;
  billingPeriod?: string;
  cancellable?: boolean;
  responseTime?: string;
  reportingFrequency?: string;
  includedServices?: string[];
}

export interface AdvisoryPackage {
  id: string;
  slug: string;
  title: string;
  category: string;
  priceRange: string;
  description: string;
}

export interface ServicesData {
  services: Service[];
  advisoryPackages: AdvisoryPackage[];
}
