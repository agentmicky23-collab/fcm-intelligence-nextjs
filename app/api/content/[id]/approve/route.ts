import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await storage.getContentById(parseInt(id));
  if (!data) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const { platforms } = await req.json();
  const versions = (data.platformVersions as Record<string, any>) || {};
  for (const p of platforms || []) {
    if (versions[p]) versions[p].status = "approved";
  }
  const updated = await storage.updateContent(data.id, {
    status: "published",
    publishedAt: new Date(),
    platformVersions: versions,
  });
  return NextResponse.json(updated);
}
