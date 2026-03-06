# FCM Intelligence

## Overview
A full-stack Progressive Web App for a UK Post Office franchise operator (40+ branches). Features a premium dark theme with gold (#FFD700) accent, using Inter and JetBrains Mono fonts.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS v4 + wouter routing + Recharts
- **Backend**: Express.js + Drizzle ORM + PostgreSQL
- **Shared**: `shared/schema.ts` defines all data models with Drizzle + Zod validation

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
- `server/db.ts` — Database connection
- `server/storage.ts` — DatabaseStorage class implementing IStorage interface
- `server/routes.ts` — All API routes prefixed with `/api`
- `server/seed.ts` — Database seed script with realistic sample data
- `client/src/App.tsx` — Main router with all page routes
- `client/src/index.css` — Design system (dark theme, gold accent, custom utilities)
- `client/src/components/layout/` — Navbar, Footer, AppLayout
- `client/src/pages/dashboard/` — All admin dashboard pages
- `client/src/pages/insiders/` — All insider-area pages

## Dashboard Pages
- `/dashboard` — Overview (DashboardHome.tsx + exported DashboardSidebar)
- `/dashboard/swarm` — Agent Swarm: SVG network visualization, activity feed, agent cards (AgentSwarm.tsx)
- `/dashboard/opportunities` — Pipeline Kanban with status filters (Opportunities.tsx)
- `/dashboard/market-scan` — Market Scan: parameter sliders, scoring weights, filtered results (MarketScan.tsx)
- `/dashboard/content` — Content Mission Control: pipeline flow, workbench, platform adaptations, calendar (ContentPipeline.tsx)
- `/dashboard/costs` — Cost Analytics with Recharts charts (Costs.tsx)
- `/dashboard/hr` — Ask Harper: chat interface with mock structured responses (HrCases.tsx)
- `/dashboard/agents` — Agent detail status cards (Agents.tsx)
- `/dashboard/settings` — Settings page (DashboardSettings.tsx)

## API Endpoints
- `GET/POST/PATCH /api/opportunities` — CRUD for opportunities
- `GET /api/opportunities/insider` — Insider-visible opportunities
- `GET/POST/PATCH /api/content` — Content pipeline management
- `GET /api/content/published` — Published content
- `GET /api/content/calendar` — Scheduled content
- `GET /api/content/:id/platforms` — Platform versions
- `POST /api/content/:id/adapt` — Generate platform adaptation
- `PATCH /api/content/:id/platform/:platform` — Update platform version
- `POST /api/content/:id/approve` — Approve for platforms
- `PATCH /api/content/:id/schedule` — Schedule content
- `GET/POST /api/agents` — Agent health monitoring
- `GET/POST /api/agents/activity` — Agent activity feed
- `GET /api/agents/:name/detail` — Agent detail with activity history
- `GET/PUT /api/scan/config` — Scan configuration
- `POST /api/scan/trigger` — Trigger manual scan
- `GET /api/scan/history` — Scan history
- `GET/POST /api/costs` — Cost records
- `GET /api/costs/summary` — Cost summary (today, week, projected)
- `GET/POST/PATCH /api/hr/conversations` — HR chat conversations
- `POST /api/hr/conversations/:id/save-case` — Convert to formal case
- `GET/POST/PATCH /api/hr` — HR case management
- `POST /api/feedback` — Feedback logging
- `POST /api/contact` — Contact form submissions
- `GET /api/dashboard` — Dashboard summary aggregation

## UI-Only Features (to be wired later by Claudia)
- Ask Harper chat responses use mock structured data with 2s delay
- Content "Regenerate" and "Adapt" buttons show loading then same content
- "Trigger Manual Scan" shows success toast

## Brand Rules
- Background: #000000, Cards: #1A1A1A, Border: #333333
- Gold accent: #FFD700 (hover: #E6C200)
- All financial numbers use `font-financial` class (JetBrains Mono in gold)
- No light mode. Dark theme only.
- Wouter v3 pattern: `<Link href="..." className="...">text</Link>` — no nested `<a>` tags

## Seed Script
Run `npx tsx server/seed.ts` to reset all sample data including agent activity feed, scan config, HR conversations.
