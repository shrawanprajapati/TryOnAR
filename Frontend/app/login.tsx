import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { hexToRgba, useTheme } from '../context/ThemeContext';
import { getAuthErrorMessage } from '../lib/firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const animationRef = useRef<LottieView>(null);
  const { theme, accent, isDark } = useTheme();
  const { completeOnboarding, isAuthenticated, isReady, signIn } = useAuth();

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, isReady, router]);

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn({ email: email.trim(), password });
      await completeOnboarding();
      router.replace('/home');
    } catch (error) {
      Alert.alert('Login failed', getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        <LottieView
          ref={animationRef}
          source={require('../assets/animations/scan-ring.json')}
          autoPlay
          loop
          style={[styles.backgroundAnimation, { opacity: isDark ? 0.4 : 0.28 }]}
          resizeMode="cover"
        />

        <View
          style={[
            styles.overlay,
            { backgroundColor: hexToRgba(theme.background, isDark ? 0.18 : 0.62) },
          ]}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.contentContainer}
      >
        <PageTransition style={styles.card}>
          <Text style={[styles.eyebrow, { color: accent }]}>Backend Connected</Text>
          <Text style={[styles.title, { color: theme.text, textShadowColor: accent }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: theme.subText }]}>
            Sign in to sync your profile, products, and live AR sessions.
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: hexToRgba(theme.card, isDark ? 0.78 : 0.92),
                borderColor: theme.glassBorder,
                color: theme.text,
              },
            ]}
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={theme.subText}
            selectionColor={accent}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: hexToRgba(theme.card, isDark ? 0.78 : 0.92),
                borderColor: theme.glassBorder,
                color: theme.text,
              },
            ]}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={theme.subText}
            selectionColor={accent}
          />

          <TouchableOpacity
            activeOpacity={0.82}
            style={[styles.button, { backgroundColor: accent, shadowColor: accent }]}
            onPress={() => void handleLogin()}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.82}
            style={[
              styles.secondaryButton,
              { borderColor: theme.glassBorder, backgroundColor: theme.glassBg },
            ]}
            onPress={() => router.push('/onboarding1')}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.text }]}>View Onboarding</Text>
          </TouchableOpacity>

          <Text style={[styles.footerText, { color: theme.text }]}>
            Don&apos;t have an account?{' '}
            <Text style={[styles.signupText, { color: accent }]} onPress={() => router.push('/signup')}>
              Sign Up
            </Text>
          </Text>
        </PageTransition>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundAnimation: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  card: {
    borderRadius: 28,
    padding: 24,
    backgroundColor: 'rgba(4, 6, 10, 0.14)',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  input: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  secondaryButton: {
    marginTop: 12,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 25,
    fontSize: 14,
  },
  signupText: {
    fontWeight: 'bold',
  },
});
