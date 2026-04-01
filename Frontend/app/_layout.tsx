import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import AnimatedBackground from '../components/AnimatedBackground';

export const unstable_settings = {
  initialRouteName: 'index',
};

function AppLayout() {
  const { theme, isDark } = useTheme();

  return (
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
        <Stack.Screen name="settings" options={{ title: 'Settings', headerShown: false }} />
        <Stack.Screen name="explore" options={{ title: 'Explore', headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: 'Profile', headerShown: false }} />
        <Stack.Screen name="account" options={{ title: 'Account', headerShown: false }} />
        <Stack.Screen name="models" options={{ title: 'Models', headerShown: false }} />
        <Stack.Screen name="snapshots" options={{ title: 'Snapshots', headerShown: false }} />
        <Stack.Screen name="support" options={{ title: 'Support', headerShown: false }} />
        <Stack.Screen name="ruler" options={{ title: 'Ruler', headerShown: false }} />
        <Stack.Screen name="product" options={{ title: 'Product', headerShown: false }} />
        <Stack.Screen name="tryon" options={{ title: 'Try On', headerShown: false }} />
        <Stack.Screen name="placement" options={{ title: 'Placement', headerShown: false }} />
        <Stack.Screen name="result" options={{ title: 'Result', headerShown: false }} />
        <Stack.Screen name="Ecommerce" options={{ title: 'E-Commerce', headerShown: false }} />
      </Stack>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </AnimatedBackground>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
