import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, hexToRgba } from '../context/ThemeContext';

export default function HomeScreen() {
  const router = useRouter();
  const { theme, accent, isDark } = useTheme();

  // Floating animation for the Hero Card
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 2500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2500, useNativeDriver: true })
      ])
    ).start();
  }, []);

  // Use the refined, decreasingly transparent card background for glassmorphism
  const glassCard = {
    backgroundColor: hexToRgba(theme.card, isDark ? 0.6 : 0.8),
    borderColor: hexToRgba(theme.text, 0.05),
    borderWidth: 1,
  };

  const workspaceTools = [
    { id: '1', name: 'Web Import', icon: 'link-outline', sub: 'Extract 3D models via URL', route: '/explore' },
    { id: '2', name: 'My Models', icon: 'cube-outline', sub: 'Your saved AR objects', route: '/explore' },
    { id: '3', name: 'AR Ruler', icon: 'options-outline', sub: 'Measure physical spaces', route: '/placement' },
    { id: '4', name: 'Snapshots', icon: 'images-outline', sub: 'Gallery of your setups', route: '/profile' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.subText }]}>AR Workspace</Text>
          <Text style={[styles.logo, { color: theme.text }]}>TryOn<Text style={{ color: accent }}>AR</Text></Text>
        </View>
        <View style={styles.headerIcons}>
          {/* FEATURE ADDED: Quick Settings Button on Home */}
          <TouchableOpacity onPress={() => router.push('/settings' as any)} style={[styles.iconBtn, glassCard]}>
            <Ionicons name="settings-outline" size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile' as any)} style={[styles.profileBtn, glassCard]}>
            <Ionicons name="person" size={20} color={accent} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Hero Card (Self Try-On) */}
      <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
        <TouchableOpacity style={[styles.heroCard, glassCard]} onPress={() => router.push('/tryon' as any)}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <View style={[styles.badge, { backgroundColor: hexToRgba(accent, 0.2) }]}>
              <Ionicons name="body-outline" size={14} color={accent} style={{ marginRight: 5 }} />
              <Text style={[styles.badgeText, { color: accent }]}>SELF AR</Text>
            </View>
            <Text style={[styles.heroTitle, { color: theme.text }]}>Virtual Try-On</Text>
            <Text style={[styles.heroSub, { color: theme.subText }]}>Apply wearables and textures to your body using Live ML.</Text>
          </View>
          <View style={[styles.heroAction, { backgroundColor: accent, shadowColor: accent }]}>
            <Ionicons name="scan" size={32} color="#FFF" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Feature 2: Environment Scanner (Room Placement) */}
      <TouchableOpacity style={[styles.envCard, glassCard]} onPress={() => router.push('/placement' as any)}>
        <View style={[styles.iconBox, { backgroundColor: hexToRgba(accent, 0.15) }]}>
          <Ionicons name="scan-circle-outline" size={36} color={accent} />
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Space Mapping</Text>
          <Text style={{ color: theme.subText, fontSize: 13, marginTop: 2 }}>Place and scale objects in your room</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={theme.subText} />
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Workspace Tools</Text>

      {/* Tools Grid */}
      <View style={styles.grid}>
        {workspaceTools.map(item => (
          <TouchableOpacity key={item.id} style={[styles.toolCard, glassCard]}>
            <Ionicons name={item.icon as any} size={28} color={accent} style={{ marginBottom: 10 }} />
            <Text style={[styles.toolName, { color: theme.text }]}>{item.name}</Text>
            <Text style={[styles.toolSub, { color: theme.subText }]}>{item.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' }, // Crucial: Set background to transparent
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 25, paddingTop: 60, alignItems: 'center' },
  greeting: { fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  logo: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  headerIcons: { flexDirection: 'row', gap: 15, alignItems: 'center' },
  iconBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  profileBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  heroCard: { marginHorizontal: 20, padding: 25, borderRadius: 30, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  badge: { flexDirection: 'row', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 15, alignItems: 'center' },
  badgeText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  heroTitle: { fontSize: 26, fontWeight: '900', marginBottom: 8 },
  heroSub: { fontSize: 13, lineHeight: 20 },
  heroAction: { width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 10 },
  envCard: { margin: 20, padding: 20, borderRadius: 25, flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 25, marginTop: 10, marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
  toolCard: { width: '48%', padding: 20, borderRadius: 25, marginBottom: 15, justifyContent: 'center' },
  toolName: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  toolSub: { fontSize: 11, lineHeight: 16 }
});