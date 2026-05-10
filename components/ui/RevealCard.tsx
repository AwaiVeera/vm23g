import { PropsWithChildren } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle, SharedValue } from 'react-native-reanimated';

import { useGlowHover } from '@/animations/glowSystem';
import { GlassCard, GlassIntensity } from '@/components/ui/GlassCard';
import { useParallaxLayerStyle } from '@/systems/motion/parallax';
import { RevealVariant, useRevealStyle, useScrollReveal } from '@/systems/motion/viewport';

type RevealCardProps = PropsWithChildren<{
  scrollY: SharedValue<number>;
  depth?: number;
  variant?: RevealVariant;
  hover?: boolean;
  intensity?: GlassIntensity;
  padding?: number;
  borderRadius?: number;
  style?: ViewStyle;
  innerStyle?: ViewStyle;
  onPress?: () => void;
}>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function RevealCard({
  children,
  scrollY,
  depth = 0,
  variant = 'fadeUp',
  hover = true,
  intensity = 'medium',
  padding,
  borderRadius,
  style,
  innerStyle,
  onPress,
}: RevealCardProps) {
  const { onLayout, visible } = useScrollReveal(scrollY);
  const reveal = useRevealStyle(visible, variant);
  const parallax = useParallaxLayerStyle(scrollY, depth);
  const { glowStyle, onHoverIn, onHoverOut, onPressIn, onPressOut } = useGlowHover('card');

  return (
    <View onLayout={onLayout} style={style}>
      <Animated.View style={parallax}>
        <Animated.View style={reveal}>
          {hover ? (
            <AnimatedPressable
              onPress={onPress}
              onHoverIn={onHoverIn}
              onHoverOut={onHoverOut}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              style={[innerStyle, glowStyle as AnimatedStyle<ViewStyle>]}
            >
              <GlassCard intensity={intensity} padding={padding} borderRadius={borderRadius}>
                {children}
              </GlassCard>
            </AnimatedPressable>
          ) : (
            <View style={innerStyle}>
              <GlassCard intensity={intensity} padding={padding} borderRadius={borderRadius}>
                {children}
              </GlassCard>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </View>
  );
}
