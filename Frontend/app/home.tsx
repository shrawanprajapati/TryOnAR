import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext'; // Dynamic Theme Hook

const { width } = Dimensions.get('window');

// Premium Products Mock Data
const CATALOG_PRODUCTS = [
  { id: '1', name: 'Ray-Ban Aviator', desc: 'Classic gold', price: '$165', icon: 'glasses-outline' },
  { id: '2', name: 'Zenith Tech Frames', desc: 'Ultralight weight', price: '$260', icon: 'scan-outline' },
  { id: '3', name: 'Oakley Frogskins', desc: 'Sporty shape', price: '$150', icon: 'sunglasses-outline' },
  { id: '4', name: 'Titanium Minimalist', desc: 'Sleek & subtle', price: '$380', icon: 'glasses' },
];

export default function Home() {
  const router = useRouter();
  const { theme, accent } = useTheme(); // Pull colors dynamically!

  // Glassmorphism effect based on theme background
  const getGlassColors = () => {
    return isDark(theme.background) ? ['rgba(26,26,26,0.9)', 'rgba(13,13,13,0.8)'] : ['rgba(255,255,255,0.95)', 'rgba(240,240,240,0.9)'];
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* 1. PREMIUM HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.subText }]}>Hello, Shrawan 👋</Text>
          <Text style={[styles.logo, { color: theme.text }]}>TryOn<Text style={{ color: accent }}>AR</Text></Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable onPress={() => router.push("/settings")} style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={26} color={theme.text} />
          </Pressable>
          <Pressable onPress={() => router.push("/profile")}>
            <Ionicons name="person-circle" size={36} color={accent} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* 2. HERO AR CTA CARD */}
        <Pressable onPress={() => router.push("/tryon")}>
          {({ pressed }) => (
            <LinearGradient
              colors={getGlassColors()}
              style={[styles.heroCard, { borderColor: pressed ? accent : theme.card, shadowColor: accent }]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <View style={styles.heroTextContainer}>
                <Text style={[styles.heroBadge, { color: accent, backgroundColor: accent + '20' }]}>LIVE AR SCAN</Text>
                <Text style={[styles.heroTitle, { color: theme.text }]}>Start Your{'\n'}Journey</Text>
                <Text style={[styles.heroSub, { color: theme.subText }]}>Scan your face to see premium eyewear instantly.</Text>
              </View>
              <View style={[styles.heroIconBg, { backgroundColor: accent }]}>
                <Ionicons name="camera" size={32} color="#fff" />
              </View>
            </LinearGradient>
          )}
        </Pressable>

        {/* 3. PLACEMENT SHORTCUT */}
        <Pressable 
          style={({ pressed }) => [styles.secondaryBtn, { backgroundColor: theme.card, borderColor: pressed ? accent : 'rgba(150,150,150,0.1)' }]}
          onPress={() => router.push("/placement")}
        >
          <Ionicons name="cube-outline" size={24} color={accent} style={{ marginRight: 15 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.secondaryBtnTitle, { color: theme.text }]}>Room Placement</Text>
            <Text style={[styles.secondaryBtnSub, { color: theme.subText }]}>Test items in your physical space</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.subText} />
        </Pressable>

        {/* 4. PREMIUM GRID PRODUCT CATALOG */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Trending Frames</Text>
          <Pressable onPress={() => router.push("/product")}>
            <Text style={{ color: accent, fontWeight: '600' }}>See All</Text>
          </Pressable>
        </View>

        <View style={styles.productGrid}>
          {CATALOG_PRODUCTS.map((product) => (
            <View key={product.id} style={[styles.productCard, { backgroundColor: theme.card, borderColor: theme.subText + '10' }]}>
              <View style={[styles.productImagePlaceholder, { backgroundColor: theme.background + '50' }]}>
                <Ionicons name={product.icon as any} size={42} color={theme.subText + '50'} />
              </View>
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: theme.text }]} numberOfLines={1}>{product.name}</Text>
                <Text style={[styles.productDesc, { color: theme.subText }]} numberOfLines={1}>{product.desc}</Text>
                <View style={styles.productFooter}>
                  <Text style={[styles.productPrice, { color: theme.text }]}>{product.price}</Text>
                  <Pressable style={[styles.tryOnMiniBtn, { backgroundColor: accent }]} onPress={() => router.push("/tryon")}>
                    <Text style={styles.tryOnMiniText}>Try On</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function to check if background is dark
const isDark = (hex: string) => hex === '#0a0a0a' || hex === '#000000';

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  greeting: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  logo: { fontSize: 26, fontWeight: "900", letterSpacing: 0.5 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 15 },
  iconBtn: { padding: 8 },
  scrollContent: { paddingBottom: 40 },
  
  heroCard: { marginHorizontal: 20, borderRadius: 28, padding: 24, flexDirection: 'row', alignItems: 'center', borderWidth: 1, elevation: 15, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 25, marginBottom: 15, borderTopColor: 'rgba(255,255,255,0.1)', borderLeftColor: 'rgba(255,255,255,0.05)' },
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
  productCard: { width: (width / 2) - 20, borderRadius: 24, marginHorizontal: 5, overflow: 'hidden', borderWidth: 1, marginBottom: 15, elevation: 5, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10 },
  productImagePlaceholder: { height: 130, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(150,150,150,0.1)' },
  productInfo: { padding: 15 },
  productName: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  productDesc: { fontSize: 11, marginBottom: 12 },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 17, fontWeight: '800' },
  tryOnMiniBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  tryOnMiniText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
});