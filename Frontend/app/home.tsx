import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme, hexToRgba } from '../context/ThemeContext';
import { useAuth } from '@/context/auth-context';
import { fetchProducts, syncUser, type Product } from '@/lib/api';

export default function HomeScreen() {
  const router = useRouter();
  const { theme, accent, isDark } = useTheme();
  const { user, loading, getIdToken, signOutUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 2500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
  }, [floatAnim]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, router, user]);

  const loadDashboard = useCallback(async () => {
    try {
      setRefreshing(true);
      setErrorMessage(null);

      if (user) {
        const token = await getIdToken();
        if (token) {
          await syncUser(token, user.email);
        }
      }

      const items = await fetchProducts();
      setProducts(items);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load dashboard.');
    } finally {
      setRefreshing(false);
    }
  }, [getIdToken, user]);

  useEffect(() => {
    if (!loading) {
      void loadDashboard();
    }
  }, [loadDashboard, loading]);

  useEffect(() => {
    if (!errorMessage || !errorMessage.startsWith('Unable to reach the backend')) {
      return;
    }

    const retryTimer = setTimeout(() => {
      void loadDashboard();
    }, 2500);

    return () => clearTimeout(retryTimer);
  }, [errorMessage, loadDashboard]);

  async function handleLogout() {
    await signOutUser();
    router.replace('/login');
  }

  const glassCard = {
    backgroundColor: hexToRgba(theme.card, isDark ? 0.6 : 0.86),
    borderColor: hexToRgba(theme.text, 0.06),
    borderWidth: 1,
  };

  const workspaceTools = [
    { id: '1', name: 'All Products', icon: 'glasses-outline', sub: 'Browse the current catalog', route: '/product' },
    { id: '2', name: 'AR Viewer', icon: 'scan-outline', sub: 'Open the AI try-on module', route: '/tryon' },
    { id: '3', name: 'Room Placement', icon: 'cube-outline', sub: 'Test items in your room', route: '/placement' },
    { id: '4', name: 'Profile', icon: 'person-outline', sub: 'Review your account', route: '/profile' },
  ];

  if (loading) {
    return (
      <SafeAreaView style={[styles.loaderScreen, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadDashboard} tintColor={accent} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.subText }]}>
              {user?.email ? `Welcome back, ${user.email}` : 'AR Workspace'}
            </Text>
            <Text style={[styles.logo, { color: theme.text }]}>
              TryOn<Text style={{ color: accent }}>AR</Text>
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => router.push('/settings')} style={[styles.iconBtn, glassCard]}>
              <Ionicons name="settings-outline" size={24} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile')} style={[styles.profileBtn, glassCard]}>
              <Ionicons name="person" size={20} color={accent} />
            </TouchableOpacity>
          </View>
        </View>

        {errorMessage ? (
          <View style={[styles.errorCard, { backgroundColor: hexToRgba('#FF4D4F', 0.12), borderColor: hexToRgba('#FF4D4F', 0.3) }]}>
            <Ionicons name="warning-outline" size={20} color="#FF8080" />
            <View style={styles.errorContent}>
              <Text style={styles.errorText}>{errorMessage}</Text>
              <Pressable style={[styles.retryButton, { borderColor: hexToRgba('#FF8080', 0.45) }]} onPress={() => void loadDashboard()}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
          <TouchableOpacity style={[styles.heroCard, glassCard]} onPress={() => router.push('/tryon')}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <View style={[styles.badge, { backgroundColor: hexToRgba(accent, 0.2) }]}>
                <Ionicons name="body-outline" size={14} color={accent} style={{ marginRight: 5 }} />
                <Text style={[styles.badgeText, { color: accent }]}>SELF AR</Text>
              </View>
              <Text style={[styles.heroTitle, { color: theme.text }]}>Virtual Try-On</Text>
              <Text style={[styles.heroSub, { color: theme.subText }]}>Preview frames and open the AI viewer from one place.</Text>
            </View>
            <View style={[styles.heroAction, { backgroundColor: accent, shadowColor: accent }]}>
              <Ionicons name="scan" size={32} color="#FFF" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={[styles.envCard, glassCard]} onPress={() => router.push('/placement')}>
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

        <View style={styles.grid}>
          {workspaceTools.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.toolCard, glassCard]} onPress={() => router.push(item.route as never)}>
              <Ionicons name={item.icon as never} size={28} color={accent} style={{ marginBottom: 10 }} />
              <Text style={[styles.toolName, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.toolSub, { color: theme.subText }]}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.catalogHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text, marginHorizontal: 0, marginBottom: 0 }]}>Trending Frames</Text>
          <Pressable onPress={() => router.push('/product')}>
            <Text style={{ color: accent, fontWeight: '700' }}>See All</Text>
          </Pressable>
        </View>

        <View style={styles.productList}>
          {products.length === 0 ? (
            <View style={[styles.emptyCard, glassCard]}>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No products loaded</Text>
              <Text style={[styles.emptyBody, { color: theme.subText }]}>
                If the backend is off, start it and pull to refresh. If MySQL is empty, run the schema seed first.
              </Text>
            </View>
          ) : (
            products.slice(0, 4).map((product) => (
              <TouchableOpacity key={product.id} style={[styles.productCard, glassCard]} onPress={() => router.push('/product')}>
                <View style={[styles.productIcon, { backgroundColor: hexToRgba(accent, 0.12) }]}>
                  <Ionicons name="glasses-outline" size={26} color={accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.productName, { color: theme.text }]} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text style={[styles.productDesc, { color: theme.subText }]} numberOfLines={2}>
                    {product.description}
                  </Text>
                </View>
                <Text style={[styles.productPrice, { color: accent }]}>${Number(product.price).toFixed(2)}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity style={[styles.logoutBtn, { borderColor: '#FF3B30', backgroundColor: theme.glassBg }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" style={{ marginRight: 10 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  loaderScreen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 25, paddingTop: 20, alignItems: 'center' },
  greeting: { fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  logo: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  headerIcons: { flexDirection: 'row', gap: 15, alignItems: 'center' },
  iconBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  profileBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  errorText: { color: '#FFD1D1', flex: 1, fontSize: 13, lineHeight: 18 },
  errorContent: { flex: 1, gap: 10 },
  retryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  retryButtonText: { color: '#FFD1D1', fontSize: 12, fontWeight: '700' },
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
  toolSub: { fontSize: 11, lineHeight: 16 },
  catalogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 10,
    marginBottom: 15,
  },
  productList: { paddingHorizontal: 20 },
  emptyCard: { borderRadius: 24, padding: 20 },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptyBody: { fontSize: 13, lineHeight: 19 },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 22,
    marginBottom: 12,
  },
  productIcon: { width: 52, height: 52, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  productName: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  productDesc: { fontSize: 12, lineHeight: 17, maxWidth: 190 },
  productPrice: { fontSize: 14, fontWeight: '800' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 15,
    borderRadius: 20,
    borderWidth: 1,
  },
  logoutText: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold' },
});
