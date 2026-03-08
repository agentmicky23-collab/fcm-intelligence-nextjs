import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const proposal = await storage.updateImProposal(parseInt(id), body);
    if (!proposal) return NextResponse.json({ error: "Proposal not found" }, { status: 404 });

    if (body.status === "accepted") {
      await storage.updateImAssignment(proposal.assignmentId, {
        status: "matched",
        matchedManagerId: proposal.managerId,
      });
      const otherProposals = await storage.getImProposalsByAssignment(proposal.assignmentId);
      const declinePromises = otherProposals
        .filter((other) => other.id !== proposal.id && other.status === "pending")
        .map((other) => storage.updateImProposal(other.id, { status: "declined" }));
      await Promise.all(declinePromises);
    }
    return NextResponse.json(proposal);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
