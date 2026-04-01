import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SystemUI from 'expo-system-ui';
import { Platform } from 'react-native';

export const hexToRgba = (hex: string, alpha: number) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => Promise<void>;
  accent: string;
  setAccent: (color: string) => void;
  theme: { 
    background: string; text: string; subText: string; card: string; 
    primary: string; tint: string; glassBg: string; glassBorder: string;
  };
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(true);
  const [accent, setAccent] = useState('#8A2BE2');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        const savedAccent = await AsyncStorage.getItem('appAccent');
        if (savedTheme === 'light') setIsDark(false);
        if (savedAccent) setAccent(savedAccent);
      } catch (error) { 
        console.log("Error loading theme:", error); 
      } finally { 
        setIsLoaded(true); 
      }
    };
    loadSettings();
  }, []);

  const toggleTheme = async () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);

    try {
      await AsyncStorage.setItem('appTheme', nextIsDark ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const handleSetAccent = async (color: string) => {
    setAccent(color);

    try {
      await AsyncStorage.setItem('appAccent', color);
    } catch (error) {
      console.log('Error saving accent:', error);
    }
  };

  const theme = {
    background: isDark ? '#06080D' : '#F4F6F9',
    text: isDark ? '#F8FAFC' : '#121212',
    subText: isDark ? '#9AA4B2' : '#6C757D',
    card: isDark ? '#11151C' : '#FFFFFF',
    primary: accent,
    tint: hexToRgba(accent, isDark ? 0.2 : 0.1),
    glassBg: isDark ? 'rgba(17, 21, 28, 0.78)' : 'rgba(255, 255, 255, 0.84)',
    glassBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
  };

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const roots = ['root', '__next', 'expo-root']
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => Boolean(element));

      document.documentElement.style.backgroundColor = theme.background;
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
      document.documentElement.style.height = '100%';

      document.body.style.backgroundColor = theme.background;
      document.body.style.color = theme.text;
      document.body.style.margin = '0';
      document.body.style.minHeight = '100vh';

      roots.forEach((root) => {
        root.style.backgroundColor = theme.background;
        root.style.minHeight = '100vh';
      });

      return;
    }

    void SystemUI.setBackgroundColorAsync(theme.background).catch(() => {
      // Some platforms don't allow runtime background updates, so we fail softly.
    });
  }, [isDark, isLoaded, theme.background, theme.text]);

  if (!isLoaded) return null; // Prevent flash of wrong theme

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, accent, setAccent: handleSetAccent, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
