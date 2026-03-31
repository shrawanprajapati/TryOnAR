import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/context/auth-context';
import { getAuthErrorMessage } from '@/lib/firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const animationRef = useRef<LottieView>(null);
  const { user, signIn } = useAuth();

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  useEffect(() => {
    if (user) {
      router.replace('/home');
    }
  }, [router, user]);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      setSubmitting(true);
      await signIn(email, password);
      router.replace('/home');
    } catch (error) {
      Alert.alert('Login failed', getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        <LottieView
          ref={animationRef}
          source={require('../assets/animations/scan-ring.json')}
          autoPlay
          loop
          style={styles.backgroundAnimation}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.contentContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#9CA3AF"
          selectionColor="#9966CC"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#9CA3AF"
          selectionColor="#9966CC"
        />

        <TouchableOpacity activeOpacity={0.8} style={[styles.button, submitting && styles.buttonDisabled]} onPress={handleLogin} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don&apos;t have an account?{' '}
          <Text style={styles.signupText} onPress={() => router.push('/signup')}>
            Sign Up
          </Text>
        </Text>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  backgroundAnimation: {
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 10, 0.05)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Poppins-bold',
    textShadowColor: '#9966CC',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    fontFamily: 'Poppins-bold',
    marginBottom: 30,
    textShadowColor: '#9966CC',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  input: {
    backgroundColor: 'rgba(20, 20, 20, 0.7)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#9966CC',
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#9966CC',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
    shadowColor: '#9966CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 25,
    color: '#FFFFFF',
    fontSize: 14,
  },
  signupText: {
    color: '#9966CC',
    fontWeight: 'bold',
  },
});
