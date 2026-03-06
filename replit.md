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

## Key Files
- `shared/schema.ts` — All database schemas (opportunities, content, agent_health, cost_records, hr_cases, feedback_log, contact_submissions)
- `server/db.ts` — Database connection
- `server/storage.ts` — DatabaseStorage class implementing IStorage interface
- `server/routes.ts` — All API routes prefixed with `/api`
- `server/seed.ts` — Database seed script with realistic sample data
- `client/src/App.tsx` — Main router with all page routes
- `client/src/index.css` — Design system (dark theme, gold accent, custom utilities)
- `client/src/components/layout/` — Navbar, Footer, AppLayout
- `client/src/pages/dashboard/` — All admin dashboard pages
- `client/src/pages/insiders/` — All insider-area pages

## API Endpoints
- `GET/POST/PATCH /api/opportunities` — CRUD for opportunities
- `GET /api/opportunities/insider` — Insider-visible opportunities
- `GET/POST/PATCH /api/content` — Content pipeline management
- `GET /api/content/published` — Published content
- `GET/POST /api/agents` — Agent health monitoring
- `GET/POST /api/costs` — Cost records
- `GET /api/costs/summary` — Cost summary (today, week, projected)
- `GET/POST/PATCH /api/hr` — HR case management
- `POST /api/feedback` — Feedback logging
- `POST /api/contact` — Contact form submissions
- `GET /api/dashboard` — Dashboard summary aggregation

## Brand Rules
- Background: #000000, Cards: #1A1A1A, Border: #333333
- Gold accent: #FFD700 (hover: #E6C200)
- All financial numbers use `font-financial` class (JetBrains Mono in gold)
- No light mode. Dark theme only.
