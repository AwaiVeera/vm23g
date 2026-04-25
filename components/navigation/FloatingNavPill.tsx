import { Link } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors } from '@/systems/theme/colors';
import { typography } from '@/systems/theme/typography';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/collectives', label: 'Collectives' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/partners', label: 'Partners' },
  { href: '/legal', label: 'Legal' },
] as const;

export function FloatingNavPill() {
  const { width } = useWindowDimensions();
  const show = width < 900;

  if (!show) {
    return null;
  }

  return (
    <View style={styles.shell}>
      <View style={styles.pill}>
        <BlurView intensity={55} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.pillInner}>
          {links.map((item) => (
            <Link key={item.href} href={item.href} asChild>
              <Pressable style={({ pressed }) => [styles.pillLink, pressed && styles.pillPressed]}>
                <Text style={styles.pillText}>{item.label}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 22,
    alignItems: 'center',
    zIndex: 20,
    pointerEvents: 'box-none',
  },
  pill: {
    maxWidth: 640,
    width: '92%',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.strokeGlass,
    overflow: 'hidden',
    backgroundColor: colors.surfaceGlass,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowDeep,
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.9,
        shadowRadius: 28,
      },
      android: { elevation: 16 },
      web: {
        boxShadow: `0 18px 40px ${colors.shadowDeep}`,
      },
      default: {},
    }),
  },
  pillInner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  pillLink: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  pillPressed: {
    backgroundColor: colors.surfaceGlassStrong,
  },
  pillText: {
    ...typography.caption,
    color: colors.oliveGreen,
    textTransform: 'uppercase',
  },
});
