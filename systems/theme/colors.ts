// ─── Raw palette (internal — never import directly) ─────────────────────────
const p = {
  cream:     '#F4F1EA',
  creamSoft: '#FAF8F2',
  creamDeep: '#E8E3D7',
  brgDeep:   '#003B20',
  brg:       '#004225',
  brgLight:  '#1F5C3A',
  brgMid:    '#0E4D2D',
  olive:     '#5F6E43',
  ink:       '#1F2A24',
  white:     '#FFFFFF',
} as const;

// ─── Semantic color system ───────────────────────────────────────────────────
export const colors = {
  background: {
    base: p.cream,
    elevated: p.creamSoft,
    recessed: p.creamDeep,
  },

  text: {
    primary: p.brgDeep,
    secondary: 'rgba(0, 66, 37, 0.78)' as const,
    muted: 'rgba(0, 66, 37, 0.55)' as const,
    inverse: p.cream,
    accent: p.brg,
  },

  accent: {
    base: p.brg,
    light: p.brgLight,
    mid: p.brgMid,
    dark: p.brgDeep,
    muted: 'rgba(0, 66, 37, 0.55)' as const,
    subtle: 'rgba(0, 66, 37, 0.28)' as const,
    faint: 'rgba(0, 66, 37, 0.12)' as const,
  },

  glass: {
    surface: 'rgba(255, 255, 255, 0.55)' as const,
    surfaceStrong: 'rgba(255, 255, 255, 0.78)' as const,
    highlight: 'rgba(255, 255, 255, 0.36)' as const,
    white: 'rgba(255, 255, 255, 0.88)' as const,
  },

  border: {
    glass: 'rgba(0, 66, 37, 0.10)' as const,
    subtle: 'rgba(0, 66, 37, 0.18)' as const,
    default: 'rgba(0, 66, 37, 0.12)' as const,
    strong: 'rgba(0, 66, 37, 0.28)' as const,
  },

  state: {
    glowRest: 'rgba(0, 66, 37, 0.30)' as const,
    glowHover: 'rgba(0, 66, 37, 0.52)' as const,
    shadow: 'rgba(31, 42, 36, 0.10)' as const,
    shadowDeep: 'rgba(31, 42, 36, 0.20)' as const,
  },

  // ── Flat aliases — backward compat for existing components ──────────────
  pearlMatte: p.cream,
  oliveGreen: p.brg,
  textPrimary: p.brgDeep,
  textMuted: 'rgba(0, 66, 37, 0.55)' as const,
  surfaceGlass: 'rgba(255, 255, 255, 0.55)' as const,
  surfaceGlassStrong: 'rgba(255, 255, 255, 0.78)' as const,
  strokeGlass: 'rgba(0, 66, 37, 0.16)' as const,
  strokeSubtle: 'rgba(0, 66, 37, 0.18)' as const,
  innerHighlight: 'rgba(255, 255, 255, 0.42)' as const,
  shadowDeep: 'rgba(31, 42, 36, 0.20)' as const,
  glowOlive: 'rgba(0, 66, 37, 0.35)' as const,
  glowOliveIntense: 'rgba(0, 66, 37, 0.65)' as const,
} as const;

export type Colors = typeof colors;
