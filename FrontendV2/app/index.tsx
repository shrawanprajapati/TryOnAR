import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';

import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Index() {
  const router = useRouter();
  const { theme, accent, isDark } = useTheme();
  const { isAuthenticated, isReady, onboardingComplete } = useAuth();

  const moveAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide animation for the Lottie icons
    Animated.timing(moveAnim, {
      toValue: -40,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Fade-in animation for the text
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      delay: 1000,
      useNativeDriver: true,
    }).start();

    if (!isReady) {
      return () => undefined;
    }

    const timer = setTimeout(() => {
      if (!onboardingComplete) {
        router.replace('/onboarding1');
        return;
      }

      router.replace(isAuthenticated ? '/home' : '/login');
    }, 2600);

    return () => clearTimeout(timer);
  }, [fadeAnim, isAuthenticated, isReady, moveAnim, onboardingComplete, router]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <PageTransition style={styles.page}>
        <Animated.View style={[styles.animationContainer, { transform: [{ translateY: moveAnim }] }]}>
          <LottieView
            source={require('../assets/animations/scan-ring.json')}
            autoPlay
            loop
            style={styles.scanRing}
          />

          <LottieView
            source={require('../assets/animations/face-scan.json')}
            autoPlay
            loop={false}
            style={styles.faceScan}
          />
        </Animated.View>

        <Animated.Text
          style={[styles.title, { opacity: fadeAnim, color: accent, textShadowColor: accent }]}
        >
          Smart Vision AR
        </Animated.Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>
          Live try-on, object placement, and synced profile data in one AR workspace.
        </Text>
      </PageTransition>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationContainer: {
    position: 'relative',
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanRing: {
    position: 'absolute',
    width: 300,
    height: 300,
    opacity: 1.0,
  },
  faceScan: {
    width: 200,
    height: 200,
    opacity: 1.0,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    marginTop: 70,
    fontWeight: '600',
    letterSpacing: 1.5,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitle: {
    marginTop: 16,
    maxWidth: 280,
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 14,
  },
});
