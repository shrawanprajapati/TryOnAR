import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import PageTransition from '../components/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import { useTheme } from '../context/ThemeContext';

export default function SupportScreen() {
  const router = useRouter();
  const { theme, accent } = useTheme();

  const faqs = [
    'Use Try Lens for face and body wearables with the live viewer button in results.',
    'Use Detect & Place to scan objects, review candidates, and launch placement live.',
    'Open Settings to switch theme mode or update the accent color across the app.',
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <PageTransition>
        <View style={styles.header}>
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: theme.glassBg, borderColor: theme.glassBorder }]} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Help & Support</Text>
          <View style={{ width: 42 }} />
        </View>

        <GlassCard style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Contact</Text>
          <Text style={[styles.cardText, { color: theme.subText }]}>support@tryonar.app</Text>
          <Text style={[styles.cardText, { color: theme.subText }]}>Mon-Sat, 9:00 AM to 6:00 PM</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.primaryAction, { backgroundColor: accent }]}
              onPress={() => void Linking.openURL('mailto:support@tryonar.app?subject=TryOnAR%20Support')}
            >
              <Text style={styles.primaryText}>Email Support</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryAction, { borderColor: theme.glassBorder }]}
              onPress={() => router.push('/settings')}
            >
              <Text style={[styles.secondaryText, { color: theme.text }]}>Open Settings</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Quick Answers</Text>
          {faqs.map((faq) => (
            <View key={faq} style={styles.faqRow}>
              <Ionicons name="checkmark-circle" size={18} color={accent} style={{ marginTop: 2 }} />
              <Text style={[styles.faqText, { color: theme.text }]}>{faq}</Text>
            </View>
          ))}
        </GlassCard>

        <TouchableOpacity style={[styles.launchButton, { backgroundColor: theme.card, borderColor: theme.glassBorder }]} onPress={() => router.push('/placement')}>
          <Ionicons name="scan-outline" size={20} color={accent} />
          <Text style={[styles.launchText, { color: theme.text }]}>Launch Placement Guide</Text>
        </TouchableOpacity>
      </PageTransition>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  card: { marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  cardText: { fontSize: 14, lineHeight: 20, marginBottom: 6 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  primaryAction: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  secondaryAction: { flex: 1, borderRadius: 12, borderWidth: 1, paddingVertical: 12, alignItems: 'center' },
  primaryText: { color: '#FFFFFF', fontWeight: '800' },
  secondaryText: { fontWeight: '700' },
  faqRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  faqText: { flex: 1, fontSize: 14, lineHeight: 20, marginLeft: 10 },
  launchButton: {
    borderRadius: 16,
    paddingVertical: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  launchText: { marginLeft: 10, fontWeight: '700' },
});
