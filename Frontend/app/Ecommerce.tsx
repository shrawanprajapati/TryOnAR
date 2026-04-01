import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { fetchCatalogProducts, searchProducts } from '../api/productApi';
import { hexToRgba, useTheme } from '../context/ThemeContext';
import { formatPrice } from '../lib/api';
import { Product } from '../types/Product';

const Ecommerce = () => {
  const [query, setQuery] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { theme, accent, isDark } = useTheme();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const timer = setTimeout(async () => {
      setLoading(true);
      setErrorMessage('');

      try {
        const result = query.trim()
          ? await searchProducts(query.trim())
          : await fetchCatalogProducts();

        if (isMounted) {
          setProducts(result);
        }
      } catch (error) {
        console.error('Error fetching products:', error);

        if (isMounted) {
          setProducts([]);
          setErrorMessage('The catalog could not be loaded from the backend.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
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
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.glassBorder,
          shadowColor: accent,
          shadowOpacity: isDark ? 0.18 : 0.08,
        },
      ]}
    >
      <Image source={{ uri: item.image }} style={[styles.image, { backgroundColor: theme.tint }]} />

      <View style={styles.info}>
        <Text style={[styles.badge, { color: accent }]}>
          {(item.category || 'AR ready').toUpperCase()}
        </Text>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.price, { color: accent }]}>{formatPrice(item.price)}</Text>
        <Text numberOfLines={2} style={[styles.desc, { color: theme.subText }]}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: theme.text }]}>Ecommerce Catalog</Text>
      <Text style={[styles.subHeader, { color: theme.subText }]}>Search the connected product API and jump straight into AR previews.</Text>

      <TextInput
        placeholder="Search products..."
        value={query}
        onChangeText={setQuery}
        style={[
          styles.input,
          {
            backgroundColor: hexToRgba(theme.card, isDark ? 0.72 : 0.92),
            borderColor: theme.glassBorder,
            color: theme.text,
          },
        ]}
        placeholderTextColor={theme.subText}
        selectionColor={accent}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {loading ? <ActivityIndicator size="large" color={accent} style={styles.loader} /> : null}
      {!loading && errorMessage ? (
        <Text style={[styles.emptyText, { color: theme.subText }]}>{errorMessage}</Text>
      ) : null}

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          products.length === 0 ? styles.emptyListContainer : undefined,
        ]}
        ListEmptyComponent={
          !loading ? (
            <Text style={[styles.emptyText, { color: theme.subText }]}>
              {query.trim() ? 'No products matched your search.' : 'Catalog items will appear here.'}
            </Text>
          ) : null
        }
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 40,
  },
  subHeader: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  loader: {
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 92,
    height: 110,
    borderRadius: 16,
    marginRight: 16,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  badge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});

export default Ecommerce;
