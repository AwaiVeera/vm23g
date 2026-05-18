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
    if (document.getElementById('vm23g-global')) return;
    const style = document.createElement('style');
    style.id = 'vm23g-global';
    style.textContent = [
      '* { box-sizing: border-box; }',
      'html, body {',
      '  margin: 0;',
      '  padding: 0;',
      '  background-color: #F4F1EA;',
      '  background-image:',
      '    radial-gradient(ellipse 80% 60% at 18% 8%, rgba(255, 255, 255, 0.55) 0%, transparent 60%),',
      '    radial-gradient(ellipse 70% 55% at 82% 22%, rgba(0, 66, 37, 0.05) 0%, transparent 65%),',
      '    radial-gradient(ellipse 90% 60% at 50% 95%, rgba(31, 42, 36, 0.08) 0%, transparent 70%),',
      '    linear-gradient(180deg, #FAF8F2 0%, #F4F1EA 40%, #ECE7DA 100%);',
      '  background-attachment: fixed;',
      '  background-repeat: no-repeat;',
      '  background-size: cover;',
      '  overflow-x: hidden;',
      '  -webkit-font-smoothing: antialiased;',
      '  -moz-osx-font-smoothing: grayscale;',
      '  color: #003B20;',
      '}',
      '#root { background: transparent !important; }',
      '::-webkit-scrollbar { width: 6px; }',
      '::-webkit-scrollbar-track { background: rgba(244, 241, 234, 0.9); }',
      '::-webkit-scrollbar-thumb { background: rgba(0, 66, 37, 0.35); border-radius: 3px; }',
      '::-webkit-scrollbar-thumb:hover { background: rgba(0, 66, 37, 0.56); }',
    ].join('\n');
    document.head.appendChild(style);
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
          <View style={styles.surface}>
            <Navbar />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: 'transparent',
                  ...Platform.select({
                    web:     { paddingTop: 64 },
                    default: { paddingTop: 0 },
                  }),
                },
                animation: 'fade_from_bottom',
              }}
            />
          </View>
          <View style={styles.rainLayer}>
            <RainOverlay />
          </View>
          <View style={styles.presence}>
            <PresenceLayer />
            <CursorGlow />
          </View>
          <FloatingNavPill />
          <StatusBar style="dark" />
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash:   { flex: 1, backgroundColor: '#F4F1EA' },
  root:     { flex: 1, backgroundColor: 'transparent' },
  surface:  { flex: 1, zIndex: 2, backgroundColor: 'transparent' },
  rainLayer: { ...StyleSheet.absoluteFillObject, zIndex: 3, pointerEvents: 'none' },
  presence: { ...StyleSheet.absoluteFillObject, zIndex: 4, pointerEvents: 'none' },
});
