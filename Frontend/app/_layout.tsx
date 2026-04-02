import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProvider } from '../context/auth-context';
import { ThemeProvider as CustomThemeProvider, useTheme } from '../context/ThemeContext';

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

function RootLayoutNav() {
  const { isDark } = useTheme();

  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <WebExtensionNoiseFilter />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding1" />
        <Stack.Screen name="onboarding2" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="home" />
        <Stack.Screen name="product" />
        <Stack.Screen name="tryon" />
        <Stack.Screen name="placement" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </CustomThemeProvider>
  );
}
