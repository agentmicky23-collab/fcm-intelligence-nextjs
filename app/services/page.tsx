/**
 * Services Page - Full Consultation Booking System
 * Migrated from original fcm-intelligence.vercel.app/consultation.html
 */

'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useState, useEffect } from 'react';

// Consultation types data
const CONSULTATION_TYPES = {
  'helpline-101': {
    name: 'Helpline 101',
    price: 101,
    duration: 20,
    durationText: '20 minutes • One-time',
    icon: '🆘',
    description: 'Urgent help when you need it. Cash discrepancies, compliance issues, immediate guidance.',
    features: [
      '20-minute emergency call',
      'Cash & compliance guidance',
      'Quick problem resolution',
      'One-time fee, no commitment'
    ],
    category: 'quick'
  },
  'discovery-call': {
    name: 'Discovery Call',
    price: 150,
    duration: 60,
    durationText: '1 hour',
    icon: '💬',
    description: 'Initial consultation to assess your situation, answer questions, and explore options.',
    features: [
      '60-minute video call',
      'Situation assessment',
      'Q&A on any topic',
      'Recommendations & next steps'
    ],
    category: 'quick'
  },
  'strategic-session': {
    name: 'Strategic Session',
    price: 497,
    duration: 60,
    durationText: '1 hour • Standalone',
    icon: '🎯',
    description: 'Quick validation, red flags check, go/no-go decision on a specific opportunity.',
    features: [
      '60-minute deep-dive video call',
      'Opportunity assessment & viability check',
      'Initial due diligence guidance',
      'Q&A on specific concerns',
      'Follow-up email summary with action points'
    ],
    category: 'premium'
  },
  'acquisition-advisory': {
    name: 'Acquisition Advisory',
    price: 1997,
    duration: 180,
    durationText: 'Premium Report + 3 Hours',
    icon: '📊',
    description: 'Expert guidance through the entire acquisition process. Includes FCM Intelligence Premium Report.',
    features: [
      'FCM Intelligence Premium Report (£449 value)',
      '3× 60-minute consultation sessions',
      'Session 1: Pre-acquisition strategy',
      'Session 2: Due diligence review',
      'Session 3: Negotiation prep & closing',
      'Email/WhatsApp support between sessions',
      'Deal structure recommendations'
    ],
    category: 'premium',
    featured: true
  },
  'full-support': {
    name: 'Full Acquisition Support',
    price: 4997,
    duration: 360,
    durationText: 'Elite Package • 3 Months',
    icon: '🏆',
    description: 'Complete hand-holding for first-time buyers or complex acquisitions.',
    features: [
      'FCM Intelligence Elite Report included',
      '6× 60-minute consultation sessions',
      'Unlimited email/WhatsApp support',
      'On-site visit option (travel separate)',
      'Post-acquisition operations planning',
      '30-day post-acquisition check-in'
    ],
    category: 'premium'
  },
  'retainer': {
    name: 'Advisory Retainer',
    price: 997,
    duration: 120,
    durationText: '3-month minimum',
    icon: '🤝',
    priceDisplay: '£997/month',
    description: 'Ongoing support for operators building portfolios or wanting continuous expert access.',
    features: [
      '2× 60-minute calls per month',
      'Unlimited email/WhatsApp support',
      'Portfolio strategy & expansion planning',
      'Operations troubleshooting',
      'Exclusive opportunities before public listing'
    ],
    category: 'premium'
  }
};

