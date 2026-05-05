import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SharedValue } from 'react-native-reanimated';

import { GlassCard } from '@/components/ui/GlassCard';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { servicesContent } from '@/cms/content';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';
import { useParallaxLayerStyle } from '@/systems/motion/parallax';
import { useScrollReveal, useRevealStyle, useStaggeredReveal } from '@/systems/motion/viewport';
import { SECTION_STAGGER } from '@/systems/motion/transitions';

type ServicesSectionProps = {
  scrollY: SharedValue<number>;
};

export function ServicesSection({ scrollY }: ServicesSectionProps) {
  const layer = useParallaxLayerStyle(scrollY, 0.8);
  const { onLayout, visible } = useScrollReveal(scrollY);

  const headingReveal = useRevealStyle(visible, 'fadeUp');
  const cardReveals   = useStaggeredReveal(
    servicesContent.items.length,
    visible,
    SECTION_STAGGER,
    'fadeUp',
  );

  return (
    <SectionWrapper asymmetry="right">
      <View onLayout={onLayout}>
        <Animated.View style={layer}>
          <Animated.Text style={[styles.heading, headingReveal]}>
            {servicesContent.heading}
          </Animated.Text>
          <View style={styles.grid}>
            {servicesContent.items.map((item, i) => (
              <Animated.View key={item.title} style={[styles.card, cardReveals[i]]}>
                <GlassCard style={styles.cardInner}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardBody}>{item.body}</Text>
                </GlassCard>
              </Animated.View>
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
    marginBottom: 28,
  },
  grid: {
    gap: 18,
  },
  card: {
    width: '100%',
  },
  cardInner: {
    width: '100%',
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.oliveGreen,
    marginBottom: 8,
  },
  cardBody: {
    ...typography.body,
    color: colors.text.muted,
  },
});
