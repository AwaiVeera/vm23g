import { useEffect } from 'react';
import { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

export const motion = {
  duration: {
    micro:  140,
    short:  260,
    medium: 440,
    long:   680,
  },
  easing: {
    cinematic: Easing.bezier(0.22, 0.61, 0.36, 1),
    settle:    Easing.bezier(0.16, 1, 0.3, 1),
    drift:     Easing.bezier(0.45, 0, 0.55, 1),
    luxe:      Easing.bezier(0.2, 0.8, 0.2, 1),
  },
} as const;

// Section-to-section stagger cadence (ms between each card/item in a group)
export const SECTION_STAGGER = 96;

export function useFadeIn(trigger: boolean = true) {
  const opacity = useSharedValue(trigger ? 0 : 1);

  useEffect(() => {
    opacity.value = withTiming(trigger ? 1 : 0, {
      duration: motion.duration.medium,
      easing: motion.easing.cinematic,
    });
  }, [trigger]);

  return useAnimatedStyle(() => ({ opacity: opacity.value }));
}

export function useScaleEntrance(trigger: boolean = true) {
  const opacity = useSharedValue(trigger ? 0 : 1);
  const scale   = useSharedValue(trigger ? 0.94 : 1);

  useEffect(() => {
    const target = trigger ? 1 : 0;
    opacity.value = withTiming(target, {
      duration: motion.duration.long,
      easing: motion.easing.settle,
    });
    scale.value = withTiming(trigger ? 1 : 0.94, {
      duration: motion.duration.long,
      easing: motion.easing.settle,
    });
  }, [trigger]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
}

export function useSlideUp(trigger: boolean = true, distance: number = 24) {
  const opacity    = useSharedValue(trigger ? 0 : 1);
  const translateY = useSharedValue(trigger ? distance : 0);

  useEffect(() => {
    const target = trigger ? 1 : 0;
    opacity.value = withTiming(target, {
      duration: motion.duration.long,
      easing: motion.easing.cinematic,
    });
    translateY.value = withTiming(trigger ? 0 : distance, {
      duration: motion.duration.long,
      easing: motion.easing.cinematic,
    });
  }, [trigger]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

export function useStaggeredEntrance(count: number, trigger: boolean = true) {
  const STAGGER = 80;

  const values = Array.from({ length: count }, () => ({
    opacity:    useSharedValue(trigger ? 0 : 1),
    translateY: useSharedValue(trigger ? 24 : 0),
  }));

  useEffect(() => {
    values.forEach((v, i) => {
      const delay  = i * STAGGER;
      const config = { duration: motion.duration.long, easing: motion.easing.cinematic };
      v.opacity.value    = withDelay(delay, withTiming(trigger ? 1 : 0, config));
      v.translateY.value = withDelay(delay, withTiming(trigger ? 0 : 24, config));
    });
  }, [trigger]);

  return values.map((v) =>
    useAnimatedStyle(() => ({
      opacity: v.opacity.value,
      transform: [{ translateY: v.translateY.value }],
    }))
  );
}
