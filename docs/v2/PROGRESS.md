# VM23G v2 — Progress record

Branch: `redesign-v2` · New site lives in `site/` · Live veeramisir.com is untouched.

## Current status (updated 2026-11-14)
Direction changed after the screens below were built. The owner now wants:
- a more static, screen-by-screen site, explored in concept spikes under `site/public/concepts/` (the latest test is `calm.html`: one quiet screen at a time, tap to move on; Kyani removed);
- hosting on **Bluehost** at veeramisir.com, structured like destinosingapore.co: a static front end served by Apache, plus a PHP `/api` folder for forms, admin and V. **Not Cloudflare, not WordPress.**

The Astro site in `site/` stays as the working reference for features: Start a Project, Command Centre and V. Nothing is deployed. Audit record: `docs/v2/AUDIT-2026-11-05.md`.

## Health check (2026-11-14)
- `astro check` 0 errors/warnings; `astro build` passes; `npm audit` 0 vulnerabilities (production and full).
- Patch updates applied: astro 7.4.11, @astrojs/cloudflare 14.4.7, wrangler 4.162.0, workers-types. TypeScript 7 (major, dev-only) held back.
- All routes answer locally (200; `/admin` redirects to login; unknown pages 404). V answers in built-in knowledge mode. No console errors.
- Lighthouse (mobile, local dev server): Home, Services, Work and Start score 100 for Accessibility, Best Practices and SEO. Work page layout shift 0.083 (within the 0.1 "good" limit).
- Removed: two unused images (`gallery-kyani`, `gallery-navafit-session`) and three outdated legacy docs (Pearl Matte brand system, Expo launch checklist, Expo task manager). Restore point: `~/Backups/vm23g/2026-11-14-pre-health-check`.
- `astro preview` does not start locally (Cloudflare runtime needs a login); not a code fault.

## Cloudflare preview (2026-11-14)
- Owner chose Cloudflare. Worker `vm23g-v2` is live at https://vm23g-v2.awaiveera.workers.dev with D1 `vm23g` (APAC). Admin secrets set from the local admin hash plus a new session secret.
- R2 is not enabled on the account, so voice notes are switched off: the recorder is hidden, the API ignores audio, and V does not offer voice notes. Enable R2, add the `r2_buckets` binding back to the top level of `wrangler.jsonc` and redeploy to turn them on.
- `public/.assetsignore` keeps `concepts/` out of every deploy. The first upload briefly included it (about a minute, unlisted address) before this was added.
- The old Pages project `vm23g` (Git-connected) still serves veeramisir.com from `main`. Pushes to `redesign-v2` trigger failing Pages preview builds; they never touch production.
- Checks on the preview: all routes answer, V answers via Workers AI, a test enquiry saved and was deleted, Lighthouse mobile 100/100/100, LCP 0.78 s and CLS 0 on a throttled phone trace.

## Launch (2026-11-14)
- veeramisir.com and www.veeramisir.com moved from the Pages project `vm23g` to the Worker `vm23g-v2` (custom domains in `wrangler.jsonc`; `workers_dev` kept on). Email records (Google MX, DKIM, imap/pop/smtp) untouched; pre-switch DNS saved in `~/Backups/vm23g/2026-11-14-pre-health-check/dns-before-switch.txt`.
- Live checks: every route answers, `/concepts/*` returns 404, HSTS on, V answers via Workers AI.
- Rollback: remove the two custom domains from `vm23g-v2`, then re-add them to the Pages project `vm23g` (it still holds the old site).

## Go-live blockers (owner decisions)
- **Hosting target.** The site is built for Cloudflare Workers (D1 database, R2 voice notes, Workers AI for V). The Bluehost plan needs the server parts (forms, admin, V) rebuilt in PHP first. veeramisir.com's nameservers are already on Cloudflare.
- **Cloudflare account access** (if Cloudflare): owner login, create the D1 database and R2 bucket, set admin secrets, then route veeramisir.com.
- **Legal page** still states it must be reviewed by a qualified Singapore lawyer before publication.
- **Enquiry inbox** for notifications is unconfirmed (`docs/v2/CONTACT-REGISTER.md`).
- **Login bot check** (Turnstile) and session revocation are still open from the 2026-11-05 audit.

## Completed screens
1. **Navigation + Living Logo hero** — floating olive glass dock with active indicator; expanded menu with full logo, described destinations and project previews; authentic gold logo on a glass stage with WebGL olive-to-gold halo, light sweep masked to the gold lines, glass planes with pointer parallax (logo itself never 3D-transformed, so it stays sharp). Pause motion + reduced-motion.
2. **Four disciplines (home chapters)** — sticky rail with live chapter index, alternating editorial image/card layout, scroll parallax.
3. **Selected work** — asymmetric grid with cursor-following gold glow.
4. **Founders preview** — formal founder cards rebuilt in HTML from the supplied screenshot (names, titles, AaVisions / NavaFit Alignment).
5. **Meet V teaser** — prompt chips that open V with the question.
6. **Press** — three cards labelled honestly (press release / contributor feature).
7. **Closing call to action**.
8. **Inner pages** — Work (filters), Services, AI Lab (with AI-generated clips that pause offscreen), Founders (story + Men's Insider press context), Ecosystem, Legal, 404.
9. **Start a Project** — four guided steps, validation, optional voice note with live waveform, thank-you state. Mobile action bar; V launcher hidden on this page so nothing overlaps.
10. **V, the AI concierge** — streaming answers from verified facts only, voice input (speech recognition) and read-aloud, "Send my brief" hands the chat to the founders. Built-in knowledge mode when Workers AI is not connected.
11. **Command Centre** (`/admin`) — secure login (hashed password, signed session, lockout after 8 failed attempts), live overview (visits, enquiries, V conversations, average lead score, 14-day pulse, pipeline, what visitors ask V), enquiry pages with AI summary + lead score, voice note player + transcript, V chat transcript, status, private notes, AI-drafted reply that opens in your email app, V chat log, and **Publish** (announcement bar, hero line, closing CTA, work, press, Teach V) with instant updates and version history.

## Performance
- Homepage JavaScript: about 8 KB compressed (live site today: about 460 KB).
- Images served as AVIF/WebP at the right size; WebGL halo renders at reduced resolution and stops when offscreen or paused.

## Genuine blockers
- **Cloudflare login expired** on this Mac. Publishing the preview needs `npx wrangler login` once (see `site/README.md`). I can run every remaining step after that.
- **VM23G enquiry inbox not verified.** Enquiries are stored in the Command Centre; no email address is published. Confirm which inbox (if any) should get notifications. See `docs/v2/CONTACT-REGISTER.md`.

## Decisions taken (owner delegated)
- ~~Hosting stays on Cloudflare~~. Superseded later on 2026-11-05: host on Bluehost (veeramisir.com). Before go-live: copy the email DNS records, back up the Bluehost WordPress site, and get explicit approval to move nameservers away from Cloudflare.
- Rebuilt on Astro (web-first) instead of Expo web, for speed.
- Five upgrades approved by the owner: Living Logo stage, V AI concierge, Command Centre, cinematic page transitions, guided Start a Project.
- Budget ranges on Start a Project are visitor options, not published prices.
- The AI clips in the AI Lab are labelled "AI-generated concept clips from the VM23G archive" — authorship is not claimed.
