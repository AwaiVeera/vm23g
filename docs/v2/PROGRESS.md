# VM23G v2 — Progress record

Branch: `redesign-v2` · New site lives in `site/` · Live veeramisir.com is untouched.

## Current screen
Screen 2 — Home chapters (Mind / Body / Brand / Technology)

## Completed screens
1. **Navigation + Living Logo hero** — floating olive glass dock, expanded menu with logo, described destinations and project previews; hero with authentic gold logo on glass stage, WebGL olive-to-gold halo, masked light sweep across the gold only, glass planes with pointer parallax, Pause motion, reduced-motion support. Checked at 1440×900 and 390×844.

## Genuine blockers
- **Cloudflare login expired** on this Mac. Publishing the preview link needs the owner to run `npx wrangler login` once (from `site/`). Building and local testing continue without it.
- **VM23G enquiry destination not verified.** `summan@veeramisir.com` appears in the old site's legal page only. Enquiries are stored in the dashboard; no email address is published until confirmed. See `docs/v2/CONTACT-REGISTER.md`.

## Decisions taken (owner delegated)
- Hosting stays on Cloudflare (owner decision, 2026-11-05). New site deploys as a Cloudflare Worker `vm23g-v2`, preview first.
- Rebuilt on Astro (web-first) instead of Expo web, for speed: the live site ships ~460 KB compressed JavaScript.
- The 5 upgrades approved by the owner: Living Logo stage, V AI concierge, Command Centre dashboard, cinematic page transitions, guided Start a Project.
- Press items are labelled honestly: two are paid press releases (ACCESS Newswire / Yahoo Finance syndication), one is Men's Insider contributor content. No metrics from them are quoted.
