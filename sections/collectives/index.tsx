import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';

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
  const brandReveal   = useRevealStyle(visible, 'fadeUp');

  return (
    <SectionWrapper asymmetry="left">
      <View style={styles.stack}>
        <View onLayout={onLayout}>
          <Animated.View style={layer}>
            <Animated.Text style={[styles.heading, headingReveal]}>
              {collectivesContent.heading}
            </Animated.Text>
            <Animated.Text style={[styles.brandLine, brandReveal]}>
              {collectivesPageContent.hero.brandLine}
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
          <Text style={styles.ecosystem}>{collectivesPageContent.ecosystem}</Text>
          <Text style={styles.mission}>{collectivesPageContent.mission}</Text>
        </RevealCard>

        <View style={styles.tilesGrid}>
          {collectivesPageContent.featureTiles.map((tile, i) => (
            <RevealCard
              key={tile.key}
              scrollY={scrollY}
              depth={i % 2 === 0 ? 0.18 : -0.18}
              variant={i % 2 === 0 ? 'slideLeft' : 'slideRight'}
              intensity="high"
              padding={0}
              borderRadius={22}
              style={styles.tileSlot}
            >
              <View style={styles.tileInner}>
                <View style={styles.tileImageFrame}>
                  <Image
                    source={tile.image}
                    style={styles.tileImage}
                    contentFit="cover"
                    accessibilityLabel={`${tile.title} — ${tile.tag}`}
                    alt={`${tile.title}: ${tile.caption}`}
                    transition={300}
                  />
                  <View style={styles.tileMatte} pointerEvents="none" />
                  <View style={styles.tileTopGloss} pointerEvents="none" />
                </View>
                <View style={styles.tileBody}>
                  <Text style={styles.tileTag}>{tile.tag}</Text>
                  <Text style={styles.tileTitle}>{tile.title}</Text>
                  <Text style={styles.tileCaption}>{tile.caption}</Text>
                </View>
              </View>
            </RevealCard>
          ))}
        </View>
      </View>
    </SectionWrapper>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 28,
  },
  heading: {
    ...typography.display,
    color: colors.text.primary,
    marginBottom: 8,
  },
  brandLine: {
    ...typography.caption,
    color: colors.accent.light,
    letterSpacing: 2.4,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  body: {
    ...typography.body,
    color: colors.text.primary,
  },
  ecosystem: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: 14,
    fontStyle: 'italic',
  },
  mission: {
    ...typography.bodySmall,
    color: colors.text.muted,
    marginTop: 14,
  },

  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 4,
  },
  tileSlot: {
    flexGrow: 1,
    flexBasis: 300,
    minWidth: 260,
    maxWidth: 420,
  },
  tileInner: {
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: colors.glass.white,
  },
  tileImageFrame: {
    width: '100%',
    aspectRatio: 4 / 3,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.background.recessed,
  },
  tileImage: {
    width: '100%',
    height: '100%',
    ...Platform.select({
      web: {
        filter: 'saturate(0.92) brightness(0.94) contrast(1.02)',
      } as object,
      default: {},
    }),
  },
  tileMatte: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        backgroundImage:
          'linear-gradient(180deg, rgba(6,7,10,0.05) 0%, rgba(6,7,10,0.18) 55%, rgba(6,7,10,0.55) 100%)',
      } as object,
      default: {
        backgroundColor: 'rgba(6, 7, 10, 0.28)',
      },
    }),
  },
  tileTopGloss: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        backgroundImage:
          'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 30%, rgba(156,176,113,0) 70%, rgba(156,176,113,0.14) 100%)',
      } as object,
      default: {},
    }),
  },
  tileBody: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 6,
  },
  tileTag: {
    ...typography.caption,
    color: colors.accent.base,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    fontSize: 10,
  },
  tileTitle: {
    ...typography.subheading,
    color: colors.text.primary,
    fontSize: 20,
    lineHeight: 26,
  },
  tileCaption: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
});
