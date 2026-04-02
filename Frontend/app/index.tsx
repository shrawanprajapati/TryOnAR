import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StatusBar, StyleSheet, View } from 'react-native';

import { useAuth } from '@/context/auth-context';

export default function IndexScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const moveAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(moveAnim, {
      toValue: -40,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      delay: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, moveAnim]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const timer = setTimeout(() => {
      router.replace(user ? '/home' : '/onboarding1');
    }, 1800);

    return () => clearTimeout(timer);
  }, [loading, router, user]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View
        style={{
          transform: [{ translateY: moveAnim }],
          alignItems: 'center',
        }}
      >
        <LottieView
          source={require('../assets/animations/scan-ring.json')}
          autoPlay
          loop
          style={styles.ring}
        />

        <LottieView
          source={require('../assets/animations/face-scan.json')}
          autoPlay
          loop={false}
          style={styles.face}
        />
      </Animated.View>

      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>TryOnAR</Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        Smart vision try-on experience
      </Animated.Text>

      {loading ? <ActivityIndicator style={styles.loader} color="#FFFFFF" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    width: 260,
    height: 300,
    opacity: 1,
  },
  face: {
    width: 200,
    height: 200,
    opacity: 1,
  },
  title: {
    color: '#9966CC',
    fontSize: 28,
    marginTop: 70,
    fontWeight: '700',
    letterSpacing: 1.5,
    textShadowColor: '#9966CC',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitle: {
    color: '#C7C3D7',
    fontSize: 14,
    marginTop: 10,
    letterSpacing: 0.4,
  },
  loader: {
    marginTop: 24,
  },
});
