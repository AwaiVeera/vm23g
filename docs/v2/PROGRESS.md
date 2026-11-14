# VM23G v2 — Progress record

Branch: `redesign-v2` · Site lives in `site/` · **veeramisir.com is LIVE on the new site since 2026-11-14.**

## Current status (updated 2026-11-15)
- veeramisir.com and www run on the Cloudflare Worker `vm23g-v2` with D1 `vm23g` and Workers AI (V). Deploy from `site/` with `npm run deploy`. Hosting notes and rollback are in `CLAUDE.md`.
- Enquiry alerts go to the Google Chat space "VM23G enquiries" through the `NOTIFY_WEBHOOK_URL` secret. Owner confirmed delivery on 2026-11-15.
- The legacy Expo app was removed from the repo root on 2026-11-14 (commit `0ae5809`); it remains in git history and in `~/Backups/vm23g/2026-11-14-pre-health-check`.
- Concept screens (`site/public/concepts/`, latest `calm.html`) stay local and never deploy (`site/public/.assetsignore`).
- Audit record: `docs/v2/AUDIT-2026-11-05.md`.

## Open items (owner decisions)
- **Legal page** still states it must be reviewed by a qualified Singapore lawyer before publication.
- **Voice notes** are off until R2 is enabled in the Cloudflare dashboard; then add the `r2_buckets` binding back to the top level of `site/wrangler.jsonc` and redeploy.
- **Login bot check** (Turnstile) and session revocation, open since the 2026-11-05 audit.

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
- Homepage JavaScript: about 8 KB compressed (the old site was about 460 KB).
- Live trace 2026-11-14 (throttled phone): LCP 0.78 s, CLS 0. Lighthouse mobile 100 for Accessibility, Best Practices and SEO.
- Images served as AVIF/WebP at the right size; WebGL halo renders at reduced resolution and stops when offscreen or paused.

## Decisions taken (owner delegated)
- Hosting: Cloudflare Workers (owner's final choice on 2026-11-14, replacing the earlier Bluehost plan). Email DNS (Google Workspace) left untouched.
- Rebuilt on Astro (web-first) instead of Expo web, for speed.
- Five upgrades approved by the owner: Living Logo stage, V AI concierge, Command Centre, cinematic page transitions, guided Start a Project.
- Budget ranges on Start a Project are visitor options, not published prices.
- The AI clips in the AI Lab are labelled "AI-generated concept clips from the VM23G archive" — authorship is not claimed.
