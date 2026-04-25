import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';

import { proofMetricsContent } from '@/cms/content';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { useGlowHover } from '@/animations/glowSystem';
import { colors } from '@/systems/theme/colors';
import { fontFamilies, typography } from '@/systems/theme/typography';
import { useParallaxLayerStyle } from '@/systems/motion/parallax';
import { useScrollReveal, useRevealStyle, useStaggeredReveal } from '@/systems/motion/viewport';
import { SECTION_STAGGER } from '@/systems/motion/transitions';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = { scrollY: SharedValue<number> };

export function ProofMetrics({ scrollY }: Props) {
  const layer = useParallaxLayerStyle(scrollY, 0.6);
  const { onLayout, visible } = useScrollReveal(scrollY);

  const labelReveal = useRevealStyle(visible, 'fadeUp');
  const cardReveals = useStaggeredReveal(proofMetricsContent.items.length, visible, SECTION_STAGGER * 0.8, 'fadeUp');

  return (
    <SectionWrapper asymmetry="center" spacing="large">
      <View onLayout={onLayout}>
        <Animated.View style={layer}>
          <Animated.Text style={[styles.microLabel, labelReveal]}>
            {proofMetricsContent.microLabel}
          </Animated.Text>

          <View style={styles.row}>
            {proofMetricsContent.items.map((m, i) => (
              <Animated.View key={m.label} style={[styles.cardWrap, cardReveals[i]]}>
                <ProofCard value={m.value} label={m.label} />
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </View>
    </SectionWrapper>
  );
}

function ProofCard({ value, label }: { value: string; label: string }) {
  const { glowStyle, onHoverIn, onHoverOut, onPressIn, onPressOut } = useGlowHover('card');

  return (
    <AnimatedPressable
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.cardPressable, glowStyle]}
    >
      <GlassCard intensity="medium" padding={28} borderRadius={16} style={styles.cardInner}>
        <Animated.Text style={styles.value}>{value}</Animated.Text>
        <Animated.Text style={styles.label}>{label}</Animated.Text>
      </GlassCard>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  microLabel:    { ...typography.microLabel, color: colors.oliveGreen, marginBottom: 36, textAlign: 'center' },
  row:           { flexDirection: 'row', flexWrap: 'wrap', gap: 18, justifyContent: 'center' },
  cardWrap:      { flex: 1, minWidth: 180, maxWidth: 260 },
  cardPressable: { borderRadius: 16 },
  cardInner:     { alignItems: 'center', justifyContent: 'center' },
  value:         { fontFamily: fontFamilies.serif, fontSize: 48, lineHeight: 56, letterSpacing: 2, fontWeight: '300', color: colors.text.primary, marginBottom: 10 },
  label:         { ...typography.microLabel, color: colors.text.muted, textAlign: 'center' },
});
