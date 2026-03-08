import { handlers } from "@/auth";

// Force dynamic to prevent static generation during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = handlers.GET;
export const POST = handlers.POST;
