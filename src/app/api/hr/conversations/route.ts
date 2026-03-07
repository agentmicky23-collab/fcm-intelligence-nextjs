import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { insertHrConversationSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function GET() {
  const data = await storage.getHrConversations();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = insertHrConversationSchema.parse(body);
    const data = await storage.createHrConversation(parsed);
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ message: "Validation error", errors: e.errors }, { status: 400 });
    }
    throw e;
  }
}
