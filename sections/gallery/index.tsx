import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
  AnimatedStyle,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { GlassCard } from '@/components/ui/GlassCard';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { galleryContent, galleryPageContent } from '@/cms/content';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';
import { useParallaxLayerStyle } from '@/systems/motion/parallax';
import { useScrollReveal, useRevealStyle, useStaggeredReveal } from '@/systems/motion/viewport';
import { SECTION_STAGGER } from '@/systems/motion/transitions';
import { useGlowHover } from '@/animations/glowSystem';

type GalleryItem = (typeof galleryPageContent.items)[number];

type GallerySectionProps = {
  scrollY: SharedValue<number>;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function GalleryCard({
  item,
  revealStyle,
}: {
  item: GalleryItem;
  revealStyle: AnimatedStyle<ViewStyle>;
}) {
  const hoverDepth = useSharedValue(0);
  const { glowStyle, onHoverIn, onHoverOut, onPressIn, onPressOut } = useGlowHover('card');

  const cardMotionStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(hoverDepth.value, [0, 1], [0, -4]) },
      { scale: interpolate(hoverDepth.value, [0, 1], [1, 1.012]) },
    ],
  }));

  return (
    <Animated.View style={[revealStyle, styles.cardSlot]}>
      <AnimatedPressable
        style={[glowStyle as AnimatedStyle<ViewStyle>, cardMotionStyle, styles.cardPressable]}
        onHoverIn={() => {
          hoverDepth.value = withTiming(1, { duration: 200 });
          onHoverIn();
        }}
        onHoverOut={() => {
          hoverDepth.value = withTiming(0, { duration: 240 });
          onHoverOut();
        }}
        onPressIn={() => {
          hoverDepth.value = withTiming(1, { duration: 120 });
          onPressIn();
        }}
        onPressOut={() => {
          hoverDepth.value = withTiming(0, { duration: 220 });
          onPressOut();
        }}
      >
        <GlassCard intensity="low" padding={0} borderRadius={20} style={styles.cardInner}>
          <View style={styles.imageFrame}>
            <Image
              source={item.image}
              style={styles.image}
              contentFit="cover"
              accessibilityLabel={`${item.title} — ${item.category}`}
              alt={`${item.title}: ${item.caption}`}
              transition={300}
            />
            <View style={styles.imageMatte} pointerEvents="none" />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.label}>{item.title}</Text>
            <Text style={styles.meta}>Project: {item.project}</Text>
            <Text style={styles.meta}>Category: {item.category}</Text>
            <Text style={styles.meta}>Year: {item.year}</Text>
            {item.status ? <Text style={styles.status}>{item.status}</Text> : null}
            {item.caption ? <Text style={styles.caption}>{item.caption}</Text> : null}
          </View>
        </GlassCard>
      </AnimatedPressable>
    </Animated.View>
  );
}

export function GallerySection({ scrollY }: GallerySectionProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof galleryPageContent.filters)[number]>('All');
  const layer = useParallaxLayerStyle(scrollY, 1);
  const { onLayout, visible } = useScrollReveal(scrollY);

  const filteredItems = useMemo(() => {
    const indexed = galleryPageContent.items.map((item, index) => ({ ...item, index }));
    if (activeFilter === 'All') return indexed;
    return indexed.filter((item) => item.category === activeFilter || item.project === activeFilter);
  }, [activeFilter]);

  const headingReveal = useRevealStyle(visible, 'fadeUp');
  const cardReveals = useStaggeredReveal(
    galleryPageContent.items.length,
    visible,
    SECTION_STAGGER,
    'scaleIn',
  );

  return (
    <SectionWrapper asymmetry="center">
      <View onLayout={onLayout}>
        <Animated.View style={layer}>
          <Animated.Text style={[styles.heading, headingReveal]}>
            {galleryContent.heading}
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, headingReveal]}>
            {galleryPageContent.hero.subtitle}
          </Animated.Text>
          <View style={styles.filterRow}>
            {galleryPageContent.filters.map((filter) => {
              const isActive = filter === activeFilter;
              return (
                <Pressable
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  style={({ hovered, pressed }) => [
                    styles.filterChip,
                    hovered && styles.filterChipHover,
                    pressed && styles.filterChipPressed,
                    isActive && styles.filterChipActive,
                  ]}
                >
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.grid}>
            {filteredItems.map((item) => (
              <GalleryCard
                key={`${item.title}-${item.index}`}
                item={item}
                revealStyle={cardReveals[item.index]}
              />
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
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: 18,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.glass.surface,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterChipActive: {
    backgroundColor: colors.accent.subtle,
    borderColor: colors.accent.base,
  },
  filterChipHover: {
    backgroundColor: colors.glass.surfaceStrong,
    borderColor: colors.accent.muted,
    transform: [{ translateY: -1 }],
  },
  filterChipPressed: {
    transform: [{ scale: 0.98 }],
  },
  filterText: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  filterTextActive: {
    color: colors.accent.light,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  cardSlot: {
    flexGrow: 1,
    flexBasis: 300,
    minWidth: 260,
    maxWidth: 460,
  },
  cardPressable: {
    borderRadius: 20,
    ...Platform.select({
      web: { cursor: 'pointer' as unknown as undefined },
      default: {},
    }),
  },
  cardInner: {
    overflow: 'hidden',
  },
  imageFrame: {
    width: '100%',
    aspectRatio: 4 / 3,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.background.recessed,
  },
  image: {
    width: '100%',
    height: '100%',
    ...Platform.select({
      web: {
        filter: 'saturate(0.95) brightness(0.96) contrast(1.02)',
      } as object,
      default: {},
    }),
  },
  imageMatte: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        backgroundImage:
          'linear-gradient(180deg, rgba(6,7,10,0.04) 0%, rgba(6,7,10,0.12) 60%, rgba(6,7,10,0.42) 100%)',
      } as object,
      default: {
        backgroundColor: 'rgba(6, 7, 10, 0.20)',
      },
    }),
  },
  cardBody: {
    padding: 18,
    gap: 4,
  },
  label: {
    ...typography.subheading,
    color: colors.text.primary,
    fontSize: 19,
    lineHeight: 25,
    marginBottom: 4,
  },
  meta: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: 1,
  },
  status: {
    ...typography.caption,
    color: colors.accent.light,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  caption: {
    ...typography.bodySmall,
    color: colors.text.muted,
    marginTop: 6,
    fontStyle: 'italic',
  },
});
