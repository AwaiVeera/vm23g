import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { SharedValue } from 'react-native-reanimated';
import { PARALLAX_DEPTH, useParallaxStyle } from '@/systems/motion/parallax';

const webGradientStyle = Platform.select({
  web: {
    background:
      'radial-gradient(ellipse 70% 60% at 15% 25%, rgba(115, 130, 83, 0.11) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 85% 75%, rgba(115, 130, 83, 0.07) 0%, transparent 65%), #F5F3EF',
  } as unknown as ViewStyle,
  default: {
    backgroundColor: '#F5F3EF',
  } as ViewStyle,
});

const ellipse1BlurStyle = Platform.select({
  web: { filter: 'blur(80px)' } as unknown as ViewStyle,
  default: {} as ViewStyle,
});

const ellipse2BlurStyle = Platform.select({
  web: { filter: 'blur(60px)' } as unknown as ViewStyle,
  default: {} as ViewStyle,
});

const noiseWebStyle = Platform.select({
  web: {
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'repeat',
    backgroundSize: '200px 200px',
  } as unknown as ViewStyle,
  default: {} as ViewStyle,
});

export function HeroBackground({ scrollY }: { scrollY: SharedValue<number> }) {
  const bloomStyle  = useParallaxStyle(scrollY, PARALLAX_DEPTH.background);
  const ellipse1Style = useParallaxStyle(scrollY, PARALLAX_DEPTH.mid);
  const ellipse2Style = useParallaxStyle(scrollY, PARALLAX_DEPTH.foreground);

  return (
    <View style={styles.root}>
      <Animated.View
        style={[styles.gradientBloom, webGradientStyle, bloomStyle]}
      />

      <Animated.View
        style={[styles.ellipse1, ellipse1BlurStyle, ellipse1Style]}
      />

      <Animated.View
        style={[styles.ellipse2, ellipse2BlurStyle, ellipse2Style]}
      />

      {Platform.OS === 'web' && (
        <View style={[styles.noiseOverlay, noiseWebStyle]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  gradientBloom: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    pointerEvents: 'none',
  },
  ellipse1: {
    position: 'absolute',
    width: 400,
    height: 300,
    top: '5%',
    right: '8%',
    borderRadius: 9999,
    backgroundColor: 'rgba(115, 130, 83, 0.09)',
    zIndex: 0,
    pointerEvents: 'none',
  },
  ellipse2: {
    position: 'absolute',
    width: 280,
    height: 200,
    bottom: '12%',
    left: '3%',
    borderRadius: 9999,
    backgroundColor: 'rgba(115, 130, 83, 0.07)',
    zIndex: 0,
    pointerEvents: 'none',
  },
  noiseOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    opacity: 0.035,
    pointerEvents: 'none',
  },
});
