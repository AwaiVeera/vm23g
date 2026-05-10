import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { PageHead } from '@/components/seo/PageHead';
import { CollectivesSection } from '@/sections/collectives';

export default function CollectivesScreen() {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={styles.page}>
      <PageHead
        title="Collectives"
        description="The VM23G Collective — a network of creators, athletes, venues, sponsors, educators, and AI/design/tech collaborators moving with VM23G."
        path="/collectives"
      />
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <CollectivesSection scrollY={scrollY} />
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
