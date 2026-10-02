# FCM Intelligence — fcmintelligence.com

The personal-brand site for Mikesh Parekh: free insights and resources for Post Office buyers and operators, with consultancy services and acquisition reports behind them.

This is the 2026 rebuild (branch `rebuild`). The previous site is kept untouched on `main`.

## Stack
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Markdown articles in `content/articles/`.

## Editing content
- **Articles:** add a `.md` file to `content/articles/` with `title`, `description`, `date` and `category` front matter.
- **Facts and numbers** (branches, staff, contact email, social links): `lib/site.ts`.
- **Services and prices:** `lib/services.ts`. Set `pricesConfirmed: true` in `lib/site.ts` once prices are final.
- **Going live:** set `indexable: true` in `lib/site.ts` so search engines can index the site.

## Environment (set in Vercel)
| Variable | What it does |
|---|---|
| `RESEND_API_KEY` | Sends enquiry, membership and order emails. |
| `ENQUIRY_NOTIFY_TO` | Where enquiries and paid orders are emailed (defaults to the contact email). |
| `STRIPE_SECRET_KEY` | Switches on online report checkout. Without it, the order buttons go to the enquiry form. Redeploy after adding it. |
| `STRIPE_WEBHOOK_SECRET` | Signing secret of the Stripe webhook pointing at `/api/stripe/webhook` (event: `checkout.session.completed`). |
| `OPENCLAW_OPS_KEY` | A long random value (24+ characters) that OpenClaw sends to `/api/reports/[orderId]/ready`. Set the same value in OpenClaw as `FCM_SITE_OPS_KEY`. |
| `CRON_SECRET` | Any long random value. Lets Vercel run the daily report pipeline check (`/api/cron/pipeline-check`, 12:00 UTC), which emails Mikesh about orders that are late, stuck, failed or waiting for approval. |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` | Optional. A Google Maps Embed API key restricted to fcmintelligence.com. With it, Street View opens inside the report (after the visitor agrees to Google's cookies); without it, the button opens Google Maps. |
| `NEXT_PUBLIC_MAP_STYLE_URL` | Optional. A different MapLibre style for the report maps. Default: OpenFreeMap Positron (free, no key, no cookies). |
| `ORDER_INGEST_KEY` | Lets the Stripe webhook save paid report orders to the Supabase `orders` table (via `record_order`) for the OpenClaw report agents. Without it, orders are only emailed. |

Paid orders live in Stripe (with the branch details in the payment's metadata); the webhook emails Mikesh and the customer.

## Development
```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Reports from the OpenClaw agents

- Agents write reports to the Supabase `reports` table in the format of `fcm-report-schema-v3.json` (in the vault, `08-REPORT-AGENTS/v3/`).
- `lib/report-rules.ts` holds the fixed rules (section keys, tier lists, grade scale, weights, verdicts); `lib/report-check.ts` checks a report against them; `lib/uk-rates.ts` and `lib/employer-cost.ts` hold the statutory rates and the staffing calculation.
- `POST /api/reports/[orderId]/check` (OpenClaw key) returns the check. `POST /api/reports/[orderId]/ready` emails Mikesh only when there are no critical issues (`?notify=0` returns the review link without emailing).
- `GET /api/tools/employer-cost?rate=12.71&hours=30` returns the true cost of an employee.
- Update `lib/uk-rates.ts` every April.
- Maps: `components/report/live/SiteMap.tsx` draws the location, competition, footfall and crime maps from the coordinates in the report (MapLibre on OpenStreetMap). Street View is shown live (`StreetView.tsx`). No Google photos, Street View or map images are stored or shown; the check blocks them.

