import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET() {
  let data = await storage.getScanConfig();
  if (!data) {
    data = await storage.upsertScanConfig({});
  }
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const data = await storage.upsertScanConfig(body);
  return NextResponse.json(data);
}
