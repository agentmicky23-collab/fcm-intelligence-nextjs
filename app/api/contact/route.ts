import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { insertContactSubmissionSchema } from "@/shared/schema";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = insertContactSubmissionSchema.parse(body);
    const data = await storage.createContactSubmission(parsed);
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ message: "Validation error", errors: e.errors }, { status: 400 });
    }
    throw e;
  }
}
