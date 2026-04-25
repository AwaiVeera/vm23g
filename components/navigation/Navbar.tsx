import { Link } from 'expo-router';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/systems/theme/colors';
import { fontFamilies, typography } from '@/systems/theme/typography';

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '/',            label: 'Home' },
  { href: '/about',       label: 'About' },
  { href: '/collectives', label: 'Collectives' },
  { href: '/gallery',     label: 'Gallery' },
  { href: '/partners',    label: 'Partners' },
  { href: '/legal',       label: 'Legal' },
] as const;

type NavHref = (typeof NAV_LINKS)[number]['href'];

// ─── NavLink ──────────────────────────────────────────────────────────────────

function NavLink({ href, label }: { href: NavHref; label: string }) {
  const hover = useSharedValue(0);

  const hoverStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(115, 130, 83, ${interpolate(hover.value, [0, 1], [0, 0.10])})`,
  }));

  return (
    <Link href={href} asChild>
      <Pressable
        onHoverIn={() => { hover.value = withTiming(1, { duration: 200 }); }}
        onHoverOut={() => { hover.value = withTiming(0, { duration: 260 }); }}
        onPressIn={() => { hover.value = withTiming(1, { duration: 100 }); }}
        onPressOut={() => { hover.value = withTiming(0, { duration: 200 }); }}
      >
        <Animated.View style={[styles.linkWrap, hoverStyle]}>
          <Text style={styles.linkText}>{label}</Text>
        </Animated.View>
      </Pressable>
    </Link>
  );
}

// ─── CTA Button ───────────────────────────────────────────────────────────────

function CtaButton() {
  const hover = useSharedValue(0);

  const glowStyle = useAnimatedStyle(() => {
    const glowOpacity = interpolate(hover.value, [0, 1], [0.35, 0.72]);
    const glowRadius = interpolate(hover.value, [0, 1], [12, 28]);
    if (Platform.OS === 'web') {
      return {
        boxShadow: `0 0 ${glowRadius}px rgba(115, 130, 83, ${glowOpacity})`,
      } as object;
    }
    return {
      shadowRadius: glowRadius,
      shadowOpacity: glowOpacity,
    };
  });

  return (
    <Animated.View style={[styles.ctaOuter, glowStyle]}>
      <Pressable
        style={styles.cta}
        onHoverIn={() => { hover.value = withTiming(1, { duration: 240 }); }}
        onHoverOut={() => { hover.value = withTiming(0, { duration: 300 }); }}
        onPressIn={() => { hover.value = withTiming(1, { duration: 100 }); }}
        onPressOut={() => { hover.value = withTiming(0, { duration: 200 }); }}
      >
        <Text style={styles.ctaText}>Enter</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const { width } = useWindowDimensions();
  const compact = width < 900;
  const scrolled = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onScroll = () => {
      scrolled.value = withTiming(Math.min(window.scrollY / 72, 1), { duration: 180 });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrolled]);

  const barStyle = useAnimatedStyle(() => {
    if (Platform.OS !== 'web') return {};
    const bgOpacity   = interpolate(scrolled.value, [0, 1], [0, 0.86]);
    const blurPx      = interpolate(scrolled.value, [0, 1], [0, 22]);
    const borderAlpha = interpolate(scrolled.value, [0, 1], [0, 0.16]);
    return {
      backgroundColor:         `rgba(245, 243, 239, ${bgOpacity})`,
      backdropFilter:          `blur(${blurPx}px)`,
      WebkitBackdropFilter:    `blur(${blurPx}px)`,
      borderBottomColor:       `rgba(115, 130, 83, ${borderAlpha})`,
    } as object;
  });

  const pillStyle = useAnimatedStyle(() => {
    if (Platform.OS !== 'web') return {};
    const blurPx      = interpolate(scrolled.value, [0, 1], [10, 26]);
    const bgOpacity   = interpolate(scrolled.value, [0, 1], [0.28, 0.52]);
    const shadowAlpha = interpolate(scrolled.value, [0, 1], [0.06, 0.14]);
    return {
      backdropFilter:          `blur(${blurPx}px)`,
      WebkitBackdropFilter:    `blur(${blurPx}px)`,
      backgroundColor:         `rgba(255, 255, 255, ${bgOpacity})`,
      boxShadow:               [
        `0 6px 28px rgba(26, 25, 22, ${shadowAlpha})`,
        `inset 0 1px 0 rgba(255, 255, 255, 0.88)`,
        `inset 0 -1px 0 rgba(255, 255, 255, 0.32)`,
      ].join(', '),
    } as object;
  });

  return (
    <Animated.View style={[styles.bar, barStyle]}>
      {/* Left — wordmark */}
      <Text style={styles.wordmark}>VM23G</Text>

      {/* Center — glass pill */}
      {!compact && (
        <Animated.View style={[styles.pill, pillStyle]}>
          {NAV_LINKS.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </Animated.View>
      )}

      {/* Right — CTA */}
      <CtaButton />
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent',
    zIndex: 100,
    ...Platform.select({
      web:     { position: 'fixed' as unknown as 'absolute', top: 0, left: 0, right: 0 },
      default: {},
    }),
  },

  wordmark: {
    fontFamily: fontFamilies.serif,
    fontSize: 15,
    letterSpacing: 4,
    fontWeight: '400',
    color: colors.textPrimary,
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.strokeGlass,
    paddingVertical: 8,
    paddingHorizontal: 14,
    overflow: 'hidden',
  },

  linkWrap: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  linkText: {
    ...typography.caption,
    color: colors.oliveGreen,
    textTransform: 'uppercase',
    letterSpacing: 1.8,
  },

  ctaOuter: {
    borderRadius: 999,
    ...Platform.select({
      ios: {
        shadowColor: colors.glowOlive,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.45,
        shadowRadius: 14,
      },
      android: { elevation: 6 },
      default: {},
    }),
  },

  cta: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.oliveGreen,
    backgroundColor: colors.pearlMatte,
    ...Platform.select({
      web: { cursor: 'pointer' as unknown as undefined },
      default: {},
    }),
  },

  ctaText: {
    fontFamily: fontFamilies.sans,
    fontSize: 12,
    letterSpacing: 2.2,
    fontWeight: '500',
    color: colors.oliveGreen,
    textTransform: 'uppercase',
  },
});
