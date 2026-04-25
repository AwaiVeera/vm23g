import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';

import { premiumCTAContent } from '@/cms/content';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';
import { useParallaxLayerStyle } from '@/systems/motion/parallax';
import { useScrollReveal, useRevealStyle } from '@/systems/motion/viewport';

type Props = { scrollY: SharedValue<number> };

export function PremiumCTA({ scrollY }: Props) {
  const router = useRouter();
  const layer = useParallaxLayerStyle(scrollY, -0.4);
  const { onLayout, visible } = useScrollReveal(scrollY);

  const labelReveal    = useRevealStyle(visible, 'fadeUp');
  const headlineReveal = useRevealStyle(visible, 'scaleIn');
  const bodyReveal     = useRevealStyle(visible, 'fadeUp');
  const ctaReveal      = useRevealStyle(visible, 'fadeUp');

  return (
    <SectionWrapper asymmetry="center" spacing="large">
      <View onLayout={onLayout}>
        <Animated.View style={[styles.center, layer]}>
          <GlassCard intensity="high" padding={48} borderRadius={28} style={styles.panel}>
            <Animated.Text style={[styles.microLabel, labelReveal]}>
              {premiumCTAContent.microLabel}
            </Animated.Text>
            <Animated.Text style={[styles.headline, headlineReveal]}>
              {premiumCTAContent.headline}
            </Animated.Text>
            <Animated.Text style={[styles.body, bodyReveal]}>
              {premiumCTAContent.body}
            </Animated.Text>

            <Animated.View style={[styles.ctaRow, ctaReveal]}>
              <GlowButton
                label={premiumCTAContent.primaryLabel}
                onPress={() => router.push('/about')}
              />
              <Pressable
                onPress={() => router.push('/collectives')}
                style={styles.secondary}
              >
                <Text style={styles.secondaryLabel}>{premiumCTAContent.secondaryLabel}</Text>
              </Pressable>
            </Animated.View>
          </GlassCard>
        </Animated.View>
      </View>
    </SectionWrapper>
  );
}

const styles = StyleSheet.create({
  center:         { alignItems: 'center' },
  panel:          { width: '100%', maxWidth: 720, alignItems: 'center' },
  microLabel:     { ...typography.microLabel, color: colors.oliveGreen, marginBottom: 20, textAlign: 'center' },
  headline:       { ...typography.title, color: colors.text.primary, textAlign: 'center', marginBottom: 20 },
  body:           { ...typography.body, color: colors.text.muted, textAlign: 'center', maxWidth: 520, marginBottom: 32 },
  ctaRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 18, alignItems: 'center', justifyContent: 'center' },
  secondary:      { paddingVertical: 12, paddingHorizontal: 8 },
  secondaryLabel: { ...typography.caption, color: colors.text.muted, letterSpacing: 2, textTransform: 'uppercase' },
});
