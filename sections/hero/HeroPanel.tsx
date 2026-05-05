import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/systems/theme/colors';
import { fontFamilies, typography } from '@/systems/theme/typography';

const PARALLAX_DEPTH = 0.14;

const bars: { width: string; opacity: number }[] = [
  { width: '82%', opacity: 0.9 },
  { width: '61%', opacity: 0.65 },
  { width: '74%', opacity: 0.78 },
  { width: '48%', opacity: 0.52 },
];

function PulsingDot() {
  const dotOpacity = useSharedValue(0.9);

  useEffect(() => {
    dotOpacity.value = withRepeat(
      withTiming(0.3, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
  }));

  return <Animated.View style={[styles.dot, dotStyle]} />;
}

export function HeroPanel({ scrollY }: { scrollY: SharedValue<number> }) {
  const { height } = useWindowDimensions();
  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(12, { duration: 5800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const panelStyle = useAnimatedStyle(() => {
    const parallax = (scrollY.value / height) * PARALLAX_DEPTH * height * 0.4;
    return {
      transform: [{ translateY: parallax + floatY.value }],
    };
  });

  return (
    <Animated.View style={panelStyle}>
      <View style={styles.shadowWrapper}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={styles.microLabel}>INTELLIGENCE LAYER</Text>
            <PulsingDot />
          </View>

          <View style={styles.barsContainer}>
            {bars.map((bar, i) => (
              <View key={i} style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: bar.width as `${number}%`, opacity: bar.opacity },
                  ]}
                />
              </View>
            ))}
          </View>

          <View style={styles.rule} />

          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.statNumber}>23G</Text>
              <Text style={styles.statCaption}>NODES ACTIVE</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <Text style={styles.statNumber}>∞</Text>
              <Text style={styles.statCaption}>ITERATIONS</Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const webStyles = Platform.select({
  web: {
    boxShadow:
      '0 24px 64px rgba(26, 25, 22, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.88)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  },
  default: {},
}) as object;

const nativeStyles = Platform.select({
  ios: {
    shadowColor: '#1A1916',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
  },
  default: {},
});

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderWidth: 1,
    borderColor: colors.border.glass,
    ...nativeStyles,
    ...webStyles,
  },
  inner: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  microLabel: {
    ...typography.microLabel,
    color: colors.textMuted,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(115, 130, 83, 0.9)',
  },
  barsContainer: {
    rowGap: 10,
    marginBottom: 28,
  },
  barTrack: {
    height: 6,
    backgroundColor: colors.accent.faint,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.accent.base,
    borderRadius: 3,
  },
  rule: {
    height: 1,
    backgroundColor: colors.accent.base,
    opacity: 0.2,
    marginBottom: 28,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    rowGap: 6,
  },
  metricDivider: {
    width: 1,
    height: 48,
    backgroundColor: colors.border.subtle,
  },
  statNumber: {
    fontFamily: fontFamilies.serif,
    fontSize: 36,
    letterSpacing: 2,
    fontWeight: '300',
    color: colors.textPrimary,
  },
  statCaption: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
