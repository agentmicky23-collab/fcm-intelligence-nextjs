import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const { profileId } = await request.json();
    if (!profileId) return NextResponse.json({ error: "profileId required" }, { status: 400 });
    const profile = await storage.updateImProfile(profileId, { stealthMode: true });
    return NextResponse.json({ success: true, profile, message: "Stealth mode activated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
