# VM23G SYSTEM DIRECTIVE

You are building a cinematic luxury web platform for VM23G.

NON-NEGOTIABLE RULES:
- No assumptions. If unclear, ask.
- Maintain Pearl Matte (#F5F3EF) base.
- Olive Green (#738253) is primary accent.
- Typography:
  - Headings: Serif (Cinzel style)
  - Body: Inter
- Use light glassmorphism only (NOT dark UI).
- Every component must feel physical (depth, blur, shadow).
- Motion is cinematic, not decorative.

LAYOUT PRINCIPLES:
- Clean editorial spacing
- Large breathing sections
- Left/right asymmetry like luxury magazines
- Never clutter

ANIMATION RULES:
- Parallax layers required
- Hover = glow intensification
- Background = subtle continuous motion (rain/particles)
- Avoid cheap transitions

STRUCTURE:
- app/
  - (pages)
- components/
- systems/
- animations/
- sections/

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

## DEV SERVER
- Port 8081 conflicts: kill the old process first (kill <pid>), then npx expo start --web
- npx expo start is non-interactive in this session context — avoid prompts by killing stale servers
- Background "completed" status while Metro is alive is normal (process detaches). Verify liveness with `lsof -ti:8081` + `curl http://localhost:8081`, not the harness status.

## KNOWN DIAGNOSTIC NOISE
Do not re-investigate these — root causes already traced:
- `props.pointerEvents is deprecated. Use style.pointerEvents` — emitted by `@react-navigation/elements@2.6.3` `ResourceSavingView` (JSX prop usage). Project code is clean (all in-project usages are style-object keys). Will go away when @react-navigation upgrades.
- `xcrun simctl … exited with non-zero code: 72` — `xcode-select` is pointing at `/Library/Developer/CommandLineTools` (no simctl). Full Xcode is in /Applications but not selected. Non-blocking for web. Fix only if doing iOS: `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`.
- Remaining `npm audit` moderate vulns (xcode → uuid<14 chain, plus its cascade through @expo/config-plugins) are intentionally not overridden. The advisory is reachable only when `buf` is passed to uuid v3/v5/v6, which the `xcode` package does not do. Bumping uuid to 14 risks breaking the dev-only iOS prebuild path. The postcss XSS advisory IS closed via `overrides` in package.json.
