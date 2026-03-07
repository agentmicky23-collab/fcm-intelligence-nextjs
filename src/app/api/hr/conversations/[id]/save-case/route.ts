import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const conv = await storage.getHrConversation(parseInt(id));
  if (!conv) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const hrCase = await storage.createHrCase({
    caseType: conv.caseType || "General Query",
    description: conv.title || "HR case from conversation",
    riskLevel: conv.riskLevel || "medium",
  });
  return NextResponse.json(hrCase, { status: 201 });
}
