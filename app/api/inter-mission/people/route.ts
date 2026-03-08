import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const profiles = await storage.getImProfiles({
      userType: params.get("userType") || undefined,
      expertiseTrack: params.get("expertiseTrack") || undefined,
      verificationStatus: params.get("verificationStatus") || undefined,
      search: params.get("search") || undefined,
    });
    const limit = params.get("limit");
    return NextResponse.json(limit ? profiles.slice(0, parseInt(limit)) : profiles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
