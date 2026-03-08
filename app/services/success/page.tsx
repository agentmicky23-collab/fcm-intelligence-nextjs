/**
 * Booking Success Page
 * Displayed after successful Stripe payment
 */

'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const [bookingData, setBookingData] = useState<any>(null);
  const [isHelpline, setIsHelpline] = useState(false);

  useEffect(() => {
    // Retrieve booking data from localStorage
    const stored = localStorage.getItem('fcm_booking');
    if (stored) {
      const data = JSON.parse(stored);
      setBookingData(data);
      setIsHelpline(data.serviceType === 'helpline-101');
      // Clear booking data
      localStorage.removeItem('fcm_booking');
    }
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <AppLayout>
      <div className="success-page">
        <div className="container">
          {isHelpline ? (
            // Helpline 101 Success (Instant Access)
            <div className="success-content helpline">
              <div className="success-icon">📞</div>
              <h1>Helpline Access Granted!</h1>
              <p>Your payment has been confirmed. Call now for immediate expert assistance.</p>

              <div className="phone-card">
                <div className="phone-label">Call this number now:</div>
                <a href="tel:+447886152939" className="phone-number">
                  +44 7886 152939
                </a>
                <div className="phone-hours">Available Mon-Fri, 9am-6pm UK time</div>
              </div>

              <div className="before-call">
                <h4>Before You Call</h4>
                <ul>
                  <li>Have your branch name/FAD code ready</li>
                  <li>Note down the specific issue or question</li>
                  <li>Have any relevant documents to hand</li>
                </ul>
              </div>

              <div className="actions">
                <Link href="/" className="btn btn-secondary">
                  Return to Home
                </Link>
                <a href="tel:+447886152939" className="btn btn-primary">
                  📞 Call Now
                </a>
              </div>
            </div>
          ) : (
            // Standard Consultation Success
            <div className="success-content">
              <div className="success-icon">✓</div>
              <h1>Booking Confirmed!</h1>
              <p>Your consultation has been scheduled. Check your email for confirmation and video call details.</p>

              {bookingData && (
                <div className="confirmation-details">
                  <div className="detail-row">
                    <span className="label">Service</span>
                    <strong>{bookingData.serviceName}</strong>
                  </div>
                  <div className="detail-row">
                    <span className="label">Date & Time</span>
                    <strong>
                      {formatDate(bookingData.selectedDate)} at {bookingData.selectedTime}
                    </strong>
                  </div>
                  <div className="detail-row">
                    <span className="label">Confirmation sent to</span>
                    <strong>{bookingData.email}</strong>
                  </div>
                </div>
              )}

              <Link href="/" className="btn btn-primary">
                Return to Home
              </Link>
            </div>
          )}
        </div>

        <style jsx>{`
          .success-page {
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--fcm-dark);
            color: white;
            padding: 80px 24px;
          }

          .container {
            max-width: 700px;
            width: 100%;
          }

          .success-content {
            text-align: center;
            background: var(--fcm-card);
            border: 1px solid #30363d;
            border-radius: 20px;
            padding: 60px 40px;
          }

          .success-icon {
            font-size: 4rem;
            margin-bottom: 24px;
          }

          .success-content h1 {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            margin-bottom: 16px;
            color: var(--fcm-gold);
          }

          .success-content p {
            color: #8b949e;
            font-size: 1.1rem;
            margin-bottom: 32px;
          }

          /* Helpline specific */
          .phone-card {
            background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.05) 100%);
            border: 1px solid var(--fcm-gold);
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 32px;
          }

          .phone-label {
            font-size: 0.9rem;
            color: #8b949e;
            margin-bottom: 12px;
          }

          .phone-number {
            font-family: 'Playfair Display', serif;
            font-size: 2.5rem;
            color: var(--fcm-gold);
            font-weight: 700;
            text-decoration: none;
            display: block;
            margin-bottom: 12px;
          }

          .phone-number:hover {
            color: #e8d48a;
          }

          .phone-hours {
            font-size: 0.85rem;
            color: #57606a;
          }

          .before-call {
            background: var(--fcm-dark);
            border: 1px solid #30363d;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
            text-align: left;
          }

          .before-call h4 {
            font-size: 1rem;
            margin-bottom: 12px;
            color: var(--fcm-gold);
          }

          .before-call ul {
            color: #8b949e;
            font-size: 0.9rem;
            line-height: 1.8;
            padding-left: 20px;
          }

          .before-call li {
            margin-bottom: 8px;
          }

          /* Confirmation details */
          .confirmation-details {
            background: var(--fcm-dark);
            border: 1px solid #30363d;
            border-radius: 12px;
            padding: 32px;
            margin-bottom: 32px;
            text-align: left;
          }

          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #30363d;
          }

          .detail-row:last-child {
            border-bottom: none;
          }

          .detail-row .label {
            color: #8b949e;
          }

          .detail-row strong {
            color: white;
          }

          /* Actions */
          .actions {
            display: flex;
            gap: 16px;
            justify-content: center;
          }

          .btn {
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
            border: none;
          }

          .btn-primary {
            background: var(--fcm-gold);
            color: var(--fcm-dark);
          }

          .btn-primary:hover {
            background: #e8d48a;
            transform: translateY(-2px);
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

          @media (max-width: 640px) {
            .success-content {
              padding: 40px 24px;
            }

            .phone-number {
              font-size: 2rem;
            }

            .actions {
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
