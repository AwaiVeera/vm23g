import { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import { RevealCard } from '@/components/ui/RevealCard';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { legalPageContent } from '@/cms/content';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';
import { useParallaxLayerStyle } from '@/systems/motion/parallax';
import { useRevealStyle, useScrollReveal } from '@/systems/motion/viewport';

const LEGAL_ENTITY_ROWS = [
  { label: 'Legal entity name', value: legalPageContent.legalEntity.legalEntityName },
  { label: 'Trading name', value: legalPageContent.legalEntity.tradingName },
  { label: 'UEN', value: legalPageContent.legalEntity.uen },
  { label: 'Registered address', value: legalPageContent.legalEntity.registeredAddress },
  { label: 'Contact email', value: legalPageContent.legalEntity.contactEmail },
  { label: 'DPO contact', value: legalPageContent.legalEntity.dpoContact },
  { label: 'Governing law', value: legalPageContent.legalEntity.governingLaw },
  { label: 'Payment terms', value: legalPageContent.legalEntity.paymentTerms },
  { label: 'Refund policy', value: legalPageContent.legalEntity.refundPolicy },
  { label: 'Coaching disclaimer', value: legalPageContent.legalEntity.coachingDisclaimer },
  { label: 'AI services disclaimer', value: legalPageContent.legalEntity.aiServicesDisclaimer },
  { label: 'Data retention period', value: legalPageContent.legalEntity.dataRetentionPeriod },
  { label: 'Third-party processors', value: legalPageContent.legalEntity.thirdPartyProcessors },
  { label: 'Analytics tools', value: legalPageContent.legalEntity.analyticsTools },
  { label: 'Marketing tools', value: legalPageContent.legalEntity.marketingTools },
  { label: 'Cookie tools', value: legalPageContent.legalEntity.cookieTools },
] as const;

function LegalHero({ scrollY }: { scrollY: SharedValue<number> }) {
  const layer = useParallaxLayerStyle(scrollY, -0.4);
  const { onLayout, visible } = useScrollReveal(scrollY);
  const headingReveal = useRevealStyle(visible, 'slideLeft');
  const subtitleReveal = useRevealStyle(visible, 'fadeUp');

  return (
    <View onLayout={onLayout}>
      <Animated.View style={layer}>
        <Animated.Text style={[styles.heading, headingReveal]}>
          {legalPageContent.heading}
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, subtitleReveal]}>
          {legalPageContent.subheading}
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

export default function LegalScreen() {
  const scrollY = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({});

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const jumpToSection = (key: string) => {
    const y = sectionOffsets.current[key];
    if (typeof y === 'number') {
      (scrollRef.current as unknown as ScrollView | null)?.scrollTo({
        y: Math.max(y - 24, 0),
        animated: true,
      });
    }
  };

  return (
    <View style={styles.page}>
      <Animated.ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <SectionWrapper asymmetry="center">
          <View style={styles.stack}>
            <LegalHero scrollY={scrollY} />

            <RevealCard
              scrollY={scrollY}
              depth={-0.2}
              variant="fadeUp"
              intensity="high"
              padding={26}
              borderRadius={22}
              hover={false}
            >
              <Text style={styles.notice}>{legalPageContent.templateNotice}</Text>
              <Text style={styles.lastUpdated}>Last updated: {legalPageContent.lastUpdated}</Text>
            </RevealCard>

            <RevealCard
              scrollY={scrollY}
              depth={0.2}
              variant="fadeUp"
              intensity="medium"
              padding={26}
              borderRadius={22}
            >
              <Text style={styles.sectionTitle}>Legal Entity Details</Text>
              {LEGAL_ENTITY_ROWS.map((item) => (
                <View key={item.label} style={styles.row}>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <Text style={styles.rowValue}>{item.value}</Text>
                </View>
              ))}
            </RevealCard>

            <RevealCard
              scrollY={scrollY}
              depth={-0.15}
              variant="scaleIn"
              intensity="medium"
              padding={22}
              borderRadius={22}
              hover={false}
            >
              <Text style={styles.sectionTitle}>Jump To Section</Text>
              <View style={styles.navChips}>
                {legalPageContent.sections.map((section) => (
                  <Pressable
                    key={section.key}
                    style={({ hovered, pressed }) => [
                      styles.navChip,
                      hovered && styles.navChipHover,
                      pressed && styles.navChipPressed,
                    ]}
                    onPress={() => jumpToSection(section.key)}
                  >
                    <Text style={styles.navChipText}>{section.title}</Text>
                  </Pressable>
                ))}
              </View>
            </RevealCard>

            {legalPageContent.sections.map((section, idx) => (
              <View
                key={section.key}
                onLayout={(event) => {
                  sectionOffsets.current[section.key] = event.nativeEvent.layout.y;
                }}
              >
                <RevealCard
                  scrollY={scrollY}
                  depth={idx % 2 === 0 ? 0.18 : -0.18}
                  variant={idx % 2 === 0 ? 'slideLeft' : 'slideRight'}
                  intensity="medium"
                  padding={26}
                  borderRadius={22}
                >
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  {section.body.map((line) => (
                    <Text key={line} style={styles.body}>
                      · {line}
                    </Text>
                  ))}
                </RevealCard>
              </View>
            ))}

            <RevealCard
              scrollY={scrollY}
              depth={-0.1}
              variant="fadeUp"
              intensity="low"
              padding={22}
              borderRadius={20}
              hover={false}
            >
              <Text style={styles.sectionTitle}>Singapore Reference Sources</Text>
              {legalPageContent.singaporeSources.map((source) => (
                <Text key={source} style={styles.sourceLine}>
                  · {source}
                </Text>
              ))}
            </RevealCard>
          </View>
        </SectionWrapper>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.pearlMatte,
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 160 },
  stack: { gap: 18 },
  heading: {
    ...typography.display,
    color: colors.text.primary,
    marginBottom: 12,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  notice: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: 10,
  },
  lastUpdated: {
    ...typography.caption,
    color: colors.accent.base,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.accent.base,
    marginBottom: 14,
  },
  row: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.subtle,
  },
  rowLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
  },
  rowValue: {
    ...typography.bodySmall,
    color: colors.text.primary,
    marginTop: 2,
  },
  navChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  navChip: {
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: 999,
    backgroundColor: colors.glass.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navChipHover: {
    borderColor: colors.accent.base,
    backgroundColor: colors.accent.subtle,
    transform: [{ translateY: -1 }],
  },
  navChipPressed: {
    transform: [{ scale: 0.98 }],
  },
  navChipText: {
    ...typography.caption,
    color: colors.accent.base,
    textTransform: 'uppercase',
  },
  body: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  sourceLine: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: 6,
  },
});
