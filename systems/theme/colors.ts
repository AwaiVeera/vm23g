// ─── Raw palette (internal — never import directly) ─────────────────────────
const p = {
  pearl:      '#F5F3EF',
  pearlLight: '#FAF9F6',
  pearlDeep:  '#E8E5DF',
  olive:      '#738253',
  oliveLight: '#8E9E6A',
  oliveMid:   '#5F6E43',
  oliveDark:  '#4A5530',
  ink:        '#1A1A1F',
  white:      '#FFFFFF',
} as const;

// ─── Semantic color system ───────────────────────────────────────────────────
export const colors = {

  // Page and surface backgrounds
  background: {
    base:     p.pearl,       // Pearl Matte — primary canvas
    elevated: p.pearlLight,  // cards, modals, raised panels
    recessed: p.pearlDeep,   // section insets, subtle contrast zones
  },

  // All text uses ink on pearl — never dark UI
  text: {
    primary:   p.ink,
    secondary: 'rgba(26, 26, 31, 0.72)' as const,
    muted:     'rgba(26, 26, 31, 0.45)' as const,
    inverse:   p.pearl,
    accent:    p.olive,
  },

  // Olive green — primary accent, full range
  accent: {
    base:   p.olive,
    light:  p.oliveLight,
    mid:    p.oliveMid,
    dark:   p.oliveDark,
    muted:  'rgba(115, 130, 83, 0.45)' as const,
    subtle: 'rgba(115, 130, 83, 0.22)' as const,
    faint:  'rgba(115, 130, 83, 0.10)' as const,
  },

  // Light glassmorphism surfaces only — never dark
  glass: {
    surface:       'rgba(255, 255, 255, 0.42)' as const,
    surfaceStrong: 'rgba(255, 255, 255, 0.58)' as const,
    highlight:     'rgba(255, 255, 255, 0.85)' as const,
    white:         'rgba(255, 255, 255, 0.96)' as const,
  },

  // Borders: glass hairlines, olive tints, ink tints
  border: {
    glass:   'rgba(255, 255, 255, 0.72)' as const,
    subtle:  'rgba(115, 130, 83, 0.22)' as const,
    default: 'rgba(26, 26, 31, 0.14)' as const,
    strong:  'rgba(26, 26, 31, 0.28)' as const,
  },

  // Interactive and motion states
  state: {
    glowRest:   'rgba(115, 130, 83, 0.38)' as const,
    glowHover:  'rgba(115, 130, 83, 0.72)' as const,
    shadow:     'rgba(26, 25, 22, 0.12)' as const,
    shadowDeep: 'rgba(26, 25, 22, 0.22)' as const,
  },

  // ── Flat aliases — backward compat for existing components ──────────────
  pearlMatte:         p.pearl,
  oliveGreen:         p.olive,
  textPrimary:        p.ink,
  textMuted:          'rgba(26, 26, 31, 0.45)' as const,
  surfaceGlass:       'rgba(255, 255, 255, 0.42)' as const,
  surfaceGlassStrong: 'rgba(255, 255, 255, 0.58)' as const,
  strokeGlass:        'rgba(255, 255, 255, 0.72)' as const,
  strokeSubtle:       'rgba(115, 130, 83, 0.22)' as const,
  innerHighlight:     'rgba(255, 255, 255, 0.85)' as const,
  shadowDeep:         'rgba(26, 25, 22, 0.12)' as const,
  glowOlive:          'rgba(115, 130, 83, 0.45)' as const,
  glowOliveIntense:   'rgba(115, 130, 83, 0.72)' as const,

} as const;

export type Colors = typeof colors;
