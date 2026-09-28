import { createHash } from "node:crypto";

/** A daily-salted hash of the sender's IP, so repeat submissions can be limited without storing the IP. */
export function senderHash(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.ENQUIRY_HASH_SALT ?? "fcm-enquiries";
  return createHash("sha256").update(`${ip}|${day}|${salt}`).digest("hex").slice(0, 32);
}

export const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();
export const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
