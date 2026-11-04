# VM23G SYSTEM DIRECTIVE

You are building a cinematic luxury web platform for VM23G.

NON-NEGOTIABLE RULES (v2 brand direction, owner brief 2026-11-05 — supersedes the old Pearl Matte light theme):
- No assumptions. If unclear, ask.
- Use the authentic supplied logo (`site/src/assets/brand/vm23g-logo.png`, 640×499 raster). Never redraw, recolour or crop it into a new mark. Never call it vector or 4K.
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
- The legacy Expo app at the repo root is reference only; do not extend it.

OUTPUT STANDARD:
- Production-ready code only
- No pseudo-code
- No unnecessary comments

## REACT NATIVE WEB STYLING GUARDRAIL
- Never mutate objects returned from StyleSheet.create(). Treat as immutable.
- For web-only CSS properties (backgroundImage, filter, maskImage, backdropFilter):
  - Use Platform.select({ web: { ... } as unknown as ViewStyle, default: {} })
  - Or apply a separate inline object in a style array alongside the StyleSheet ref
- Never assign properties to StyleSheet objects at module scope — causes module-evaluation crashes on web.

## REANIMATED / RN GOTCHAS
- Easing: use Easing.sin not Easing.sine (Easing.sine does not exist)
- Omit JSX.Element return type annotation — use implicit return type or React.JSX.Element
- AnimatedStyle is the correct import from react-native-reanimated (not AnimatedStyleProp)
- onHoverIn/onHoverOut only exist on Pressable — use Animated.createAnimatedComponent(Pressable) for hover glow
- Animated text counters: use useAnimatedReaction + runOnJS + useState, not useAnimatedProps on Text

## DEV SERVER (v2)
- Run from `site/`: `PATH=/opt/homebrew/opt/node/bin:$PATH npm run dev` (Astro needs Node ≥22.23.4; `~/.local/bin/node` is 22.23.1). Preview config: `.claude/launch.json` → `vm23g-v2`.
- Local dev uses `CLOUDFLARE_ENV=dev` (no Workers AI binding; it needs a Cloudflare login). V falls back to its built-in knowledge mode locally.

## DEV SERVER (legacy Expo)
- Port 8081 conflicts: kill the old process first (kill <pid>), then npx expo start --web
- npx expo start is non-interactive in this session context — avoid prompts by killing stale servers
- Background "completed" status while Metro is alive is normal (process detaches). Verify liveness with `lsof -ti:8081` + `curl http://localhost:8081`, not the harness status.

## KNOWN DIAGNOSTIC NOISE
Do not re-investigate these — root causes already traced:
- `props.pointerEvents is deprecated. Use style.pointerEvents` — emitted by `@react-navigation/elements@2.6.3` `ResourceSavingView` (JSX prop usage). Project code is clean (all in-project usages are style-object keys). Will go away when @react-navigation upgrades.
- `xcrun simctl … exited with non-zero code: 72` — `xcode-select` is pointing at `/Library/Developer/CommandLineTools` (no simctl). Full Xcode is in /Applications but not selected. Non-blocking for web. Fix only if doing iOS: `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`.
- Remaining `npm audit` moderate vulns (xcode → uuid<14 chain, plus its cascade through @expo/config-plugins) are intentionally not overridden. The advisory is reachable only when `buf` is passed to uuid v3/v5/v6, which the `xcode` package does not do. Bumping uuid to 14 risks breaking the dev-only iOS prebuild path. The postcss XSS advisory IS closed via `overrides` in package.json.
