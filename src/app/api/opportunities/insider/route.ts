import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET() {
  const data = await storage.getInsiderOpportunities();
  return NextResponse.json(data);
}
