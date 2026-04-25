import { BlurView } from 'expo-blur';
import { useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';
import { motion } from '@/systems/motion/transitions';

export type PanelLiveState = 'idle' | 'processing' | 'active';

export type PanelMetric = {
  label: string;
  value: string;
};

export type PanelBar = {
  width: string;
  opacity: number;
};

type FloatingPanelProps = {
  title?: string;
  metrics?: PanelMetric[];
  bars?: PanelBar[];
  liveState?: PanelLiveState;
  style?: ViewStyle;
  floatAmplitude?: number;
  floatDuration?: number;
};

const DEFAULT_BARS: PanelBar[] = [
  { width: '82%', opacity: 0.90 },
  { width: '61%', opacity: 0.65 },
  { width: '74%', opacity: 0.78 },
  { width: '48%', opacity: 0.52 },
];

const DOT_COLORS: Record<PanelLiveState, string> = {
  idle:       'rgba(115, 130, 83, 0.45)',
  processing: 'rgba(115, 130, 83, 0.75)',
  active:     colors.accent.base,
};

function StatusDot({ liveState }: { liveState: PanelLiveState }) {
  const opacity = useSharedValue(0.9);

  useEffect(() => {
    const pulseSpeed = liveState === 'active' ? 900 : liveState === 'processing' ? 1200 : 1800;
    opacity.value = withRepeat(
      withTiming(0.3, { duration: pulseSpeed, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [liveState, opacity]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.dot,
        { backgroundColor: DOT_COLORS[liveState] },
        dotStyle,
      ]}
    />
  );
}

function AnimatedBar({ bar, index }: { bar: PanelBar; index: number }) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(
      index * 80,
      withTiming(parseFloat(bar.width) / 100, {
        duration: motion.duration.long,
        easing: motion.easing.settle,
      }),
    );
  }, [bar, index, width]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${(width.value * 100).toFixed(1)}%` as `${number}%`,
  }));

  return (
    <View style={styles.barTrack}>
      <Animated.View
        style={[styles.barFill, barStyle, { opacity: bar.opacity }]}
      />
    </View>
  );
}

export function FloatingPanel({
  title = 'INTELLIGENCE LAYER',
  metrics,
  bars = DEFAULT_BARS,
  liveState = 'active',
  style,
  floatAmplitude = 10,
  floatDuration = 5800,
}: FloatingPanelProps) {
  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(floatAmplitude, {
        duration: floatDuration,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [floatAmplitude, floatDuration, floatY]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const webSurfaceStyle: ViewStyle = Platform.select({
    web: {
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: [
        '0 24px 64px rgba(26, 25, 22, 0.12)',
        '0 0 0 1px rgba(255, 255, 255, 0.72)',
        'inset 0 1px 0 rgba(255, 255, 255, 0.88)',
      ].join(', '),
    } as unknown as ViewStyle,
    default: {},
  }) ?? {};

  const nativeShadow: ViewStyle = Platform.select({
    ios: {
      shadowColor: colors.state.shadow,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 1,
      shadowRadius: 32,
    },
    default: {},
  }) ?? {};

  const glowStyle: ViewStyle = Platform.select({
    web: {
      boxShadow: `0 0 40px rgba(115, 130, 83, 0.14), 0 0 80px rgba(115, 130, 83, 0.06)`,
    } as unknown as ViewStyle,
    default: {},
  }) ?? {};

  return (
    <Animated.View style={[floatStyle, style]}>
      <View style={[styles.shadowWrapper, nativeShadow, glowStyle]}>
        <View
          style={[
            styles.surface,
            webSurfaceStyle,
          ]}
        >
          {Platform.OS !== 'web' && (
            <BlurView
              intensity={52}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          )}

          <View style={styles.innerHighlight} />

          <View style={styles.inner}>
            <View style={styles.header}>
              <Text style={styles.titleText}>{title}</Text>
              <StatusDot liveState={liveState} />
            </View>

            {bars.length > 0 && (
              <View style={styles.barsContainer}>
                {bars.map((bar, i) => (
                  <AnimatedBar key={i} bar={bar} index={i} />
                ))}
              </View>
            )}

            {metrics && metrics.length > 0 && (
              <>
                <View style={styles.rule} />
                <View style={styles.metricsRow}>
                  {metrics.map((m, i) => (
                    <View key={m.label} style={styles.metricCell}>
                      {i > 0 && <View style={styles.metricDivider} />}
                      <View style={styles.metric}>
                        <Text style={styles.metricValue}>{m.value}</Text>
                        <Text style={styles.metricLabel}>{m.label}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 20,
  },
  surface: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.52)',
    borderWidth: 1,
    borderColor: colors.border.glass,
  },
  innerHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.88)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  inner: {
    padding: 28,
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  titleText: {
    ...typography.microLabel,
    color: colors.text.muted,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  barsContainer: {
    rowGap: 10,
    marginBottom: 24,
  },
  barTrack: {
    height: 5,
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
    backgroundColor: colors.accent.subtle,
    marginBottom: 24,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 44,
    backgroundColor: colors.border.subtle,
    marginRight: 0,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  metricValue: {
    fontFamily: 'Cinzel',
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: 2,
    fontWeight: '300',
    color: colors.text.primary,
  },
  metricLabel: {
    ...typography.microLabel,
    color: colors.text.muted,
  },
});
