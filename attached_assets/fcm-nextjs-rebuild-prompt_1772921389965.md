# FCM INTELLIGENCE PWA — NEXT.JS REBUILD
#
# CRITICAL CONTEXT: This is a REBUILD of an existing working app.
# The app currently exists as Vite + Express and works perfectly on Replit.
# It needs to be rebuilt as Next.js so it deploys correctly to Vercel.
#
# The design, features, and functionality are ALREADY BUILT and working.
# DO NOT change the design. DO NOT remove features. Rebuild the same app
# in Next.js App Router with the exact same look and feel.
#
# ═══════════════════════════════════════════════════════════════════

## IMPORTANT — READ FIRST

This project already exists as a Vite + Express + React app in this Replit workspace. I need you to REBUILD it as a Next.js App Router application so it deploys to Vercel without issues.

**Rules:**
1. Keep the EXACT same visual design — dark theme (#000000), gold accents (#FFD700), red (#FF0000), JetBrains Mono for financial data, Inter for everything else
2. Keep ALL existing features — every page, every component, every API endpoint
3. Keep the same database schema (Drizzle ORM + PostgreSQL)
4. Keep all the same UI components (reuse the existing Shadcn/Radix components)
5. The ONLY thing changing is the framework: Vite + Express → Next.js App Router
6. Use Next.js API routes instead of Express routes
7. Use Next.js App Router file-based routing instead of wouter/react-router

## Tech Stack (Next.js Rebuild)

- Framework: **Next.js 14+ with App Router** (NOT Pages Router)
- Language: TypeScript
- Styling: Tailwind CSS (keep existing tailwind config and CSS)
- Database: Drizzle ORM + PostgreSQL (Vercel Postgres — keep existing schema)
- Charts: Recharts (keep existing chart components)
- UI Components: Keep all existing Shadcn/Radix components
- Deployment: Vercel (this is why we're rebuilding — Next.js deploys perfectly to Vercel)

## Project Structure — Convert To This

```
app/
├── layout.tsx              # Root layout (dark theme, fonts, global styles)
├── page.tsx                # Homepage (convert from client/src/pages/Home.tsx)
├── about/
│   └── page.tsx            # About (from About.tsx)
├── services/
│   └── page.tsx            # Services (from Services.tsx)
├── blog/
│   └── page.tsx            # Blog (from Blog.tsx)
├── contact/
│   └── page.tsx            # Contact (from Contact.tsx)
├── dashboard/
│   ├── layout.tsx          # Dashboard layout with sidebar
│   ├── page.tsx            # Dashboard home (from DashboardHome.tsx)
│   ├── swarm/
│   │   └── page.tsx        # Agent Swarm (from Swarm.tsx or AgentSwarm.tsx)
│   ├── opportunities/
│   │   └── page.tsx        # Opportunities (from Opportunities.tsx)
│   ├── market-scan/
│   │   └── page.tsx        # Market Scan (from MarketScan.tsx)
│   ├── content/
│   │   └── page.tsx        # Content Pipeline (from ContentPipeline.tsx)
│   ├── costs/
│   │   └── page.tsx        # Costs (from Costs.tsx)
│   ├── agents/
│   │   └── page.tsx        # Agents (from Agents.tsx)
│   ├── hr/
│   │   └── page.tsx        # Ask Harper (from HrCases.tsx)
│   └── settings/
│       └── page.tsx        # Settings (from DashboardSettings.tsx)
├── insiders/
│   ├── layout.tsx          # Insiders layout with sidebar
│   ├── page.tsx            # Insiders home (from InsidersHome.tsx)
│   ├── listings/
│   │   └── page.tsx        # Listings (from Listings.tsx)
│   ├── market/
│   │   └── page.tsx        # Market (from Market.tsx)
│   ├── insights/
│   │   └── page.tsx        # Insights (from Insights.tsx)
│   └── profile/
│       └── page.tsx        # Profile (from Profile.tsx)
├── api/
│   ├── health/
│   │   └── route.ts        # Health check
│   ├── opportunities/
│   │   ├── route.ts        # GET all, POST new
│   │   ├── insider/
│   │   │   └── route.ts    # GET insider-visible only
│   │   └── [id]/
│   │       └── route.ts    # GET one, PATCH update
│   ├── content/
│   │   ├── route.ts        # GET all, POST new
│   │   ├── published/
│   │   │   └── route.ts    # GET published only
│   │   └── [id]/
│   │       ├── route.ts    # GET one, PATCH update
│   │       ├── adapt/
│   │       │   └── route.ts
│   │       └── approve/
│   │           └── route.ts
│   ├── agents/
│   │   ├── route.ts        # GET health, POST update
│   │   └── activity/
│   │       └── route.ts    # GET activity feed
│   ├── costs/
│   │   ├── route.ts        # GET records, POST new
│   │   └── summary/
│   │       └── route.ts    # GET summary
│   ├── hr/
│   │   ├── route.ts        # GET cases, POST new
│   │   ├── [id]/
│   │   │   └── route.ts    # GET one, PATCH update
│   │   └── conversations/
│   │       ├── route.ts    # GET all, POST new
│   │       └── [id]/
│   │           └── route.ts
│   ├── feedback/
│   │   └── route.ts        # POST feedback
│   ├── contact/
│   │   └── route.ts        # POST contact form
│   ├── dashboard/
│   │   └── route.ts        # GET dashboard summary
│   ├── scan/
│   │   ├── config/
│   │   │   └── route.ts    # GET/PUT scan config
│   │   ├── trigger/
│   │   │   └── route.ts    # POST trigger scan
│   │   └── history/
│   │       └── route.ts    # GET scan history
│   └── marketplace/
│       ├── listings/
│       │   └── route.ts
│       └── quiz/
│           └── route.ts
├── globals.css             # Keep existing CSS with dark theme
└── not-found.tsx           # 404 page
components/
├── ui/                     # Keep ALL existing Shadcn components as-is
├── layout/
│   ├── Navbar.tsx          # Keep existing
│   ├── Footer.tsx          # Keep existing
│   ├── DashboardSidebar.tsx # Extract from DashboardHome
│   └── InsidersSidebar.tsx  # Extract from InsidersHome
└── charts/                 # Any shared chart components
lib/
├── db.ts                   # Database connection (Drizzle + Vercel Postgres)
├── schema.ts               # Keep existing Drizzle schema from shared/schema.ts
├── storage.ts              # Keep existing storage layer
├── seed.ts                 # Database seeding with ALL 35 listings
└── utils.ts                # Keep existing utilities
public/
├── favicon.png
└── opengraph.jpg
```

## Converting Express Routes to Next.js API Routes

The existing Express routes in server/routes.ts need to become Next.js API route handlers.

**Express pattern:**
```typescript
app.get("/api/opportunities", async (req, res) => {
  const data = await storage.getOpportunities(req.query);
  res.json(data);
});
```

**Next.js pattern:**
```typescript
// app/api/opportunities/route.ts
import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status") || undefined;
  const businessType = searchParams.get("businessType") || undefined;
  const data = await storage.getOpportunities({ status, businessType });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const data = await storage.createOpportunity(body);
  return NextResponse.json(data, { status: 201 });
}
```

Convert ALL routes from server/routes.ts using this pattern. Every Express route becomes a Next.js API route handler.

## Converting React Components

The existing React components use React Query (TanStack Query) and wouter for routing. In Next.js:

1. **Keep React Query** — it works in Next.js client components. Wrap data-fetching components with "use client" directive.
2. **Replace wouter links** with Next.js `<Link>` from "next/link"
3. **Replace wouter useLocation** with Next.js `usePathname` from "next/navigation"
4. **Keep all Shadcn/Radix UI components exactly as they are** — just copy the components/ui/ folder
5. **Keep all Recharts components** — they work in client components with "use client"
6. **Keep all Lucide icons** — same imports

**Component conversion pattern:**
```typescript
// Add "use client" to any component that uses hooks, state, or browser APIs
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// Rest of component stays the same
```

## Database Connection — Vercel Postgres

Replace the existing database connection with Vercel Postgres:

```typescript
// lib/db.ts
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./schema";

export const db = drizzle(sql, { schema });
```

**Keep the entire schema from shared/schema.ts** — just move it to lib/schema.ts. Don't change any table definitions, types, or Zod schemas.

## Database Seeding — ALL 35 Listings

The seed file MUST include ALL 35 opportunity listings. The current seed.ts only has 15 hardcoded. There are JSON files with all 35 listings in the migration-data folder.

Read the existing server/seed.ts and the migration-data/listings-35.json. Combine them to create a complete seed that includes:
- ALL 35 Post Office listings with full metadata
- 4 report pricing tiers (£99, £149, £249, £449)
- FCM Insider membership (£15/month)
- 6 services with pricing
- 4 blog posts
- 7 agent health records (one per agent)
- 14 days of sample cost records
- 3 HR case samples
- 20 agent activity feed entries

## Critical Design Rules (DO NOT CHANGE)

1. **Background: #000000** everywhere. No white backgrounds. No light mode.
2. **Gold accent: #FFD700** for all CTAs, highlights, active states, financial data
3. **Red: #FF0000** for alerts and brand mark only
4. **Card background: #1A1A1A** with border #333333
5. **Text: #FFFFFF** primary, #888888 muted
6. **Financial numbers: JetBrains Mono font in gold**
7. **All other text: Inter font**
8. **Cards hover: border transitions to gold**
9. **Primary buttons: Gold background, black text**
10. **Minimum touch target: 44x44px**

## Mobile Navigation

Keep the existing bottom navigation bar on mobile (below 768px):
- 5 tabs: Overview, Swarm, Pipeline, Content, More
- "More" expands to show: Market Scan, Costs, Ask Harper, Agents, Settings
- Fixed positioning at bottom
- Gold active indicator
- Hide desktop sidebar on mobile

## Pages to Convert (Complete List)

Convert each of these from the existing Vite/React components to Next.js pages:

**Public (5):**
1. / — Home.tsx → app/page.tsx
2. /about — About.tsx → app/about/page.tsx
3. /services — Services.tsx → app/services/page.tsx
4. /blog — Blog.tsx → app/blog/page.tsx
5. /contact — Contact.tsx → app/contact/page.tsx

**Dashboard (9):**
6. /dashboard — DashboardHome.tsx → app/dashboard/page.tsx
7. /dashboard/swarm — AgentSwarm/Swarm.tsx → app/dashboard/swarm/page.tsx
8. /dashboard/opportunities — Opportunities.tsx → app/dashboard/opportunities/page.tsx
9. /dashboard/market-scan — MarketScan.tsx → app/dashboard/market-scan/page.tsx
10. /dashboard/content — ContentPipeline.tsx → app/dashboard/content/page.tsx
11. /dashboard/costs — Costs.tsx → app/dashboard/costs/page.tsx
12. /dashboard/agents — Agents.tsx → app/dashboard/agents/page.tsx
13. /dashboard/hr — HrCases.tsx → app/dashboard/hr/page.tsx
14. /dashboard/settings — DashboardSettings.tsx → app/dashboard/settings/page.tsx

**Insiders (5):**
15. /insiders — InsidersHome.tsx → app/insiders/page.tsx
16. /insiders/listings — Listings.tsx → app/insiders/listings/page.tsx
17. /insiders/market — Market.tsx → app/insiders/market/page.tsx
18. /insiders/insights — Insights.tsx → app/insiders/insights/page.tsx
19. /insiders/profile — Profile.tsx → app/insiders/profile/page.tsx

## Environment Variables

The app needs these environment variables (set in Vercel dashboard):

```
# Database (Vercel Postgres — auto-populated when you add Postgres storage)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=

# Stripe (existing keys from current site)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
SENDGRID_API_KEY=

# Discord
DISCORD_WEBHOOK_URL=

# App
NEXT_PUBLIC_APP_URL=https://fcm-pwa.vercel.app
```

## Vercel Configuration

Create a minimal vercel.json:

```json
{
  "framework": "nextjs"
}
```

That's it. Next.js on Vercel needs almost no configuration — Vercel auto-detects and configures everything.

## Build and Deploy

After rebuilding:
1. `npm run build` should complete with zero errors
2. All 19 routes should appear in the build output
3. API routes should be listed as serverless functions
4. `npm run dev` should work locally for testing
5. Push to GitHub → Vercel auto-deploys

## FINAL CHECK — Before You Finish

Verify ALL of these:
- [ ] All 19 pages render correctly
- [ ] Dark theme applied everywhere (#000000 background)
- [ ] Gold accents (#FFD700) on all CTAs and financial data
- [ ] JetBrains Mono font on all financial numbers
- [ ] Mobile bottom navigation working
- [ ] All API routes return correct data
- [ ] Database connected and returning seeded data
- [ ] Dashboard shows agent status, opportunity pipeline, content pipeline, costs
- [ ] Agent Swarm shows network topology and activity feed
- [ ] Market Scan has working sliders and filters
- [ ] Ask Harper has chat interface with mock responses
- [ ] Content Mission Control has platform adaptation buttons
- [ ] Insiders area shows listings, market data, insights
- [ ] No console errors
- [ ] Build completes successfully

## START NOW

Read the existing codebase in this workspace. Convert it to Next.js App Router following the rules above. Keep every feature, every component, every design element. The only thing changing is the framework.
