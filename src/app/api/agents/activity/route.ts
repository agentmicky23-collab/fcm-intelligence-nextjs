import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { insertAgentActivitySchema } from "@shared/schema";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");
  const data = await storage.getAgentActivities(limit);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = insertAgentActivitySchema.parse(body);
    const data = await storage.createAgentActivity(parsed);
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ message: "Validation error", errors: e.errors }, { status: 400 });
    }
    throw e;
  }
}
