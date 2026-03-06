# FCM INTELLIGENCE PWA — ENHANCED DASHBOARD FEATURES
# 
# Paste this into Replit Agent to add the four new dashboard features.
# This builds on the existing codebase — do not rebuild what already exists.
#
# ═══════════════════════════════════════════════════════════════════

I need to add four major features to the existing FCM Intelligence dashboard. Do NOT rebuild existing pages — add these as new pages and enhance existing ones. Keep the same dark theme, gold accents, and JetBrains Mono for financial data.

## Feature 1: Agent Swarm — Live Activity View

### New page: /dashboard/swarm

This replaces the simple agent status cards with a live mission control view showing what every agent is doing in real time.

**Layout:**

Top section — Agent Network Visualisation:
- Show all 7 agents as nodes in a network diagram (use SVG or canvas)
- Agents: Main (Micky), Henry, Claudia, Harper, Rex, Sentinel, Watchtower
- Each node shows: agent name, current status (active/idle/silent), and a pulsing animation if currently working
- Draw lines between agents when they're passing work to each other (e.g., Henry → Rex when content is submitted for review)
- Active connections glow gold, inactive connections are dim grey
- Node colours: Active = gold border, Idle = grey border, Silent/Error = red border

Middle section — Live Activity Feed:
- Real-time scrolling feed of agent actions, like a chat log
- Each entry shows: timestamp, agent name (colour coded), action description, and target agent if applicable
- Format: "[17:34] Henry → Rex: Submitted LinkedIn post 'Why Franchise Operators Fail' for editorial review"
- Format: "[17:36] Rex: Reviewing content... Score: 90% — PASS"
- Format: "[17:40] Watchtower: Health check complete. All agents healthy."
- Format: "[17:45] Claudia: Deployed website update to Vercel. Awaiting Sentinel QA."
- Auto-scroll to newest entry, with ability to scroll up through history
- Filter buttons: All | Content | Opportunities | System | Errors

Bottom section — Agent Detail Cards:
- Horizontal scrollable row of cards, one per agent
- Each card shows: name, role (one line), model being used, current task (or "idle"), last output timestamp, uptime % (sparkline), tasks completed today
- Click a card to expand it into a full detail view with:
  - Task history (last 20 tasks)
  - Average response time
  - Error rate
  - Memory usage (which feedback files this agent reads/writes)

**Database additions:**

