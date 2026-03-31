import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const newTheme = !isDark;
    setIsDark(newTheme);
    await AsyncStorage.setItem('appTheme', newTheme ? 'dark' : 'light');
  };

  const handleSetAccent = async (color: string) => {
    setAccent(color);
    await AsyncStorage.setItem('appAccent', color);
  };

  const theme = {
    background: isDark ? '#0A0A0A' : '#F4F6F9',
    text: isDark ? '#FFFFFF' : '#121212',
    subText: isDark ? '#A0A0A0' : '#6C757D',
    card: isDark ? '#161616' : '#FFFFFF',
    primary: accent,
    tint: hexToRgba(accent, isDark ? 0.2 : 0.1),
    glassBg: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
    glassBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
  };

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