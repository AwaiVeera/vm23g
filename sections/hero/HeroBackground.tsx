import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect } from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { SharedValue } from 'react-native-reanimated';
import { PARALLAX_DEPTH, useParallaxStyle } from '@/systems/motion/parallax';
import { useMotionGuardrails } from '@/systems/motion/useMotionGuardrails';

const webGradientStyle = Platform.select({
  web: {
    background:
      'radial-gradient(ellipse 70% 60% at 15% 25%, rgba(153, 172, 121, 0.20) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 85% 75%, rgba(115, 130, 83, 0.16) 0%, transparent 65%)',
  } as unknown as ViewStyle,
  default: {
    backgroundColor: 'transparent',
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

const videoCoverWebStyle = Platform.select({
  web: {
    width: '104%',
    height: '104%',
    marginLeft: '-2%',
    marginTop: '-2%',
    transform: [{ scale: 1.01 }],
  } as unknown as ViewStyle,
  default: {} as ViewStyle,
});

export function HeroBackground({ scrollY }: { scrollY: SharedValue<number> }) {
  const { reduceMotion, lowMotionDevice } = useMotionGuardrails();
  const bloomStyle  = useParallaxStyle(scrollY, PARALLAX_DEPTH.background);
  const ellipse1Style = useParallaxStyle(scrollY, PARALLAX_DEPTH.mid);
  const ellipse2Style = useParallaxStyle(scrollY, PARALLAX_DEPTH.foreground);
  const player = useVideoPlayer(require('@/assets/videos/robmace-1.mp4'), (instance) => {
    instance.loop = true;
    instance.muted = true;
    instance.play();
  });

  useEffect(() => {
    if (reduceMotion) {
      player.pause();
      return;
    }
    player.play();
  }, [player, reduceMotion]);

  return (
    <View style={styles.root}>
      {!reduceMotion ? (
        <View style={styles.videoWrap}>
          <VideoView
            player={player}
            style={[styles.videoBackground, videoCoverWebStyle]}
            nativeControls={false}
            contentFit="cover"
            allowsFullscreen={false}
            allowsPictureInPicture={false}
            playsInline
          />
        </View>
      ) : null}

      <Animated.View
        style={[styles.gradientBloom, webGradientStyle, bloomStyle]}
      />

      <Animated.View
        style={[styles.ellipse1, ellipse1BlurStyle, ellipse1Style]}
      />

      <Animated.View
        style={[styles.ellipse2, ellipse2BlurStyle, ellipse2Style]}
      />

      <View style={[styles.vignette, lowMotionDevice && styles.vignetteLowMotion]} />

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
    backgroundColor: '#0F1112',
  },
  videoBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  videoWrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  gradientBloom: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    pointerEvents: 'none',
  },
  ellipse1: {
    position: 'absolute',
    width: 400,
    height: 300,
    top: '5%',
    right: '8%',
    borderRadius: 9999,
    backgroundColor: 'rgba(115, 130, 83, 0.16)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  ellipse2: {
    position: 'absolute',
    width: 280,
    height: 200,
    bottom: '12%',
    left: '3%',
    borderRadius: 9999,
    backgroundColor: 'rgba(115, 130, 83, 0.14)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
    ...Platform.select({
      web: {
        backgroundImage:
          'radial-gradient(circle at 50% 42%, rgba(9, 10, 12, 0.08) 0%, rgba(9, 10, 12, 0.34) 64%, rgba(9, 10, 12, 0.58) 100%)',
      } as unknown as ViewStyle,
      default: {
        backgroundColor: 'rgba(9, 10, 12, 0.30)',
      } as ViewStyle,
    }),
  },
  vignetteLowMotion: {
    opacity: 0.8,
  },
  noiseOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 4,
    opacity: 0.05,
    pointerEvents: 'none',
  },
});
