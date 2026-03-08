import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { insertImAssignmentSchema } from "@/shared/schema";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const assignments = await storage.getImAssignments({
      expertiseTrack: params.get("expertiseTrack") || undefined,
      urgency: params.get("urgency") || undefined,
      status: params.get("status") || undefined,
    });
    return NextResponse.json(assignments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = insertImAssignmentSchema.parse(body);
    const assignment = await storage.createImAssignment(parsed);
    return NextResponse.json(assignment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create assignment" }, { status: 400 });
  }
}
