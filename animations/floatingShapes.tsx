import { useEffect, useMemo } from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import type { DimensionValue } from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useParallaxLayerStyle } from '@/systems/motion/parallax';
import { useMotionGuardrails } from '@/systems/motion/useMotionGuardrails';

type ShapeSpec = {
  key: string;
  top: DimensionValue;
  left?: DimensionValue;
  right?: DimensionValue;
  width: number;
  height: number;
  radius: number;
  speed: number;
  color: string;
  blurPx: number;
  duration: number;
  drift: number;
};

const SHAPE_SPECS: ShapeSpec[] = [
  {
    key: 'orb-back-left',
    top: '8%',
    left: '-6%',
    width: 320,
    height: 320,
    radius: 180,
    speed: 1.4,
    color: 'rgba(0, 66, 37, 0.12)',
    blurPx: 74,
    duration: 22000,
    drift: 14,
  },
  {
    key: 'capsule-top-right',
    top: '14%',
    right: '-2%',
    width: 300,
    height: 120,
    radius: 120,
    speed: -1.1,
    color: 'rgba(0, 66, 37, 0.10)',
    blurPx: 46,
    duration: 18000,
    drift: 10,
  },
  {
    key: 'square-mid-left',
    top: '42%',
    left: '2%',
    width: 220,
    height: 220,
    radius: 44,
    speed: 0.95,
    color: 'rgba(31, 92, 58, 0.10)',
    blurPx: 56,
    duration: 26000,
    drift: 16,
  },
  {
    key: 'orb-mid-right',
    top: '48%',
    right: '3%',
    width: 260,
    height: 260,
    radius: 160,
    speed: -1.35,
    color: 'rgba(0, 59, 32, 0.12)',
    blurPx: 66,
    duration: 21000,
    drift: 12,
  },
  {
    key: 'capsule-bottom-left',
    top: '72%',
    left: '-3%',
    width: 340,
    height: 132,
    radius: 132,
    speed: 1.2,
    color: 'rgba(0, 66, 37, 0.11)',
    blurPx: 52,
    duration: 24000,
    drift: 11,
  },
  {
    key: 'orb-bottom-right',
    top: '78%',
    right: '-4%',
    width: 300,
    height: 300,
    radius: 180,
    speed: -1.45,
    color: 'rgba(0, 66, 37, 0.13)',
    blurPx: 70,
    duration: 23000,
    drift: 14,
  },
];

function FloatingShape({
  spec,
  scrollY,
  intensity,
}: {
  spec: ShapeSpec;
  scrollY: SharedValue<number>;
  intensity: number;
}) {
  const spin = useSharedValue(0);
  const sway = useSharedValue(0);
  const parallaxStyle = useParallaxLayerStyle(scrollY, spec.speed);

  useEffect(() => {
    spin.value = withRepeat(
      withTiming(1, { duration: spec.duration / intensity, easing: Easing.linear }),
      -1,
      false,
    );
    sway.value = withRepeat(
      withTiming(1, { duration: (spec.duration * 0.75) / intensity, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [intensity, spec.duration, spin, sway]);

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: (sway.value - 0.5) * spec.drift },
      { rotateZ: `${spin.value * 360}deg` },
    ],
  }));

  const webBlurStyle =
    Platform.OS === 'web'
      ? ({ filter: `blur(${spec.blurPx}px)` } as unknown as ViewStyle)
      : ({} as ViewStyle);

  return (
    <Animated.View
      style={[
        styles.shapeSlot,
        {
          top: spec.top,
          left: spec.left,
          right: spec.right,
          width: spec.width,
          height: spec.height,
        },
        parallaxStyle,
      ]}
    >
      <Animated.View
        style={[
          styles.shape,
          {
            borderRadius: spec.radius,
            backgroundColor: spec.color,
          },
          webBlurStyle,
          rotateStyle,
        ]}
      />
    </Animated.View>
  );
}

export function FloatingShapes() {
  const { reduceMotion, lowMotionDevice } = useMotionGuardrails();
  const scrollY = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const onScroll = () => {
      scrollY.value = window.scrollY || 0;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollY]);

  const specs = useMemo(
    () => (lowMotionDevice ? SHAPE_SPECS.slice(0, 4) : SHAPE_SPECS),
    [lowMotionDevice],
  );

  const intensity = reduceMotion ? 0.55 : lowMotionDevice ? 0.75 : 1;
  const opacity = reduceMotion ? 0.36 : lowMotionDevice ? 0.5 : 0.64;

  return (
    <View style={[styles.layer, { opacity }]}>
      {specs.map((spec) => (
        <FloatingShape key={spec.key} spec={spec} scrollY={scrollY} intensity={intensity} />
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
  shapeSlot: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  shape: {
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
});
