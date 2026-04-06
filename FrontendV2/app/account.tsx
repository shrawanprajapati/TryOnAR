import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import PageTransition from '../components/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useProtectedRoute } from '../hooks/use-protected-route';

export default function AccountScreen() {
  const router = useRouter();
  const { theme, accent } = useTheme();
  const { updateProfile, user } = useAuth();
  const { isAuthenticated, isReady } = useProtectedRoute();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setRole(user?.role || 'AR Creator');
  }, [user]);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Missing details', 'Name and email are required.');
      return;
    }

    setIsSaving(true);

    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        role: role.trim() || 'AR Creator',
      });
      Alert.alert('Saved', 'Profile details updated successfully.');
      router.back();
    } catch (error) {
      Alert.alert(
        'Update failed',
        error instanceof Error ? error.message : 'Could not save your profile details.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isReady) {
    return (
      <View style={[styles.stateScreen, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={accent} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <PageTransition>
        <View style={styles.header}>
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: theme.glassBg, borderColor: theme.glassBorder }]} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Personal Details</Text>
          <View style={{ width: 42 }} />
        </View>

        <GlassCard style={styles.card}>
          <Text style={[styles.label, { color: theme.text }]}>Name</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.glassBorder, backgroundColor: theme.card }]}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={theme.subText}
          />

          <Text style={[styles.label, { color: theme.text }]}>Email</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.glassBorder, backgroundColor: theme.card }]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={theme.subText}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={[styles.label, { color: theme.text }]}>Role</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.glassBorder, backgroundColor: theme.card }]}
            value={role}
            onChangeText={setRole}
            placeholder="Enter your role"
            placeholderTextColor={theme.subText}
          />
        </GlassCard>

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: accent }]} onPress={() => void handleSave()} disabled={isSaving}>
          {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
        </TouchableOpacity>
      </PageTransition>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  stateScreen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  card: { marginBottom: 24 },
  label: { fontSize: 15, fontWeight: '700', marginBottom: 8, marginTop: 8 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, marginBottom: 10 },
  saveButton: { borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
