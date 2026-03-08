import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { insertImReviewSchema } from "@/shared/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = insertImReviewSchema.parse(body);
    const review = await storage.createImReview(parsed);
    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit review" }, { status: 400 });
  }
}
