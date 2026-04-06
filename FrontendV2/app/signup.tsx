import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { hexToRgba, useTheme } from '../context/ThemeContext';

export default function SignUpScreen() {
  const router = useRouter();
  const { theme, accent, isDark } = useTheme();
  const { completeOnboarding, isAuthenticated, isReady, signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('AR Creator');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, isReady, router]);

  const handleSignUp = async () => {
    if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
      Alert.alert('Missing details', 'Please enter your name, email, and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
        role: role.trim() || 'AR Creator',
      });
      await completeOnboarding();
      router.replace('/home');
    } catch (error) {
      Alert.alert(
        'Sign-up failed',
        error instanceof Error ? error.message : 'Could not create your account.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={StyleSheet.absoluteFillObject}>
        <LottieView
          source={require('../assets/animations/scan-ring.json')}
          autoPlay
          loop
          style={[styles.backgroundAnimation, { opacity: isDark ? 0.38 : 0.26 }]}
          resizeMode="cover"
        />
        <View
          style={[
            styles.overlay,
            { backgroundColor: hexToRgba(theme.background, isDark ? 0.16 : 0.56) },
          ]}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <PageTransition style={styles.card}>
            <Text style={[styles.eyebrow, { color: accent }]}>Create Workspace</Text>
            <Text style={[styles.title, { color: theme.text, textShadowColor: accent }]}>Sign Up</Text>
            <Text style={[styles.subtitle, { color: theme.subText }]}> 
              Start with a synced account so profile data and AR workspace tools come from the
              backend.
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
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={theme.subText}
              selectionColor={accent}
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
              placeholder="Email address"
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
              placeholder="Role"
              value={role}
              onChangeText={setRole}
              placeholderTextColor={theme.subText}
              selectionColor={accent}
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
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={theme.subText}
              selectionColor={accent}
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: accent, shadowColor: accent }]}
              onPress={() => void handleSignUp()}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <Text style={[styles.footerText, { color: theme.text }]}> 
              Already have an account?{' '}
              <Text style={[styles.loginText, { color: accent }]} onPress={() => router.push('/login')}>
                Login
              </Text>
            </Text>
          </PageTransition>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  keyboard: { flex: 1 },
  scrollView: { flex: 1, backgroundColor: 'transparent' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 30 },
  card: {
    borderRadius: 30,
    padding: 24,
    backgroundColor: 'rgba(4, 6, 10, 0.14)',
  },
  backgroundAnimation: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 15,
    marginBottom: 28,
  },
  input: { padding: 18, borderRadius: 15, marginBottom: 16, borderWidth: 1 },
  button: {
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  footerText: { textAlign: 'center', marginTop: 25, fontSize: 14 },
  loginText: { fontWeight: 'bold' },
});

