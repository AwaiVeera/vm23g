import { Platform, type ViewStyle } from 'react-native';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { useMotionGuardrails } from '@/systems/motion/useMotionGuardrails';

// ─── Cursor-reactive glow (web only) ─────────────────────────────────────────

// Module-level shared values so only one mousemove listener exists globally.
let _cursorX: ReturnType<typeof useSharedValue<number>> | null = null;
let _cursorY: ReturnType<typeof useSharedValue<number>> | null = null;
let _listenerAttached = false;

function getCursorValues() {
  if (!_cursorX) _cursorX = { value: -9999 } as ReturnType<typeof useSharedValue<number>>;
  if (!_cursorY) _cursorY = { value: -9999 } as ReturnType<typeof useSharedValue<number>>;
  return { x: _cursorX, y: _cursorY };
}

function attachCursorListener() {
  if (_listenerAttached || Platform.OS !== 'web' || typeof document === 'undefined') return;

  // Only activate for pointer:fine (mouse), not pointer:coarse (touch/stylus)
  const isFinePointer =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches;

  if (!isFinePointer) return;

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) return;

  _listenerAttached = true;
  const { x, y } = getCursorValues();

  document.addEventListener(
    'mousemove',
    (e: MouseEvent) => {
      x.value = e.clientX;
      y.value = e.clientY;
    },
    { passive: true },
  );
}

// Returns a radial-gradient style centered on cursor position.
// The gradient is a soft olive bloom — use on full-width section backgrounds.
// Pass the element's measured { left, top } offset to localize the gradient.
export function useCursorGlow(
  elementX: number = 0,
  elementY: number = 0,
  radius: number = 320,
  opacity: number = 0.08,
): ReturnType<typeof useAnimatedStyle> {
  if (Platform.OS !== 'web') {
    return useAnimatedStyle(() => ({}));
  }

  attachCursorListener();
  const { x, y } = getCursorValues();

  return useAnimatedStyle(() => {
    const cx = x.value - elementX;
    const cy = y.value - elementY;

    // Off-screen / not yet moved: no glow
    if (x.value < 0) return {};

    return {
      backgroundImage: `radial-gradient(circle ${radius}px at ${cx}px ${cy}px, rgba(115, 130, 83, ${opacity}) 0%, transparent 70%)`,
    } as ViewStyle;
  });
}

export type GlowSurface = 'button' | 'card' | 'nav';

type GlowLayer = {
  outerRadius: number;
  outerOpacity: number;
  innerRadius?: number;
  innerOpacity?: number;
  secondOuterRadius?: number;
  secondOuterOpacity?: number;
};

type GlowPreset = {
  rest: GlowLayer;
  hover: GlowLayer;
};

export const GLOW_PRESETS: Record<GlowSurface, GlowPreset> = {
  button: {
    rest:  { outerRadius: 12, outerOpacity: 0.32, innerRadius: 6,  innerOpacity: 0.20 },
    hover: { outerRadius: 30, outerOpacity: 0.72, innerRadius: 12, innerOpacity: 0.46 },
  },
  // Card uses two concentric shadow rings at hover: the second ring gives the card a
  // breathing ambient field that extends well beyond its border without overpowering.
  card: {
    rest:  { outerRadius: 24, outerOpacity: 0.22 },
    hover: { outerRadius: 56, outerOpacity: 0.46, secondOuterRadius: 96, secondOuterOpacity: 0.16 },
  },
  nav: {
    rest:  { outerRadius: 8,  outerOpacity: 0.24 },
    hover: { outerRadius: 20, outerOpacity: 0.56 },
  },
};

function buildWebBoxShadow(layer: GlowLayer): string {
  const primary = `0 0 ${layer.outerRadius}px rgba(115, 130, 83, ${layer.outerOpacity})`;

  if (layer.innerRadius !== undefined && layer.innerOpacity !== undefined) {
    const inner = `0 0 ${layer.innerRadius}px rgba(115, 130, 83, ${layer.innerOpacity})`;
    return `${primary}, ${inner}`;
  }

  if (layer.secondOuterRadius !== undefined && layer.secondOuterOpacity !== undefined) {
    const second = `0 0 ${layer.secondOuterRadius}px rgba(115, 130, 83, ${layer.secondOuterOpacity})`;
    return `${primary}, ${second}`;
  }

  return primary;
}

