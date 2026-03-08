import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const profile = await storage.getImProfile(parseInt(id));
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    const reviews = await storage.getImReviewsByProfile(profile.id);
    return NextResponse.json({ profile, reviews });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
