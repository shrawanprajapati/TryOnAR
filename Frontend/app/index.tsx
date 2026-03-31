import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';

export default function Home() {
  const router = useRouter();
  const { theme, accent } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: theme.text }]}>Dashboard</Text>
      <Text style={[styles.subHeader, { color: theme.subText }]}>
        Welcome to your dynamic themed app.
      </Text>

      <GlassCard style={styles.cardSpacing}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Quick Links</Text>
        <Text style={{ color: theme.subText, marginBottom: 15 }}>
          Your theme changes will reflect instantly across all these components.
        </Text>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.tint, borderColor: accent }]}
          onPress={() => router.push('/settings')}
        >
          <Text style={[styles.buttonText, { color: accent }]}>Go to Settings</Text>
        </TouchableOpacity>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: { fontSize: 32, fontWeight: 'bold', marginBottom: 5 },
  subHeader: { fontSize: 16, marginBottom: 30 },
  cardSpacing: { marginTop: 20 },
  cardTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonText: { fontWeight: 'bold', fontSize: 16 },
});