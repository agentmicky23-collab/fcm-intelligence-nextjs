/**
 * Services Data Loader
 * Loads and processes services from migration data
 */

import type { Service, AdvisoryPackage, ServicesData } from '@/types/service';
import servicesJson from '@/migration-data/services.json';

// Load data
const data = servicesJson as ServicesData;

// Export services with slugs
export const services: Service[] = data.services.map(service => ({
  ...service,
  slug: service.id.toLowerCase().replace('svc-', '').replace(/_/g, '-')
}));

// Export advisory packages
export const advisoryPackages: AdvisoryPackage[] = data.advisoryPackages.map(pkg => ({
  ...pkg,
  slug: pkg.id.toLowerCase().replace('pkg-', '').replace(/_/g, '-')
}));

/**
 * Get service by slug
 */
export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(s => s.slug === slug);
}

/**
 * Get service by ID
 */
export function getServiceById(id: string): Service | undefined {
  return services.find(s => s.id === id);
}

/**
 * Get services by category
 */
export function getServicesByCategory(category: Service['category']): Service[] {
  return services.filter(s => s.category === category);
}

/**
 * Get all categories
 */
export function getServiceCategories(): Array<{value: Service['category'], label: string}> {
  return [
    { value: 'preparation', label: 'Preparation' },
    { value: 'onboarding', label: 'Onboarding' },
    { value: 'ongoing', label: 'Ongoing Support' }
  ];
}
