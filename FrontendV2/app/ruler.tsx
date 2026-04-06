import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import PageTransition from '../components/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import { useTheme } from '../context/ThemeContext';

export default function RulerScreen() {
  const router = useRouter();
  const { theme, accent } = useTheme();

  const steps = [
    'Stand back so the floor or tabletop is visible in frame.',
    'Use Detect & Place to lock onto a flat surface before comparing size.',
    'Open the live viewer to judge width, height, and spacing with the anchor grid.',
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <PageTransition>
        <View style={styles.header}>
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: theme.glassBg, borderColor: theme.glassBorder }]} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>AR Ruler</Text>
          <View style={{ width: 42 }} />
        </View>

        <GlassCard style={styles.card}>
          <Ionicons name="resize-outline" size={28} color={accent} />
          <Text style={[styles.title, { color: theme.text }]}>Measurement Ready</Text>
          <Text style={[styles.text, { color: theme.subText }]}>Use live placement guidance to estimate object width, height, and spacing more consistently.</Text>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={[styles.title, { color: theme.text }]}>How To Use It</Text>
          {steps.map((step) => (
            <View key={step} style={styles.stepRow}>
              <Ionicons name="ellipse" size={8} color={accent} style={{ marginTop: 7 }} />
              <Text style={[styles.stepText, { color: theme.subText }]}>{step}</Text>
            </View>
          ))}
        </GlassCard>

        <TouchableOpacity style={[styles.launchButton, { backgroundColor: accent }]} onPress={() => router.push('/placement?category=Table' as any)}>
          <Text style={styles.launchText}>Launch Live Measure Guide</Text>
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
  card: { marginBottom: 20, alignItems: 'flex-start' },
  title: { fontSize: 18, fontWeight: '800', marginTop: 12, marginBottom: 8 },
  text: { fontSize: 14, lineHeight: 20 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 10 },
  stepText: { flex: 1, fontSize: 14, lineHeight: 20, marginLeft: 10 },
  launchButton: { borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  launchText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
