import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { insertContentSchema } from "@/shared/schema";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") || undefined;
  const track = searchParams.get("track") || undefined;
  const data = await storage.getContent({ status, track });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = insertContentSchema.parse(body);
    const data = await storage.createContent(parsed);
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ message: "Validation error", errors: e.errors }, { status: 400 });
    }
    throw e;
  }
}
