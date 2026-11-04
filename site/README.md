# VM23G v2 — veeramisir.com

Astro 7 site running on Cloudflare Workers, with D1 (database), R2 (voice notes) and Workers AI (V, the concierge).

## Run locally

```bash
cd site
npm install
PATH=/opt/homebrew/opt/node/bin:$PATH npm run dev
```

Open http://localhost:4321. Admin: http://localhost:4321/admin (the local login is in `ADMIN-LOGIN.local.md`, which is not committed).

First run only: `npm run db:migrate:local`.

## Publish a private preview (needs a Cloudflare login)

```bash
npx wrangler login
npx wrangler d1 create vm23g --location apac        # copy the database_id into wrangler.jsonc (both places)
npx wrangler r2 bucket create vm23g-media
npm run db:migrate:remote
node scripts/admin-password.mjs "choose-a-strong-password"
npx wrangler secret put ADMIN_PASSWORD_HASH         # paste the hash printed above
npx wrangler secret put SESSION_SECRET              # paste 64 random hex characters
npm run deploy                                      # prints the preview URL on workers.dev
```

Optional: `npx wrangler secret put NOTIFY_WEBHOOK_URL` to get a message (Slack/Discord/Zapier webhook) for every new enquiry.

## Go live on veeramisir.com

Only after the preview is approved: in the Cloudflare dashboard, remove `veeramisir.com` from the old Pages project **vm23g**, then add it under Workers → **vm23g-v2** → Domains. Rolling back is the reverse.

## Where things live

- `src/content/site.ts` — verified copy (founders, services, ecosystem)
- `src/lib/content.ts` — sections editable from the Command Centre (hero line, call to action, work, press, announcement, Teach V)
- `src/lib/knowledge.ts` — what V knows and its rules
- `migrations/` — database schema
- `../docs/v2/` — progress record and contact register
