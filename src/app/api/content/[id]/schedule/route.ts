import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { scheduledDate, scheduledPlatforms } = await req.json();
  const updated = await storage.updateContent(parseInt(id), {
    scheduledDate,
    scheduledPlatforms,
  });
  if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
