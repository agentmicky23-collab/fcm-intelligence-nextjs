import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { insertOpportunitySchema } from "@/shared/schema";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") || undefined;
  const businessType = searchParams.get("businessType") || undefined;
  const region = searchParams.get("region") || undefined;
  const data = await storage.getOpportunities({ status, businessType, region });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = insertOpportunitySchema.parse(body);
    const data = await storage.createOpportunity(parsed);
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ message: "Validation error", errors: e.errors }, { status: 400 });
    }
    throw e;
  }
}
