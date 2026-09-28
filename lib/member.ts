// What the membership form sends to /api/member, and what it gets back.

export type JoinPayload = {
  name: string;
  email: string;
  situation?: string;
  consent: boolean;
  sourcePath: string;
  company_url?: string; // honeypot
  elapsedMs: number;
};

export type JoinResult = { ok: true } | { ok: false; error: "invalid" | "rate_limited" | "unavailable" };

export const situations = [
  "Researching",
  "Actively looking to buy",
  "Found a branch",
  "New operator (1-2 branches)",
  "Established operator (3+ branches)",
  "Other",
] as const;

export const memberBenefits = [
  "Every checklist, worksheet and guide as I release them",
  "A short email when I publish something worth reading, a couple of times a month at most",
  "Leave with one click, any time",
] as const;
