import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; platform: string }> }) {
  const { id, platform } = await params;
  const data = await storage.getContentById(parseInt(id));
  if (!data) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const body = await req.json();
  const versions = (data.platformVersions as Record<string, any>) || {};
  versions[platform] = { ...versions[platform], ...body };
  const updated = await storage.updateContent(data.id, { platformVersions: versions });
  return NextResponse.json(updated);
}
