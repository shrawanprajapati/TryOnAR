import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/context/auth-context';
import { getAuthErrorMessage } from '@/lib/firebase';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user, signUp } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace('/home');
    }
  }, [router, user]);

  async function handleSignUp() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    if (password.trim().length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      await signUp(email, password);
      router.replace('/home');
    } catch (error) {
      Alert.alert('Sign up failed', getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={StyleSheet.absoluteFillObject}>
        <LottieView
          source={require('../assets/animations/scan-ring.json')}
          autoPlay
          loop
          style={styles.backgroundAnimation}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Sign Up</Text>

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

          <TouchableOpacity style={[styles.button, submitting && styles.buttonDisabled]} onPress={handleSignUp} disabled={submitting}>
            {submitting ? <ActivityIndicator color="#F5F7FB" /> : <Text style={styles.buttonText}>Sign Up</Text>}
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.loginText} onPress={() => router.push('/login')}>
              Login
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30,
  },
  backgroundAnimation: {
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 10, 0.2)',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F5F7FB',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: '#9966CC',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  input: {
    backgroundColor: 'rgba(20, 20, 20, 0.7)',
    padding: 18,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#9966CC',
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#9966CC',
    paddingVertical: 18,
    borderRadius: 15,
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
    color: '#F5F7FB',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 25,
    color: '#F5F7FB',
    fontSize: 14,
  },
  loginText: {
    color: '#9966CC',
    fontWeight: 'bold',
  },
});
