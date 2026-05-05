import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { SharedValue } from 'react-native-reanimated';

import { GlassCard } from '@/components/ui/GlassCard';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { galleryContent } from '@/cms/content';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';
import { useParallaxLayerStyle } from '@/systems/motion/parallax';
import { useScrollReveal, useRevealStyle, useStaggeredReveal } from '@/systems/motion/viewport';
import { SECTION_STAGGER } from '@/systems/motion/transitions';
import { useGlowHover } from '@/animations/glowSystem';

type GallerySectionProps = {
  scrollY: SharedValue<number>;
};

function GalleryCard({
  label,
  caption,
  revealStyle,
}: {
  label: string;
  caption: string;
  revealStyle: AnimatedStyle<ViewStyle>;
}) {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const { glowStyle, onHoverIn, onHoverOut, onPressIn, onPressOut } = useGlowHover('card');

  return (
    <Animated.View style={[revealStyle, styles.card]}>
      <GlassCard style={styles.cardInner}>
        <AnimatedPressable
          style={[styles.frame, glowStyle as AnimatedStyle<ViewStyle>]}
          onHoverIn={onHoverIn}
          onHoverOut={onHoverOut}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        />
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.caption}>{caption}</Text>
      </GlassCard>
    </Animated.View>
  );
}

export function GallerySection({ scrollY }: GallerySectionProps) {
  const layer = useParallaxLayerStyle(scrollY, 1);
  const { onLayout, visible } = useScrollReveal(scrollY);

  const headingReveal = useRevealStyle(visible, 'fadeUp');
  const cardReveals   = useStaggeredReveal(
    galleryContent.items.length,
    visible,
    SECTION_STAGGER,
    'scaleIn',
  );

  return (
    <SectionWrapper asymmetry="center">
      <View onLayout={onLayout}>
        <Animated.View style={layer}>
          <Animated.Text style={[styles.heading, headingReveal]}>
            {galleryContent.heading}
          </Animated.Text>
          <View style={styles.grid}>
            {galleryContent.items.map((item, i) => (
              <GalleryCard
                key={item.label}
                label={item.label}
                caption={item.caption}
                revealStyle={cardReveals[i]}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    </SectionWrapper>
  );
}

const styles = StyleSheet.create({
  heading: {
    ...typography.title,
    color: colors.text.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    gap: 16,
  },
  card: {
    width: '100%',
  },
  cardInner: {
    width: '100%',
  },
  frame: {
    height: 160,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.strokeSubtle,
    backgroundColor: colors.surfaceGlass,
    marginBottom: 12,
  },
  label: {
    ...typography.subtitle,
    color: colors.text.primary,
  },
  caption: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: 4,
  },
});
