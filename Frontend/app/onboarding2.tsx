import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { height } = Dimensions.get('window');

export default function Onboarding2() {
  const router = useRouter();
  const { completeOnboarding, isAuthenticated } = useAuth();
  const { theme, accent } = useTheme();

  const handleContinue = async () => {
    await completeOnboarding();
    router.replace(isAuthenticated ? '/home' : '/login');
  };

  return (
    <View style={styles.container}>
      <PageTransition style={styles.page}>
        <View style={[styles.badge, { backgroundColor: theme.glassBg, borderColor: theme.glassBorder }]}>
          <Text style={[styles.badgeText, { color: accent }]}>2 / 2</Text>
        </View>

        <View style={styles.animationWrapper}>
          <LottieView
            source={require('../assets/animations/onboarding2_eye.json')}
            autoPlay
            loop
            style={styles.eye}
          />

          <LottieView
            source={require('../assets/animations/hud_circle.json')}
            autoPlay
            loop
            speed={0.6}
            style={styles.hud}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text }]}>Try On With Sync</Text>
          <Text style={[styles.text, { color: theme.subText }]}>
            Login once and keep your profile, saved snapshots, and try-on results connected across the app.
          </Text>
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: theme.glassBorder, backgroundColor: theme.glassBg }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.secondaryText, { color: theme.text }]}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: accent }]}
            onPress={() => void handleContinue()}
          >
            <Text style={styles.nextText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </PageTransition>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  page: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 72,
    paddingBottom: 42,
    paddingHorizontal: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  animationWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height * 0.36,
  },
  eye: {
    width: 230,
    height: 230,
    opacity: 0.78,
  },
  hud: {
    position: 'absolute',
    width: 300,
    height: 300,
    opacity: 0.9,
  },
  textContainer: {
    marginTop: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 14,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '700',
  },
  nextButton: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
