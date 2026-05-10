import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { GlowButton } from '@/components/ui/GlowButton';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';

export default function FormsScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [businessEnquiry, setBusinessEnquiry] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <View style={styles.page}>
      <Animated.ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionWrapper asymmetry="center">
          <View style={styles.stack}>
            <Text style={styles.micro}>ENTER THE SYSTEM</Text>
            <Text style={styles.heading}>Business Enquiry Form</Text>
            <Text style={styles.subtitle}>
              Fill in your details below. The send action is a placeholder for now and will be connected to your backend later.
            </Text>

            <View style={styles.formCard}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your full name"
                  placeholderTextColor={colors.text.muted}
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@company.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={colors.text.muted}
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Mobile</Text>
                <TextInput
                  value={mobile}
                  onChangeText={setMobile}
                  placeholder="+65 0000 0000"
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.text.muted}
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Business Enquiry</Text>
                <TextInput
                  value={businessEnquiry}
                  onChangeText={setBusinessEnquiry}
                  placeholder="Tell us about your project goals, timeline, and expected outcomes."
                  placeholderTextColor={colors.text.muted}
                  style={[styles.input, styles.textArea]}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.ctaWrap}>
                <GlowButton label="Send Enquiry (Placeholder)" onPress={() => setSubmitted(true)} />
              </View>

              {submitted ? (
                <Text style={styles.success}>
                  Placeholder submitted. Next step: connect this button to your real form handler or API endpoint.
                </Text>
              ) : null}
            </View>
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 160,
  },
  stack: {
    gap: 14,
  },
  micro: {
    ...typography.microLabel,
    color: colors.accent.base,
  },
  heading: {
    ...typography.display,
    color: colors.text.primary,
    maxWidth: 900,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.text.secondary,
    maxWidth: 760,
    marginBottom: 4,
  },
  formCard: {
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.glass.white,
    borderRadius: 24,
    padding: 22,
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    ...typography.caption,
    color: colors.accent.base,
    textTransform: 'uppercase',
  },
  input: {
    ...typography.body,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: 14,
    backgroundColor: colors.background.elevated,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  textArea: {
    minHeight: 148,
  },
  ctaWrap: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  success: {
    ...typography.bodySmall,
    color: colors.accent.base,
    marginTop: 4,
  },
});
