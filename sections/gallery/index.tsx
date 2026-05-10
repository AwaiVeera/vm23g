import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SharedValue } from 'react-native-reanimated';

import { GlassCard } from '@/components/ui/GlassCard';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { galleryContent, galleryPageContent } from '@/cms/content';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';
import { useParallaxLayerStyle } from '@/systems/motion/parallax';
import { useScrollReveal, useRevealStyle, useStaggeredReveal } from '@/systems/motion/viewport';
import { SECTION_STAGGER } from '@/systems/motion/transitions';
import { useGlowHover } from '@/animations/glowSystem';

type GallerySectionProps = {
  scrollY: SharedValue<number>;
};

function GalleryCard({
  title,
  project,
  category,
  year,
  status,
  caption,
  revealStyle,
}: {
  title: string;
  project: string;
  category: string;
  year: string;
  status: string;
  caption: string;
  revealStyle: AnimatedStyle<ViewStyle>;
}) {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const hoverDepth = useSharedValue(0);
  const { glowStyle, onHoverIn, onHoverOut, onPressIn, onPressOut } = useGlowHover('card');

  const cardMotionStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(hoverDepth.value, [0, 1], [0, -4]) },
      { scale: interpolate(hoverDepth.value, [0, 1], [1, 1.01]) },
    ],
  }));

  return (
    <Animated.View style={[revealStyle, styles.card]}>
      <GlassCard style={styles.cardInner}>
        <AnimatedPressable
          style={[styles.frame, glowStyle as AnimatedStyle<ViewStyle>, cardMotionStyle]}
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
        />
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.meta}>Project: {project}</Text>
        <Text style={styles.meta}>Category: {category}</Text>
        <Text style={styles.meta}>Year: {year}</Text>
        <Text style={styles.status}>Status: {status}</Text>
        <Text style={styles.caption}>{caption}</Text>
      </GlassCard>
    </Animated.View>
  );
}

export function GallerySection({ scrollY }: GallerySectionProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof galleryPageContent.filters)[number]>('All');
  const layer = useParallaxLayerStyle(scrollY, 1);
  const { onLayout, visible } = useScrollReveal(scrollY);

  const filteredItems = useMemo(() => {
    const indexed = galleryPageContent.items.map((item, index) => ({ ...item, index }));
    if (activeFilter === 'All') {
      return indexed;
    }
    return indexed.filter(
      (item) => item.category === activeFilter || item.project === activeFilter,
    );
  }, [activeFilter]);

  const headingReveal = useRevealStyle(visible, 'fadeUp');
  const cardReveals   = useStaggeredReveal(
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
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{filter}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.grid}>
            {filteredItems.map((item) => (
              <GalleryCard
                key={`${item.title}-${item.index}`}
                title={item.title}
                project={item.project}
                category={item.category}
                year={item.year}
                status={item.status}
                caption={item.caption}
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
    marginBottom: 14,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
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
    backgroundColor: colors.glass.white,
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
  },
  filterTextActive: {
    color: colors.accent.base,
  },
  grid: {
    gap: 12,
  },
  card: {
    width: '100%',
  },
  cardInner: {
    width: '100%',
  },
  frame: {
    height: 110,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.strokeSubtle,
    backgroundColor: colors.surfaceGlass,
    marginBottom: 12,
  },
  label: {
    ...typography.subtitle,
    color: colors.text.primary,
  },
  meta: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: 2,
  },
  status: {
    ...typography.caption,
    color: colors.accent.base,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  caption: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: 2,
  },
});
