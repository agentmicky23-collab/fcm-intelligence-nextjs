import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { insertImProfileSchema } from "@/shared/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = insertImProfileSchema.parse(body);
    const existing = await storage.getImProfileByEmail(parsed.email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const profile = await storage.createImProfile(parsed);
    await storage.createImVettingEntry({ profileId: profile.id, priority: false, status: "pending" });
    return NextResponse.json(profile, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 400 });
  }
}
