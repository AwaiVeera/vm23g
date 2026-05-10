import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { GlowButton } from '@/components/ui/GlowButton';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';
import { useParallaxStyle, PARALLAX_DEPTH } from '@/systems/motion/parallax';
import { useParallaxFade } from '@/systems/motion/parallax';

import { HeroBackground } from './HeroBackground';

const BREAKPOINT = 900;

type HeroProps = {
  scrollY: SharedValue<number>;
};

export function Hero({ scrollY }: HeroProps) {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isWide = width >= BREAKPOINT;

  const foregroundStyle = useParallaxStyle(scrollY, PARALLAX_DEPTH.foreground);
  const fadeStyle       = useParallaxFade(scrollY, height * 0.3, height * 0.85);

  const chevronY = useSharedValue(0);
  useEffect(() => {
    chevronY.value = withRepeat(
      withTiming(8, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, []);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: chevronY.value }],
  }));

  const minHeight: number | string =
    Platform.OS === 'web' ? ('100vh' as unknown as number) : height;

  const contentLayoutStyle = styles.sectionContentColumn;

  return (
    <View style={[styles.root, { minHeight }]}>
      <HeroBackground scrollY={scrollY} />

      <SectionWrapper
        align="left"
        spacing="large"
        style={styles.sectionWrapper}
        contentStyle={contentLayoutStyle}
      >
        <Animated.View
          style={[
            styles.leftContent,
            isWide ? styles.leftContentWide : styles.leftContentNarrow,
            foregroundStyle,
            fadeStyle,
          ]}
        >
          <Text style={styles.microLabel}>THE COLLECTIVE</Text>

          <Text style={styles.headline}>VM23G</Text>
          <Text style={styles.subHeadline}>Mind. Body. Brand. Technology.</Text>

          <Text style={styles.paragraph}>
            {'A convergence of intelligence, design, and craft — built for those who demand the exceptional.'}
          </Text>

          <View style={styles.ctaRow}>
            <GlowButton label="Explore" onPress={() => router.push('/about')} />
          </View>
        </Animated.View>

      </SectionWrapper>

      <Animated.View style={[styles.scrollIndicator, fadeStyle]}>
        <Text style={styles.scrollLabel}>Scroll to explore</Text>
        <Animated.View style={[styles.chevron, chevronStyle]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#0F1112',
    overflow: 'hidden',
  },
  sectionWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  sectionContentRow: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    gap: 0,
  },
  sectionContentColumn: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  leftContent: {
    gap: 14,
    zIndex: 2,
    justifyContent: 'center',
  },
  leftContentWide: {
    flex: 1,
    maxWidth: 760,
  },
  leftContentNarrow: {
    width: '100%',
    maxWidth: 560,
  },
  microLabel: {
    ...typography.microLabel,
    color: 'rgba(231, 238, 222, 0.9)',
  },
  headline: {
    ...typography.heroTitle,
    color: '#F6F4F0',
    letterSpacing: 3.2,
    textShadowColor: 'rgba(0, 0, 0, 0.42)',
    textShadowRadius: 26,
    textShadowOffset: { width: 0, height: 8 },
  },
  subHeadline: {
    ...typography.subtitle,
    color: 'rgba(244, 242, 236, 0.92)',
    maxWidth: 620,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: -4,
  },
  paragraph: {
    ...typography.bodyLarge,
    color: 'rgba(244, 242, 236, 0.9)',
    maxWidth: 620,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowRadius: 14,
    textShadowOffset: { width: 0, height: 4 },
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    zIndex: 2,
    alignItems: 'center',
    gap: 10,
    pointerEvents: 'none',
  },
  scrollLabel: {
    ...typography.microLabel,
    color: colors.text.muted,
  },
  chevron: {
    width: 8,
    height: 12,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.accent.muted,
    transform: [{ rotate: '45deg' }],
  },
});
