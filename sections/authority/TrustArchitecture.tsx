import { StyleSheet, View } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';

import { trustArchitectureContent } from '@/cms/content';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';
import { useParallaxLayerStyle } from '@/systems/motion/parallax';
import { useScrollReveal, useRevealStyle, useStaggeredReveal } from '@/systems/motion/viewport';
import { SECTION_STAGGER } from '@/systems/motion/transitions';

type Props = { scrollY: SharedValue<number> };

export function TrustArchitecture({ scrollY }: Props) {
  const layer = useParallaxLayerStyle(scrollY, 0.5);
  const { onLayout, visible } = useScrollReveal(scrollY);

  const labelReveal    = useRevealStyle(visible, 'fadeUp');
  const headingReveal  = useRevealStyle(visible, 'slideLeft');
  const cardReveals    = useStaggeredReveal(trustArchitectureContent.cards.length, visible, SECTION_STAGGER, 'scaleIn');

  return (
    <SectionWrapper asymmetry="right" spacing="large">
      <View onLayout={onLayout}>
        <Animated.View style={layer}>
          <Animated.Text style={[styles.microLabel, labelReveal]}>
            {trustArchitectureContent.microLabel}
          </Animated.Text>
          <Animated.Text style={[styles.heading, headingReveal]}>
            {trustArchitectureContent.heading}
          </Animated.Text>

          <View style={styles.row}>
            {trustArchitectureContent.cards.map((c, i) => (
              <Animated.View key={c.label} style={[styles.cardWrap, cardReveals[i]]}>
                <GlassCard intensity="medium" padding={32} borderRadius={20} style={styles.card}>
                  <Animated.Text style={styles.cardLabel}>{c.label}</Animated.Text>
                  <Animated.Text style={styles.cardBody}>{c.body}</Animated.Text>
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
  microLabel: { ...typography.microLabel, color: colors.oliveGreen, marginBottom: 18 },
  heading:    { ...typography.title, color: colors.text.primary, marginBottom: 36 },
  row:        { flexDirection: 'row', flexWrap: 'wrap', gap: 18 },
  cardWrap:   { flex: 1, minWidth: 260 },
  card:       { width: '100%' },
  cardLabel:  { ...typography.microLabel, color: colors.oliveGreen, marginBottom: 12 },
  cardBody:   { ...typography.body,       color: colors.text.muted },
});