export function useGlowIntensityStyle(
  intensity: SharedValue<number>,
  surface: GlowSurface = 'button',
): ReturnType<typeof useAnimatedStyle> {
  const preset = GLOW_PRESETS[surface];

  return useAnimatedStyle(() => {
    const t = intensity.value;

    const outerRadius  = interpolate(t, [0, 1], [preset.rest.outerRadius,  preset.hover.outerRadius]);
    const outerOpacity = interpolate(t, [0, 1], [preset.rest.outerOpacity, preset.hover.outerOpacity]);

    if (Platform.OS === 'web') {
      const restShadow  = buildWebBoxShadow(preset.rest);
      const hoverShadow = buildWebBoxShadow(preset.hover);

      // Interpolate each numeric value in the shadow string separately by
      // constructing the intermediate shadow at the current t value.
      const interpolatedLayer: GlowLayer = { outerRadius, outerOpacity };

      if (
        preset.rest.innerRadius !== undefined &&
        preset.rest.innerOpacity !== undefined &&
        preset.hover.innerRadius !== undefined &&
        preset.hover.innerOpacity !== undefined
      ) {
        interpolatedLayer.innerRadius  = interpolate(t, [0, 1], [preset.rest.innerRadius,  preset.hover.innerRadius]);
        interpolatedLayer.innerOpacity = interpolate(t, [0, 1], [preset.rest.innerOpacity, preset.hover.innerOpacity]);
      }

      if (
        preset.hover.secondOuterRadius !== undefined &&
        preset.hover.secondOuterOpacity !== undefined
      ) {
        const secondRadius  = interpolate(t, [0, 1], [preset.rest.outerRadius,  preset.hover.secondOuterRadius]);
        const secondOpacity = interpolate(t, [0, 1], [0,                        preset.hover.secondOuterOpacity]);
        interpolatedLayer.secondOuterRadius  = secondRadius;
        interpolatedLayer.secondOuterOpacity = secondOpacity;
      }

      return { boxShadow: buildWebBoxShadow(interpolatedLayer) } as ViewStyle;
    }

    return {
      shadowColor: 'rgba(115, 130, 83, 1)',
      shadowRadius: outerRadius,
      shadowOpacity: outerOpacity,
      shadowOffset: { width: 0, height: 0 },
    };
  });
}

export function useGlowHover(surface: GlowSurface = 'button'): {
  glowStyle: ReturnType<typeof useAnimatedStyle>;
  onHoverIn: () => void;
  onHoverOut: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
} {
  const { reduceMotion, lowMotionDevice } = useMotionGuardrails();
  const intensity = useSharedValue(0);

  const glowStyle = useGlowIntensityStyle(intensity, surface);

  const hoverTarget = reduceMotion ? 0.25 : lowMotionDevice ? 0.62 : 1;
  const hoverInDuration = reduceMotion ? 120 : 220;
  const hoverOutDuration = reduceMotion ? 140 : 300;

  const onHoverIn  = () => { intensity.value = withTiming(hoverTarget, { duration: hoverInDuration }); };
  const onHoverOut = () => { intensity.value = withTiming(0, { duration: hoverOutDuration }); };
  const onPressIn  = () => { intensity.value = withTiming(hoverTarget, { duration: hoverInDuration }); };
  const onPressOut = () => { intensity.value = withTiming(0, { duration: hoverOutDuration }); };

  return { glowStyle, onHoverIn, onHoverOut, onPressIn, onPressOut };
}

export function getAmbientGlowStyle(surface: GlowSurface): ViewStyle {
  const preset = GLOW_PRESETS[surface];

  if (Platform.OS === 'web') {
    return { boxShadow: buildWebBoxShadow(preset.rest) } as ViewStyle;
  }

  return {
    shadowColor: 'rgba(115, 130, 83, 1)',
    shadowRadius: preset.rest.outerRadius,
    shadowOpacity: preset.rest.outerOpacity,
    shadowOffset: { width: 0, height: 0 },
  };
}
