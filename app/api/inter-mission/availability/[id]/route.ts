import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const availability = await storage.getImAvailability(parseInt(id));
    return NextResponse.json(availability);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { dates } = await request.json();
    const entries = dates.map((d: any) => ({
      profileId: parseInt(id),
      date: d.date,
      status: d.status || "available",
      assignmentId: d.assignmentId || null,
    }));
    await storage.setImAvailability(entries);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
