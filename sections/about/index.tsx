import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';

import { aboutPageContent, businessArms, vm23gProfile } from '@/cms/content';
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
        </RevealCard>

        <Text style={[styles.sectionTitle, styles.foundersHeading]}>Founders</Text>
        <View style={styles.foundersGrid}>
          {aboutPageContent.leadership.map((leader, index) => {
            const arm = businessArms[leader.armKey];
            return (
              <RevealCard
                key={leader.name}
                scrollY={scrollY}
                depth={index === 0 ? 0.32 : -0.32}
                variant={index === 0 ? 'slideLeft' : 'slideRight'}
                intensity="high"
                padding={0}
                borderRadius={22}
                style={styles.founderCardSlot}
              >
                <View style={styles.founderCardInner}>
                  <View style={styles.portraitFrame}>
                    <Image
                      source={leader.portrait}
                      style={styles.portraitImage}
                      contentFit="cover"
                      contentPosition={{ top: '8%' }}
                      accessibilityLabel={`${leader.name}, ${leader.role} of VM23G`}
                      alt={`Portrait of ${leader.name}, ${leader.role} of VM23G`}
                      transition={300}
                    />
                    <View style={styles.portraitGloss} pointerEvents="none" />
                  </View>
                  <View style={styles.founderBody}>
                    <Text style={styles.founderName}>{leader.name}</Text>
                    <Text style={styles.founderRole}>{leader.role}</Text>
                    <Text style={styles.founderNote}>{leader.note}</Text>

                    <View style={styles.armDivider} />

                    <Text style={styles.armLabel}>{arm.name}</Text>
                    <Text style={styles.armRole}>{arm.role}</Text>
                    {arm.focus.map((item) => (
                      <Text key={item} style={styles.armBullet}>
                        · {item}
                      </Text>
                    ))}
                    <Text style={styles.armEnergy}>
                      {leader.armKey === 'navaFitAlignment'
                        ? businessArms.navaFitAlignment.brandEnergy
                        : businessArms.aaVisions.differentiator}
                    </Text>
                  </View>
                </View>
              </RevealCard>
            );
          })}
        </View>

        <RevealCard
          scrollY={scrollY}
          depth={-0.1}
          variant="fadeUp"
          intensity="medium"
          padding={24}
          borderRadius={20}
        >
          <Text style={styles.sectionTitle}>Are We Qualified</Text>
          {aboutPageContent.qualifications.map((note) => (
            <Text key={note} style={styles.qualificationLine}>
              {note}
            </Text>
          ))}
        </RevealCard>
      </View>
    </SectionWrapper>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 36,
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
  armDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border.subtle,
    marginVertical: 14,
  },
  armLabel: {
    ...typography.subheading,
    color: colors.text.primary,
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 4,
  },
  armRole: {
    ...typography.caption,
    color: colors.accent.base,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  armBullet: {
    ...typography.bodySmall,
    color: colors.text.muted,
    marginBottom: 4,
  },
  armEnergy: {
    ...typography.bodySmall,
    color: colors.accent.base,
    marginTop: 10,
    fontStyle: 'italic',
  },
  qualificationLine: {
    ...typography.body,
    color: colors.text.secondary,
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
  foundersHeading: {
    marginTop: 6,
    marginBottom: 0,
  },
  foundersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 4,
  },
  founderCardSlot: {
    flexGrow: 1,
    flexBasis: 300,
    minWidth: 260,
    maxWidth: 460,
  },
  founderCardInner: {
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: colors.glass.white,
  },
  portraitFrame: {
    width: '100%',
    aspectRatio: 4 / 3,
    overflow: 'hidden',
    backgroundColor: colors.background.recessed,
    position: 'relative',
  },
  portraitImage: {
    width: '100%',
    height: '100%',
  },
  portraitGloss: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        backgroundImage:
          'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.0) 38%, rgba(0,0,0,0.0) 60%, rgba(156,176,113,0.16) 100%)',
      } as object,
      default: {},
    }),
  },
  founderBody: {
    padding: 18,
    gap: 4,
  },
  founderName: {
    ...typography.subheading,
    color: colors.text.primary,
    fontSize: 22,
    lineHeight: 28,
  },
  founderRole: {
    ...typography.caption,
    color: colors.accent.base,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  founderNote: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
});
