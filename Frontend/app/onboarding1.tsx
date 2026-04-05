import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { height } = Dimensions.get('window');

export default function Onboarding1() {
  const router = useRouter();
  const { theme, accent } = useTheme();
  const { completeOnboarding } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <PageTransition style={styles.page}>
        <View style={[styles.badge, { backgroundColor: theme.glassBg, borderColor: theme.glassBorder }]}>
          <Text style={[styles.badgeText, { color: accent }]}>1 / 2</Text>
        </View>

        <View style={styles.animationContainer}>
          <LottieView
            source={require('../assets/animations/sparkles.json')}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text }]}>Place Objects Live</Text>
          <Text style={[styles.text, { color: theme.subText }]}>
            Scan your room, detect anchor surfaces, and launch a live placement viewer for decor and objects.
          </Text>
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: theme.glassBorder, backgroundColor: theme.glassBg }]}
            onPress={async () => {
              await completeOnboarding();
              router.replace('/login');
            }}
          >
            <Text style={[styles.secondaryText, { color: theme.text }]}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: accent }]}
            onPress={() => router.push('/onboarding2')}
          >
            <Text style={styles.nextText}>Next</Text>
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
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.04,
  },
  animation: {
    width: 320,
    height: 320,
    opacity: 0.85,
  },
  textContainer: {
    marginTop: 12,
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
