/**
 * Individual Service Page
 * Detailed view of a specific service offering
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { services, getServiceBySlug } from '@/lib/services-data';

export async function generateStaticParams() {
  return services.map(service => ({
    slug: service.slug
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  
  if (!service) {
    return { title: 'Service Not Found' };
  }
  
  return {
    title: `${service.title} | FCM Intelligence`,
    description: service.description
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  
  if (!service) {
    notFound();
  }
  
  // Format price display
  const priceDisplay = typeof service.price === 'number' 
    ? `£${service.price.toLocaleString()}`
    : `£${service.price}`;
  
  const priceLabel = service.priceType === 'monthly' ? 'per month' : 'one-time';
  
  return (
    <div className="min-h-screen bg-[var(--fcm-dark)] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Link 
            href="/services"
            className="text-sm text-[var(--fcm-gold)] hover:underline mb-4 inline-block"
          >
            ← All Services
          </Link>
          
          <div className="inline-block px-4 py-1 bg-[var(--fcm-gold)]/10 border border-[var(--fcm-gold)] text-[var(--fcm-gold)] text-xs font-semibold uppercase rounded mb-4">
            {service.category}
          </div>
          
          <h1 className="text-5xl font-bold mb-4">{service.title}</h1>
          <p className="text-xl text-gray-400">{service.description}</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* What's Included */}
              <section>
                <h2 className="text-3xl font-bold mb-6">What's Included</h2>
                <div className="space-y-4">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-[var(--fcm-card)] rounded-lg border border-gray-800">
                      <span className="text-2xl text-[var(--fcm-gold)]">✓</span>
                      <span className="text-lg">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
              
              {/* Service Details */}
              <section>
                <h2 className="text-3xl font-bold mb-6">Service Details</h2>
                <div className="grid grid-cols-2 gap-6">
                  {service.turnaroundDays && (
                    <div className="p-6 bg-[var(--fcm-card)] rounded-lg border border-gray-800">
                      <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Turnaround</div>
                      <div className="text-2xl font-bold text-white">{service.turnaroundDays} days</div>
                    </div>
                  )}
                  
                  {service.deliveryFormat && (
                    <div className="p-6 bg-[var(--fcm-card)] rounded-lg border border-gray-800">
                      <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Format</div>
                      <div className="text-2xl font-bold text-white">{service.deliveryFormat}</div>
                    </div>
                  )}
                  
                  {service.sessions && (
                    <div className="p-6 bg-[var(--fcm-card)] rounded-lg border border-gray-800">
                      <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Sessions</div>
                      <div className="text-2xl font-bold text-white">{service.sessions}</div>
                    </div>
                  )}
                  
                  {service.responseTime && (
                    <div className="p-6 bg-[var(--fcm-card)] rounded-lg border border-gray-800">
                      <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Response Time</div>
                      <div className="text-2xl font-bold text-white">{service.responseTime}</div>
                    </div>
                  )}
                  
                  {service.cancellable && (
                    <div className="p-6 bg-[var(--fcm-card)] rounded-lg border border-gray-800">
                      <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Flexibility</div>
                      <div className="text-2xl font-bold text-white">Cancel Anytime</div>
                    </div>
                  )}
                  
                  {service.customized && (
                    <div className="p-6 bg-[var(--fcm-card)] rounded-lg border border-gray-800">
                      <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Customization</div>
                      <div className="text-2xl font-bold text-white">Tailored to You</div>
                    </div>
                  )}
                </div>
              </section>
              
              {/* Delivery Modes */}
              {service.deliveryModes && service.deliveryModes.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Delivery Options</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {service.deliveryModes.map((mode, i) => (
                      <div key={i} className="p-6 bg-[var(--fcm-card)] border border-gray-800 rounded-lg text-center">
                        <div className="text-3xl mb-3">
                          {mode.includes('Online') && '💻'}
                          {mode.includes('Offsite') && '🏢'}
                          {mode.includes('Onsite') && '📍'}
                        </div>
                        <div className="font-semibold">{mode}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Included Services */}
              {service.includedServices && service.includedServices.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Included Services</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.includedServices.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-[var(--fcm-card)] rounded-lg border border-gray-800">
                        <span className="text-xl text-[var(--fcm-gold)]">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Instructor/Experience */}
              {service.instructors && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Who Delivers This</h2>
                  <div className="p-6 bg-[var(--fcm-gold)]/10 border border-[var(--fcm-gold)] rounded-lg">
                    <p className="text-lg">{service.instructors}</p>
                  </div>
                </section>
              )}
              
              {/* Process Overview */}
              <section>
                <h2 className="text-3xl font-bold mb-6">How It Works</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--fcm-gold)]/20 border-2 border-[var(--fcm-gold)] flex items-center justify-center font-bold text-[var(--fcm-gold)]">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Contact Us</h4>
                      <p className="text-sm text-gray-400">Get in touch to discuss your needs and schedule</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--fcm-gold)]/20 border-2 border-[var(--fcm-gold)] flex items-center justify-center font-bold text-[var(--fcm-gold)]">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Customization</h4>
                      <p className="text-sm text-gray-400">We tailor the service to your specific situation</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--fcm-gold)]/20 border-2 border-[var(--fcm-gold)] flex items-center justify-center font-bold text-[var(--fcm-gold)]">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Delivery</h4>
                      <p className="text-sm text-gray-400">
                        {service.turnaroundDays 
                          ? `Delivered within ${service.turnaroundDays} days`
                          : 'Scheduled at your convenience'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--fcm-gold)]/20 border-2 border-[var(--fcm-gold)] flex items-center justify-center font-bold text-[var(--fcm-gold)]">
                      4
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Follow-Up</h4>
                      <p className="text-sm text-gray-400">Ongoing support and guidance as needed</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            
            {/* Right Column - Purchase Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 p-8 bg-[var(--fcm-card)] border border-gray-800 rounded-lg">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono text-5xl font-bold text-[var(--fcm-gold)]">
                      {priceDisplay}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 capitalize">{priceLabel}</div>
                  
                  {service.altPricing && (
                    <div className="mt-2 text-sm text-gray-400">
                      {service.altPricing}
                    </div>
                  )}
                </div>
                
                <Link
                  href="/contact"
                  className="block w-full px-6 py-4 bg-[var(--fcm-gold)] text-[var(--fcm-dark)] font-semibold text-center rounded-lg hover:bg-[var(--fcm-gold-hover)] transition-colors mb-4"
                >
                  Get Started
                </Link>
                
                <div className="space-y-3 text-sm text-gray-400">
                  {service.turnaroundDays && (
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--fcm-gold)]">✓</span>
                      <span>{service.turnaroundDays} day turnaround</span>
                    </div>
                  )}
                  {service.customized && (
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--fcm-gold)]">✓</span>
                      <span>Customized to your needs</span>
                    </div>
                  )}
                  {service.cancellable && (
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--fcm-gold)]">✓</span>
                      <span>Cancel anytime</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--fcm-gold)]">✓</span>
                    <span>Expert operator guidance</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Questions?
                  </div>
                  <Link 
                    href="/contact"
                    className="text-sm text-[var(--fcm-gold)] hover:underline"
                  >
                    Contact us to discuss
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Services */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Related Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services
              .filter(s => s.id !== service.id && s.category === service.category)
              .slice(0, 2)
              .map(s => (
                <Link
                  key={s.id}
                  href={`/services/${s.slug}`}
                  className="group block p-6 bg-[var(--fcm-card)] border border-gray-800 rounded-lg hover:border-[var(--fcm-gold)] transition-colors"
                >
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--fcm-gold)] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">{s.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-bold text-[var(--fcm-gold)]">
                      {typeof s.price === 'number' ? `£${s.price}` : `£${s.price}`}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
