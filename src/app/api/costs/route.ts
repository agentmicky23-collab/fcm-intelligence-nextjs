import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { insertCostRecordSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  const days = parseInt(req.nextUrl.searchParams.get("days") || "30");
  const data = await storage.getCostRecords(days);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = insertCostRecordSchema.parse(body);
    const data = await storage.createCostRecord(parsed);
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ message: "Validation error", errors: e.errors }, { status: 400 });
    }
    throw e;
  }
}
