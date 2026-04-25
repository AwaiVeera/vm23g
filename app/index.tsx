import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { AboutSection } from '@/sections/about';
import { AuthorityStatement, ProofMetrics, TrustArchitecture } from '@/sections/authority';
import { CollectivesSection } from '@/sections/collectives';
import { ClientPathway, PremiumCTA } from '@/sections/conversion';
import { GallerySection } from '@/sections/gallery';
import { HeroSection } from '@/sections/hero';
import { PartnersSection } from '@/sections/partners';
import { colors } from '@/systems/theme/colors';

export default function HomeScreen() {
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={styles.page}>
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection scrollY={scrollY} />
        <AuthorityStatement scrollY={scrollY} />
        <ProofMetrics scrollY={scrollY} />
        <CollectivesSection scrollY={scrollY} />
        <ClientPathway scrollY={scrollY} />
        <AboutSection scrollY={scrollY} />
        <GallerySection scrollY={scrollY} />
        <TrustArchitecture scrollY={scrollY} />
        <PartnersSection scrollY={scrollY} />
        <PremiumCTA scrollY={scrollY} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page:    { flex: 1, backgroundColor: colors.pearlMatte },
  scroll:  { flex: 1 },
  content: { paddingBottom: 160 },
});
