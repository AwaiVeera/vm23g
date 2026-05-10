import { Platform, useWindowDimensions } from 'react-native';
import {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

// Background moves most, surface least.
export const PARALLAX_DEPTH = {
  deep:       0.32,
  background: 0.22,
  mid:        0.14,
  foreground: 0.08,
  surface:    0.04,
  rain:       0.12,
} as const;

export type ParallaxPlane = keyof typeof PARALLAX_DEPTH;

const MOBILE_BREAKPOINT  = 768;
const MULTIPLIER_DESKTOP = 0.4;
const MULTIPLIER_MOBILE  = 0.2; // native + mobile web

// Width-aware: mobile browsers get the same reduced intensity as native.
// Called on JS thread during render; result is a plain number captured by worklets.
function useDepthMultiplier(): number {
  const { width } = useWindowDimensions();
  if (Platform.OS !== 'web') return MULTIPLIER_MOBILE;
  return width < MOBILE_BREAKPOINT ? MULTIPLIER_MOBILE : MULTIPLIER_DESKTOP;
}

// Hero background planes. translateY = scrollY * depth * multiplier.
// (scrollY / height) * depth * height reduces to scrollY * depth — height cancels,
// so useWindowDimensions is not needed inside the worklet.
export function useParallaxStyle(scrollY: SharedValue<number>, depth: number) {
  const multiplier = useDepthMultiplier();
  const factor = depth * multiplier;

  return useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * factor }],
  }));
}

// Section-layer parallax. Signed speed factor:
//   negative → element moves up faster than scroll (foreground)
//   positive → element moves slower (background)
// Magnitude kept small (0.05) — visible drift without breaking flow stacking.
const LAYER_MAGNITUDE = 0.05;
const MAX_LAYER_TRANSLATE_PX = 24;

export function useParallaxLayerStyle(
  scrollY: SharedValue<number>,
  speedFactor: number,
) {
  const multiplier = useDepthMultiplier();
  const clamped = Math.max(-2, Math.min(2, speedFactor));
  const factor = clamped * multiplier * LAYER_MAGNITUDE;
  const cap = MAX_LAYER_TRANSLATE_PX;

  return useAnimatedStyle(() => {
    const raw = scrollY.value * factor;
    const translateY = Math.max(-cap, Math.min(cap, raw));
    return {
      transform: [{ translateY }],
    };
  });
}

// Fade element out as scroll passes a px range. Used for hero content fade.
export function useParallaxFade(
  scrollY: SharedValue<number>,
  startPx: number,
  endPx: number,
) {
  return useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [startPx, endPx],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));
}

// Named-plane shorthand for HeroBackground and similar layered backgrounds.
export function useDepthPlane(scrollY: SharedValue<number>, plane: ParallaxPlane) {
  return useParallaxStyle(scrollY, PARALLAX_DEPTH[plane]);
}
