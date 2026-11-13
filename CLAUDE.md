# VM23G SYSTEM DIRECTIVE

You are building a cinematic luxury web platform for VM23G.

NON-NEGOTIABLE RULES (v2 brand direction, owner brief 2026-11-05 — supersedes the old Pearl Matte light theme):
- No assumptions. If unclear, ask.
- Use the authentic supplied logo (`site/src/assets/brand/vm23g-logo.png`, 1306×1019 raster, trimmed from the owner's `bglogo-1.png`). Never redraw, recolour or crop it into a new mark. Never call it vector or 4K. Never upscale, filter or sub-pixel-translate it.
- Brand line, exactly: MIND. BODY. BRAND. TECHNOLOGY.
- Dark gold-and-olive UI tokens: canvas #080D09, glass #141E16, olive #687347, gold #C7A45A, gold highlight #E5D09A, text #F2EDDF, secondary text #B8BEA7.
  - Olive #687347 fails contrast for text (3.85:1) — use it only for surfaces, borders and glows.
- Typography: Cinzel for short display headings and founder names; Manrope for paragraphs and UI.
- Every component must feel physical (depth, blur, shadow). Motion is cinematic, not decorative.
- Never invent founder facts, metrics, press reach, ratings or contact details. Contact status lives in `docs/v2/CONTACT-REGISTER.md`.

LAYOUT PRINCIPLES:
- Clean editorial spacing
- Large breathing sections
- Left/right asymmetry like luxury magazines
- Never clutter
- Mobile composition is part of every screen's definition of done

ANIMATION RULES:
- Parallax layers required
- Hover = glow intensification
- Background = subtle continuous motion (halo/particles), paused offscreen
- Support Pause motion (`data-motion-toggle`) and prefers-reduced-motion
- Never put 3D transforms on the logo itself (it blurs the raster); tilt the glass layers around it
- Avoid cheap transitions

STRUCTURE (v2 site in `site/`, Astro 7 + @astrojs/cloudflare on Workers):
- site/src/pages/        routes (public pages, /admin, /api)
- site/src/components/
- site/src/sections/
- site/src/systems/
- site/src/animations/
- site/src/content/      verified copy and data
- site/migrations/       D1 schema
- site/public/.assetsignore keeps concepts/ (private family photos, song) out of every deploy. Never remove it.

OUTPUT STANDARD:
- Production-ready code only
- No pseudo-code
- No unnecessary comments

## DEV SERVER (v2)
- Run from `site/`: `PATH=/opt/homebrew/opt/node/bin:$PATH npm run dev` (Astro needs Node ≥22.23.4; `~/.local/bin/node` is 22.23.1). Preview config: `.claude/launch.json` → `vm23g-v2`.
- Local dev uses `CLOUDFLARE_ENV=dev` (no Workers AI binding; it needs a Cloudflare login). V falls back to its built-in knowledge mode locally.

## HOSTING (live since 2026-11-14)
- veeramisir.com and www are served by the Cloudflare Worker `vm23g-v2` (custom domains in `site/wrangler.jsonc`), with D1 `vm23g`. Deploy from `site/` with `npm run deploy` (rebuilds first; a bare `wrangler deploy` uses the last build's config).
- The old site is the Cloudflare Pages project `vm23g`, connected to this GitHub repo with production branch `main`. Never push to `main` without explicit approval: it would redeploy the old Pages project. Pushes to `redesign-v2` only create failing Pages preview builds.
- R2 is not enabled, so voice notes are off (the recorder hides itself when no `MEDIA` binding exists).
- Email is Google Workspace (MX smtp.google.com, DKIM, imap/pop/smtp CNAMEs). Never change those DNS records. DNS edits are done by the owner in the Cloudflare dashboard.
- Rollback: remove the custom domains from `vm23g-v2`, re-add them to the Pages project `vm23g`.
