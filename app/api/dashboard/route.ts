import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET() {
  const data = await storage.getDashboardSummary();
  return NextResponse.json(data);
}