```sql
CREATE TABLE agent_activity (
  id SERIAL PRIMARY KEY,
  agent_name TEXT NOT NULL,
  action_type TEXT NOT NULL, -- task_start, task_complete, handoff, error, health_check
  description TEXT NOT NULL,
  target_agent TEXT, -- if handing off to another agent
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**API endpoints:**

```
GET /api/agents/activity?limit=50 — Latest activity feed entries
GET /api/agents/activity/stream — SSE endpoint for real-time updates (if possible, otherwise poll every 10s)
GET /api/agents/:name/detail — Full detail for a specific agent
POST /api/agents/activity — Log a new activity entry
```

## Feature 2: Market Scan Command Centre

### New page: /dashboard/market-scan

A full control panel for managing opportunity scanning with live parameter adjustment, scan triggering, and inline report summaries.

**Layout:**

Left panel — Scan Controls (sticky sidebar, 300px width):

Scan Parameters section:
- Slider: Minimum Annual Fees (£0 — £200k, default £50k, step £5k)
- Slider: Minimum Sessions/Month (0 — 5000, default 1000, step 100)
- Slider: Maximum Asking Price (£0 — £1m, default £500k, step £25k)
- Slider: Minimum Weekly Turnover (£0 — £50k, default £0, step £500)
- Multi-select checkboxes: Business Types (Post Office ✓, Forecourt ✓, Convenience Store ✓, Newsagent □, Franchise □)
- Multi-select checkboxes: Regions (all UK regions, all checked by default)
- Multi-select checkboxes: Sources (RightBiz ✓, Daltons ✓, Christie & Co ✓, BusinessesForSale ✓, Franchise Direct ✓, FirmsForSale ✓)

Scoring Weights section:
- Slider: Annual Fees weight (0.4 — 2.0, default 1.0, step 0.1)
- Slider: Sessions weight (0.4 — 2.0, default 1.0, step 0.1)
- Slider: Location weight (0.4 — 2.0, default 1.0, step 0.1)
- Slider: Franchise Type weight (0.4 — 2.0, default 1.0, step 0.1)
- Slider: Price weight (0.4 — 2.0, default 1.0, step 0.1)
- "Reset to Defaults" button (ghost)
- "Save Configuration" button (gold primary)

Action buttons:
- "Trigger Manual Scan" (gold primary, large) — triggers Henry to run a scan with current parameters
- "Last Scan: [timestamp]" display
- "Scan History" expandable showing last 10 scan timestamps and result counts

Right panel — Results:

Top bar: Result count ("34 opportunities matching criteria") + sort dropdown (Score, Fees, Price, Date)

Results displayed as cards with:
- Business name, type, location
- Financial data grid: Annual Fees | Sessions | Asking Price | Weekly T/O | Yearly T/O
- FCM Score with colour coding (gold >80, white 60-80, grey <60)
- Confidence badge
- Status badge
- Quick action buttons: Pursue | Watch | Dismiss
- "View Report Summary" expandable section on each card that shows:
  - Location analysis summary (2-3 sentences)
  - Financial assessment (2-3 sentences)
  - Risk factors (bullet list)
  - Recommendation (one line)
  - "Request Full Professional Report — £249" CTA button

**Database additions:**

```sql
CREATE TABLE scan_config (
  id SERIAL PRIMARY KEY,
  name TEXT DEFAULT 'default',
  min_annual_fees DECIMAL DEFAULT 50000,
  min_sessions INTEGER DEFAULT 1000,
  max_asking_price DECIMAL DEFAULT 500000,
  min_weekly_turnover DECIMAL DEFAULT 0,
  business_types JSONB DEFAULT '["post_office","forecourt","convenience_store"]',
  regions JSONB DEFAULT '[]',
  sources JSONB DEFAULT '[]',
  fee_weight DECIMAL DEFAULT 1.0,
  sessions_weight DECIMAL DEFAULT 1.0,
  location_weight DECIMAL DEFAULT 1.0,
  type_weight DECIMAL DEFAULT 1.0,
  price_weight DECIMAL DEFAULT 1.0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scan_history (
  id SERIAL PRIMARY KEY,
  triggered_by TEXT DEFAULT 'manual',
  parameters JSONB,
  results_count INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);
```

**API endpoints:**

```
GET /api/scan/config — Get current scan configuration
PUT /api/scan/config — Update scan configuration
POST /api/scan/trigger — Trigger a manual scan
GET /api/scan/history — Get scan history
GET /api/opportunities?scored=true — Opportunities with current weight-adjusted scores
```

## Feature 3: Ask Harper — Chat Interface

### Replace /dashboard/hr with a chat-first interface

Instead of just a case list, make this a live chat interface with Harper, with case management built in.

**Layout:**

Left panel — Case History sidebar (250px):
- List of past conversations/cases
- Each shows: date, case type, risk level badge, status
- "New Conversation" button at top (gold)
- Click to load a conversation
- Search bar at top to find past cases

Right panel — Chat Interface (main area):

Chat area:
- Full-height scrollable chat window
- Messages styled like a messaging app:
  - Your messages: right-aligned, gold background, dark text
  - Harper's responses: left-aligned, dark card background, white text
  - Harper's responses include structured sections: Answer, Legal Basis, Procedure, Risk Level (badge), Documents Needed, Escalation Advice
- Typing indicator when "Harper is thinking..."
- Each response auto-tagged with: risk level, relevant legislation, case type

Input area:
- Text input with placeholder "Describe your HR situation..."
- Send button (gold)
- Attach file button (for uploading contracts, letters etc — future feature)
- Quick prompt buttons above input: "Disciplinary", "Grievance", "TUPE", "Redundancy", "Absence", "Contract"

Case management:
- After each conversation, option to "Save as Case" which creates an HR case record
- Case status dropdown: Open, Resolved, Escalated, Ongoing
- Risk level auto-populated from Harper's assessment
- Follow-up reminder toggle (2 weeks)

**Important:** This is a UI mockup for now. The actual Harper AI integration will be wired in by Claudia later — she'll connect this chat to the OpenClaw agent system. For now, build the complete UI with a mock response that shows the correct format (Answer → Legal Basis → Procedure → Risk → Docs → Escalation). Use a 2-second delay to simulate "thinking".

**Database additions:**

```sql
CREATE TABLE hr_conversations (
  id SERIAL PRIMARY KEY,
  title TEXT,
  case_type TEXT,
  risk_level TEXT,
  status TEXT DEFAULT 'open',
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**API endpoints:**

```
GET /api/hr/conversations — List all conversations
GET /api/hr/conversations/:id — Get a specific conversation with messages
POST /api/hr/conversations — Create new conversation
PATCH /api/hr/conversations/:id — Update conversation (add message, change status)
POST /api/hr/conversations/:id/save-case — Convert conversation to formal HR case
```

## Feature 4: Content Mission Control

### Replace /dashboard/content with a full content workbench

**Layout:**

Top bar — Pipeline Status:
- Horizontal flow: Draft (count) → Rex Review (count) → Your Approval (count) → Published (count)
- Click any stage to filter the list below

Main area — Content List + Editor split view:

Left panel — Content List (350px):
- Cards for each content piece showing: title, type icon (LinkedIn/Twitter/Blog/Email), track badge, Rex score, status badge
- Click to select and view in the right panel
- Filter tabs: All | LinkedIn | Twitter | Blog | Email
- Sort: Newest | Score | Status

Right panel — Content Workbench (main area):

When a content piece is selected:

View/Edit section:
- Full content displayed in a readable format
- Inline editing — click to edit any text directly
- Word count and character count displayed
- Reading time estimate

Platform Adaptation section:
- Row of platform buttons: LinkedIn | Twitter/X | Facebook | Threads | Blog | Email
- Clicking a platform shows the content adapted for that platform:
  - LinkedIn: Full post with character count (max 3000), hashtag suggestions
  - Twitter/X: Thread format, each tweet shown as a card with 280 char count
  - Facebook: Adapted format with emoji suggestions
  - Threads: Short-form adaptation
  - Blog: Full article format with H2/H3 structure
  - Email: Subject line + body format
- "Regenerate for [Platform]" button on each — uses current content as base and adapts
- Each platform adaptation can be independently approved

Tone & Style Controls:
- Tone slider or selector: Professional ← → Casual
- Style dropdown: Operator-to-Operator | Educational | Contrarian | Data-Heavy | Story-Led | Inspirational
- Key message input: "What's the ONE thing the reader should take away?"
- "Regenerate with these settings" button (gold)
- Show before/after comparison when regenerating

Approval section:
- Large "Approve" button (gold) with platform checkboxes (which platforms to approve for)
- "Request Changes" button (secondary) with a text field for notes back to Henry
- "Reject" button (ghost/red)
- When approving, select which platforms: ☑ LinkedIn ☑ Twitter ☐ Facebook ☐ Threads
- Approval writes to feedback log with signal type

Content Calendar (bottom section, collapsible):
- Week view showing scheduled posts
- Monday/Wednesday/Friday highlighted as posting days
- Drag and drop to reschedule
- Track colour coding: PO Insider = one colour, UK Business Strategy = another
- Shows which platform each post is scheduled for

**Database additions:**

```sql
-- Add columns to existing content table
ALTER TABLE content ADD COLUMN platform_versions JSONB DEFAULT '{}';
-- Format: {"linkedin": {"body": "...", "status": "approved"}, "twitter": {"thread": ["...", "..."], "status": "draft"}}
ALTER TABLE content ADD COLUMN tone TEXT DEFAULT 'operator';
ALTER TABLE content ADD COLUMN style TEXT DEFAULT 'operator_to_operator';
ALTER TABLE content ADD COLUMN key_message TEXT;
ALTER TABLE content ADD COLUMN scheduled_date DATE;
ALTER TABLE content ADD COLUMN scheduled_platforms JSONB DEFAULT '[]';
```

**API endpoints:**

```
GET /api/content/:id/platforms — Get all platform versions of a content piece
POST /api/content/:id/adapt — Generate adaptation for a specific platform
PATCH /api/content/:id/platform/:platform — Update a specific platform version
POST /api/content/:id/approve — Approve content for selected platforms
GET /api/content/calendar?week=YYYY-MM-DD — Get scheduled content for a week
PATCH /api/content/:id/schedule — Set/change scheduled date and platforms
```

## Navigation Updates

Update the dashboard sidebar to include the new pages:

```
Dashboard Home     (existing)
Agent Swarm        (NEW — /dashboard/swarm)
Opportunities      (existing)
Market Scan        (NEW — /dashboard/market-scan)
Content Control    (updated — /dashboard/content)
Cost Analytics     (existing)
Ask Harper         (updated — /dashboard/hr)
Agents Detail      (existing — /dashboard/agents)
Settings           (existing)
```

## Important Implementation Notes

1. Keep the dark theme with gold accents throughout
2. All financial numbers in JetBrains Mono gold
3. All new pages need the DashboardSidebar component
4. Use Recharts for any new charts
5. Use the existing API patterns (React Query, apiRequest helper)
6. Add the new database tables via Drizzle schema updates
7. Seed new tables with realistic sample data
8. The Ask Harper chat is UI-only for now — use mock responses with the correct structured format
9. The "Regenerate" and "Adapt" buttons on Content Mission Control are UI-only for now — show a loading state then display the same content (Claudia will wire the actual AI later)
10. The "Trigger Manual Scan" button is UI-only for now — show a success toast (Claudia will wire to the agent system later)

Build all four features now.
