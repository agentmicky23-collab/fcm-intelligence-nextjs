/**
 * Services Page
 * Service offerings for Post Office operators
 */

import Link from 'next/link';
import { services, advisoryPackages, getServicesByCategory } from '@/lib/services-data';

export const metadata = {
  title: 'Services | FCM Intelligence',
  description: 'Expert services for Post Office acquisition and operation',
};

export default function ServicesPage() {
  const preparationServices = getServicesByCategory('preparation');
  const onboardingServices = getServicesByCategory('onboarding');
  const ongoingServices = getServicesByCategory('ongoing');
  
  return (
    <div className="min-h-screen bg-[var(--fcm-dark)] text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Expert <span className="text-[var(--fcm-gold)]">Services</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            From business planning to ongoing advisory — support at every stage of your Post Office journey
          </p>
        </div>
      </section>

      {/* Preparation Services */}
      <section className="py-16 px-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Preparation Services</h2>
            <p className="text-gray-400">Get ready for acquisition and Post Office Ltd approval</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {preparationServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding Services */}
      <section className="py-16 px-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Onboarding Services</h2>
            <p className="text-gray-400">Set up your business and learn the operations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {onboardingServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Ongoing Support */}
      <section className="py-16 px-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Ongoing Support</h2>
            <p className="text-gray-400">Expert advisory as you run and grow your business</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ongoingServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Packages */}
      <section className="py-16 px-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Advisory Packages</h2>
            <p className="text-gray-400">Custom-scoped consulting for specific needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {advisoryPackages.map(pkg => (
              <div
                key={pkg.id}
                className="p-6 rounded-lg bg-[var(--fcm-card)] border border-gray-800"
              >
                <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{pkg.description}</p>
                <div className="font-mono text-lg font-bold text-[var(--fcm-gold)]">
                  {pkg.priceRange}
                </div>
                <Link
                  href="/contact"
                  className="mt-4 inline-block text-sm text-[var(--fcm-gold)] hover:underline"
                >
                  Get a quote →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why FCM Services */}
      <section className="py-16 px-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Why Choose <span className="text-[var(--fcm-gold)]">FCM</span>?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-semibold text-lg mb-2">40+ Branches</h3>
              <p className="text-sm text-gray-400">
                Real operational experience managing dozens of Post Office branches
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="font-semibold text-lg mb-2">Proven Systems</h3>
              <p className="text-sm text-gray-400">
                Battle-tested processes and frameworks from years of operation
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-semibold text-lg mb-2">Operator-to-Operator</h3>
              <p className="text-sm text-gray-400">
                Practical advice from people who've been where you are
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to get <span className="text-[var(--fcm-gold)]">expert support</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Let's discuss your needs and recommend the right services for your situation
          </p>
          <Link 
            href="/contact"
            className="inline-block px-8 py-4 bg-[var(--fcm-gold)] text-[var(--fcm-dark)] font-semibold rounded-lg hover:bg-[var(--fcm-gold-hover)] transition-colors"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ service }: { service: any }) {
  // Format price display
  const priceDisplay = typeof service.price === 'number' 
    ? `£${service.price}`
    : `£${service.price}`;
  
  const priceLabel = service.priceType === 'monthly' ? '/month' : '';
  
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group block p-6 rounded-lg bg-[var(--fcm-card)] border border-gray-800 hover:border-[var(--fcm-gold)] transition-colors"
    >
      <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--fcm-gold)] transition-colors">
        {service.title}
      </h3>
      <p className="text-sm text-gray-400 mb-4">{service.description}</p>
      
      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold text-[var(--fcm-gold)]">
            {priceDisplay}
          </span>
          <span className="text-sm text-gray-500">{priceLabel}</span>
        </div>
        {service.altPricing && (
          <div className="text-xs text-gray-500 mt-1">{service.altPricing}</div>
        )}
      </div>
      
      {/* Key Features */}
      <div className="space-y-2 mb-4">
        {service.features.slice(0, 3).map((feature: string, i: number) => (
          <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <span className="text-[var(--fcm-gold)] mt-1">✓</span>
            <span>{feature}</span>
          </div>
        ))}
        {service.features.length > 3 && (
          <div className="text-xs text-gray-500">
            +{service.features.length - 3} more features
          </div>
        )}
      </div>
      
      {/* Metadata */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        {service.turnaroundDays && (
          <span>{service.turnaroundDays} day turnaround</span>
        )}
        {service.deliveryFormat && (
          <span>• {service.deliveryFormat}</span>
        )}
        {service.cancellable && (
          <span>• Cancel anytime</span>
        )}
      </div>
      
      {/* CTA */}
      <div className="mt-4 text-[var(--fcm-gold)] text-sm font-semibold group-hover:underline">
        View Details →
      </div>
    </Link>
  );
}
