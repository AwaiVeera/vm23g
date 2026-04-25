import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';

import { clientPathwayContent } from '@/cms/content';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { colors } from '@/systems/theme/colors';
import { fontFamilies, typography } from '@/systems/theme/typography';
import { useParallaxLayerStyle } from '@/systems/motion/parallax';
import { useScrollReveal, useRevealStyle, useStaggeredReveal } from '@/systems/motion/viewport';
import { SECTION_STAGGER } from '@/systems/motion/transitions';

type Props = { scrollY: SharedValue<number> };

const CONNECTOR_MIN_WIDTH = 1024;

export function ClientPathway({ scrollY }: Props) {
  const { width } = useWindowDimensions();
  const layer = useParallaxLayerStyle(scrollY, -0.6);
  const { onLayout, visible } = useScrollReveal(scrollY);

  const labelReveal   = useRevealStyle(visible, 'fadeUp');
  const headingReveal = useRevealStyle(visible, 'slideRight');
  const stepReveals   = useStaggeredReveal(clientPathwayContent.steps.length, visible, SECTION_STAGGER * 1.15, 'fadeUp');

  const showConnector = width >= CONNECTOR_MIN_WIDTH;

  return (
    <SectionWrapper asymmetry="left" spacing="large">
      <View onLayout={onLayout}>
        <Animated.View style={layer}>
          <Animated.Text style={[styles.microLabel, labelReveal]}>
            {clientPathwayContent.microLabel}
          </Animated.Text>
          <Animated.Text style={[styles.heading, headingReveal]}>
            {clientPathwayContent.heading}
          </Animated.Text>

          <View style={styles.row}>
            {showConnector && <View style={styles.connector} />}
            {clientPathwayContent.steps.map((s, i) => (
              <Animated.View key={s.number} style={[styles.stepWrap, stepReveals[i]]}>
                <GlassCard intensity="low" padding={26} borderRadius={18} style={styles.stepCard}>
                  <Animated.Text style={styles.stepNumber}>{s.number}</Animated.Text>
                  <Animated.Text style={styles.stepTitle}>{s.title}</Animated.Text>
                  <Animated.Text style={styles.stepBody}>{s.body}</Animated.Text>
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
  heading:    { ...typography.title, color: colors.text.primary, marginBottom: 44 },
  row:        { flexDirection: 'row', flexWrap: 'wrap', gap: 18, position: 'relative' },
  connector:  { position: 'absolute', top: 36, left: 16, right: 16, height: 1, backgroundColor: colors.strokeSubtle, opacity: 0.6, pointerEvents: 'none' },
  stepWrap:   { flex: 1, minWidth: 220 },
  stepCard:   { width: '100%' },
  stepNumber: { fontFamily: fontFamilies.serif, fontSize: 28, lineHeight: 32, fontWeight: '300', letterSpacing: 2, color: colors.oliveGreen, marginBottom: 14 },
  stepTitle:  { ...typography.subtitle, color: colors.text.primary, marginBottom: 8 },
  stepBody:   { ...typography.body,     color: colors.text.muted },
});
