import { StyleSheet, View } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';

import { aboutContent } from '@/cms/content';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';
import { useParallaxLayerStyle } from '@/systems/motion/parallax';
import { useScrollReveal, useRevealStyle } from '@/systems/motion/viewport';

type Props = { scrollY: SharedValue<number> };

export function AboutSection({ scrollY }: Props) {
  const layer = useParallaxLayerStyle(scrollY, -0.45);
  const { onLayout, visible } = useScrollReveal(scrollY);

  const headingReveal = useRevealStyle(visible, 'slideLeft');
  const bodyReveal    = useRevealStyle(visible, 'fadeUp');

  return (
    <SectionWrapper asymmetry="left" spacing="large">
      <View onLayout={onLayout}>
        <Animated.View style={layer}>
          <Animated.Text style={[styles.heading, headingReveal]}>
            {aboutContent.heading}
          </Animated.Text>
          <Animated.View style={bodyReveal}>
            <GlassCard intensity="medium" padding={36} borderRadius={22} style={styles.card}>
              <Animated.Text style={styles.body}>{aboutContent.body}</Animated.Text>
            </GlassCard>
          </Animated.View>
        </Animated.View>
      </View>
    </SectionWrapper>
  );
}

const styles = StyleSheet.create({
  heading: { ...typography.title, color: colors.text.primary, marginBottom: 24 },
  card:    { maxWidth: 720 },
  body:    { ...typography.body, color: colors.text.muted },
});
