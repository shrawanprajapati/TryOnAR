import React, { createContext, useState, useContext } from 'react';

export const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: any) => {
  // Default to Dark Mode and Neon Blue accent
  const [isDark, setIsDark] = useState(true);
  const [accent, setAccent] = useState('#00E5FF'); 

  // The actual color palette that changes instantly
  const theme = {
    background: isDark ? '#0a0a0a' : '#f2f2f7',
    card: isDark ? '#1a1a1a' : '#ffffff',
    text: isDark ? '#ffffff' : '#000000',
    subText: isDark ? '#888888' : '#8e8e93',
    accent: accent,
  };

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, accent, setAccent, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);