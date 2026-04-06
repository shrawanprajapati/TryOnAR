import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import PageTransition from '../components/PageTransition';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';

const ACCENT_COLORS = ['#8A2BE2', '#FF3366', '#00C9A7', '#FF8C00', '#007AFF'];

export default function Settings() {
  const router = useRouter();
  const { isDark, toggleTheme, theme, accent, setAccent } = useTheme();
  const { restartOnboarding } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageTransition>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: theme.glassBg, borderColor: theme.glassBorder }]}
          >
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.header, { color: theme.text }]}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <GlassCard style={styles.section}>
          <View style={styles.row}>
            <View>
              <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[styles.helper, { color: theme.subText }]}>
                Current appearance: {isDark ? 'Dark' : 'Light'}
              </Text>
            </View>
            <Switch 
              value={isDark} 
              onValueChange={() => {
                void toggleTheme();
              }}
              trackColor={{ false: theme.subText, true: accent }}
              thumbColor={'#FFF'}
            />
          </View>
        </GlassCard>

        <GlassCard style={styles.section}>
          <Text style={[styles.label, { color: theme.text, marginBottom: 15 }]}>Accent Color</Text>
          <View style={styles.colorRow}>
            {ACCENT_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setAccent(color)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  accent === color && { borderWidth: 3, borderColor: theme.text }
                ]}
              />
            ))}
          </View>
        </GlassCard>

        <GlassCard style={styles.section}>
          <Text style={[styles.label, { color: theme.text, marginBottom: 12 }]}>Theme Preview</Text>
          <View style={[styles.previewCard, { backgroundColor: theme.card, borderColor: theme.glassBorder }]}>
            <Text style={[styles.previewTitle, { color: theme.text }]}>TryOnAR Preview</Text>
            <Text style={[styles.helper, { color: theme.subText }]}>
              Theme updates now apply across settings, profile, and feature screens.
            </Text>
            <View style={[styles.previewAccent, { backgroundColor: accent }]} />
          </View>
        </GlassCard>

        <GlassCard style={styles.section}>
          <Text style={[styles.label, { color: theme.text, marginBottom: 8 }]}>Tutorial</Text>
          <Text style={[styles.helper, { color: theme.subText, marginTop: 0, marginBottom: 16 }]}>
            Replay the onboarding tour and walkthrough screens anytime.
          </Text>
          <TouchableOpacity
            onPress={async () => {
              await restartOnboarding();
              router.replace('/onboarding1');
            }}
            style={[styles.replayButton, { backgroundColor: accent }]}
          >
            <Ionicons name="play-circle-outline" size={18} color="#FFFFFF" style={styles.replayIcon} />
            <Text style={styles.replayText}>Replay Onboarding</Text>
          </TouchableOpacity>
        </GlassCard>
      </PageTransition>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  backBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  headerSpacer: { width: 42 },
  header: { fontSize: 32, fontWeight: 'bold' },
  section: { marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 18, fontWeight: '500' },
  helper: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  colorRow: { flexDirection: 'row', justifyContent: 'space-between' },
  colorCircle: { width: 40, height: 40, borderRadius: 20 },
  previewCard: { borderWidth: 1, borderRadius: 16, padding: 16 },
  previewTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  previewAccent: { width: 60, height: 8, borderRadius: 999, marginTop: 16 },
  replayButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  replayIcon: {
    marginRight: 8,
  },
  replayText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
