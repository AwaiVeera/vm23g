# VM23G brand system

## Color

- Base: Pearl Matte `#F5F3EF`
- Primary accent: Olive Green `#738253`
- Text: deep neutral on Pearl Matte; muted text uses controlled opacity
- Glass: light surfaces only — frosted white glass with hairline stroke, not dark UI

## Typography

- Headings: Cinzel (serif)
- Body: Inter
- Keep hierarchy spacious; editorial rhythm over density

## Surfaces

- Light glassmorphism: blur + translucent white + crisp border + soft inner highlight
- Physical depth: layered elevation, soft shadows, restrained highlights

## Motion

- Cinematic pacing; motion clarifies hierarchy
- Parallax layers on scroll
- Hover increases olive glow intensity
- Background: subtle continuous motion (rain / particles)
- Avoid abrupt or gimmicky transitions

## Performance Guardrails

- Prefer transform/opacity animation over layout-affecting animation
- Keep blur/shadow intensity adaptive for smaller viewports
- Avoid unnecessary state updates in high-frequency interactions
- Keep particle and overlay systems lightweight on mobile
- Preserve premium visual language while protecting frame stability

## Layout

- Generous vertical spacing
- Magazine-like asymmetry (left / right weighting)
- No clutter; one focal idea per section where possible
