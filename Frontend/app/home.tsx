import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { hexToRgba, useTheme } from '../context/ThemeContext';
import { useProtectedRoute } from '../hooks/use-protected-route';

type HomeAction = 'DIRECT TRYONS' | 'TRY LENS' | 'DETECT OBJECT';

export default function HomeScreen() {
  const router = useRouter();
  const { theme, accent, isDark } = useTheme();
  const { user } = useAuth();
  const { isAuthenticated, isReady } = useProtectedRoute();
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 2500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2500, useNativeDriver: true }),
      ])
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [floatAnim]);

  const handlePress = (option: HomeAction) => {
    if (option === 'DIRECT TRYONS') {
      router.push('/product');
      return;
    }

    if (option === 'TRY LENS') {
      router.push('/tryon');
      return;
    }

    router.push('/placement');
  };

  const glassCard = {
    backgroundColor: hexToRgba(theme.card, isDark ? 0.62 : 0.82),
    borderColor: hexToRgba(theme.text, 0.05),
    borderWidth: 1,
  };

  const workspaceTools = [
    { id: '1', name: 'All Products', icon: 'glasses-outline', sub: 'Browse the backend catalog', route: '/product' },
    { id: '2', name: 'AR Viewer', icon: 'scan-outline', sub: 'Open the live try-on module', route: '/tryon' },
    { id: '3', name: 'Placement Guide', icon: 'cube-outline', sub: 'Launch room placement flow', route: '/placement' },
    { id: '4', name: 'Profile', icon: 'person-outline', sub: 'Check synced account details', route: '/profile' },
  ];

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <PageTransition>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.subText }]}>Welcome, {user?.name || 'AR Creator'}</Text>
            <Text style={[styles.logo, { color: theme.text }]}>TryOn<Text style={{ color: accent }}>AR</Text></Text>
            <Text style={[styles.headerSub, { color: theme.subText }]}>Live try-on, object placement, and synced profile data.</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => router.push('/settings' as never)} style={[styles.iconBtn, glassCard]}>
              <Ionicons name="settings-outline" size={24} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile' as never)} style={[styles.profileBtn, glassCard]}>
              <Ionicons name="person" size={20} color={accent} />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
          <TouchableOpacity style={[styles.heroCard, glassCard]} onPress={() => handlePress('DIRECT TRYONS')}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <View style={[styles.badge, { backgroundColor: hexToRgba(accent, 0.2) }]}>
                <Ionicons name="cart-outline" size={14} color={accent} style={{ marginRight: 5 }} />
                <Text style={[styles.badgeText, { color: accent }]}>SHOP & LIVE AR</Text>
              </View>
              <Text style={[styles.heroTitle, { color: theme.text }]}>Direct Try-Ons</Text>
              <Text style={[styles.heroSub, { color: theme.subText }]}>Browse the connected catalog, open a product, and jump into try-on or placement instantly.</Text>
            </View>
            <View style={[styles.heroAction, { backgroundColor: accent, shadowColor: accent }]}>
              <Ionicons name="bag-handle" size={32} color="#FFF" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={[styles.envCard, glassCard]} onPress={() => handlePress('TRY LENS')}>
          <View style={[styles.iconBox, { backgroundColor: hexToRgba(accent, 0.15) }]}>
            <Ionicons name="body-outline" size={32} color={accent} />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Try Lens</Text>
            <Text style={{ color: theme.subText, fontSize: 13, marginTop: 2 }}>Run live try-on or open the AI viewer connected through the backend.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.subText} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.envCard, glassCard, { marginTop: 0 }]} onPress={() => handlePress('DETECT OBJECT')}>
          <View style={[styles.iconBox, { backgroundColor: hexToRgba(accent, 0.15) }]}>
            <Ionicons name="scan-circle-outline" size={36} color={accent} />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Detect & Place</Text>
            <Text style={{ color: theme.subText, fontSize: 13, marginTop: 2 }}>Analyze a room and launch the live placement workflow.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.subText} />
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Workspace Tools</Text>

        <View style={styles.grid}>
          {workspaceTools.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.toolCard, glassCard]}
              onPress={() => router.push(item.route as never)}
            >
              <Ionicons name={item.icon as never} size={28} color={accent} style={{ marginBottom: 10 }} />
              <Text style={[styles.toolName, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.toolSub, { color: theme.subText }]}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </PageTransition>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingBottom: 40 },
  stateScreen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 25, paddingTop: 60, alignItems: 'flex-start' },
  greeting: { fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  logo: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  headerSub: { marginTop: 8, fontSize: 14, lineHeight: 20, maxWidth: 240 },
  headerIcons: { flexDirection: 'row', gap: 15, alignItems: 'center' },
  iconBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  profileBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  heroCard: { marginHorizontal: 20, padding: 25, borderRadius: 30, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', marginBottom: 20 },
  badge: { flexDirection: 'row', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 15, alignItems: 'center' },
  badgeText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  heroTitle: { fontSize: 26, fontWeight: '900', marginBottom: 8 },
  heroSub: { fontSize: 13, lineHeight: 20 },
  heroAction: { width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 10 },
  envCard: { marginHorizontal: 20, marginBottom: 20, padding: 20, borderRadius: 25, flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 25, marginTop: 10, marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
  toolCard: { width: '48%', padding: 20, borderRadius: 25, marginBottom: 15, justifyContent: 'center' },
  toolName: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  toolSub: { fontSize: 11, lineHeight: 16 },
});
