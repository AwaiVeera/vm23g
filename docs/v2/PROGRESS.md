# VM23G v2 — Progress record

Branch: `redesign-v2` · New site lives in `site/` · Live veeramisir.com is untouched.

## Current status (updated 2026-11-05)
Direction changed after the screens below were built. The owner now wants:
- a more static, screen-by-screen site, explored in concept spikes under `site/public/concepts/` (the chosen concept is `mix.html`: Monolith + Lens, five sides);
- hosting on **Bluehost** at veeramisir.com, structured like destinosingapore.co: a static front end served by Apache, plus a PHP `/api` folder for forms, admin and V. **Not Cloudflare, not WordPress.**

The Astro site in `site/` stays as the working reference for features: Start a Project, Command Centre and V. Nothing is deployed. Audit record: `docs/v2/AUDIT-2026-11-05.md`.

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
