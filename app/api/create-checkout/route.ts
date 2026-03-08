/**
 * Stripe Checkout API Route
 * Creates a Stripe checkout session for consultation bookings
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe (will need STRIPE_SECRET_KEY in .env.local)
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

// Consultation pricing mapping
const CONSULTATION_PRICES: Record<string, { price: number; name: string }> = {
  'helpline-101': { price: 10100, name: 'Helpline 101' }, // Stripe uses cents
  'discovery-call': { price: 15000, name: 'Discovery Call' },
  'strategic-session': { price: 49700, name: 'Strategic Session' },
  'acquisition-advisory': { price: 199700, name: 'Acquisition Advisory' },
  'full-support': { price: 499700, name: 'Full Acquisition Support' },
  'retainer': { price: 99700, name: 'Advisory Retainer' },
};

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { serviceType, customerEmail, customerName, bookingData } = body;

    if (!serviceType || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: serviceType, customerEmail' },
        { status: 400 }
      );
    }

    const consultationType = CONSULTATION_PRICES[serviceType];
    if (!consultationType) {
      return NextResponse.json(
        { error: `Invalid service type: ${serviceType}` },
        { status: 400 }
      );
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: consultationType.name,
              description: 'FCM Intelligence Consultation Service',
            },
            unit_amount: consultationType.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      metadata: {
        serviceType,
        customerName,
        selectedDate: bookingData.selectedDate || 'instant',
        selectedTime: bookingData.selectedTime || 'N/A',
        phone: bookingData.phone || '',
        businessType: bookingData.businessType || '',
        notes: bookingData.notes || '',
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/services/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/services`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
