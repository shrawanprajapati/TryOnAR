import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// 1. Import our custom Theme Provider
import { ThemeProvider as CustomThemeProvider, useTheme } from '../context/ThemeContext'; 

export const unstable_settings = {
  anchor: '(tabs)',
};

// 2. We move your exact Stack into a sub-component so it can read our new dynamic theme
function RootLayoutNav() {
  const { isDark } = useTheme(); // Read the dynamic dark mode from Settings!

  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* YOUR PREVIOUS CODE IS 100% SAFE HERE */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </NavThemeProvider>
  );
}

// 3. Wrap everything in our CustomThemeProvider
export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <RootLayoutNav />
    </CustomThemeProvider>
  );
}