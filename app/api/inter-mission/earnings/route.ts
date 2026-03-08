import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(request: NextRequest) {
  try {
    const managerId = request.nextUrl.searchParams.get("managerId");
    if (!managerId) return NextResponse.json({ error: "managerId required" }, { status: 400 });
    const summary = await storage.getImEarningsSummary(parseInt(managerId));
    const earnings = await storage.getImEarnings(parseInt(managerId));
    return NextResponse.json({ summary, earnings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
