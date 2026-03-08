import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const assignment = await storage.getImAssignment(parseInt(id));
    if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    const proposals = await storage.getImProposalsByAssignment(assignment.id);
    const proposalsWithProfiles = await Promise.all(
      proposals.map(async (p) => {
        const manager = await storage.getImProfile(p.managerId);
        return { ...p, manager };
      })
    );
    const operator = await storage.getImProfile(assignment.operatorId);
    return NextResponse.json({ assignment, proposals: proposalsWithProfiles, operator });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const assignment = await storage.updateImAssignment(parseInt(id), body);
    if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    return NextResponse.json(assignment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
