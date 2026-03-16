import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { sentiment, message, email, page } = await req.json();
    
    // Log to console (we'll add Google Sheets later)
    console.log('Feedback received:', { sentiment, message, email, page, timestamp: new Date().toISOString() });
    
    // TODO: Add Google Sheets integration
    // TODO: Send email to mikeshparekh@gmail.com for negative feedback
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit feedback' }, { status: 500 });
  }
}
