import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const furnitureItems = [
  { id: '1', name: 'Modern Chair', icon: 'easel-outline', size: 'Medium' },
  { id: '2', name: 'Coffee Table', icon: 'albums-outline', size: 'Large' },
  { id: '3', name: 'Floor Lamp', icon: 'flashlight-outline', size: 'Tall' },
  { id: '4', name: 'Sofa Set', icon: 'bed-outline', size: 'Extra Large' },
  { id: '5', name: 'Potted Plant', icon: 'leaf-outline', size: 'Small' },
  { id: '6', name: 'Bookshelf', icon: 'library-outline', size: 'Tall' },
];

export default function PlacementScreen() {
  const { theme, accent } = useTheme();
  const router = useRouter();

  // Pulse animation for AI Button
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{marginBottom: 10}}>
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Room Placement</Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>Place objects in your physical space</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* IDENTIFY BY AI BUTTON */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }], marginBottom: 30 }}>
          <TouchableOpacity style={[styles.aiCard, { backgroundColor: accent }]}>
            <View style={styles.aiIconContainer}>
              <Ionicons name="scan-outline" size={32} color={theme.background} />
              <Ionicons name="sparkles" size={16} color="#FFF" style={{ position: 'absolute', top: -5, right: -5 }} />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.aiTitle}>Identify by AI</Text>
              <Text style={styles.aiSub}>Scan your room to auto-suggest items</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Object</Text>

        {/* Furniture Grid */}
        <View style={styles.grid}>
          {furnitureItems.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.itemCard, { backgroundColor: theme.card }]}>
              <View style={[styles.iconBox, { backgroundColor: theme.background }]}>
                <Ionicons name={item.icon as any} size={30} color={accent} />
              </View>
              <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.itemSize, { color: theme.subText }]}>{item.size}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 50 },
  title: { fontSize: 32, fontWeight: '900' },
  subtitle: { fontSize: 16, marginTop: 5 },
  aiCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 25, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
  aiIconContainer: { width: 50, height: 50, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  aiTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  aiSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  itemCard: { width: '48%', padding: 20, borderRadius: 25, marginBottom: 15, alignItems: 'center' },
  iconBox: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  itemName: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  itemSize: { fontSize: 12, marginTop: 5 }
});
