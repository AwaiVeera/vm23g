import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SharedValue } from 'react-native-reanimated';

import { GlassCard } from '@/components/ui/GlassCard';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { collectivesContent } from '@/cms/content';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';
import { useParallaxLayerStyle } from '@/systems/motion/parallax';
import { useScrollReveal, useRevealStyle, useStaggeredReveal } from '@/systems/motion/viewport';
import { SECTION_STAGGER } from '@/systems/motion/transitions';

type CollectivesSectionProps = {
  scrollY: SharedValue<number>;
};

export function CollectivesSection({ scrollY }: CollectivesSectionProps) {
  const layer = useParallaxLayerStyle(scrollY, -0.6);
  const { onLayout, visible, checkVisibility } = useScrollReveal(scrollY);

  const headingReveal = useRevealStyle(visible, 'slideLeft');
  const cardReveal    = useRevealStyle(visible, 'fadeUp');

  return (
    <SectionWrapper asymmetry="left">
      <View onLayout={onLayout}>
        <Animated.View style={[styles.inner, layer]}>
          <Animated.Text style={[styles.heading, headingReveal]}>
            {collectivesContent.heading}
          </Animated.Text>
          <Animated.View style={cardReveal}>
            <GlassCard>
              <Text style={styles.body}>{collectivesContent.body}</Text>
            </GlassCard>
          </Animated.View>
        </Animated.View>
      </View>
    </SectionWrapper>
  );
}

const styles = StyleSheet.create({
  inner: {
    gap: 20,
  },
  heading: {
    ...typography.title,
    color: colors.text.primary,
  },
  body: {
    ...typography.body,
    color: colors.text.muted,
  },
});
