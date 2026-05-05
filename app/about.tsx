import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { aboutContent } from '@/cms/content';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';

export default function AboutScreen() {
  return (
    <View style={styles.page}>
      <SectionWrapper asymmetry="center">
        <Text style={styles.heading}>{aboutContent.heading}</Text>
        <GlassCard>
          <Text style={styles.body}>{aboutContent.body}</Text>
        </GlassCard>
      </SectionWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.pearlMatte,
  },
  heading: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: 18,
  },
  body: {
    ...typography.body,
    color: colors.textMuted,
  },
});
