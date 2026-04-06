import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import 'react-native-reanimated';

import AnimatedBackground from '../components/AnimatedBackground';
import { AuthProvider as AppAuthProvider } from '../context/AuthContext';
import { AuthProvider as FirebaseAuthProvider } from '../context/auth-context';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

function WebExtensionNoiseFilter() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const shouldIgnore = (value: unknown) => {
      const text =
        value instanceof Error
          ? `${value.message}\n${value.stack ?? ''}`
          : typeof value === 'string'
            ? value
            : JSON.stringify(value);

      return (
        text.includes('Failed to connect to MetaMask') ||
        text.includes('chrome-extension://') ||
        text.includes('inpage.js')
      );
    };

    const handleError = (event: ErrorEvent) => {
      if (shouldIgnore(event.error ?? event.message)) {
        event.preventDefault();
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      if (shouldIgnore(event.reason)) {
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return null;
}

function AppLayout() {
  const { theme, isDark } = useTheme();

  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <WebExtensionNoiseFilter />
      <AnimatedBackground>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
            contentStyle: { backgroundColor: 'transparent' },
            headerStyle: { backgroundColor: theme.glassBg },
            headerTintColor: theme.text,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding1" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding2" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="explore" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="account" options={{ headerShown: false }} />
          <Stack.Screen name="models" options={{ headerShown: false }} />
          <Stack.Screen name="snapshots" options={{ headerShown: false }} />
          <Stack.Screen name="support" options={{ headerShown: false }} />
          <Stack.Screen name="ruler" options={{ headerShown: false }} />
          <Stack.Screen name="product" options={{ headerShown: false }} />
          <Stack.Screen name="tryon" options={{ headerShown: false }} />
          <Stack.Screen name="placement" options={{ headerShown: false }} />
          <Stack.Screen name="result" options={{ headerShown: false }} />
          <Stack.Screen name="Ecommerce" options={{ headerShown: false }} />
        </Stack>
      </AnimatedBackground>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <FirebaseAuthProvider>
        <AppAuthProvider>
          <AppLayout />
        </AppAuthProvider>
      </FirebaseAuthProvider>
    </ThemeProvider>
  );
}
