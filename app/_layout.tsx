import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CursorGlow } from '@/animations/cursorGlow';
import { PresenceLayer } from '@/animations/presenceLayer';
import { RainOverlay } from '@/animations/rainOverlay';
import { FloatingNavPill } from '@/components/navigation/FloatingNavPill';
import { Navbar } from '@/components/navigation/Navbar';
import { usePointerTracker } from '@/systems/motion/pointerTracker';
import { colors } from '@/systems/theme/colors';

SplashScreen.preventAutoHideAsync();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.pearlMatte,
    card: colors.pearlMatte,
    text: colors.textPrimary,
    border: colors.strokeSubtle,
    primary: colors.oliveGreen,
  },
};

export default function RootLayout() {
  usePointerTracker();

  const [loaded] = useFonts({
    Cinzel:          'https://raw.githubusercontent.com/google/fonts/main/ofl/cinzel/Cinzel-Regular.ttf',
    Cinzel_700Bold:  'https://raw.githubusercontent.com/google/fonts/main/ofl/cinzel/Cinzel-Bold.ttf',
    Inter:           'https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter-Regular.ttf',
    Inter_500Medium: 'https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter-Medium.ttf',
  });

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const style = document.createElement('style');
    style.id = 'vm23g-global';
    if (!document.getElementById('vm23g-global')) {
      style.textContent = [
        '* { box-sizing: border-box; }',
        'html, body {',
        '  margin: 0;',
        '  padding: 0;',
        '  background: #F5F3EF;',
        '  overflow-x: hidden;',
        '  -webkit-font-smoothing: antialiased;',
        '  -moz-osx-font-smoothing: grayscale;',
        '}',
        '::-webkit-scrollbar { width: 6px; }',
        '::-webkit-scrollbar-track { background: #F5F3EF; }',
        '::-webkit-scrollbar-thumb { background: rgba(115, 130, 83, 0.35); border-radius: 3px; }',
        '::-webkit-scrollbar-thumb:hover { background: rgba(115, 130, 83, 0.60); }',
      ].join('\n');
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) {
    return <View style={styles.splash} />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navTheme}>
        <View style={styles.root}>
          <RainOverlay />
          <View style={styles.presence}>
            <PresenceLayer />
            <CursorGlow />
          </View>
          <View style={styles.surface}>
            <Navbar />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: colors.pearlMatte,
                  ...Platform.select({
                    web:     { paddingTop: 64 },
                    default: { paddingTop: 0 },
                  }),
                },
                animation: 'fade_from_bottom',
              }}
            />
          </View>
          <FloatingNavPill />
          <StatusBar style="dark" />
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash:   { flex: 1, backgroundColor: '#F5F3EF' },
  root:     { flex: 1, backgroundColor: colors.pearlMatte },
  presence: { ...StyleSheet.absoluteFillObject, zIndex: 1, pointerEvents: 'none' },
  surface:  { flex: 1, zIndex: 2 },
});
