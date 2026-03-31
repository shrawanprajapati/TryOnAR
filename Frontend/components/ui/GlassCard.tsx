import React from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  style?: object;
}

export default function GlassCard({ children, style, ...props }: GlassCardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.glassBg,
          borderColor: theme.glassBorder,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    // Platform specific shadows to prevent web warnings seen in your terminal
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 10px 15px rgba(0,0,0,0.1)' as any, // Standard CSS for web
      },
    }),
  },
});