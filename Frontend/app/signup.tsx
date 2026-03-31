import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useTheme } from '../context/ThemeContext';
import AnimatedBackground from '../components/AnimatedBackground'; // Adjust path if needed

export default function SignUpScreen() {
  const router = useRouter();
  const { theme, accent } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please enter email and password');
    } else {
      router.replace('/home');
    }
  };

  return (
    <AnimatedBackground>
      <View style={StyleSheet.absoluteFillObject}>
        <LottieView
          source={require('../assets/animations/scan-ring.json')}
          autoPlay
          loop
          style={styles.backgroundAnimation}
          resizeMode="cover"
        />
        <View style={[styles.overlay, { backgroundColor: theme.background === '#0A0A0A' ? 'rgba(10, 10, 10, 0.6)' : 'rgba(244, 246, 249, 0.8)' }]} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.title, { color: theme.text, textShadowColor: accent }]}>Sign Up</Text>

          <TextInput
            style={[styles.input, { backgroundColor: theme.glassBg, borderColor: accent, color: theme.text }]}
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={theme.subText}
            selectionColor={accent}
            keyboardType="email-address"
          />

          <TextInput
            style={[styles.input, { backgroundColor: theme.glassBg, borderColor: accent, color: theme.text }]}
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={theme.subText}
            selectionColor={accent}
          />

          <TouchableOpacity style={[styles.button, { backgroundColor: accent, shadowColor: accent }]} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={[styles.footerText, { color: theme.text }]}>
            Already have an account?{' '}
            <Text style={[styles.loginText, { color: accent }]} onPress={() => router.push('/login')}>
              Login
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 30 },
  backgroundAnimation: { width: '100%', height: '100%', opacity: 0.4 },
  overlay: { ...StyleSheet.absoluteFillObject },
  title: { fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 15 },
  input: { padding: 18, borderRadius: 15, marginBottom: 20, borderWidth: 1 },
  button: { paddingVertical: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, elevation: 5, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  buttonText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  footerText: { textAlign: 'center', marginTop: 25, fontSize: 14 },
  loginText: { fontWeight: 'bold' },
});