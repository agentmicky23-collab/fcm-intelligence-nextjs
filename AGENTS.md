# FCM Intelligence - Next.js Content Migration

## MISSION
The old static site at fcm-intelligence.vercel.app has been PERFECTED by the team.
This Next.js project needs its content to be IDENTICAL to the old site.
The old site HTML source is in this project root for reference:
- `old-site-index.html` — Complete homepage
- `old-site-consultation.html` — Consultation page  
- `old-site-blog.html` — Blog page

## WHAT TO DO
Update the CONTENT of pages to match the old site exactly. The Next.js infrastructure (Tailwind, shadcn, AppLayout, Navbar, Footer, Inter-Mission) is already set up and working. You're updating page CONTENT, not rebuilding the framework.

## CRITICAL: DO NOT TOUCH THESE
- `/app/inter-mission/` — entire directory, leave alone
- `/app/business-republic/` — entire directory, leave alone  
- `/app/dashboard/` — entire directory, leave alone
- `/app/auth/` — entire directory, leave alone
- `/app/providers.tsx` — leave alone
- `/app/globals.css` — leave alone (unless adding needed styles)
- `/components/layout/` — leave alone (Navbar, Footer, AppLayout)
- `/components/inter-mission/` — leave alone
- `/components/ui/` — leave alone

## PAGES TO UPDATE

### 1. Homepage (`app/page.tsx`)
Read `old-site-index.html` and replicate ALL sections:
- Hero: "Buy Post Offices Smarter, Not Harder" + badge "Trusted by 200+ Buyers Since 2009" + CTAs (View Pricing, See Sample Report)
- Trust Stats Bar: 15+ Years, 40 Branches, 200+ Reports, 98% Satisfaction
- Trust Badge Bar: SSL Secured, 4.9/5 Rating, 15 Years Experience, UK Based Team
- Curation Explainer: 4-card grid (Daily Scanning, Verified Active, Quality Filtered, Expert Context)
- "Why Intelligence Matters": Time Is Money + Know Before You Go (2 gold-bordered cards)
- Disclaimer: third-party source notice
- Featured Listings Preview: Show first 6-8 listings in a grid with "View All Listings" link
- "What's Included" feature cards section (6 cards: Financial Deep-Dive, Location Intelligence, Competition Mapping, Revenue Forecasting, Risk Assessment, Exit Strategy)
- Sample Report Preview section (mockup preview of report)
- Pricing section (4 tiers: Quick Check £49, Standard £149, Premium £349, Enterprise £599+)
- Quote section ("Every Post Office tells a story...")
- Complete Acquisition Support section (services grid)
- Contact form section ("Ready to Buy Smarter?")
- FCM Insider section
- Footer with disclaimer

### 2. Opportunities (`app/opportunities/page.tsx`)
Already has listings data from migration-data/listings-35.json. Update to match old site format:
- Section header: "🔥 Live Opportunities" + "Businesses For Sale Now"
- Curation explainer cards (Daily Scanning, Verified Active, Quality Filtered, Expert Context)
- "Why Intelligence Matters" boxes
- Disclaimer box
- Category filters (All, Post Office, Forecourt, Convenience Store, Newsagent)
- Advanced filters (Region dropdown, Weekly Turnover, Yearly Turnover, FCM Insider Picks button, Reset)
- Listing count display
- Grid of listing cards

### 3. Listing Card (`components/listing-card.tsx`)
Update to match old site format EXACTLY:
- Gradient image header with emoji + region tag (colored backgrounds per region)
- FCM Pick / Tier 2 / Warning badges
- Business type badge (Post Office / Convenience Store)
- Title, location with 📍, price with label (Leasehold/Freehold/etc)
- Detail items grid (PO Revenue, Turnover, Weekly, Accommodation, etc)
- Expert summary text
- Action buttons: "View Listing →" (links to source) + "Get Report £149"
- Source attribution: "Source: RightBiz • Verified 6 Mar 2026"

