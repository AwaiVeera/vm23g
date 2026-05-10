import { useEffect, useMemo } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/systems/theme/colors';
import { useMotionGuardrails } from '@/systems/motion/useMotionGuardrails';

type DepthLayer = 'back' | 'mid' | 'front';

const LAYER_BASE: Record<DepthLayer, {
  count: number;
  width: number;
  minHeight: number;
  maxHeight: number;
  opacity: number;
  blurPx: number;
  minDuration: number;
  durationStep: number;
  driftRange: number;
}> = {
  back: {
    count: 34,
    width: 1,
    minHeight: 14,
    maxHeight: 26,
    opacity: 0.10,
    blurPx: 1.8,
    minDuration: 11400,
    durationStep: 780,
    driftRange: 1.2,
  },
  mid: {
    count: 42,
    width: 1.2,
    minHeight: 18,
    maxHeight: 36,
    opacity: 0.16,
    blurPx: 1,
    minDuration: 8600,
    durationStep: 620,
    driftRange: 2.4,
  },
  front: {
    count: 28,
    width: 1.6,
    minHeight: 24,
    maxHeight: 48,
    opacity: 0.24,
    blurPx: 0,
    minDuration: 6500,
    durationStep: 420,
    driftRange: 3.8,
  },
};

function RainDrop({
  index,
  layer,
  width,
  height,
  intensity,
}: {
  index: number;
  layer: DepthLayer;
  width: number;
  height: number;
  intensity: number;
}) {
  const spec = LAYER_BASE[layer];
  const progress = useSharedValue(0);
  const drift = useSharedValue(0);
  const pulse = useSharedValue(0);

  const left = (index * 43 + index * 17) % Math.max(width, 1);
  const delay = (index % 18) * 150;
  const duration = (spec.minDuration + (index % 7) * spec.durationStep) / intensity;
  const driftRange = spec.driftRange + (index % 4) * 0.65;
  const dropHeight = spec.minHeight + (index % 6) * ((spec.maxHeight - spec.minHeight) / 6);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration, easing: Easing.linear }),
        -1,
        false
      )
    );

    drift.value = withRepeat(
      withTiming(driftRange, { duration: duration * 1.5, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    pulse.value = withRepeat(
      withTiming(1, { duration: duration * 0.9, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [delay, driftRange, drift, duration, progress, pulse]);

  const style = useAnimatedStyle(() => {
    const translateY = progress.value * (height + 180);
    const translateX = drift.value - driftRange / 2;
    const dynamicOpacity = spec.opacity * (0.82 + pulse.value * 0.22);
    const scale = layer === 'front' ? 1 + pulse.value * 0.06 : 1 + pulse.value * 0.03;
    return {
      transform: [{ translateY }, { translateX }, { scale }],
      opacity: dynamicOpacity,
    };
  });

  const webBlurStyle =
    Platform.OS === 'web' && spec.blurPx > 0
      ? ({ filter: `blur(${spec.blurPx}px)` } as unknown as ViewStyle)
      : ({} as ViewStyle);

  return (
    <Animated.View
      style={[
        styles.dropBase,
        {
          left,
          top: -140 - (index % 10) * 14,
          width: spec.width,
          height: dropHeight,
        },
        layer === 'back' && styles.dropBack,
        layer === 'mid' && styles.dropMid,
        layer === 'front' && styles.dropFront,
        webBlurStyle,
        style,
      ]}
    />
  );
}

export function RainOverlay() {
  const { reduceMotion, lowMotionDevice } = useMotionGuardrails();
  const { width, height } = useWindowDimensions();
  const densityScale = reduceMotion ? 0.45 : lowMotionDevice || width < 900 ? 0.7 : 1;
  const intensity = reduceMotion ? 0.62 : 1;

  const layers = useMemo(
    () =>
      (Object.keys(LAYER_BASE) as DepthLayer[]).map((layer) => ({
        layer,
        indexes: Array.from({
          length: Math.max(10, Math.round(LAYER_BASE[layer].count * densityScale)),
        }),
      })),
    [densityScale],
  );

  return (
    <View
      style={styles.layer}
      {...(Platform.OS === 'web' ? ({ accessibilityElementsHidden: true } as const) : {})}
    >
      {layers.map(({ layer, indexes }) => (
        <View key={layer} style={styles.depthLayer}>
          {indexes.map((_, index) => (
            <RainDrop key={`${layer}-${index}`} index={index} layer={layer} width={width} height={height} intensity={intensity} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  depthLayer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  dropBase: {
    position: 'absolute',
    borderRadius: 1,
    backgroundColor: colors.textPrimary,
    pointerEvents: 'none',
  },
  dropBack: {
    backgroundColor: 'rgba(245, 243, 239, 0.65)',
  },
  dropMid: {
    backgroundColor: 'rgba(230, 237, 221, 0.70)',
  },
  dropFront: {
    backgroundColor: 'rgba(200, 219, 171, 0.84)',
  },
});
