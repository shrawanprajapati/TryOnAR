import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';
import { fetchCatalogProducts } from '../api/productApi';
import { formatPrice } from '../lib/api';
import type { Product } from '../types/Product';

export default function Explore() {
  const { theme, accent } = useTheme();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const catalog = await fetchCatalogProducts();

        if (isMounted) {
          setProducts(catalog);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Unable to load the catalog right now.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const values = products
      .map((item) => item.category)
      .filter((value): value is string => Boolean(value));

    return ['All', ...Array.from(new Set(values))];
  }, [products]);

  const visibleProducts =
    activeCategory === 'All'
      ? products
      : products.filter((item) => item.category === activeCategory);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[
            styles.backBtn,
            { backgroundColor: theme.glassBg, borderColor: theme.glassBorder },
          ]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={[styles.header, { color: theme.text }]}>Explore</Text>
          <Text style={{ color: theme.subText }}>
            Live catalog items from the backend, ready for try-on or placement.
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? accent : theme.glassBg,
                  borderColor: isActive ? accent : theme.glassBorder,
                },
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text style={{ color: isActive ? '#FFF' : theme.text, fontWeight: '700' }}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={accent} />
          <Text style={[styles.stateText, { color: theme.subText }]}>Loading products...</Text>
        </View>
      ) : null}

      {!isLoading && errorMessage ? (
        <GlassCard style={styles.stateCard}>
          <Text style={[styles.itemTitle, { color: theme.text }]}>Catalog unavailable</Text>
          <Text style={[styles.stateText, { color: theme.subText }]}>{errorMessage}</Text>
        </GlassCard>
      ) : null}

      {!isLoading &&
        !errorMessage &&
        visibleProducts.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.86}
            onPress={() =>
              router.push({
                pathname: '/product' as any,
                params: {
                  productId: String(item.id),
                  name: item.title,
                  description: item.description,
                  price: formatPrice(item.price),
                  imageUrl: item.image,
                  category: item.category || '',
                  modelSlug: item.modelSlug || '',
                },
              })
            }
          >
            <GlassCard style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.imagePreview} resizeMode="cover" />
              <View style={styles.info}>
                <Text style={[styles.metaLabel, { color: accent }]}>
                  {(item.category || 'AR ready').toUpperCase()}
                </Text>
                <Text style={[styles.itemTitle, { color: theme.text }]}>{item.title}</Text>
                <Text
                  style={[styles.itemDescription, { color: theme.subText }]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
                <View style={styles.itemFooter}>
                  <Text style={[styles.itemPrice, { color: theme.text }]}>
                    {formatPrice(item.price)}
                  </Text>
                  <View style={[styles.actionBtn, { borderColor: accent }]}>
                    <Text style={{ color: accent, fontWeight: '700' }}>Open</Text>
                  </View>
                </View>
              </View>
            </GlassCard>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerTextWrap: { flex: 1, marginLeft: 12 },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  header: { fontSize: 32, fontWeight: 'bold' },
  chipRow: { gap: 10, paddingBottom: 16 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  centerState: { paddingVertical: 40, alignItems: 'center' },
  stateCard: { marginBottom: 16 },
  stateText: { marginTop: 10, fontSize: 14, textAlign: 'center' },
  itemCard: { flexDirection: 'row', marginBottom: 15, padding: 15 },
  imagePreview: {
    width: 92,
    height: 112,
    borderRadius: 20,
    marginRight: 15,
    backgroundColor: '#1E1E1E',
  },
  info: { flex: 1, justifyContent: 'space-between' },
  metaLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 6 },
  itemTitle: { fontSize: 18, fontWeight: 'bold' },
  itemDescription: { fontSize: 14, lineHeight: 20 },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  itemPrice: { fontSize: 18, fontWeight: '800' },
  actionBtn: {
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
});
