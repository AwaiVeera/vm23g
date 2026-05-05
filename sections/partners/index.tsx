import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { AnimatedStyle, SharedValue } from 'react-native-reanimated';

import { useGlowHover } from '@/animations/glowSystem';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { partnersContent } from '@/cms/content';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';
import { useParallaxLayerStyle } from '@/systems/motion/parallax';
import { useScrollReveal, useRevealStyle, useStaggeredReveal } from '@/systems/motion/viewport';
import { SECTION_STAGGER } from '@/systems/motion/transitions';

type PartnersSectionProps = {
  scrollY: SharedValue<number>;
};

function PartnerCard({
  name,
  revealStyle,
}: {
  name: string;
  revealStyle: AnimatedStyle<ViewStyle>;
}) {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const { glowStyle, onHoverIn, onHoverOut, onPressIn, onPressOut } = useGlowHover('card');

  return (
    <Animated.View style={[styles.cardShell, revealStyle]}>
      <GlassCard intensity="high" style={styles.cardOuter}>
        <AnimatedPressable
          style={[styles.cardPressable, glowStyle as AnimatedStyle<ViewStyle>]}
          onHoverIn={onHoverIn}
          onHoverOut={onHoverOut}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <View style={styles.emblem} />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.meta}>Private strategic partnership</Text>
        </AnimatedPressable>
      </GlassCard>
    </Animated.View>
  );
}

export function PartnersSection({ scrollY }: PartnersSectionProps) {
  const layer = useParallaxLayerStyle(scrollY, -0.4);
  const { onLayout, visible } = useScrollReveal(scrollY);

  const headingReveal = useRevealStyle(visible, 'slideRight');
  const pillReveals   = useStaggeredReveal(
    partnersContent.names.length,
    visible,
    SECTION_STAGGER * 0.7,
    'fadeUp',
  );

  return (
    <SectionWrapper asymmetry="right">
      <View onLayout={onLayout}>
        <Animated.View style={layer}>
          <Animated.Text style={[styles.heading, headingReveal]}>
            {partnersContent.heading}
          </Animated.Text>
          <Text style={styles.lead}>
            Curated collaborators integrated into the VM23G operating layer.
          </Text>
          <View style={styles.row}>
            {partnersContent.names.map((name, i) => (
              <PartnerCard key={name} name={name} revealStyle={pillReveals[i]} />
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
    marginBottom: 10,
  },
  lead: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: 18,
    maxWidth: 720,
  },
  row: {
    gap: 16,
  },
  cardShell: {
    width: '100%',
  },
  cardOuter: {
    width: '100%',
  },
  cardPressable: {
    minHeight: 220,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border.glass,
    padding: 22,
    justifyContent: 'space-between',
    backgroundColor: colors.glass.surface,
  },
  emblem: {
    width: 72,
    height: 72,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent.subtle,
    backgroundColor: colors.glass.white,
  },
  name: {
    ...typography.caption,
    color: colors.oliveGreen,
    textTransform: 'uppercase',
    letterSpacing: 2.2,
  },
  meta: {
    ...typography.bodySmall,
    color: colors.text.muted,
  },
});
