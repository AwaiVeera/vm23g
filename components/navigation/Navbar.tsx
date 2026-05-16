import { Link, usePathname, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/systems/theme/colors';
import { useMotionGuardrails } from '@/systems/motion/useMotionGuardrails';
import { fontFamilies, typography } from '@/systems/theme/typography';

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '/',            label: 'Home' },
  { href: '/about',       label: 'About' },
  { href: '/collectives', label: 'Collectives' },
  { href: '/gallery',     label: 'Gallery' },
  { href: '/legal',       label: 'Legal' },
] as const;

type NavHref = (typeof NAV_LINKS)[number]['href'];

function isActiveLink(pathname: string, href: NavHref) {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getLogoSize(width: number) {
  if (width >= 1280) return { width: 320, height: 110 };
  if (width >= 900) return { width: 280, height: 96 };
  return { width: 220, height: 76 };
}

// ─── NavLink ──────────────────────────────────────────────────────────────────

function NavLink({ href, label, active }: { href: NavHref; label: string; active: boolean }) {
  const { reduceMotion, lowMotionDevice } = useMotionGuardrails();
  const hover = useSharedValue(0);

  const hoverStyle = useAnimatedStyle(() => {
    const glow = interpolate(hover.value, [0, 1], [0, 0.28]);
    const lift = reduceMotion ? 0 : interpolate(hover.value, [0, 1], [0, lowMotionDevice ? -0.8 : -1.5]);
    const scale = reduceMotion ? 1 : interpolate(hover.value, [0, 1], [1, lowMotionDevice ? 1.02 : 1.04]);
    if (Platform.OS === 'web') {
      return {
        backgroundColor: `rgba(0, 66, 37, ${glow * 0.6})`,
        transform: [{ translateY: lift }, { scale }],
        boxShadow: [
          `0 12px 26px rgba(0, 66, 37, ${interpolate(hover.value, [0, 1], [0.10, 0.24])})`,
          `0 0 18px rgba(0, 66, 37, ${interpolate(hover.value, [0, 1], [0.06, 0.18])})`,
        ].join(', '),
      } as object;
    }
    return {
      backgroundColor: `rgba(0, 66, 37, ${glow * 0.6})`,
      transform: [{ translateY: lift }, { scale }],
    };
  });

  return (
    <Link href={href} asChild>
      <Pressable
        onHoverIn={() => { hover.value = withTiming(reduceMotion ? 0.3 : 1, { duration: reduceMotion ? 120 : 200 }); }}
        onHoverOut={() => { hover.value = withTiming(0, { duration: reduceMotion ? 130 : 260 }); }}
        onPressIn={() => { hover.value = withTiming(reduceMotion ? 0.3 : 1, { duration: 100 }); }}
        onPressOut={() => { hover.value = withTiming(0, { duration: reduceMotion ? 130 : 200 }); }}
      >
        <Animated.View style={[styles.linkWrap, active && styles.linkWrapActive, hoverStyle]}>
          <Text style={[styles.linkText, active && styles.linkTextActive]}>{label}</Text>
        </Animated.View>
      </Pressable>
    </Link>
  );
}

// ─── CTA Button ───────────────────────────────────────────────────────────────

function CtaButton({ onPress }: { onPress: () => void }) {
  const hover = useSharedValue(0);

  const glowStyle = useAnimatedStyle(() => {
    const glowOpacity = interpolate(hover.value, [0, 1], [0.35, 0.72]);
    const glowRadius = interpolate(hover.value, [0, 1], [12, 28]);
    if (Platform.OS === 'web') {
      return {
        boxShadow: `0 0 ${glowRadius}px rgba(0, 66, 37, ${glowOpacity * 0.62})`,
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
        onPress={onPress}
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
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { reduceMotion, lowMotionDevice } = useMotionGuardrails();
  const compact = width < 900;
  const pathname = usePathname();
  const logoSize = getLogoSize(width);
  const scrolled = useSharedValue(0);
  const logoHover = useSharedValue(0);
  const logoPulse = useSharedValue(0);
  const pillHover = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onScroll = () => {
      scrolled.value = withTiming(Math.min(window.scrollY / 72, 1), { duration: 180 });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrolled]);

  useEffect(() => {
    if (reduceMotion) {
      logoPulse.value = withTiming(0, { duration: 120 });
      return;
    }
    logoPulse.value = withRepeat(withTiming(1, { duration: lowMotionDevice ? 2600 : 2200 }), -1, true);
  }, [logoPulse, reduceMotion, lowMotionDevice]);

  const barStyle = useAnimatedStyle(() => {
    if (Platform.OS !== 'web') return {};
    const bgOpacity   = interpolate(scrolled.value, [0, 1], [0, 0.78]);
    const blurPx      = interpolate(scrolled.value, [0, 1], [0, 24]);
    const borderAlpha = interpolate(scrolled.value, [0, 1], [0, 0.16]);
    return {
      backgroundColor:         `rgba(255, 255, 255, ${bgOpacity})`,
      backdropFilter:          `blur(${blurPx}px) saturate(125%)`,
      WebkitBackdropFilter:    `blur(${blurPx}px) saturate(125%)`,
      borderBottomColor:       `rgba(0, 66, 37, ${borderAlpha})`,
    } as object;
  });

  const pillStyle = useAnimatedStyle(() => {
    const hoverInfluence = pillHover.value;
    if (Platform.OS !== 'web') {
      return {
        transform: [{ scale: interpolate(hoverInfluence, [0, 1], [1, 1.01]) }],
      };
    }
    const blurPx      = interpolate(scrolled.value, [0, 1], [12, 28]) + interpolate(hoverInfluence, [0, 1], [0, 6]);
    const bgOpacity   = interpolate(scrolled.value, [0, 1], [0.55, 0.74]) + interpolate(hoverInfluence, [0, 1], [0, 0.08]);
    const shadowAlpha = interpolate(scrolled.value, [0, 1], [0.16, 0.24]) + interpolate(hoverInfluence, [0, 1], [0, 0.08]);
    return {
      backdropFilter:          `blur(${blurPx}px) saturate(125%)`,
      WebkitBackdropFilter:    `blur(${blurPx}px) saturate(125%)`,
      backgroundColor:         `rgba(255, 255, 255, ${bgOpacity})`,
      transform: [
        { translateY: reduceMotion ? 0 : interpolate(hoverInfluence, [0, 1], [0, -1]) },
        { scale: reduceMotion ? 1 : interpolate(hoverInfluence, [0, 1], [1, lowMotionDevice ? 1.006 : 1.012]) },
        { rotateZ: `${reduceMotion ? 0 : interpolate(hoverInfluence, [0, 1], [0, -0.12])}deg` },
      ],
      boxShadow:               [
        `0 10px 34px rgba(31, 42, 36, ${shadowAlpha})`,
        `0 0 22px rgba(0, 66, 37, ${interpolate(hoverInfluence, [0, 1], [0.05, 0.15])})`,
        `inset 0 1px 0 rgba(255, 255, 255, 0.45)`,
        `inset 0 -1px 0 rgba(0, 66, 37, 0.20)`,
      ].join(', '),
    } as object;
  });

  const logoCtaStyle = useAnimatedStyle(() => {
    const pulseScale = reduceMotion
      ? 1
      : interpolate(logoPulse.value, [0, 1], [1, lowMotionDevice ? 1.012 : 1.022]);
    const hoverScale = interpolate(logoHover.value, [0, 1], [1, 1.05]);
    const scale = pulseScale * hoverScale;
    const lift = reduceMotion ? 0 : interpolate(logoHover.value, [0, 1], [0, -1]);
    return {
      transform: [{ translateY: lift }, { scale }],
    };
  });

  return (
    <Animated.View style={[styles.bar, barStyle]}>
      {/* Left — logo */}
      <Link href="/" asChild>
        <Pressable
          onHoverIn={() => {
            logoHover.value = withTiming(reduceMotion ? 0.35 : 1, { duration: reduceMotion ? 140 : 240 });
          }}
          onHoverOut={() => {
            logoHover.value = withTiming(0, { duration: 220 });
          }}
          onPressIn={() => { logoHover.value = withTiming(reduceMotion ? 0.35 : 1, { duration: 120 }); }}
          onPressOut={() => { logoHover.value = withTiming(0, { duration: 200 }); }}
          accessibilityRole="link"
          accessibilityLabel="Go to Home"
          style={styles.logoPressable}
        >
          <Animated.View style={[styles.logoWrap, logoCtaStyle]}>
            <Image
              source={require('@/assets/images/vm23g-logo.png')}
              accessibilityLabel="VM23G — Home"
              alt="VM23G logo"
              style={{ width: logoSize.width, height: logoSize.height }}
              contentFit="contain"
              priority="high"
            />
          </Animated.View>
        </Pressable>
      </Link>

      {/* Center — glass pill */}
      {!compact && (
        <Pressable
          onHoverIn={() => { pillHover.value = withTiming(reduceMotion ? 0.3 : 1, { duration: reduceMotion ? 120 : 260 }); }}
          onHoverOut={() => { pillHover.value = withTiming(0, { duration: reduceMotion ? 140 : 300 }); }}
        >
          <Animated.View style={[styles.pill, pillStyle]}>
            {NAV_LINKS.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} active={isActiveLink(pathname, item.href)} />
            ))}
          </Animated.View>
        </Pressable>
      )}

      {/* Right — CTA */}
      <CtaButton onPress={() => router.push('/forms')} />
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

  logoPressable: {
    backgroundColor: 'transparent',
    ...Platform.select({
      web: { cursor: 'pointer' as unknown as undefined },
      default: {},
    }),
  },
  logoWrap: {
    backgroundColor: 'transparent',
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.strokeGlass,
    paddingVertical: 10,
    paddingHorizontal: 14,
    overflow: 'hidden',
  },

  linkWrap: {
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 999,
  },
  linkWrapActive: {
    borderWidth: 1.5,
    borderColor: colors.oliveGreen,
    backgroundColor: colors.accent.subtle,
  },

  linkText: {
    ...typography.caption,
    color: colors.oliveGreen,
    textTransform: 'uppercase',
    letterSpacing: 1.8,
  },
  linkTextActive: {
    color: colors.text.primary,
    fontWeight: '600',
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
    backgroundColor: colors.glass.surfaceStrong,
    ...Platform.select({
      web: {
        cursor: 'pointer' as unknown as undefined,
        backdropFilter: 'blur(12px) saturate(125%)' as unknown as undefined,
        WebkitBackdropFilter: 'blur(12px) saturate(125%)' as unknown as undefined,
      },
      default: {},
    }),
  },

  ctaText: {
    fontFamily: fontFamilies.sans,
    fontSize: 12,
    letterSpacing: 2.2,
    fontWeight: '500',
    color: colors.text.primary,
    textTransform: 'uppercase',
  },
});
