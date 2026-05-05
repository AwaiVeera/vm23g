import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { PartnersSection } from '@/sections/partners';
import { colors } from '@/systems/theme/colors';

export default function PartnersScreen() {
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
        <PartnersSection scrollY={scrollY} />
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
  content: { paddingBottom: 120 },
});
