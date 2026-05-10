import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';

import { aboutPageContent, businessArms, verificationLabels, vm23gProfile } from '@/cms/content';
import { GlowButton } from '@/components/ui/GlowButton';
import { RevealCard } from '@/components/ui/RevealCard';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';
import { useParallaxLayerStyle } from '@/systems/motion/parallax';
import { useRevealStyle, useScrollReveal } from '@/systems/motion/viewport';

type Props = { scrollY: SharedValue<number> };

export function AboutSection({ scrollY }: Props) {
  const heroLayer = useParallaxLayerStyle(scrollY, -0.45);
  const { onLayout, visible } = useScrollReveal(scrollY);
  const heroReveal = useRevealStyle(visible, 'slideLeft');

  return (
    <SectionWrapper asymmetry="left" spacing="large">
      <View style={styles.stack}>
        <View onLayout={onLayout}>
          <Animated.View style={heroLayer}>
            <Animated.View style={[styles.heroBlock, styles.heroPanel, heroReveal]}>
              <Text style={styles.micro}>ABOUT VM23G</Text>
              <Text style={styles.heading}>{aboutPageContent.hero.title}</Text>
              <Text style={styles.subtitle}>{aboutPageContent.hero.subtitle}</Text>
              <View style={styles.ctaRow}>
                <GlowButton label={aboutPageContent.hero.ctas[0]} onPress={() => {}} />
                <GlowButton label={aboutPageContent.hero.ctas[1]} onPress={() => {}} />
              </View>
            </Animated.View>
          </Animated.View>
        </View>

        <RevealCard
          scrollY={scrollY}
          depth={-0.3}
          variant="fadeUp"
          intensity="high"
          padding={32}
          borderRadius={22}
        >
          <Text style={styles.sectionTitle}>Who We Are</Text>
          <Text style={styles.body}>{aboutPageContent.whoWeAre}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaChip}>Singapore based</Text>
            <Text style={styles.metaChip}>SSIC {vm23gProfile.ssic.primary.code}</Text>
            <Text style={styles.metaChip}>SSIC {vm23gProfile.ssic.secondary.code}</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Leadership</Text>
          {aboutPageContent.leadership.map((leader) => (
            <View key={leader.name} style={styles.leaderRow}>
              <View style={styles.avatarPlaceholder} />
              <View style={styles.leaderCopy}>
                <Text style={styles.proofLabel}>{leader.name}</Text>
                <Text style={styles.armRole}>{leader.role}</Text>
                <Text style={styles.body}>{leader.note}</Text>
              </View>
            </View>
          ))}
        </RevealCard>

        <View style={styles.armGrid}>
          <RevealCard
            scrollY={scrollY}
            depth={0.3}
            variant="slideLeft"
            intensity="high"
            padding={26}
            borderRadius={20}
          >
            <Text style={styles.armLabel}>{businessArms.navaFitAlignment.name}</Text>
            <Text style={styles.armRole}>{businessArms.navaFitAlignment.role}</Text>
            <Text style={styles.armText}>{businessArms.navaFitAlignment.leadership}</Text>
            {businessArms.navaFitAlignment.focus.map((item) => (
              <Text key={item} style={styles.armBullet}>
                · {item}
              </Text>
            ))}
            <Text style={styles.armEnergy}>{businessArms.navaFitAlignment.brandEnergy}</Text>
          </RevealCard>

          <RevealCard
            scrollY={scrollY}
            depth={-0.3}
            variant="slideRight"
            intensity="high"
            padding={26}
            borderRadius={20}
          >
            <Text style={styles.armLabel}>{businessArms.aaVisions.name}</Text>
            <Text style={styles.armRole}>{businessArms.aaVisions.role}</Text>
            <Text style={styles.armText}>{businessArms.aaVisions.leadership}</Text>
            {businessArms.aaVisions.focus.map((item) => (
              <Text key={item} style={styles.armBullet}>
                · {item}
              </Text>
            ))}
            <Text style={styles.armEnergy}>{businessArms.aaVisions.differentiator}</Text>
          </RevealCard>
        </View>

        <RevealCard
          scrollY={scrollY}
          depth={0.25}
          variant="fadeUp"
          intensity="medium"
          padding={28}
          borderRadius={20}
        >
          <Text style={styles.sectionTitle}>Why VM23G Exists</Text>
          {aboutPageContent.whyVm23gExists.map((item) => (
            <Text key={item} style={styles.listItem}>
              · {item}
            </Text>
          ))}
        </RevealCard>

        <RevealCard
          scrollY={scrollY}
          depth={-0.1}
          variant="fadeUp"
          intensity="low"
          padding={20}
          borderRadius={18}
          hover={false}
        >
          <Text style={styles.sectionTitle}>Verification Notes</Text>
          {aboutPageContent.verificationNotes.map((note) => (
            <Text key={note} style={styles.note}>
              · {note}
            </Text>
          ))}
          <Text style={styles.pending}>{verificationLabels.pending}</Text>
        </RevealCard>
      </View>
    </SectionWrapper>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 18,
  },
  heroBlock: {
    gap: 14,
    marginBottom: 8,
  },
  heroPanel: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    paddingVertical: 20,
    paddingHorizontal: 22,
    backgroundColor: colors.glass.surface,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: [
          '0 16px 34px rgba(26, 25, 22, 0.12)',
          '0 0 46px rgba(115, 130, 83, 0.14)',
          'inset 0 1px 0 rgba(255, 255, 255, 0.74)',
        ].join(', '),
      } as object,
      default: {},
    }),
  },
  micro: {
    ...typography.microLabel,
    color: colors.accent.base,
  },
  heading: {
    ...typography.display,
    color: colors.text.primary,
    maxWidth: 920,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.text.secondary,
    maxWidth: 760,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 8,
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.accent.base,
    marginBottom: 12,
  },
  body: {
    ...typography.body,
    color: colors.text.muted,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  metaChip: {
    ...typography.caption,
    color: colors.accent.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.glass.surface,
    textTransform: 'uppercase',
  },
  armGrid: {
    gap: 14,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border.subtle,
    marginVertical: 14,
  },
  armLabel: {
    ...typography.sectionTitle,
    color: colors.text.primary,
    marginBottom: 6,
  },
  armRole: {
    ...typography.caption,
    color: colors.accent.base,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  armText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  armBullet: {
    ...typography.bodySmall,
    color: colors.text.muted,
    marginBottom: 4,
  },
  armEnergy: {
    ...typography.bodySmall,
    color: colors.accent.base,
    marginTop: 12,
  },
  listItem: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: 6,
  },
  proofLabel: {
    ...typography.label,
    color: colors.text.primary,
  },
  pending: {
    ...typography.bodySmall,
    color: colors.accent.base,
  },
  leaderRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.subtle,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.glass.white,
  },
  leaderCopy: {
    flex: 1,
    gap: 4,
  },
  note: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: 6,
  },
});
