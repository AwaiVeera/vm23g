import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { PageHead } from '@/components/seo/PageHead';
import { AboutSection } from '@/sections/about';

const ABOUT_JSONLD = [
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About VM23G',
    url: 'https://vm23g.com/about',
    description:
      'Founded by Awai Veera and Summan Veera, VM23G blends executive business experience with certified expertise in Generative AI design and workflow automation.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Summan Misir Veera',
    jobTitle: 'Founder, Managing Director',
    worksFor: { '@type': 'Organization', name: 'VM23G', url: 'https://vm23g.com' },
    description:
      'Elite sales instinct, commercial discipline, and high-conversion strategy. Leads brand direction, partnerships, and growth across the VM23G group.',
    image: 'https://vm23g.com/og-cover.jpg',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Tinesh Awai Veera',
    jobTitle: 'Co-Founder',
    worksFor: { '@type': 'Organization', name: 'VM23G', url: 'https://vm23g.com' },
    description:
      '18+ years in nightlife, leadership, and revenue transformation, scaling venues from modest turnover to multimillion-dollar performance. Drives operational systems, AI-enhanced coaching, and movement intelligence.',
    image: 'https://vm23g.com/og-cover.jpg',
  },
];

export default function AboutScreen() {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={styles.page}>
      <PageHead
        title="About"
        description="Meet the founders of VM23G — Summan Misir Veera and Tinesh Awai Veera. Singapore-based group blending executive experience with Generative AI, workflow automation, and AI-enhanced coaching."
        path="/about"
        jsonLd={ABOUT_JSONLD}
      />
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <AboutSection scrollY={scrollY} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 120 },
});
