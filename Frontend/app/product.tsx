import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { fetchProducts, type Product } from '@/lib/api';
import { useTheme } from '../context/ThemeContext';

export default function ProductScreen() {
  const router = useRouter();
  const { theme, accent } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const items = await fetchProducts();
        setProducts(items);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>All Products</Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={accent} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {products.map((product) => (
            <View key={product.id} style={[styles.card, { backgroundColor: theme.card, borderColor: `${theme.subText}10` }]}>
              <Text style={[styles.category, { color: accent }]}>{product.category || 'General'}</Text>
              <Text style={[styles.name, { color: theme.text }]}>{product.name}</Text>
              <Text style={[styles.description, { color: theme.subText }]}>{product.description}</Text>
              <View style={styles.footer}>
                <Text style={[styles.price, { color: theme.text }]}>${Number(product.price).toFixed(2)}</Text>
                <Pressable style={[styles.tryButton, { backgroundColor: accent }]} onPress={() => router.push('/tryon')}>
                  <Text style={styles.tryButtonText}>Try On</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { padding: 4 },
  title: { fontSize: 24, fontWeight: '800' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 20, gap: 16 },
  card: { borderRadius: 22, padding: 18, borderWidth: 1 },
  category: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' },
  name: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  description: { fontSize: 14, lineHeight: 20, marginBottom: 14 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 18, fontWeight: '800' },
  tryButton: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  tryButtonText: { color: '#FFFFFF', fontWeight: '700' },
});
