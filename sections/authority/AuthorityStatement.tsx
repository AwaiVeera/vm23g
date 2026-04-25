import { StyleSheet, View } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';

import { authorityContent } from '@/cms/content';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';
import { useParallaxLayerStyle } from '@/systems/motion/parallax';
import { useScrollReveal, useRevealStyle, useStaggeredReveal } from '@/systems/motion/viewport';
import { SECTION_STAGGER } from '@/systems/motion/transitions';

type Props = { scrollY: SharedValue<number> };

export function AuthorityStatement({ scrollY }: Props) {
  const layer = useParallaxLayerStyle(scrollY, -0.5);
  const { onLayout, visible } = useScrollReveal(scrollY);

  const labelReveal    = useRevealStyle(visible, 'fadeUp');
  const headlineReveal = useRevealStyle(visible, 'slideRight');
  const bodyReveal     = useRevealStyle(visible, 'fadeUp');
  const pillarReveals  = useStaggeredReveal(authorityContent.pillars.length, visible, SECTION_STAGGER, 'fadeUp');

  return (
    <SectionWrapper asymmetry="left" spacing="large">
      <View onLayout={onLayout}>
        <Animated.View style={layer}>
          <Animated.Text style={[styles.microLabel, labelReveal]}>
            {authorityContent.microLabel}
          </Animated.Text>

          <View style={styles.split}>
            <Animated.Text style={[styles.headline, headlineReveal]}>
              {authorityContent.headline}
            </Animated.Text>
            <Animated.Text style={[styles.body, bodyReveal]}>
              {authorityContent.body}
            </Animated.Text>
          </View>

          <View style={styles.pillarRow}>
            {authorityContent.pillars.map((p, i) => (
              <Animated.View key={p.number} style={[styles.pillar, pillarReveals[i]]}>
                <Animated.Text style={styles.pillarNumber}>{p.number}</Animated.Text>
                <Animated.Text style={styles.pillarTitle}>{p.title}</Animated.Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </View>
    </SectionWrapper>
  );
}

const styles = StyleSheet.create({
  microLabel:   { ...typography.microLabel, color: colors.oliveGreen, marginBottom: 28 },
  split:        { flexDirection: 'row', flexWrap: 'wrap', gap: 48, marginBottom: 80 },
  headline:     { ...typography.title, color: colors.text.primary, flex: 1, minWidth: 320 },
  body:         { ...typography.body,  color: colors.text.muted,   flex: 1, minWidth: 320, maxWidth: 460 },
  pillarRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 32, borderTopWidth: 1, borderTopColor: colors.strokeSubtle, paddingTop: 32 },
  pillar:       { flex: 1, minWidth: 220 },
  pillarNumber: { ...typography.caption, color: colors.oliveGreen, marginBottom: 8, letterSpacing: 2 },
  pillarTitle:  { ...typography.subtitle, color: colors.text.primary },
});
