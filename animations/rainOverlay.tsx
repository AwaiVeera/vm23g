import { useEffect } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/systems/theme/colors';

const DROP_COUNT = 36;

function Drop({ index, width, height }: { index: number; width: number; height: number }) {
  const progress = useSharedValue(0);
  const drift = useSharedValue(0);

  const left = (index * 41 + index * 7) % Math.max(width, 1);
  const delay = (index % 14) * 190;
  const fallDuration = 6000 + (index % 7) * 430;
  const driftRange = 2 + (index % 3);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: fallDuration, easing: Easing.linear }),
        -1,
        false
      )
    );

    drift.value = withRepeat(
      withTiming(driftRange, { duration: fallDuration * 1.6, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [delay, driftRange, drift, fallDuration, progress]);

  const dropHeight = 16 + (index % 6) * 4;
  const opacity = 0.05 + (index % 4) * 0.02;

  const style = useAnimatedStyle(() => {
    const translateY = progress.value * (height + 120);
    const translateX = drift.value - driftRange / 2;
    return {
      transform: [{ translateY }, { translateX }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.drop,
        {
          left,
          top: -80 - (index % 8) * 12,
          height: dropHeight,
        },
        style,
      ]}
    />
  );
}

export function RainOverlay() {
  const { width, height } = useWindowDimensions();

  return (
    <View
      style={styles.layer}
      {...(Platform.OS === 'web' ? ({ accessibilityElementsHidden: true } as const) : {})}
    >
      {Array.from({ length: DROP_COUNT }).map((_, index) => (
        <Drop key={index} index={index} width={width} height={height} />
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
  drop: {
    position: 'absolute',
    width: 1,
    borderRadius: 1,
    backgroundColor: colors.textPrimary,
    pointerEvents: 'none',
  },
});
