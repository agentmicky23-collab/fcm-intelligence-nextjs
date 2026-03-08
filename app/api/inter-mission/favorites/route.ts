import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("profileId");
  if (!raw) return NextResponse.json({ error: "profileId required" }, { status: 400 });
  const profileId = parseInt(raw, 10);
  if (isNaN(profileId) || profileId <= 0) return NextResponse.json({ error: "profileId must be a positive integer" }, { status: 400 });

  try {
    const result = await storage.getFavoritesWithDetails(profileId);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, targetType, targetId } = body;

    if (!profileId || !targetType || !targetId) {
      return NextResponse.json({ error: "profileId, targetType, and targetId required" }, { status: 400 });
    }

    const pid = Number(profileId);
    const tid = Number(targetId);
    if (!Number.isInteger(pid) || pid <= 0 || !Number.isInteger(tid) || tid <= 0) {
      return NextResponse.json({ error: "profileId and targetId must be positive integers" }, { status: 400 });
    }

    if (!["profile", "assignment"].includes(targetType)) {
      return NextResponse.json({ error: "targetType must be 'profile' or 'assignment'" }, { status: 400 });
    }

    const existing = await storage.getFavorites(pid, targetType);
    const isFavorited = existing.some(f => f.targetId === tid);

    if (isFavorited) {
      await storage.removeFavorite(pid, targetType, tid);
      return NextResponse.json({ action: "removed", favorited: false });
    } else {
      const fav = await storage.addFavorite({ profileId: pid, targetType, targetId: tid });
      return NextResponse.json({ action: "added", favorited: true, favorite: fav });
    }
  } catch {
    return NextResponse.json({ error: "Failed to toggle favorite" }, { status: 500 });
  }
}
