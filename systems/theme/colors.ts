// ─── Raw palette (internal — never import directly) ─────────────────────────
const p = {
  // Dark matte greys (page + recessed surfaces)
  inkBase:    '#0E0F11',  // primary canvas
  inkDeep:    '#06070A',  // deepest section
  inkSoft:    '#1A1C20',  // raised surfaces
  inkMid:     '#22252A',  // borders & dividers tinting

  // Pearl / ivory (now used as text + glass highlight only)
  pearl:      '#F5F3EF',
  pearlLight: '#FAF9F6',
  pearlSoft:  'rgba(245, 243, 239, 0.92)',

  // Olive accent
  olive:      '#9CB071',
  oliveLight: '#B8C98A',
  oliveMid:   '#7E904F',
  oliveDark:  '#5F6E43',

  white:      '#FFFFFF',
  ink:        '#1A1A1F',  // legacy ink reference
} as const;

// ─── Semantic color system ───────────────────────────────────────────────────
export const colors = {

  // Page and surface backgrounds — DARK matte
  background: {
    base:     p.inkBase,
    elevated: p.inkSoft,
    recessed: p.inkDeep,
  },

  // Text now reads light on dark
  text: {
    primary:   p.pearl,
    secondary: 'rgba(245, 243, 239, 0.78)' as const,
    muted:     'rgba(245, 243, 239, 0.55)' as const,
    inverse:   p.inkBase,
    accent:    p.olive,
  },

  // Olive green — primary accent (slightly brightened for dark bg readability)
  accent: {
    base:   p.olive,
    light:  p.oliveLight,
    mid:    p.oliveMid,
    dark:   p.oliveDark,
    muted:  'rgba(156, 176, 113, 0.55)' as const,
    subtle: 'rgba(156, 176, 113, 0.28)' as const,
    faint:  'rgba(156, 176, 113, 0.12)' as const,
  },

  // Dark frosted glass surfaces (matte + shine via inner highlight)
  glass: {
    surface:       'rgba(22, 24, 28, 0.55)' as const,
    surfaceStrong: 'rgba(22, 24, 28, 0.72)' as const,
    highlight:     'rgba(255, 255, 255, 0.10)' as const,
    white:         'rgba(28, 30, 34, 0.82)' as const,
  },

  // Borders: glass hairlines, olive tints, light tints on dark bg
  border: {
    glass:   'rgba(255, 255, 255, 0.10)' as const,
    subtle:  'rgba(156, 176, 113, 0.28)' as const,
    default: 'rgba(245, 243, 239, 0.14)' as const,
    strong:  'rgba(245, 243, 239, 0.28)' as const,
  },

  // Interactive and motion states
  state: {
    glowRest:   'rgba(156, 176, 113, 0.42)' as const,
    glowHover:  'rgba(156, 176, 113, 0.78)' as const,
    shadow:     'rgba(0, 0, 0, 0.42)' as const,
    shadowDeep: 'rgba(0, 0, 0, 0.62)' as const,
  },

  // ── Flat aliases — backward compat for existing components ──────────────
  // pearlMatte is now the page background (dark) — components reading it as
  // "page bg color" still work; semantically it's the new matte canvas.
  pearlMatte:         p.inkBase,
  oliveGreen:         p.olive,
  textPrimary:        p.pearl,
  textMuted:          'rgba(245, 243, 239, 0.55)' as const,
  surfaceGlass:       'rgba(22, 24, 28, 0.55)' as const,
  surfaceGlassStrong: 'rgba(22, 24, 28, 0.72)' as const,
  strokeGlass:        'rgba(255, 255, 255, 0.16)' as const,
  strokeSubtle:       'rgba(156, 176, 113, 0.28)' as const,
  innerHighlight:     'rgba(255, 255, 255, 0.16)' as const,
  shadowDeep:         'rgba(0, 0, 0, 0.62)' as const,
  glowOlive:          'rgba(156, 176, 113, 0.55)' as const,
  glowOliveIntense:   'rgba(156, 176, 113, 0.85)' as const,

} as const;

export type Colors = typeof colors;
