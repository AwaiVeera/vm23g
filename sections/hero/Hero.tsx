import { useEffect } from 'react';
import {
  Platform,
  Pressable,
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
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';
import { useParallaxStyle, PARALLAX_DEPTH } from '@/systems/motion/parallax';
import { useParallaxFade } from '@/systems/motion/parallax';

import { HeroBackground } from './HeroBackground';

const BREAKPOINT = 900;

const HERO_METRICS = [
  { label: 'NODES ACTIVE', value: '23G' },
  { label: 'ITERATIONS',   value: '∞'  },
];

type HeroProps = {
  scrollY: SharedValue<number>;
};

export function Hero({ scrollY }: HeroProps) {
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

  const contentLayoutStyle = isWide ? styles.sectionContentRow : styles.sectionContentColumn;

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

          <View style={styles.headlineBlock}>
            <Text style={styles.headline}>PRECISION</Text>
            <Text style={[styles.headline, styles.headlineIndented]}>REDEFINED</Text>
          </View>

          <Text style={styles.paragraph}>
            {'A convergence of intelligence, design, and craft — built for those who demand the exceptional.'}
          </Text>

          <View style={styles.ctaRow}>
            <GlowButton label="Explore" onPress={() => {}} />
            <Pressable style={styles.secondaryCta}>
              <Text style={styles.secondaryCtaText}>Our Work →</Text>
            </Pressable>
          </View>
        </Animated.View>

        {isWide && (
          <View style={styles.panelContainer}>
            <FloatingPanel
              title="INTELLIGENCE LAYER"
              metrics={HERO_METRICS}
              liveState="active"
              floatAmplitude={10}
              floatDuration={5800}
            />
          </View>
        )}
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
    backgroundColor: colors.background.base,
    overflow: 'hidden',
  },
  sectionWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  sectionContentRow: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 64,
  },
  sectionContentColumn: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  leftContent: {
    gap: 28,
    zIndex: 2,
  },
  leftContentWide: {
    flex: 1,
  },
  leftContentNarrow: {
    width: '100%',
  },
  microLabel: {
    ...typography.microLabel,
    color: colors.accent.base,
  },
  headlineBlock: {
    gap: 0,
  },
  headline: {
    ...typography.heroTitle,
    color: colors.text.primary,
  },
  headlineIndented: {
    paddingLeft: 32,
  },
  paragraph: {
    ...typography.body,
    color: colors.text.muted,
    maxWidth: 480,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  secondaryCta: {
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  secondaryCtaText: {
    ...typography.label,
    color: colors.accent.base,
  },
  panelContainer: {
    width: 440,
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
