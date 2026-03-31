import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '../context/auth-context';
import { ThemeProvider as CustomThemeProvider, useTheme } from '../context/ThemeContext';

function RootLayoutNav() {
  const { isDark } = useTheme();

  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
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
