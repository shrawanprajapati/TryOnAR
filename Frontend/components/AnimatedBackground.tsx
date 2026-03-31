import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function AnimatedBackground({ children }: { children: React.ReactNode }) {
  const { theme, accent } = useTheme();
  
  const orb1 = useRef(new Animated.Value(0)).current;
  const orb2 = useRef(new Animated.Value(0)).current;
  const orb3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (animValue: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, { toValue: 1, duration, useNativeDriver: true }),
          Animated.timing(animValue, { toValue: 0, duration, useNativeDriver: true })
        ])
      );
    };

    createAnimation(orb1, 8000).start();
    createAnimation(orb2, 12000).start();
    createAnimation(orb3, 10000).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Orb 1: Accent Color */}
      <Animated.View style={[
        styles.orb, { backgroundColor: accent, top: -height * 0.1, left: -width * 0.2 },
        {
          opacity: orb1.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.18] }),
          transform: [
            { translateX: orb1.interpolate({ inputRange: [0, 1], outputRange: [0, width * 0.4] }) },
            { translateY: orb1.interpolate({ inputRange: [0, 1], outputRange: [0, height * 0.3] }) },
            { scale: orb1.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] }) }
          ]
        }
      ]} />
      
      {/* Orb 2: Theme Text Color */}
      <Animated.View style={[
        styles.orb, { backgroundColor: theme.text, bottom: -height * 0.1, right: -width * 0.2 },
        {
          opacity: orb2.interpolate({ inputRange: [0, 1], outputRange: [0.03, 0.08] }),
          transform: [
            { translateX: orb2.interpolate({ inputRange: [0, 1], outputRange: [0, -width * 0.3] }) },
            { translateY: orb2.interpolate({ inputRange: [0, 1], outputRange: [0, -height * 0.4] }) },
            { scale: orb2.interpolate({ inputRange: [0, 1], outputRange: [1.2, 0.8] }) }
          ]
        }
      ]} />

      {/* Orb 3: Accent Color (Secondary) */}
      <Animated.View style={[
        styles.orb, { backgroundColor: accent, top: height * 0.4, left: width * 0.5 },
        {
          opacity: orb3.interpolate({ inputRange: [0, 1], outputRange: [0.05, 0.12] }),
          transform: [
            { translateX: orb3.interpolate({ inputRange: [0, 1], outputRange: [0, -width * 0.5] }) },
            { translateY: orb3.interpolate({ inputRange: [0, 1], outputRange: [0, height * 0.2] }) },
            { scale: orb3.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.5] }) }
          ]
        }
      ]} />

      <View style={StyleSheet.absoluteFill}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  orb: { position: 'absolute', width: width * 0.9, height: width * 0.9, borderRadius: width * 0.45, filter: 'blur(70px)' },
});