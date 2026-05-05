import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { legalContent } from '@/cms/content';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';

export default function LegalScreen() {
  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionWrapper asymmetry="center">
          <Text style={styles.heading}>{legalContent.heading}</Text>
          <GlassCard>
            <Text style={styles.body}>{legalContent.body}</Text>
          </GlassCard>
        </SectionWrapper>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.pearlMatte,
  },
  content: {
    paddingBottom: 120,
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