export default function ConsultationPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isHelplineSuccess, setIsHelplineSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessType: '',
    notes: ''
  });

  const handleTypeSelect = (typeKey: string) => {
    setSelectedType(typeKey);
    
    // Special handling for Helpline 101 - skip calendar, go to form
    if (typeKey === 'helpline-101') {
      setCurrentStep(2);
      // Scroll to booking section
      setTimeout(() => {
        document.querySelector('.booking-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      // Normal flow - scroll to booking section
      setTimeout(() => {
        document.querySelector('.booking-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const renderCalendar = () => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(currentYear, currentMonth, day);
      cellDate.setHours(0, 0, 0, 0);
      const isPast = cellDate < today;
      const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;
      const isDisabled = isPast || isWeekend;
      const isToday = cellDate.getTime() === today.getTime();
      const isSelected = selectedDate?.getDate() === day && 
                        selectedDate?.getMonth() === currentMonth && 
                        selectedDate?.getFullYear() === currentYear;

      days.push(
        <div
          key={day}
          className={`calendar-day ${isDisabled ? 'disabled' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => !isDisabled && handleDateSelect(day)}
        >
          {day}
        </div>
      );
    }

    return (
      <>
        <div className="calendar-header">
          <div className="calendar-month">{monthNames[currentMonth]} {currentYear}</div>
          <div className="calendar-nav">
            <button onClick={() => changeMonth(-1)}>←</button>
            <button onClick={() => changeMonth(1)}>→</button>
          </div>
        </div>
        <div className="calendar-grid">
          {dayHeaders.map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          {days}
        </div>
      </>
    );
  };

  const changeMonth = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
    setSelectedTime(null);
    setShowTimeSlots(true);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const renderTimeSlots = () => {
    const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    
    return times.map(time => {
      // Simulate some booked slots
      const isBooked = Math.random() > 0.7;
      const isSelected = selectedTime === time;

      return (
        <div
          key={time}
          className={`time-slot ${isBooked ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => !isBooked && handleTimeSelect(time)}
        >
          {time}{isBooked ? ' (Booked)' : ''}
        </div>
      );
    });
  };

  const formatSelectedDateTime = () => {
    if (!selectedDate || !selectedTime) return '—';
    
    const dateStr = selectedDate.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    return `${dateStr} at ${selectedTime}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { firstName, lastName, email, businessType, notes } = formData;
    const notesRequired = selectedType !== 'helpline-101';

    if (!firstName || !lastName || !email || !businessType || (notesRequired && !notes)) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    const typeData = selectedType ? CONSULTATION_TYPES[selectedType as keyof typeof CONSULTATION_TYPES] : null;
    
    const booking = {
      serviceType: selectedType,
      serviceName: typeData?.name,
      price: typeData?.price,
      duration: typeData?.duration,
      selectedDate: selectedDate?.toISOString(),
      selectedTime,
      ...formData,
      timestamp: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('fcm_booking', JSON.stringify(booking));

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceType: selectedType,
          customerEmail: email,
          customerName: `${firstName} ${lastName}`,
          bookingData: {
            selectedDate: selectedDate?.toISOString(),
            selectedTime,
            phone: formData.phone,
            businessType,
            notes
          }
        })
      });

      const result = await response.json();

      if (response.ok && result.url) {
        // Redirect to Stripe
        window.location.href = result.url;
      } else {
        throw new Error(result.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Sorry, there was an error processing your request. Please try again or email us directly at agentmicky23@gmail.com');
      setIsSubmitting(false);
    }
  };

  const typeData = selectedType ? CONSULTATION_TYPES[selectedType as keyof typeof CONSULTATION_TYPES] : null;
  const priceDisplay = typeData?.priceDisplay || (typeData ? `£${typeData.price.toLocaleString()}` : '£0');

  return (
    <AppLayout>
      <div className="consultation-page">
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge">15+ Years Industry Experience</div>
              <h1>Expert <span className="highlight">Consultation</span> Services</h1>
              <p>Get personalized guidance from someone who's operated 40+ branches and built a national portfolio from the ground up.</p>
            </div>
          </div>
        </section>

        {/* Consultation Types */}
        <section className="consultation-types">
          <div className="container">
            <div className="section-header">
              <div className="section-label">Choose Your Service</div>
              <h2>What Do You Need Help With?</h2>
              <p>Select the consultation type that best fits your needs. All sessions are one-on-one via video call.</p>
            </div>

            {/* Quick Support */}
            <div className="quick-support">
              <h3 className="category-title">Quick Support</h3>
              <div className="quick-grid">
                {Object.entries(CONSULTATION_TYPES)
                  .filter(([_, type]) => type.category === 'quick')
                  .map(([key, type]) => (
                    <div
                      key={key}
                      className={`type-card ${selectedType === key ? 'selected' : ''}`}
                      onClick={() => handleTypeSelect(key)}
                    >
                      {selectedType === key && <div className="check-mark">✓</div>}
                      <div className="type-icon">{type.icon}</div>
                      <h3>{type.name}</h3>
                      <div className="type-price">{type.priceDisplay || `£${type.price}`}</div>
                      <div className="type-duration">{type.durationText}</div>
                      <p>{type.description}</p>
                      <ul className="type-features">
                        {type.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>

            {/* Premium Packages */}
            <h3 className="category-title">Premium Packages</h3>
            <div className="types-grid">
              {Object.entries(CONSULTATION_TYPES)
                .filter(([_, type]) => type.category === 'premium')
                .map(([key, type]) => (
                  <div
                    key={key}
                    className={`type-card ${selectedType === key ? 'selected' : ''} ${type.featured ? 'featured' : ''}`}
                    onClick={() => handleTypeSelect(key)}
                  >
                    {type.featured && <div className="badge-featured">BEST VALUE</div>}
                    {selectedType === key && <div className="check-mark">✓</div>}
                    <div className="type-icon">{type.icon}</div>
                    <h3>{type.name}</h3>
                    <div className="type-price">{type.priceDisplay || `£${type.price.toLocaleString()}`}</div>
                    <div className="type-duration">{type.durationText}</div>
                    <p>{type.description}</p>
                    <ul className="type-features">
                      {type.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section className="booking-section">
          <div className="container">
            <div className="booking-grid">
              {/* Booking Info Sidebar */}
              <div className="booking-info">
                <h2>Book Your Session</h2>
                <p>Choose a time that works for you. You'll receive a confirmation email with video call details and preparation materials.</p>
                
                <div className="booking-details">
                  <h4>Your Selection</h4>
                  <div className="detail-row">
                    <span className="detail-label">Service</span>
                    <span className="detail-value">{typeData?.name || 'Not selected'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">{typeData?.durationText || '—'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date & Time</span>
                    <span className="detail-value">
                      {selectedType === 'helpline-101' ? 'Instant Access' : formatSelectedDateTime()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Total</span>
                    <span className="detail-value price">{priceDisplay}</span>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="booking-form">
                {/* Step 1: Date & Time (hidden for Helpline 101) */}
                {currentStep === 1 && selectedType !== 'helpline-101' && (
                  <div className="form-step">
                    <div className="step-header">
                      <div className="step-number">1</div>
                      <h3 className="step-title">Select Date & Time</h3>
                      <p className="step-description">Choose a date and time that works for you. All times are shown in UK time (GMT/BST).</p>
                    </div>

                    <div className="calendar-container">
                      {renderCalendar()}
                    </div>

                    {showTimeSlots && (
                      <div className="time-slots-container">
                        <h4>Available Times</h4>
                        <div className="time-slots">
                          {renderTimeSlots()}
                        </div>
                      </div>
                    )}

                    <div className="form-actions">
                      <Link href="/" className="btn btn-secondary">Cancel</Link>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setCurrentStep(2)}
                        disabled={!selectedDate || !selectedTime}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Your Details */}
                {currentStep === 2 && (
                  <div className="form-step">
                    <div className="step-header">
                      <div className="step-number">2</div>
                      <h3 className="step-title">
                        {selectedType === 'helpline-101' ? 'Your Details & Payment' : 'Your Details'}
                      </h3>
                      <p className="step-description">
                        {selectedType === 'helpline-101' 
                          ? 'Enter your details to get instant access to the helpline.'
                          : 'Tell us about yourself so we can prepare for your consultation.'}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="form-row">
                        <div className="form-group">
                          <label>First Name *</label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Last Name *</label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Email *</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Current Situation *</label>
                        <select
                          value={formData.businessType}
                          onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                          required
                        >
                          <option value="">Select...</option>
                          <option value="prospective">Prospective Buyer (researching)</option>
                          <option value="active-search">Active Search (ready to buy)</option>
                          <option value="new-operator">New Operator (0-2 branches)</option>
                          <option value="established">Established Operator (3-10 branches)</option>
                          <option value="large-portfolio">Large Portfolio (10+ branches)</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>What would you like to discuss? {selectedType !== 'helpline-101' && '*'}</label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({...formData, notes: e.target.value})}
                          required={selectedType !== 'helpline-101'}
                          placeholder="Tell us what you'd like help with. The more detail you provide, the better prepared we can be."
                          rows={6}
                        />
                      </div>

                      <div className="form-actions">
                        {selectedType !== 'helpline-101' && (
                          <button type="button" className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
                            Back
                          </button>
                        )}
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                          {isSubmitting ? 'Redirecting to payment...' : '💳 Proceed to Payment'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <style jsx>{`
          .consultation-page {
            background: var(--fcm-dark);
            color: white;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
          }

          /* Hero */
          .hero {
            min-height: 60vh;
            display: flex;
            align-items: center;
            padding: 140px 0 80px;
            background: linear-gradient(180deg, #1e3a5f 0%, var(--fcm-dark) 100%);
            position: relative;
            overflow: hidden;
          }

          .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 800px;
            height: 800px;
            background: radial-gradient(circle, rgba(201, 162, 39, 0.1) 0%, transparent 70%);
            pointer-events: none;
          }

          .hero-content {
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
          }

          .hero-badge {
            display: inline-block;
            background: rgba(201, 162, 39, 0.15);
            border: 1px solid var(--fcm-gold);
            color: var(--fcm-gold);
            padding: 8px 20px;
            border-radius: 50px;
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 24px;
            letter-spacing: 0.5px;
          }

          .hero h1 {
            font-family: 'Playfair Display', serif;
            font-size: clamp(2.5rem, 6vw, 3.5rem);
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 20px;
          }

          .hero .highlight {
            color: var(--fcm-gold);
          }

          .hero p {
            font-size: 1.2rem;
            color: #8b949e;
            max-width: 680px;
            margin: 0 auto;
          }

          /* Consultation Types */
          .consultation-types {
            padding: 80px 0;
            background: var(--fcm-dark);
          }

          .section-header {
            text-align: center;
            max-width: 700px;
            margin: 0 auto 60px;
          }

          .section-label {
            color: var(--fcm-gold);
            font-size: 0.9rem;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 16px;
          }

          .section-header h2 {
            font-family: 'Playfair Display', serif;
            font-size: clamp(2rem, 4vw, 2.5rem);
            margin-bottom: 16px;
          }

          .section-header p {
            color: #8b949e;
            font-size: 1.1rem;
          }

          .quick-support {
            margin-bottom: 48px;
          }

          .category-title {
            text-align: center;
            color: var(--fcm-gold);
            font-size: 1.1rem;
            margin-bottom: 24px;
            letter-spacing: 2px;
            text-transform: uppercase;
          }

          .quick-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            max-width: 700px;
            margin: 0 auto;
          }

          .types-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 24px;
          }

          .type-card {
            background: var(--fcm-card);
            border: 2px solid #30363d;
            border-radius: 16px;
            padding: 40px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
          }

          .quick-grid .type-card {
            padding: 32px;
          }

          .type-card:hover {
            border-color: var(--fcm-gold);
            transform: translateY(-4px);
          }

          .type-card.selected {
            border-color: var(--fcm-gold);
            background: linear-gradient(180deg, rgba(201, 162, 39, 0.1) 0%, var(--fcm-card) 100%);
          }

          .type-card.featured {
            border-color: var(--fcm-gold);
            background: linear-gradient(180deg, rgba(201, 162, 39, 0.1) 0%, var(--fcm-card) 100%);
            transform: scale(1.02);
          }

          .type-card.featured:hover {
            transform: scale(1.04);
          }

          .badge-featured {
            position: absolute;
            top: -12px;
            right: 20px;
            background: var(--fcm-gold);
            color: var(--fcm-dark);
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 700;
          }

          .check-mark {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 32px;
            height: 32px;
            background: var(--fcm-gold);
            color: var(--fcm-dark);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
          }

          .type-icon {
            font-size: 2.5rem;
            margin-bottom: 20px;
          }

          .types-grid .type-icon {
            font-size: 3rem;
          }

          .type-card h3 {
            font-size: 1.25rem;
            margin-bottom: 12px;
          }

          .types-grid .type-card h3 {
            font-size: 1.5rem;
          }

          .type-price {
            font-family: 'Playfair Display', serif;
            font-size: 1.75rem;
            color: var(--fcm-gold);
            font-weight: 700;
            margin-bottom: 12px;
          }

          .types-grid .type-price {
            font-size: 2rem;
          }

          .type-duration {
            color: #57606a;
            font-size: 0.9rem;
            margin-bottom: 20px;
          }

          .type-card p {
            color: #8b949e;
            font-size: 0.9rem;
            line-height: 1.7;
            margin-bottom: 20px;
          }

          .type-features {
            list-style: none;
            margin-top: 20px;
            font-size: 0.85rem;
          }

          .type-features li {
            color: #8b949e;
            padding: 8px 0;
            padding-left: 24px;
            position: relative;
          }

          .type-features li::before {
            content: '✓';
            color: var(--fcm-gold);
            position: absolute;
            left: 0;
            font-weight: 600;
          }

          /* Booking Section */
          .booking-section {
            padding: 80px 0;
            background: linear-gradient(180deg, #0a0d12 0%, var(--fcm-dark) 100%);
          }

          .booking-grid {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 48px;
            align-items: start;
          }

          .booking-info {
            position: sticky;
            top: 120px;
          }

          .booking-info h2 {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            margin-bottom: 24px;
          }

          .booking-info p {
            color: #8b949e;
            margin-bottom: 32px;
          }

          .booking-details {
            background: var(--fcm-card);
            border: 1px solid #30363d;
            border-radius: 16px;
            padding: 32px;
          }

          .booking-details h4 {
            font-size: 1rem;
            margin-bottom: 20px;
            color: var(--fcm-gold);
          }

          .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
            border-bottom: 1px solid #30363d;
          }

          .detail-row:last-child {
            border-bottom: none;
          }

          .detail-label {
            color: #8b949e;
            font-size: 0.95rem;
          }

          .detail-value {
            font-weight: 600;
            font-size: 1rem;
          }

          .detail-value.price {
            font-family: 'Playfair Display', serif;
            font-size: 1.75rem;
            color: var(--fcm-gold);
          }

          /* Booking Form */
          .booking-form {
            background: var(--fcm-card);
            border: 1px solid #30363d;
            border-radius: 20px;
            padding: 48px;
          }

          .step-header {
            margin-bottom: 32px;
          }

          .step-number {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: rgba(201, 162, 39, 0.15);
            border: 2px solid var(--fcm-gold);
            border-radius: 50%;
            text-align: center;
            line-height: 36px;
            font-weight: 700;
            color: var(--fcm-gold);
            margin-bottom: 16px;
          }

          .step-title {
            font-size: 1.5rem;
            margin-bottom: 8px;
          }

          .step-description {
            color: #8b949e;
            font-size: 0.95rem;
          }

          /* Calendar */
          .calendar-container {
            margin-bottom: 32px;
          }

          .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }

          .calendar-month {
            font-size: 1.25rem;
            font-weight: 600;
          }

          .calendar-nav {
            display: flex;
            gap: 8px;
          }

          .calendar-nav button {
            width: 40px;
            height: 40px;
            background: var(--fcm-dark);
            border: 1px solid #30363d;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            transition: all 0.3s;
          }

          .calendar-nav button:hover {
            border-color: var(--fcm-gold);
            color: var(--fcm-gold);
          }

          .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 8px;
          }

          .calendar-day-header {
            text-align: center;
            font-size: 0.85rem;
            color: #57606a;
            padding: 8px;
            font-weight: 600;
          }

          .calendar-day {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--fcm-dark);
            border: 1px solid #30363d;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 0.95rem;
          }

          .calendar-day:hover:not(.disabled) {
            border-color: var(--fcm-gold);
            background: rgba(201, 162, 39, 0.1);
          }

          .calendar-day.disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }

          .calendar-day.selected {
            background: var(--fcm-gold);
            color: var(--fcm-dark);
            font-weight: 700;
            border-color: var(--fcm-gold);
          }

          .calendar-day.today {
            border-color: #2d5a87;
          }

          /* Time Slots */
          .time-slots-container {
            margin-bottom: 32px;
          }

          .time-slots-container h4 {
            margin-bottom: 16px;
            font-size: 1.1rem;
          }

          .time-slots {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }

          .time-slot {
            padding: 16px;
            background: var(--fcm-dark);
            border: 1px solid #30363d;
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 500;
          }

          .time-slot:hover:not(.disabled) {
            border-color: var(--fcm-gold);
            background: rgba(201, 162, 39, 0.1);
          }

          .time-slot.disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }

          .time-slot.selected {
            background: var(--fcm-gold);
            color: var(--fcm-dark);
            font-weight: 700;
            border-color: var(--fcm-gold);
          }

          /* Form */
          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .form-group {
            margin-bottom: 24px;
          }

          .form-group label {
            display: block;
            font-weight: 500;
            margin-bottom: 8px;
            font-size: 0.95rem;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            width: 100%;
            padding: 14px 18px;
            background: var(--fcm-dark);
            border: 1px solid #30363d;
            border-radius: 8px;
            color: white;
            font-size: 1rem;
            font-family: inherit;
            transition: all 0.3s ease;
          }

          .form-group input:focus,
          .form-group select:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: var(--fcm-gold);
          }

          .form-group textarea {
            min-height: 120px;
            resize: vertical;
          }

          /* Form Actions */
          .form-actions {
            display: flex;
            gap: 16px;
            justify-content: space-between;
            margin-top: 32px;
          }

          .btn {
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s;
            border: none;
            text-decoration: none;
            display: inline-block;
          }

          .btn-primary {
            background: var(--fcm-gold);
            color: var(--fcm-dark);
          }

          .btn-primary:hover:not(:disabled) {
            background: #e8d48a;
            transform: translateY(-2px);
          }

          .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .btn-secondary {
            background: transparent;
            border: 1px solid #30363d;
            color: white;
          }

          .btn-secondary:hover {
            border-color: var(--fcm-gold);
            color: var(--fcm-gold);
          }

          /* Responsive */
          @media (max-width: 968px) {
            .booking-grid {
              grid-template-columns: 1fr;
            }

            .booking-info {
              position: static;
            }

            .types-grid, .quick-grid {
              grid-template-columns: 1fr;
            }

            .form-row {
              grid-template-columns: 1fr;
            }

            .time-slots {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 480px) {
            .time-slots {
              grid-template-columns: 1fr;
            }

            .booking-form {
              padding: 32px 24px;
            }

            .form-actions {
              flex-direction: column;
            }

            .btn {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </AppLayout>
  );
}
