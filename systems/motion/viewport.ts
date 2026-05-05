import { useCallback, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { motion } from './transitions';

// How many px before the element's top edge enters the viewport to trigger reveal.
const REVEAL_OFFSET = 80;

export type RevealVariant = 'fadeUp' | 'scaleIn' | 'slideLeft' | 'slideRight';

// Returns an onLayout handler and a visible boolean.
// Call onLayout on the section's root View to register its Y position.
// visible flips true once scrollY brings the element into view.
export function useScrollReveal(scrollY: SharedValue<number>) {
  const { height } = useWindowDimensions();
  const sectionY = useRef<number>(0);
  const [visible, setVisible] = useState(false);
  const triggered = useRef(false);

  const checkVisibility = useCallback(
    (scrollValue: number) => {
      if (triggered.current) return;
      const threshold = sectionY.current - height + REVEAL_OFFSET;
      if (scrollValue >= threshold) {
        triggered.current = true;
        setVisible(true);
      }
    },
    [height],
  );

  // Called when the section mounts/measures and immediately checked.
  const onLayout = useCallback(
    (event: { nativeEvent: { layout: { y: number } } }) => {
      sectionY.current = event.nativeEvent.layout.y;
      checkVisibility(scrollY.value);
    },
    [checkVisibility, scrollY],
  );

  // Listen to shared scroll value and trigger visibility on threshold.
  useAnimatedReaction(
    () => scrollY.value,
    (scrollValue) => {
      runOnJS(checkVisibility)(scrollValue);
    },
    [checkVisibility],
  );

  return { onLayout, visible, checkVisibility };
}

// Animated style for a single element based on reveal visibility.
export function useRevealStyle(visible: boolean, variant: RevealVariant = 'fadeUp') {
  const opacity    = useSharedValue(0);
  const translateY = useSharedValue(variant === 'fadeUp' ? 32 : 0);
  const translateX = useSharedValue(
    variant === 'slideLeft' ? -40 : variant === 'slideRight' ? 40 : 0,
  );
  const scale = useSharedValue(variant === 'scaleIn' ? 0.93 : 1);

  const config = { duration: motion.duration.long, easing: motion.easing.settle };

  if (visible) {
    opacity.value    = withTiming(1, config);
    translateY.value = withTiming(0, config);
    translateX.value = withTiming(0, config);
    scale.value      = withTiming(1, config);
  }

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));
}

// Staggered reveal for arrays of items (cards, pills, etc.)
// Returns an array of animated styles, each offset by staggerMs.
export function useStaggeredReveal(
  count: number,
  visible: boolean,
  staggerMs: number = 100,
  variant: RevealVariant = 'fadeUp',
) {
  const items = Array.from({ length: count }, () => ({
    opacity:    useSharedValue(0),
    translateY: useSharedValue(variant === 'fadeUp' ? 28 : 0),
    translateX: useSharedValue(
      variant === 'slideLeft' ? -32 : variant === 'slideRight' ? 32 : 0,
    ),
    scale: useSharedValue(variant === 'scaleIn' ? 0.94 : 1),
  }));

  const config = { duration: motion.duration.long, easing: motion.easing.settle };

  if (visible) {
    items.forEach((item, i) => {
      const delay = i * staggerMs;
      item.opacity.value    = withDelay(delay, withTiming(1, config));
      item.translateY.value = withDelay(delay, withTiming(0, config));
      item.translateX.value = withDelay(delay, withTiming(0, config));
      item.scale.value      = withDelay(delay, withTiming(1, config));
    });
  }

  return items.map((item) =>
    useAnimatedStyle(() => ({
      opacity: item.opacity.value,
      transform: [
        { translateY: item.translateY.value },
        { translateX: item.translateX.value },
        { scale: item.scale.value },
      ],
    })),
  );
}
