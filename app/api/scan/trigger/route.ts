import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function POST() {
  const config = await storage.getScanConfig();
  const opps = await storage.getOpportunities({});
  const history = await storage.createScanHistory({
    triggeredBy: "manual",
    parameters: config || {},
    resultsCount: opps.length,
  });
  return NextResponse.json({ message: "Scan triggered successfully", history });
}
