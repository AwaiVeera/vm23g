import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { PageHead } from '@/components/seo/PageHead';
import { GallerySection } from '@/sections/gallery';

export default function GalleryScreen() {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={styles.page}>
      <PageHead
        title="Gallery"
        description="Visual archive of VM23G projects — apps, campaigns, places, people, and AI-driven design systems built for ambitious brands."
        path="/gallery"
      />
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <GallerySection scrollY={scrollY} />
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
