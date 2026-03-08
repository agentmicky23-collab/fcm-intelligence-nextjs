import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ profileId: string }> }) {
  try {
    const { profileId } = await params;
    const reviews = await storage.getImReviewsByProfile(parseInt(profileId));
    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
