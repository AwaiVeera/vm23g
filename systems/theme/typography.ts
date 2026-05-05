import { Platform, TextStyle } from 'react-native';

export const fontFamilies = {
  serif: Platform.select({
    web: '"Cinzel", "Cormorant Garamond", "Times New Roman", Georgia, serif',
    default: 'Cinzel',
  }) as string,
  sans: Platform.select({
    web: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    default: 'Inter',
  }) as string,
} as const;

// ─── Named editorial text styles ─────────────────────────────────────────────

export const heroTitle: TextStyle = {
  fontFamily: fontFamilies.serif,
  fontSize: 88,
  lineHeight: 96,
  letterSpacing: 8,
  fontWeight: '300',
};

export const sectionTitle: TextStyle = {
  fontFamily: fontFamilies.serif,
  fontSize: 42,
  lineHeight: 52,
  letterSpacing: 3.5,
  fontWeight: '400',
};

export const body: TextStyle = {
  fontFamily: fontFamilies.sans,
  fontSize: 16,
  lineHeight: 28,
  letterSpacing: 0.3,
  fontWeight: '400',
};

export const caption: TextStyle = {
  fontFamily: fontFamilies.sans,
  fontSize: 12,
  lineHeight: 18,
  letterSpacing: 1.6,
  fontWeight: '500',
};

export const microLabel: TextStyle = {
  fontFamily: fontFamilies.sans,
  fontSize: 10,
  lineHeight: 14,
  letterSpacing: 3,
  fontWeight: '600',
  textTransform: 'uppercase',
};

// ─── Structured map (for programmatic access) ────────────────────────────────

export const typography = {
  heroTitle,
  sectionTitle,
  body,
  caption,
  microLabel,

  // ── Extended variants ───────────────────────────────────────────────────

  display: {
    fontFamily: fontFamilies.serif,
    fontSize: 64,
    lineHeight: 72,
    letterSpacing: 5,
    fontWeight: '300' as TextStyle['fontWeight'],
  } satisfies TextStyle,

  subheading: {
    fontFamily: fontFamilies.serif,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 2,
    fontWeight: '400' as TextStyle['fontWeight'],
  } satisfies TextStyle,

  bodyLarge: {
    fontFamily: fontFamilies.sans,
    fontSize: 18,
    lineHeight: 32,
    letterSpacing: 0.2,
    fontWeight: '400' as TextStyle['fontWeight'],
  } satisfies TextStyle,

  bodySmall: {
    fontFamily: fontFamilies.sans,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.25,
    fontWeight: '400' as TextStyle['fontWeight'],
  } satisfies TextStyle,

  label: {
    fontFamily: fontFamilies.sans,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.8,
    fontWeight: '500' as TextStyle['fontWeight'],
  } satisfies TextStyle,

  // Aliases used by section components and GlowButton
  title: sectionTitle,
  subtitle: {
    fontFamily: fontFamilies.serif,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 1.8,
    fontWeight: '400' as TextStyle['fontWeight'],
  } satisfies TextStyle,

} as const;

export type TypographyKey = keyof typeof typography;
