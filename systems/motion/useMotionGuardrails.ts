import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform, useWindowDimensions } from 'react-native';

type MotionGuardrails = {
  reduceMotion: boolean;
  lowMotionDevice: boolean;
};

export function useMotionGuardrails(): MotionGuardrails {
  const { width } = useWindowDimensions();
  const [guardrails, setGuardrails] = useState<MotionGuardrails>({
    reduceMotion: false,
    lowMotionDevice: width <= 1024,
  });

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
    const compactViewportQuery = window.matchMedia('(max-width: 1024px)');

    const update = () => {
      setGuardrails({
        reduceMotion: reduceQuery.matches,
        lowMotionDevice: coarsePointerQuery.matches || compactViewportQuery.matches,
      });
    };

    update();

    reduceQuery.addEventListener('change', update);
    coarsePointerQuery.addEventListener('change', update);
    compactViewportQuery.addEventListener('change', update);

    return () => {
      reduceQuery.removeEventListener('change', update);
      coarsePointerQuery.removeEventListener('change', update);
      compactViewportQuery.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    setGuardrails((prev) => ({ ...prev, lowMotionDevice: width <= 1024 }));
  }, [width]);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (!mounted) return;
      setGuardrails((prev) => ({ ...prev, reduceMotion: enabled }));
    });

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      setGuardrails((prev) => ({ ...prev, reduceMotion: enabled }));
    });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return guardrails;
}
