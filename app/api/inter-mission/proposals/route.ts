import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { insertImProposalSchema } from "@/shared/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = insertImProposalSchema.parse(body);
    const proposal = await storage.createImProposal(parsed);
    return NextResponse.json(proposal, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit proposal" }, { status: 400 });
  }
}
