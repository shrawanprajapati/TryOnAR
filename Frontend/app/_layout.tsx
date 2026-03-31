import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '../context/ThemeContext'; // Adjust path if your context folder is elsewhere
import AnimatedBackground from '../components/AnimatedBackground';

// Create an inner component to consume the theme for the Stack headers/backgrounds
function AppLayout() {
  const { theme, isDark } = useTheme();

  return (
    <AnimatedBackground>
      <Stack
        screenOptions={{
          headerShown: false,
          // CRITICAL: Makes the screens transparent so the animated background shows through!
          contentStyle: { backgroundColor: 'transparent' },
          headerStyle: { backgroundColor: theme.glassBg },
          headerTintColor: theme.text,
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="explore" options={{ title: 'Explore' }} />
        <Stack.Screen name="profile" options={{ title: 'Profile' }} />
        {/* Add your other screens here as needed */}
      </Stack>
    </AnimatedBackground>
  );
}

// The Root Layout wraps everything in the Provider
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}