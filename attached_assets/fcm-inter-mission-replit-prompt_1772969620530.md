# INTER-MISSION — The Post Office People Network
# A marketplace section within FCM Intelligence
# Built as part of the Next.js App Router site
#
# DESIGN DIRECTION: "Sport Mode" — same dark chassis as FCM Intelligence
# but the accent shifts from gold to bright green (#00FF88). The section
# feels faster, more dynamic, more alive. Like switching a car from
# eco mode to sport mode — same vehicle, different energy.
#
# ═══════════════════════════════════════════════════════════════════

## CONTEXT

This is a NEW section within an existing Next.js 16 App Router site (FCM Intelligence). The main site uses a dark theme (#000000 background) with gold (#FFD700) accents. Inter-Mission keeps the dark background but shifts the accent to bright green (#00FF88) — creating a distinct "marketplace mode" that feels energetic and opportunity-driven.

The site already has: public pages, a dashboard, an insiders area, and API routes using Drizzle ORM + PostgreSQL. Inter-Mission adds a new set of pages under /inter-mission.

## WHAT IS INTER-MISSION?

A marketplace connecting Post Office managers/staff who need work with branch operators who need help. Post Office Ltd is cutting area managers. These experienced people need a platform to offer their expertise. Sub-postmasters who are losing their support structure need a way to find reliable, vetted help.

Inter-Mission sits in the middle — matching supply with demand instantly.

**The core principle: help others make money.** Every feature should make it easy for experienced PO people to earn income from their expertise, and easy for operators to find the help they need.

## TECH STACK

- Next.js 16 App Router (already set up)
- TypeScript
- Tailwind CSS (dark theme, bright green #00FF88 accent for this section)
- Drizzle ORM + PostgreSQL (extend existing schema)
- Shadcn/Radix UI components (already installed)
- No external auth for now — simple email-based registration
- Stripe for £3.99 skip-the-queue and £5/month stealth mode payments

## DESIGN RULES — "SPORT MODE"

### Colours (Inter-Mission section ONLY):
- Background: #000000 (same as main site)
- Card background: #0A1A0F (very dark green tint, subtle difference from main site's #1A1A1A)
- Primary accent: #00FF88 (bright green — replaces gold in this section)
- Secondary accent: #00CC6A (darker green for hover states)
- Danger/alert: #FF4444
- Text primary: #FFFFFF
- Text muted: #888888
- Financial data: JetBrains Mono in #00FF88 (green, not gold)
- Borders: #1A3A25 (dark green tint)
- Borders on hover: #00FF88 (green glow)

### Typography:
- Headings: Use a condensed or semi-bold weight — tighter, sharper than the main site
- Body: Inter (same as main site)
- Financial/rate data: JetBrains Mono
- Stats and numbers: Large, animated on scroll

### Motion & Energy:
- Cards have a subtle green glow on hover (box-shadow with #00FF88 at low opacity)
- Numbers animate/count up when they scroll into view
- The activity feed pulses with new entries
- Status badges pulse gently (available = green pulse, on assignment = amber steady)
- Page transitions feel snappy — no lazy loading delays
- The whole section should feel ALIVE — things are happening, money is being made

### Layout:
- Clean, minimal, no clutter
- Generous whitespace
- Cards are the primary UI element
- One clear action per screen
- Mobile-first — everything works on phone

## THREE USER TYPES

### 1. Managers (Supply)
Former area managers, experienced operators offering their expertise as freelance services.

Profile contains:
- Full name (or display name if in stealth mode)
- Profile photo (optional, placeholder avatar if none)
- Horizon User ID (required — proves PO legitimacy)
- Bio (2-3 sentences about their experience)
- Years of experience
- Expertise tracks (multi-select from 8 categories — see below)
- Specific skills within each track (e.g., Horizon, Paystation, banking, mails, etc.)
- Location (postcode or town)
- Willing to travel radius (5mi, 10mi, 25mi, 50mi, nationwide)
- Daily rate (£ amount or "Negotiable")
- Availability calendar (visual week/month view)
- Verification status: Unvetted (preview mode) / Vetted (full access) / Blocked
- Stealth mode: on/off (£5/month — hides profile from public browsing)
- Review scores (5 criteria — see review matrix below)
- Earnings dashboard (total earned, this month, assignments completed)
- Referral link (unique URL to invite others)

### 2. Operators (Demand)
Sub-postmasters and branch operators who need help.

Profile contains:
- Full name
- Branch name
- Branch FAD code (the unique PO branch identifier)
- Location (postcode)
- Contact email and phone
- Branch services (what services they offer — determines what skills they need)
- Verification status: Unvetted / Vetted
- Review scores (5 criteria)
- Past assignments posted

### 3. Employees (Job Seekers)
Staff looking for permanent or temporary work.

Profile contains:
- Full name (or display name if stealth)
- Horizon User ID (if they have one)
- Experience summary
- Skills (from the skills matrix)
- Location + travel radius
- What they're looking for: Full-time / Part-time / Temporary / Any
- Availability
- Expected rate (hourly or daily)
- Verification status

## 8 EXPERTISE TRACKS

Each track has specific skills within it:

1. **Counter Operations** — Holiday cover, daily branch running, customer service, cash handling
2. **Financial Services** — Banking, bill payments, MoneyGram, foreign exchange, savings, ISAs
3. **Compliance & Audit** — Audit preparation, compliance checks, cash management, loss prevention, TC verification
4. **Training & Development** — New staff training, system training, Horizon, Paystation, refresher courses
5. **Management & Strategy** — Branch management, multi-site operations, performance improvement, P&L management
6. **Retail & Commercial** — Retail setup, EPOS configuration, stock management, merchandising, social media setup
7. **Setup & Transitions** — New branch opening, refit management, TUPE, PO Ltd applications, equipment setup
8. **Advisory & Consulting** — Business planning, due diligence, acquisition support, ongoing advisory, franchise guidance

## THE ASSIGNMENT FLOW

### Step 1: Operator Posts Assignment
Simple form — maximum 5 fields visible:
- **What do you need?** (dropdown of 8 expertise tracks, plus "Other")
- **Where?** (postcode or branch name — auto-suggests)
- **When?** (date range picker — start and end date)
- **Any details?** (free text, optional — "Must have banking experience", etc.)
- **Daily budget** (optional — can leave blank, managers will propose)

Optional fields (expandable "More details"):
- Urgency level: Standard / URGENT (same week)
- Duration: Single day / 1 week / 2 weeks / 1 month / Ongoing
- Accommodation available? Yes/No
- Specific skills required (from skills matrix)

### Step 2: Instant Matching
System immediately shows matched managers:
- Filtered by: expertise track match, location/travel radius, availability on those dates, verification status
- Sorted by: distance (nearest first), then rating, then rate
- Each result is a clean card showing: name/avatar, rating (stars + count), expertise tags, distance, daily rate, availability status
- URGENT assignments get pushed as notifications to opted-in managers

### Step 3: Manager Submits Proposal
Manager sees the assignment and taps "I'm Interested":
- Proposed daily rate (pre-filled with their standard rate, editable)
- Short message (optional — "I know this branch, covered there last Christmas")
- Confirm availability for the dates

### Step 4: Operator Reviews & Accepts
Operator sees all proposals:
- Clean list sorted by rating (default) or rate (toggle)
- Each proposal shows: manager card + proposed rate + message
- One tap: "Accept Proposal"
- On acceptance: contact details shared between both parties (email + phone)
- Both get a confirmation notification

### Step 5: Assignment Completion & Review
After end date:
- Both parties prompted to review each other
- Review is structured (see review matrix below)
- Earnings logged to manager's dashboard

## REVIEW MATRIX

### Manager Reviews (left by operators):
| Criteria | Rating |
|----------|--------|
| Reliability (showed up on time, completed the full assignment) | 1-5 stars |
| Competence (knew the systems, handled the work well) | 1-5 stars |
| Professionalism (appearance, attitude, customer interaction) | 1-5 stars |
| Communication (responsive, clear, kept operator informed) | 1-5 stars |
| Would you book again? | Yes / No |

Plus optional written review (displayed publicly on profile).

### Operator Reviews (left by managers):
| Criteria | Rating |
|----------|--------|
| Branch readiness (was the handover clear, systems working) | 1-5 stars |
| Working conditions (clean, safe, appropriate) | 1-5 stars |
| Payment promptness (paid on time as agreed) | 1-5 stars |
| Communication (responsive, clear expectations) | 1-5 stars |
| Would you work there again? | Yes / No |

Plus optional written review.

### Blocking Rules:
- If average rating drops below 2.0 across 3+ reviews: auto-flagged for admin review
- Admin (Mikx) can block anyone instantly from the admin dashboard
- Blocked users see: "Your account has been suspended. Contact support@fcmgt.co.uk"
- Blocked users cannot browse, bid, or post

## PREVIEW MODE (UNVETTED USERS) — "Dating App" Experience

Anyone can sign up and create their profile immediately. No waiting gate.

**In preview mode (unvetted), you CAN:**
- Create and edit your full profile
- Browse all open assignments
- See matched assignments ("3 assignments near you match your skills")
- Post assignments (if operator)
- See manager cards with LIMITED info (name, rating, expertise, distance — but NO contact details, NO daily rate shown, photo blurred)
- See activity feed and market stats

**In preview mode, you CANNOT:**
- Submit proposals / bid on assignments
- Accept proposals
- See contact details
- See full manager profiles (rates, calendar, reviews)
- Get booked by operators

**Call to action everywhere in preview mode:**
"Complete your vetting to unlock full access. Standard: 5-7 business days. Skip the queue: £3.99 (vetted in 24-48 hours)"

**Skip the Queue — £3.99:**
- Stripe checkout for one-time £3.99 payment
- Moves user to front of vetting queue
- Vetted within 24-48 hours instead of 5-7 business days
- After payment, status changes to "Priority Vetting — you'll be verified within 48 hours"

## STEALTH MODE — £5/month

For managers and employees who want anonymity:
- Profile hidden from public browsing and search
- Only visible to operators whose specific assignments they bid on
- Name displayed as first name + initial only
- Photo hidden (generic avatar shown)
- Ideal for staff who don't want their current employer to know they're looking
- Stripe subscription — £5/month, cancel anytime
- Badge on their profile (visible only to them): "Stealth Mode Active"

## REFERRAL LINKS

Every registered user gets a unique referral link:
- Format: fcmgt.co.uk/inter-mission/join?ref=USER_ID
- Share via: copy link button, WhatsApp share, email share
- When someone signs up through the link, the referrer gets credited
- Referral counter on their dashboard: "You've referred 8 people"
- Future: referral rewards (not in v1, but track the data)
- The link pre-fills the "Referred by" field on signup

## EARNINGS DASHBOARD (Managers)

A prominent section on every manager's dashboard showing:
- **Total earned all time:** £12,450 (large, green, animated)
- **This month:** £2,400
- **Assignments completed:** 34
- **Average daily rate:** £185
- **Rating:** 4.8 stars (142 reviews)
- **Earnings chart:** Bar chart showing monthly earnings over last 6 months
- **Rate guidance:** "Managers with your experience in Compliance & Audit typically charge £180-250/day in the North West"
- **Skills tip:** "Add Banking certification to your profile — managers with banking skills earn 25% more"

## GEOGRAPHIC HEAT MAP

A visual map (use Mapbox GL JS or Leaflet) showing:
- Green dots: Available managers (clustered by area)
- Orange dots: Open assignments
- Dot size: proportional to count
- Click a cluster to zoom in and see individual cards
- Toggle: "Show managers" / "Show assignments" / "Show both"
- Filter by expertise track
- This gives everyone instant visibility of supply and demand

## PAGES & ROUTES

```
/inter-mission                          — Landing page (hero, stats, activity feed)
/inter-mission/register                 — Registration (choose: Manager, Operator, Employee)
/inter-mission/register/manager         — Manager registration form
/inter-mission/register/operator        — Operator registration form
/inter-mission/register/employee        — Employee registration form
/inter-mission/assignments              — Browse all open assignments
/inter-mission/assignments/[id]         — Single assignment detail + proposals
/inter-mission/assignments/post         — Post a new assignment
/inter-mission/people                   — Browse verified managers & employees
/inter-mission/people/[id]              — Single profile page
/inter-mission/map                      — Geographic heat map
/inter-mission/dashboard                — User dashboard (earnings, assignments, reviews, settings)
/inter-mission/dashboard/assignments    — My assignments (posted or accepted)
/inter-mission/dashboard/reviews        — My reviews (given and received)
/inter-mission/dashboard/earnings       — Earnings breakdown (managers only)
/inter-mission/dashboard/settings       — Profile settings, stealth mode, notifications
```

## LANDING PAGE (/inter-mission)

### Hero Section:
- Large headline: **"Your Expertise Has Value."** or **"The Post Office People Network"**
- Subheadline: "Connect with branches that need your skills. Find experienced help when you need it most."
- Two clear CTA buttons:
  - **"I Need Help"** (bright green) → /inter-mission/assignments
  - **"I Can Help"** (outlined green) → /inter-mission/register

### Live Stats Bar (animated counters):
- "XX managers available" | "XX open assignments" | "£XX,XXX earned by our network" | "XX assignments completed"

### Activity Feed:
- Real-time scrolling feed:
  - "Manager accepted for 2-week holiday cover in Leeds — 12 min ago"
  - "New training specialist available in Manchester — 45 min ago"
  - "Audit prep completed in Birmingham — 5 star review — 2 hours ago"
  - "URGENT: Counter cover needed in Bolton — just posted"
- This creates social proof and urgency

### How It Works (3 steps):
1. **Post or Browse** — Tell us what you need, or show us what you can do
2. **Match Instantly** — Our system finds the right person in seconds
3. **Connect & Earn** — Work together, build your reputation, grow your income

### Expertise Tracks (8 cards):
- Visual cards for each expertise track showing the category name, icon, and "XX managers available"
- Click to filter the marketplace by that track

### Testimonial placeholder:
- Space for future testimonials from managers and operators
- "I earned £3,200 in my first month on Inter-Mission" — placeholder for now

## DATABASE SCHEMA

```sql
-- User profiles (extends any existing user table or standalone)
CREATE TABLE im_profiles (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  display_name TEXT, -- For stealth mode
  user_type TEXT NOT NULL, -- manager, operator, employee
  phone TEXT,
  photo_url TEXT,
  bio TEXT,
  horizon_id TEXT, -- PO Horizon User ID for verification
  fad_code TEXT, -- Branch FAD code for operators
  branch_name TEXT, -- For operators
  location_postcode TEXT,
  location_lat DECIMAL,
  location_lng DECIMAL,
  travel_radius INTEGER DEFAULT 25, -- miles
  daily_rate DECIMAL,
  hourly_rate DECIMAL,
  years_experience INTEGER,
  expertise_tracks JSONB DEFAULT '[]', -- array of track IDs
  skills JSONB DEFAULT '[]', -- array of specific skill strings
  looking_for TEXT, -- full_time, part_time, temporary, any (employees only)
  verification_status TEXT DEFAULT 'unvetted', -- unvetted, priority_vetting, vetted, blocked
  stealth_mode BOOLEAN DEFAULT false,
  notification_urgent BOOLEAN DEFAULT true, -- opt-in for urgent assignment notifications
  referral_code TEXT UNIQUE,
  referred_by TEXT, -- referral code of referrer
  referral_count INTEGER DEFAULT 0,
  total_earnings DECIMAL DEFAULT 0,
  assignments_completed INTEGER DEFAULT 0,
  average_rating DECIMAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  blocked_at TIMESTAMPTZ,
  blocked_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability calendar
CREATE TABLE im_availability (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER REFERENCES im_profiles(id),
  date DATE NOT NULL,
  status TEXT DEFAULT 'available', -- available, booked, unavailable
  assignment_id INTEGER, -- if booked, link to assignment
  UNIQUE(profile_id, date)
);

-- Assignments (posted by operators)
CREATE TABLE im_assignments (
  id SERIAL PRIMARY KEY,
  operator_id INTEGER REFERENCES im_profiles(id),
  title TEXT NOT NULL, -- auto-generated: "Holiday Cover — Bolton — 2 weeks"
  expertise_track TEXT NOT NULL,
  description TEXT,
  location_postcode TEXT NOT NULL,
  location_lat DECIMAL,
  location_lng DECIMAL,
  branch_name TEXT,
  fad_code TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  daily_budget DECIMAL, -- null = open to proposals
  urgency TEXT DEFAULT 'standard', -- standard, urgent
  duration_type TEXT, -- single_day, one_week, two_weeks, one_month, ongoing
  accommodation_available BOOLEAN DEFAULT false,
  required_skills JSONB DEFAULT '[]',
  status TEXT DEFAULT 'open', -- open, matched, in_progress, completed, cancelled
  matched_manager_id INTEGER REFERENCES im_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals (submitted by managers)
CREATE TABLE im_proposals (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER REFERENCES im_assignments(id),
  manager_id INTEGER REFERENCES im_profiles(id),
  proposed_rate DECIMAL NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending', -- pending, accepted, declined, withdrawn
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews (double-sided)
CREATE TABLE im_reviews (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER REFERENCES im_assignments(id),
  reviewer_id INTEGER REFERENCES im_profiles(id),
  reviewee_id INTEGER REFERENCES im_profiles(id),
  reviewer_type TEXT NOT NULL, -- operator, manager
  reliability_score INTEGER CHECK (reliability_score BETWEEN 1 AND 5),
  competence_score INTEGER CHECK (competence_score BETWEEN 1 AND 5),
  professionalism_score INTEGER CHECK (professionalism_score BETWEEN 1 AND 5),
  communication_score INTEGER CHECK (communication_score BETWEEN 1 AND 5),
  would_work_again BOOLEAN,
  written_review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Earnings log
CREATE TABLE im_earnings (
  id SERIAL PRIMARY KEY,
  manager_id INTEGER REFERENCES im_profiles(id),
  assignment_id INTEGER REFERENCES im_assignments(id),
  amount DECIMAL NOT NULL,
  days_worked INTEGER NOT NULL,
  daily_rate DECIMAL NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vetting queue
CREATE TABLE im_vetting_queue (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER REFERENCES im_profiles(id),
  priority BOOLEAN DEFAULT false, -- true if paid £3.99
  stripe_payment_id TEXT, -- if priority
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  vetted_at TIMESTAMPTZ,
  vetted_by TEXT, -- admin who approved
  status TEXT DEFAULT 'pending' -- pending, approved, rejected
);

-- Saved/repeat bookings
CREATE TABLE im_saved_managers (
  id SERIAL PRIMARY KEY,
  operator_id INTEGER REFERENCES im_profiles(id),
  manager_id INTEGER REFERENCES im_profiles(id),
  notes TEXT,
  times_booked INTEGER DEFAULT 1,
  last_booked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(operator_id, manager_id)
);
```

## API ROUTES

```
POST   /api/inter-mission/register          — Create profile
GET    /api/inter-mission/profile            — Get own profile
PATCH  /api/inter-mission/profile            — Update profile
GET    /api/inter-mission/people             — Browse profiles (with filters)
GET    /api/inter-mission/people/[id]        — Get single profile

POST   /api/inter-mission/assignments        — Post new assignment
GET    /api/inter-mission/assignments        — Browse assignments (with filters)
GET    /api/inter-mission/assignments/[id]   — Get single assignment + proposals
PATCH  /api/inter-mission/assignments/[id]   — Update assignment status

POST   /api/inter-mission/proposals          — Submit proposal
PATCH  /api/inter-mission/proposals/[id]     — Accept/decline proposal

POST   /api/inter-mission/reviews            — Submit review
GET    /api/inter-mission/reviews/[profileId] — Get reviews for a profile

GET    /api/inter-mission/earnings           — Get earnings data (own)
GET    /api/inter-mission/stats              — Get marketplace stats (public)
GET    /api/inter-mission/map-data           — Get data for heat map

POST   /api/inter-mission/vetting/skip       — Pay £3.99 to skip queue
GET    /api/inter-mission/availability/[id]  — Get availability calendar
PUT    /api/inter-mission/availability       — Update availability

POST   /api/inter-mission/stealth/subscribe  — Subscribe to stealth mode (£5/mo)
POST   /api/inter-mission/stealth/cancel     — Cancel stealth mode
```

## MOBILE NAVIGATION

When in the /inter-mission section, the bottom nav changes to:
- Home (Inter-Mission landing)
- Assignments (browse/post)
- Map (heat map)
- Dashboard (my profile, earnings, reviews)
- Back to FCM (returns to main site gold theme)

## SEED DATA

Seed the database with realistic sample data:
- 15 manager profiles (various expertise tracks, locations across UK, mixed ratings)
- 5 operator profiles (different branch types and locations)
- 8 open assignments (mix of urgent and standard, various tracks)
- 12 proposals on existing assignments
- 20 reviews (mix of ratings, some written)
- Earnings data for the top 5 managers
- Activity feed with 15 recent events
- Availability calendar data for all managers

## LEGAL DISCLAIMER

Display prominently in footer of all Inter-Mission pages:

"Inter-Mission is a marketplace operated by Firstclass Managerial Ltd (FCM Intelligence). We connect Post Office professionals with branch operators. FCM Intelligence is not an employment agency, employer, or contractor. All arrangements are made directly between parties. FCM Intelligence accepts no liability for the quality of work performed, financial losses, employment disputes, or any other matters arising from connections made through this platform. All users are responsible for their own tax, insurance, and legal obligations. By using Inter-Mission you agree to these terms."

## CRITICAL DESIGN NOTES

1. The bright green (#00FF88) accent must ONLY appear within /inter-mission pages. The rest of the site stays gold.
2. When navigating from the main site to Inter-Mission, the colour transition should feel intentional — like shifting gears.
3. Cards should have a subtle green glow on hover: `box-shadow: 0 0 20px rgba(0, 255, 136, 0.15)`
4. The activity feed should auto-scroll with new entries appearing at the top
5. Numbers (earnings, stats, ratings) should animate/count up when scrolling into view
6. The "URGENT" badge should pulse with a red glow
7. Preview mode (unvetted) should show a persistent banner at the top: "You're in preview mode. Complete vetting to unlock full access."
8. The earnings dashboard should feel rewarding — big green numbers, upward trending charts
9. Mobile-first. Every page must work perfectly on phone. 44px minimum touch targets.
10. The registration flow should take under 2 minutes to complete

## BUILD THIS NOW

Read the existing Next.js codebase in this workspace. Add Inter-Mission as a new section. Keep all existing pages and functionality. Add the new pages under /inter-mission, the new database tables, and the new API routes. Follow the design rules exactly — bright green accent, sport mode energy, clean and clutter-free.

Seed with realistic sample data so the marketplace feels alive from the first visit.
