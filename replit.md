# FCM Intelligence

## Overview
A full-stack Progressive Web App for a UK Post Office franchise operator (40+ branches). Features a premium dark theme with gold (#FFD700) accent, using Inter and JetBrains Mono fonts.

## Architecture
- **Framework**: Next.js 16 App Router (Turbopack) — created with `create-next-app --no-src-dir`
- **Frontend**: React 19 + Tailwind CSS v4 + Recharts + React Query
- **Backend**: Next.js API Route Handlers + Drizzle ORM + PostgreSQL
- **Shared**: `shared/schema.ts` defines all data models with Drizzle + Zod validation
- **Path alias**: `@/*` → `./*` (root-level mapping, no `src/` directory)

## Three-Layer Access
1. **Public Pages** (`/`, `/about`, `/services`, `/blog`, `/contact`) — No auth required
2. **Admin Dashboard** (`/dashboard/*`) — For admin (mikeshparekh@gmail.com)
3. **FCM Insiders** (`/insiders/*`) — For authenticated members

## Project Structure
```
app/                    # Next.js App Router pages + API routes
  page.tsx              # Home
  layout.tsx            # Root layout
  providers.tsx         # React Query + UI providers
  globals.css           # Tailwind v4 + dark theme design system
  about/page.tsx
  blog/page.tsx
  contact/page.tsx
  services/page.tsx
  dashboard/            # Admin dashboard pages
    page.tsx, agents/, content/, costs/, hr/,
    market-scan/, opportunities/, settings/, swarm/
  insiders/             # FCM Insiders portal pages
    page.tsx, insights/, listings/, market/, profile/
  api/                  # Next.js API Route Handlers
    agents/, content/, costs/, dashboard/, feedback/,
    hr/, opportunities/, scan/, contact/
components/             # React components
  layout/               # Navbar, Footer, AppLayout, Sidebars, MobileBottomNav
  ui/                   # 55 shadcn/ui components
  ClientOnly.tsx        # Hydration mismatch fix
lib/                    # Utilities
  api.ts, db.ts, queryClient.ts, storage.ts, utils.ts
hooks/                  # React hooks
  use-mobile.tsx, use-toast.ts
shared/                 # Shared between client & server
  schema.ts             # 11 Drizzle table definitions + Zod schemas
```

## Database Tables
- `opportunities` — Business acquisition pipeline
- `content` — Content pipeline with platform versions, scheduling, tone/style
- `agent_health` — Agent health monitoring
- `agent_activity` — Agent swarm activity feed
- `scan_config` — Market scan parameter configuration
- `scan_history` — Market scan execution history
- `hr_conversations` — Ask Harper chat conversations
- `hr_cases` — Formal HR case records
- `cost_records` — Daily cost tracking by model and agent
- `feedback_log` — Feedback signal logging
- `contact_submissions` — Public contact form submissions

## API Endpoints (Next.js Route Handlers)
All under `app/api/`:
- `opportunities/route.ts` — GET, POST
- `opportunities/insider/route.ts` — GET
- `opportunities/[id]/route.ts` — GET, PATCH
- `content/route.ts` — GET, POST
- `content/published/route.ts` — GET
- `content/calendar/route.ts` — GET
- `content/[id]/route.ts` — GET, PATCH
- `content/[id]/platforms/route.ts` — GET
- `content/[id]/adapt/route.ts` — POST
- `content/[id]/platform/[platform]/route.ts` — PATCH
- `content/[id]/approve/route.ts` — POST
- `content/[id]/schedule/route.ts` — PATCH
- `agents/route.ts` — GET, POST
- `agents/activity/route.ts` — GET, POST
- `agents/[name]/detail/route.ts` — GET
- `scan/config/route.ts` — GET, PUT
- `scan/trigger/route.ts` — POST
- `scan/history/route.ts` — GET
- `costs/route.ts` — GET, POST
- `costs/summary/route.ts` — GET
- `hr/route.ts` — GET, POST
- `hr/[id]/route.ts` — GET, PATCH
- `hr/conversations/route.ts` — GET, POST
- `hr/conversations/[id]/route.ts` — GET, PATCH
- `hr/conversations/[id]/save-case/route.ts` — POST
- `feedback/route.ts` — POST
- `contact/route.ts` — POST
- `dashboard/route.ts` — GET

## Brand Rules
- Background: #000000, Cards: #1A1A1A, Border: #333333
- Gold accent: #FFD700 (hover: #E6C200)
- All financial numbers use `font-financial` class (JetBrains Mono in gold)
- No light mode. Dark theme only.

## Development
- **Workflow**: `npx next build && npx next start -p 5000`
- `npm run dev` — Dev server on port 5000
- `npm run build` — Production build
- `npm run db:push` — Push schema changes to database

## Hydration Notes
- Replit webview proxy can cause React #418 hydration mismatch errors
- `ClientApp` wrapper in `components/ClientOnly.tsx` defers rendering until client mount
- Inline suppression script in layout.tsx `<head>` catches errors before React loads
- `suppressHydrationWarning` on `<html>` and `<body>` in root layout
- `global-error.tsx` catches remaining errors and auto-recovers

## Config
- `next.config.ts`: `serverExternalPackages: ["pg"]`, `allowedDevOrigins`, `devIndicators: false`
- `postcss.config.mjs`: `@tailwindcss/postcss` (Tailwind v4)
- `tsconfig.json`: `@/*` → `./*` (root-level, no src/ directory)
