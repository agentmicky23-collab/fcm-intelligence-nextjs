import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET() {
  const data = await storage.getContent({});
  const withSchedule = data.filter((c: any) => c.scheduledDate);
  return NextResponse.json(withSchedule);
}
