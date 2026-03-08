import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await storage.getContentById(parseInt(id));
  if (!data) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const { platform } = await req.json();
  const versions = (data.platformVersions as Record<string, any>) || {};
  versions[platform] = { body: data.body, status: "draft" };
  const updated = await storage.updateContent(data.id, { platformVersions: versions });
  return NextResponse.json(updated);
}
