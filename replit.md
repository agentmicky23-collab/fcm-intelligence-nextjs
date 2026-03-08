# FCM Intelligence

## Overview
A full-stack Progressive Web App for a UK Post Office franchise operator (40+ branches). Features a premium dark theme with gold (#FFD700) accent, using Inter and JetBrains Mono fonts. Includes **Inter-Mission** — a Post Office people marketplace with green (#00FF88) "sport mode" design.

## Architecture
- **Framework**: Next.js 16 App Router (Turbopack) — created with `create-next-app --no-src-dir`
- **Frontend**: React 19 + Tailwind CSS v4 + Recharts + React Query
- **Backend**: Next.js API Route Handlers + Drizzle ORM + PostgreSQL
- **Shared**: `shared/schema.ts` defines all data models with Drizzle + Zod validation
- **Path alias**: `@/*` → `./*` (root-level mapping, no `src/` directory)

## Three-Layer Access + Inter-Mission
1. **Public Pages** (`/`, `/about`, `/services`, `/blog`, `/contact`) — No auth required
2. **Admin Dashboard** (`/dashboard/*`) — For admin (mikeshparekh@gmail.com)
3. **FCM Insiders** (`/insiders/*`) — For authenticated members
4. **Inter-Mission** (`/inter-mission/*`) — People marketplace (green #00FF88 accent)

## Project Structure
```
app/                    # Next.js App Router pages + API routes
  page.tsx              # Home
  layout.tsx            # Root layout
  providers.tsx         # React Query + UI providers
  globals.css           # Tailwind v4 + dark theme + Inter-Mission sport mode
  about/page.tsx
  blog/page.tsx
  contact/page.tsx
  services/page.tsx
  dashboard/            # Admin dashboard pages
    page.tsx, agents/, content/, costs/, hr/,
    market-scan/, opportunities/, settings/, swarm/
  insiders/             # FCM Insiders portal pages
    page.tsx, insights/, listings/, market/, profile/
  inter-mission/        # Inter-Mission marketplace (green sport mode)
    layout.tsx          # IM layout with green nav + mobile bottom nav
    page.tsx            # Landing (hero, stats, activity, expertise tracks)
    register/           # Registration pages (manager, operator, employee)
    assignments/        # Browse, detail [id], post assignments
    people/             # Browse profiles, profile detail [id]
    map/                # UK region map
    favorites/          # Saved profiles & assignments
    dashboard/          # User dashboard (overview, assignments, reviews, earnings, settings)
  api/                  # Next.js API Route Handlers
    agents/, content/, costs/, dashboard/, feedback/,
    hr/, opportunities/, scan/, contact/
    inter-mission/      # 19 IM API routes
      register/, profile/, people/, people/[id]/,
      assignments/, assignments/[id]/, proposals/,
      proposals/[id]/, reviews/, reviews/[profileId]/,
      earnings/, stats/, map-data/, activity/,
      vetting/skip/, availability/[id]/,
      stealth/subscribe/, stealth/cancel/,
      favorites/
components/             # React components
  layout/               # Navbar, Footer, AppLayout, Sidebars, MobileBottomNav
  ui/                   # 55 shadcn/ui components
  ClientOnly.tsx        # Hydration mismatch fix
lib/                    # Utilities
  api.ts, db.ts, queryClient.ts, storage.ts, utils.ts
  im-constants.ts       # Inter-Mission expertise tracks, skills, regions
hooks/                  # React hooks
  use-mobile.tsx, use-toast.ts
shared/                 # Shared between client & server
  schema.ts             # 20 Drizzle table definitions + Zod schemas
scripts/
  seed-inter-mission.ts # Seed IM with 15 managers, 5 operators, 8 assignments, etc.
```

## Database Tables (20 total)
### FCM Intelligence (11 tables)
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

### Inter-Mission (8 tables)
- `im_profiles` — Manager/operator/employee profiles with expertise, ratings, verification
- `im_availability` — Calendar availability per profile
- `im_assignments` — Assignments posted by operators
- `im_proposals` — Proposals submitted by managers
- `im_reviews` — Double-sided review system (5 criteria + written)
- `im_earnings` — Earnings log for managers
- `im_vetting_queue` — Verification queue (standard + priority £3.99 skip)
- `im_saved_managers` — Operator saved/bookmarked managers
- `im_favorites` — User favorited profiles and assignments

## Inter-Mission Network Command (Map Page)
- **Interactive SVG Map**: Custom UK outline with 12 clickable/hoverable regions, green intensity fill based on activity
- **Region Detail Panel**: Shows managers, assignments, top people, open jobs for selected region
- **Gamification**: Network Score (animated counter), Coverage Progress Bar, 6 Achievement Badges (First Region, 5 Regions, Full Coverage, Squad Up, In Demand, Hotspot)
- **Live Stats Bar**: Total managers, assignments, active regions, coverage percentage with animated counting
- **Region Status Badges**: Hotspot (5+), Growing (2+), Active (1+), Needs Coverage (0)
- **Region Cards Grid**: All 12 regions as sortable cards below map with manager/assignment counts
- **Accessibility**: SVG regions have keyboard focus, ARIA labels, Enter/Space activation
- **Files**: `components/inter-mission/UKMap.tsx` (SVG component), `app/inter-mission/map/page.tsx` (full page)

## Inter-Mission Assignments Page Features
- **Calendar View**: Monthly grid with colour-coded assignment bars spanning date ranges
- **Expanded Day Panel**: Click a day with assignments → slides open a panel listing all assignments for that day with details
- **Full Detail Modal**: Click any assignment (calendar/expanded day/list) → fetches full data from API → shows all fields, proposals, operator info
- **Role-Based Actions**: Operator who posted sees "Edit Assignment"; Managers see "Send Proposal" with inline form (rate + message)
- **Assignment List**: Always visible below the calendar showing all filtered assignments as cards, sorted by start date
- **Post Assignment**: Click "+" on any day or click an empty day to open the post form
- **Demo Role Detection**: Uses first operator/manager profiles from DB (no real auth yet); `operatorId` comparison determines ownership

## Inter-Mission Design Rules ("Sport Mode")
- **ONLY** within `/inter-mission/*` pages — rest of site stays gold
- Background: #000000, Cards: #0A1A0F, Primary: #00FF88, Hover: #00CC6A
- Borders: #1A3A25, Danger: #FF4444, Muted text: #888888
- Cards glow green on hover: `box-shadow: 0 0 20px rgba(0,255,136,0.15)`
- CSS class `.im-section` applies green theme overrides
- Utility classes: `.im-card`, `.im-btn-primary`, `.im-btn-secondary`, `.im-text-green`, `.im-font-financial`
- Animations: `.im-pulse-available`, `.im-pulse-urgent`, `.im-animate-in`
- Three user types: Manager (supply), Operator (demand), Employee (job seeker)
- Verification flow: unvetted → priority_vetting → vetted → blocked

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
- `npx tsx scripts/seed-inter-mission.ts` — Seed Inter-Mission data

## Hydration Notes
- Replit webview proxy can cause React #418 hydration mismatch errors
- `suppressHydrationWarning` on `<html>` and `<body>` in root layout
- `global-error.tsx` catches remaining errors and auto-recovers

## Config
- `next.config.ts`: `serverExternalPackages: ["pg"]`, `allowedDevOrigins`, `devIndicators: false`
- `postcss.config.mjs`: `@tailwindcss/postcss` (Tailwind v4)
- `tsconfig.json`: `@/*` → `./*` (root-level, no src/ directory)
