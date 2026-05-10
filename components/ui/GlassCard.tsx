import { BlurView } from 'expo-blur';
import { PropsWithChildren } from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '@/systems/theme/colors';

// ─── Intensity presets ────────────────────────────────────────────────────────

const INTENSITY = {
  low: {
    blurAmount: 30,
    fillOpacity: 0.55,
    webBlur: 14,
    shadowY: 10,
    shadowBlur: 28,
    shadowOpacity: 0.36,
    shadowSpread: 0,
  },
  medium: {
    blurAmount: 52,
    fillOpacity: 0.65,
    webBlur: 22,
    shadowY: 22,
    shadowBlur: 52,
    shadowOpacity: 0.46,
    shadowSpread: 0,
  },
  high: {
    blurAmount: 78,
    fillOpacity: 0.78,
    webBlur: 34,
    shadowY: 34,
    shadowBlur: 78,
    shadowOpacity: 0.58,
    shadowSpread: 0,
  },
} as const;

export type GlassIntensity = keyof typeof INTENSITY;

// ─── Types ────────────────────────────────────────────────────────────────────

type GlassCardProps = PropsWithChildren<{
  intensity?: GlassIntensity;
  padding?: number;
  borderRadius?: number;
  style?: ViewStyle;
}>;

// ─── Component ────────────────────────────────────────────────────────────────

export function GlassCard({
  children,
  intensity = 'medium',
  padding = 24,
  borderRadius = 20,
  style,
}: GlassCardProps) {
  const preset = INTENSITY[intensity];

  // Outer wrapper: holds native shadow without being clipped
  const shadowStyle: ViewStyle = Platform.select({
    ios: {
      shadowColor: colors.state.shadow,
      shadowOffset: { width: 0, height: preset.shadowY },
      shadowOpacity: preset.shadowOpacity * 10,
      shadowRadius: preset.shadowBlur / 2,
    },
    android: {
      elevation: intensity === 'high' ? 18 : intensity === 'medium' ? 10 : 5,
    },
    default: {},
  }) ?? {};

  // Web: composited box-shadow (outer depth + inner top highlight + olive glow)
  const webCardStyle: ViewStyle = Platform.select({
    web: {
      backdropFilter: `blur(${preset.webBlur}px) saturate(140%)` as unknown as undefined,
      WebkitBackdropFilter: `blur(${preset.webBlur}px) saturate(140%)` as unknown as undefined,
      boxShadow: [
        `0 ${preset.shadowY}px ${preset.shadowBlur}px rgba(0, 0, 0, ${preset.shadowOpacity})`,
        `0 2px 8px rgba(0, 0, 0, ${preset.shadowOpacity * 0.5})`,
        `inset 0 1px 0 rgba(255, 255, 255, 0.18)`,
        `inset 0 -1px 0 rgba(0, 0, 0, 0.40)`,
        `inset 0 0 0 1px rgba(156, 176, 113, 0.12)`,
      ].join(', '),
    } as unknown as ViewStyle,
    default: {},
  }) ?? {};

  return (
    <View
      style={[
        styles.shadowWrapper,
        shadowStyle,
        { borderRadius },
        style,
      ]}
    >
      {/* Glass body — overflow:hidden to clip blur to border radius */}
      <View
        style={[
          styles.glassBody,
          webCardStyle,
          {
            borderRadius,
            backgroundColor: `rgba(20, 22, 26, ${preset.fillOpacity})`,
          },
        ]}
      >
        {/* Native blur layer — absoluteFill, clipped by parent overflow:hidden */}
        {Platform.OS !== 'web' && (
          <BlurView
            intensity={preset.blurAmount}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Inner top-edge glass highlight (physical glass edge illusion) */}
        <View
          style={[styles.innerHighlight, { borderRadius }]}
        />

        {/* Content */}
        <View style={{ padding }}>
          {children}
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  shadowWrapper: {
    // No overflow:hidden — lets native shadow escape the card boundary
  },
  glassBody: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.glass,
  },
  innerHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    pointerEvents: 'none',
  },
});
