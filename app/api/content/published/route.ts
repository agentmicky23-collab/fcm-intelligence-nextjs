import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const track = req.nextUrl.searchParams.get("track") || undefined;
  const data = await storage.getPublishedContent(track);
  return NextResponse.json(data);
}
