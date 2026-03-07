# FCM Intelligence

## Overview
A full-stack Progressive Web App for a UK Post Office franchise operator (40+ branches). Features a premium dark theme with gold (#FFD700) accent, using Inter and JetBrains Mono fonts.

## Architecture
- **Framework**: Next.js 16 App Router (Turbopack)
- **Frontend**: React 19 + Tailwind CSS v4 + Recharts + React Query
- **Backend**: Next.js API Route Handlers + Drizzle ORM + PostgreSQL
- **Shared**: `shared/schema.ts` defines all data models with Drizzle + Zod validation
- **Path aliases**: `@/*` → `./src/*`, `@shared/*` → `./shared/*`

## Three-Layer Access
1. **Public Pages** (`/`, `/about`, `/services`, `/blog`, `/contact`) — No auth required
2. **Admin Dashboard** (`/dashboard/*`) — For admin (mikeshparekh@gmail.com)
3. **FCM Insiders** (`/insiders/*`) — For authenticated members

## Database Tables
- `opportunities` — Business acquisition pipeline
- `content` — Content pipeline with platform versions, scheduling, tone/style
- `agent_health` — Agent health monitoring
- `agent_activity` — Agent swarm activity feed (actions, handoffs, errors)
- `scan_config` — Market scan parameter configuration
- `scan_history` — Market scan execution history
- `hr_conversations` — Ask Harper chat conversations with structured messages
- `hr_cases` — Formal HR case records
- `cost_records` — Daily cost tracking by model and agent
- `feedback_log` — Feedback signal logging
- `contact_submissions` — Public contact form submissions

## Key Files
- `shared/schema.ts` — All 11 database table schemas with Drizzle + Zod
- `src/lib/db.ts` — Database connection (pg Pool + Drizzle)
- `src/lib/storage.ts` — DatabaseStorage class with all CRUD methods
- `src/lib/queryClient.ts` — React Query client + apiRequest helper
- `src/app/layout.tsx` — Root layout with fonts, dark theme, providers
- `src/app/globals.css` — Design system (dark theme, gold accent, custom utilities)
- `src/components/layout/` — Navbar, Footer, AppLayout, DashboardSidebar, InsidersSidebar, MobileBottomNav
- `src/components/ui/` — 55 shadcn/ui components
- `src/app/api/` — All API route handlers

## Page Structure
### Public
- `src/app/page.tsx` — Home
- `src/app/about/page.tsx` — About
- `src/app/services/page.tsx` — Services
- `src/app/blog/page.tsx` — Blog
- `src/app/contact/page.tsx` — Contact

### Dashboard
- `src/app/dashboard/page.tsx` — Overview (DashboardHome)
- `src/app/dashboard/swarm/page.tsx` — Agent Swarm visualization
- `src/app/dashboard/opportunities/page.tsx` — Pipeline Kanban
- `src/app/dashboard/market-scan/page.tsx` — Market Scan parameters
- `src/app/dashboard/content/page.tsx` — Content Mission Control
- `src/app/dashboard/costs/page.tsx` — Cost Analytics (Recharts)
- `src/app/dashboard/hr/page.tsx` — Ask Harper chat
- `src/app/dashboard/agents/page.tsx` — Agent detail cards
- `src/app/dashboard/settings/page.tsx` — Settings

### Insiders
- `src/app/insiders/page.tsx` — Insiders Home
- `src/app/insiders/listings/page.tsx` — Opportunity Listings
- `src/app/insiders/market/page.tsx` — Market Data
- `src/app/insiders/insights/page.tsx` — Insights
- `src/app/insiders/profile/page.tsx` — Profile

## API Endpoints (Next.js Route Handlers)
All under `src/app/api/`:
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

## Mobile Navigation
- `DashboardMobileNav` and `InsidersMobileNav` in `src/components/layout/MobileBottomNav.tsx`
- Fixed bottom bar on mobile (<768px), #1A1A1A bg, gold active indicator, 44px min touch targets
- Dashboard: Overview, Swarm, Pipeline, Content tabs + "More" overlay
- Insiders: Feed, Listings, Market, Insights, Profile tabs
- All pages include `pb-20 md:pb-8` on `<main>` to prevent content overlap

## Brand Rules
- Background: #000000, Cards: #1A1A1A, Border: #333333
- Gold accent: #FFD700 (hover: #E6C200)
- All financial numbers use `font-financial` class (JetBrains Mono in gold)
- No light mode. Dark theme only.

## Development
- `npx next dev -p 5000` — Dev server with Turbopack
- `npx next build` — Production build
- `npm run db:push` — Push schema changes to database