The listing card needs MORE data fields. Update `types/listing.ts` and `migration-data/listings-35.json` to include:
- `priceLabel` (e.g. "Freehold Asset", "Retirement Sale", "Leasehold", etc)
- `badge` (e.g. "⭐ FCM Pick", "✨ Tier 2", "💰 Ultra-Budget", etc)
- `badgeStyle` (gradient colors for the badge)
- `headerGradient` (CSS gradient for the card header)
- `headerEmoji` (main emoji in header)
- `headerTag` (e.g. "SCOTLAND", "VALUE ENTRY", "NW COASTAL", etc)
- `headerTagBg` (background color for the tag)
- `details` (array of {label, value} pairs from the old site)
- `originalListingUrl` (actual URL to the listing, not just domain)
- `verifiedDate` ("6 Mar 2026")

### 4. Blog (`app/blog/page.tsx`)
Read `old-site-blog.html` and replicate:
- Page header with title + subtitle
- Category filter buttons (All Posts, PO Insider, UK Business Strategy, Wild Card)  
- 4 blog article cards with:
  - Category badge, date, read time
  - Title (with link styling)
  - Full excerpt text
  - Tags
  - "Read Article →" link
- Each article has specific content from the old site — copy the titles, excerpts, dates exactly

### 5. Consultation (`app/consultation/page.tsx`)
Read `old-site-consultation.html` and replicate:
- Hero: "Expert Guidance for Post Office Acquisitions"
- Quick call-to-action strip with phone number (📞 01onal-number or booking button)
- 3 package cards (Discovery Call Free, Acquisition Review £299, Full Due Diligence from £599)
- What's Covered grid (Acquisition Strategy, Financial Analysis, Location Assessment, Risk Assessment, Negotiation Support, Ongoing Support)
- Booking form (Name, Email, Phone, Service selection, Preferred Date, Message)
- FAQ accordion
- "Prefer a Quick Chat?" section with phone number

### 6. Reports (`app/reports/page.tsx`)
Extract from `old-site-index.html` pricing section:
- "Choose Your Level of Insight" header
- 4 pricing tiers:
  - Quick Check £49: "Viability Snapshot" — Postcode check, Basic competition scan, Quick risk flags, Delivered same day
  - Standard Report £149: "Most Popular" + "Full Intelligence" — Everything in Quick Check + Detailed financial analysis, Location scoring, Competition mapping, Revenue forecasting, Risk assessment, Delivered in 48 hours
  - Premium Report £349: "Deep Dive" — Everything in Standard + On-site area assessment, Customer survey data, Comparable sales analysis, Growth projection model, Personal consultation call, Delivered in 5-7 days
  - Enterprise from £599+: "Portfolio Analysis" — Everything in Premium + Multi-branch analysis, Portfolio strategy, Negotiation support, Ongoing advisory, Custom reporting

### 7. Contact (`app/contact/page.tsx`)
Extract from `old-site-index.html` contact section:
- "Ready to Buy Smarter?" header
- Contact form: Branch/Location, Report Type dropdown, Your Name, Email, Phone (optional), Message
- "Get Your Report" submit button
- Form action: https://formspree.io/f/xblgnqzj
- "Or call us directly" with phone number
- Estimated response time badge

### 8. Services (`app/services/page.tsx`)
Should be equivalent to Consultation page content (old site has consultation.html).
If services already has different content, ADD the consultation content while preserving any existing service-specific content. The key is that /services should have the consultation booking experience.

### 9. Insiders (`app/insiders/page.tsx`)
Extract from `old-site-index.html` insider section:
- "FCM Insider" header with membership benefits
- Tier breakdown if present
- CTA to join

## LISTING DATA UPDATE
The `migration-data/listings-35.json` needs to be enriched with the exact data from the old site HTML. Each listing in the old site has specific:
- Badge text and style
- Header gradient, emoji, tag
- Price label text
- Detail items (label/value pairs, varying per listing)
- Original listing URL (some have direct RightBiz links, some are disabled)
- Summary text (exact wording from old site)

Read ALL listing cards from `old-site-index.html` and update the JSON data to include all these fields.

## BUILD REQUIREMENTS
- `npm run build` must exit with code 0
- No TypeScript errors
- No missing imports
- Do NOT modify next.config.ts to add `ignoreBuildErrors`
- Fix errors properly

## AFTER BUILDING
Run `npm run build` to verify. Then:
```bash
git add -A
git commit -m "feat: Complete old site content migration - exact match"
git push origin master
```
