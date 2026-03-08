import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET() {
  const data = await storage.getScanHistory();
  return NextResponse.json(data);
}
