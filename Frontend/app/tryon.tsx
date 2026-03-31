import React from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

import { aiViewerUrl } from '@/lib/api';
import { useTheme } from '../context/ThemeContext';

export default function TryOnScreen() {
  const router = useRouter();
  const { theme, accent } = useTheme();

  async function openAiViewer() {
    try {
      await WebBrowser.openBrowserAsync(aiViewerUrl);
    } catch (error) {
      Alert.alert('Unable to open AI viewer', error instanceof Error ? error.message : 'Please ensure the backend is running.');
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>Virtual Try-On</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: accent }]}>
        <Text style={[styles.badge, { color: accent }]}>AI VIEWER READY</Text>
        <Text style={[styles.heading, { color: theme.text }]}>Open the glasses try-on module</Text>
        <Text style={[styles.body, { color: theme.subText }]}>
          The AI module in this repo is a web-based viewer. The backend now serves it at `/ai-viewer/`, and this screen opens it for testing.
        </Text>

        <Pressable style={[styles.primaryButton, { backgroundColor: accent }]} onPress={openAiViewer}>
          <Text style={styles.primaryButtonText}>Launch AI Viewer</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16 },
  backButton: { padding: 4 },
  title: { fontSize: 24, fontWeight: '800' },
  card: { marginTop: 20, borderWidth: 1, borderRadius: 24, padding: 24, gap: 14 },
  badge: { fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  heading: { fontSize: 24, fontWeight: '800' },
  body: { fontSize: 15, lineHeight: 22 },
  primaryButton: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
