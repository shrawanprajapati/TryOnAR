import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '../context/ThemeContext';
import { useAuth } from '@/context/auth-context';
import { fetchProducts, fetchProfile, syncUser, type Product } from '@/lib/api';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const { theme, accent } = useTheme();
  const { user, loading, getIdToken, signOutUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(true);

  const getGlassColors = (): [string, string] =>
    isDark(theme.background)
      ? ['rgba(26,26,26,0.9)', 'rgba(13,13,13,0.8)']
      : ['rgba(255,255,255,0.95)', 'rgba(240,240,240,0.9)'];

  async function refreshDashboard() {
    try {
      setRefreshing(true);

      if (user) {
        const token = await getIdToken();
        if (token) {
          await syncUser(token, user.email);
          await fetchProfile(token);
        }
      }

      const items = await fetchProducts();
      setProducts(items);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, router, user]);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setRefreshing(true);

        if (user) {
          const token = await getIdToken();
          if (token) {
            await syncUser(token, user.email);
            await fetchProfile(token);
          }
        }

        const items = await fetchProducts();

        if (!cancelled) {
          setProducts(items);
        }
      } finally {
        if (!cancelled) {
          setRefreshing(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [getIdToken, user]);

  async function handleLogout() {
    await signOutUser();
    router.replace('/login');
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.subText }]}>Hello, {user?.email || 'TryOnAR user'}</Text>
          <Text style={[styles.logo, { color: theme.text }]}>
            TryOn<Text style={{ color: accent }}>AR</Text>
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable onPress={() => router.push('/settings')} style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={26} color={theme.text} />
          </Pressable>
          <Pressable onPress={() => router.push('/profile')}>
            <Ionicons name="person-circle" size={36} color={accent} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshDashboard} tintColor={accent} />}
      >
        <Pressable onPress={() => router.push('/tryon')}>
          {({ pressed }) => (
            <LinearGradient
              colors={getGlassColors()}
              style={[styles.heroCard, { borderColor: pressed ? accent : theme.card, shadowColor: accent }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.heroTextContainer}>
                <Text style={[styles.heroBadge, { color: accent, backgroundColor: `${accent}20` }]}>LIVE AR SCAN</Text>
                <Text style={[styles.heroTitle, { color: theme.text }]}>Start Your{'\n'}Journey</Text>
                <Text style={[styles.heroSub, { color: theme.subText }]}>Scan your face to see premium eyewear instantly.</Text>
              </View>
              <View style={[styles.heroIconBg, { backgroundColor: accent }]}>
                <Ionicons name="camera" size={32} color="#fff" />
              </View>
            </LinearGradient>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, { backgroundColor: theme.card, borderColor: pressed ? accent : 'rgba(150,150,150,0.1)' }]}
          onPress={() => router.push('/placement')}
        >
          <Ionicons name="cube-outline" size={24} color={accent} style={{ marginRight: 15 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.secondaryBtnTitle, { color: theme.text }]}>Room Placement</Text>
            <Text style={[styles.secondaryBtnSub, { color: theme.subText }]}>Test items in your physical space</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.subText} />
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Trending Frames</Text>
          <Pressable onPress={() => router.push('/product')}>
            <Text style={{ color: accent, fontWeight: '600' }}>See All</Text>
          </Pressable>
        </View>

        <View style={styles.productGrid}>
          {products.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: `${theme.subText}10` }]}>
              <Text style={[styles.productName, { color: theme.text }]}>No products yet</Text>
              <Text style={[styles.productDesc, { color: theme.subText }]}>Run the SQL schema to seed products, then pull to refresh.</Text>
            </View>
          ) : (
            products.map((product) => (
              <View key={product.id} style={[styles.productCard, { backgroundColor: theme.card, borderColor: `${theme.subText}10` }]}>
                <View style={[styles.productImagePlaceholder, { backgroundColor: `${theme.background}50` }]}>
                  <Ionicons name="glasses-outline" size={42} color={`${theme.subText}50`} />
                </View>
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: theme.text }]} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text style={[styles.productDesc, { color: theme.subText }]} numberOfLines={2}>
                    {product.description}
                  </Text>
                  <View style={styles.productFooter}>
                    <Text style={[styles.productPrice, { color: theme.text }]}>${Number(product.price).toFixed(2)}</Text>
                    <Pressable style={[styles.tryOnMiniBtn, { backgroundColor: accent }]} onPress={() => router.push('/tryon')}>
                      <Text style={styles.tryOnMiniText}>Try On</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <Pressable style={[styles.logoutButton, { borderColor: accent }]} onPress={handleLogout}>
          <Text style={[styles.logoutButtonText, { color: accent }]}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const isDark = (hex: string) => hex === '#0a0a0a' || hex === '#000000';

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  greeting: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  logo: { fontSize: 26, fontWeight: '900', letterSpacing: 0.5 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBtn: { padding: 8 },
  scrollContent: { paddingBottom: 40 },
  heroCard: {
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 15,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    marginBottom: 15,
    borderTopColor: 'rgba(255,255,255,0.1)',
    borderLeftColor: 'rgba(255,255,255,0.05)',
  },
  heroTextContainer: { flex: 1, paddingRight: 10 },
  heroBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 10, fontWeight: 'bold', overflow: 'hidden', marginBottom: 12, letterSpacing: 1 },
  heroTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, lineHeight: 28 },
  heroSub: { fontSize: 13, lineHeight: 18 },
  heroIconBg: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 6 },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, padding: 18, borderRadius: 20, borderWidth: 1, marginBottom: 35 },
  secondaryBtnTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  secondaryBtnSub: { fontSize: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold' },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  emptyCard: { width: width - 40, borderRadius: 24, marginHorizontal: 5, padding: 20, borderWidth: 1, marginBottom: 15 },
  productCard: { width: width / 2 - 20, borderRadius: 24, marginHorizontal: 5, overflow: 'hidden', borderWidth: 1, marginBottom: 15, elevation: 5, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10 },
  productImagePlaceholder: { height: 130, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(150,150,150,0.1)' },
  productInfo: { padding: 15 },
  productName: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  productDesc: { fontSize: 11, marginBottom: 12 },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 17, fontWeight: '800' },
  tryOnMiniBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  tryOnMiniText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  logoutButton: { marginHorizontal: 20, marginTop: 10, borderWidth: 1, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  logoutButtonText: { fontSize: 16, fontWeight: '700' },
});
