import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';
import { motion } from '@/systems/motion/transitions';

type MetricCardProps = {
  value: number;
  unit?: string;
  label: string;
  sublabel?: string;
  visible?: boolean;
  delay?: number;
  energyState?: 'rest' | 'active';
  style?: ViewStyle;
};

export function MetricCard({
  value,
  unit = '',
  label,
  sublabel,
  visible = false,
  delay = 0,
  energyState = 'rest',
  style,
}: MetricCardProps) {
  const progress   = useSharedValue(0);
  const opacity    = useSharedValue(0);
  const translateY = useSharedValue(20);

  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const cfg = { duration: motion.duration.long, easing: motion.easing.settle };
    progress.value   = withDelay(delay, withTiming(value, { duration: 900, easing: motion.easing.settle }));
    opacity.value    = withDelay(delay, withTiming(1, cfg));
    translateY.value = withDelay(delay, withTiming(0, cfg));
  }, [visible, delay, value, progress, opacity, translateY]);

  // Drive the counter display via JS-thread reaction — no setState in worklet
  useAnimatedReaction(
    () => Math.round(progress.value),
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setDisplayCount)(current);
      }
    },
  );

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const isActive = energyState === 'active';

  const webGlowStyle: ViewStyle = Platform.select({
    web: {
      boxShadow: isActive
        ? '0 0 32px rgba(115, 130, 83, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.90)'
        : '0 8px 24px rgba(26, 25, 22, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.90)',
    } as unknown as ViewStyle,
    default: {},
  }) ?? {};

  const nativeShadow: ViewStyle = Platform.select({
    ios: {
      shadowColor: isActive ? colors.accent.base : colors.state.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isActive ? 0.22 : 0.08,
      shadowRadius: isActive ? 16 : 12,
    },
    default: {},
  }) ?? {};

  return (
    <Animated.View style={[containerStyle, style]}>
      <View style={[styles.card, webGlowStyle, nativeShadow]}>
        <View style={styles.inner}>
          {isActive && <View style={styles.accentBar} />}
          <Text style={styles.number}>{displayCount}{unit}</Text>
          <Text style={styles.label}>{label}</Text>
          {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: colors.glass.surface,
    borderWidth: 1,
    borderColor: colors.border.glass,
    overflow: 'hidden',
  },
  inner: {
    padding: 24,
    gap: 6,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.accent.base,
    opacity: 0.6,
  },
  number: {
    fontFamily: 'Cinzel',
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: 2,
    fontWeight: '300',
    color: colors.text.primary,
  },
  label: {
    ...typography.microLabel,
    color: colors.text.muted,
  },
  sublabel: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: 2,
  },
});
