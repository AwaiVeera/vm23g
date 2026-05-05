import { PropsWithChildren } from 'react';
import { Platform, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

import { useGlowIntensityStyle } from '@/animations/glowSystem';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';

type GlowButtonProps = PropsWithChildren<{
  onPress?: () => void;
  style?: ViewStyle;
  label?: string;
}>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GlowButton({ children, onPress, style, label }: GlowButtonProps) {
  const hover = useSharedValue(0);
  const glowStyle = useGlowIntensityStyle(hover);

  const handleHoverIn = () => {
    hover.value = withTiming(1, { duration: 280 });
  };

  const handleHoverOut = () => {
    hover.value = withTiming(0, { duration: 320 });
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPress={onPress}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      onPressIn={handleHoverIn}
      onPressOut={handleHoverOut}
      style={[styles.base, glowStyle, style]}
    >
      {label ? (
        <Text style={styles.label}>{label}</Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    backgroundColor: colors.pearlMatte,
    borderWidth: 1,
    borderColor: colors.oliveGreen,
    ...Platform.select({
      ios: {
        shadowColor: colors.glowOliveIntense,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.45,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
      web: {
        cursor: 'pointer' as unknown as undefined,
      },
      default: {},
    }),
  },
  label: {
    ...typography.subtitle,
    color: colors.oliveGreen,
    textAlign: 'center',
  },
});
