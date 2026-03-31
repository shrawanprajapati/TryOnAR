import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';

export default function Explore() {
  const { theme, accent } = useTheme();
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={[styles.header, { color: theme.text }]}>Explore</Text>
      
      {[1, 2, 3, 4].map((item) => (
        <GlassCard key={item} style={styles.itemCard}>
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.tint }]} />
          <View style={styles.info}>
            <Text style={[styles.itemTitle, { color: theme.text }]}>Product Model {item}</Text>
            <Text style={{ color: theme.subText }}>Tap to view details or try in AR.</Text>
            
            <TouchableOpacity 
              style={[styles.actionBtn, { borderColor: accent }]}
              onPress={() => router.push('/product')}
            >
              <Text style={{ color: accent, fontWeight: '600' }}>View Details</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  header: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  itemCard: { flexDirection: 'row', marginBottom: 15, padding: 15 },
  imagePlaceholder: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  info: { flex: 1, justifyContent: 'space-between' },
  itemTitle: { fontSize: 18, fontWeight: 'bold' },
  actionBtn: { marginTop: 10, borderWidth: 1, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start' }
});