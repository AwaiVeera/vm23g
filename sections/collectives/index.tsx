import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';

import { GlowButton } from '@/components/ui/GlowButton';
import { RevealCard } from '@/components/ui/RevealCard';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { collectivesContent, collectivesPageContent } from '@/cms/content';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';
import { useParallaxLayerStyle } from '@/systems/motion/parallax';
import { useRevealStyle, useScrollReveal } from '@/systems/motion/viewport';

type CollectivesSectionProps = {
  scrollY: SharedValue<number>;
};

export function CollectivesSection({ scrollY }: CollectivesSectionProps) {
  const layer = useParallaxLayerStyle(scrollY, -0.6);
  const { onLayout, visible } = useScrollReveal(scrollY);
  const headingReveal = useRevealStyle(visible, 'slideLeft');

  return (
    <SectionWrapper asymmetry="left">
      <View style={styles.stack}>
        <View onLayout={onLayout}>
          <Animated.View style={layer}>
            <Animated.Text style={[styles.heading, headingReveal]}>
              {collectivesContent.heading}
            </Animated.Text>
          </Animated.View>
        </View>

        <RevealCard
          scrollY={scrollY}
          depth={-0.25}
          variant="fadeUp"
          intensity="high"
          padding={28}
          borderRadius={22}
        >
          <Text style={styles.body}>{collectivesPageContent.intro}</Text>
          <Text style={styles.mission}>{collectivesPageContent.mission}</Text>
        </RevealCard>

        <RevealCard
          scrollY={scrollY}
          depth={0.18}
          variant="fadeUp"
          intensity="medium"
          padding={22}
          borderRadius={20}
        >
          <Text style={styles.sectionTitle}>Collective Categories</Text>
          <View style={styles.categoryWrap}>
            {collectivesPageContent.categories.map((category) => (
              <View key={category} style={styles.categoryChip}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
        </RevealCard>

        <RevealCard
          scrollY={scrollY}
          depth={-0.12}
          variant="scaleIn"
          intensity="high"
          padding={26}
          borderRadius={22}
        >
          <Text style={styles.sectionTitle}>Move With Us</Text>
          <View style={styles.ctaRow}>
            <GlowButton label={collectivesPageContent.ctas[0]} onPress={() => {}} />
            {collectivesPageContent.ctas.slice(1).map((cta) => (
              <Pressable key={cta} style={styles.secondaryCta}>
                <Text style={styles.secondaryText}>{cta}</Text>
              </Pressable>
            ))}
          </View>
        </RevealCard>
      </View>
    </SectionWrapper>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 18,
  },
  heading: {
    ...typography.display,
    color: colors.text.primary,
    marginBottom: 8,
  },
  body: {
    ...typography.body,
    color: colors.text.primary,
  },
  mission: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: 14,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.accent.base,
    marginBottom: 16,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.glass.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  categoryText: {
    ...typography.caption,
    color: colors.accent.base,
    textTransform: 'uppercase',
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
  secondaryCta: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.glass.surface,
  },
  secondaryText: {
    ...typography.caption,
    color: colors.accent.base,
    textTransform: 'uppercase',
  },
});
