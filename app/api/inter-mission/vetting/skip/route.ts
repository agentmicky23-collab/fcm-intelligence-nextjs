import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const { profileId } = await request.json();
    if (!profileId) return NextResponse.json({ error: "profileId required" }, { status: 400 });
    const entry = await storage.createImVettingEntry({
      profileId,
      priority: true,
      stripePaymentId: `skip_${Date.now()}`,
      status: "pending",
    });
    return NextResponse.json({ success: true, entry, message: "Priority vetting activated — you'll be verified within 48 hours" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
