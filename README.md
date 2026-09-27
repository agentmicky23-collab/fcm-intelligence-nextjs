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

## Development
```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```
