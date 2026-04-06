import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../components/ui/GlassCard';
import { useTheme } from '../context/ThemeContext';
import {
  buildViewerUrl,
  fetchProduct,
  formatPrice,
  openViewerUrl,
  resolveHostedBoothCategory,
  type CatalogProduct,
} from '../lib/api';

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function ProductScreen() {
  const router = useRouter();
  const { theme, accent } = useTheme();
  const params = useLocalSearchParams<{
    productId?: string;
    name?: string;
    description?: string;
    price?: string;
    imageUrl?: string;
    category?: string;
    modelSlug?: string;
  }>();
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const productId = readParam(params.productId);
  const routeName = readParam(params.name);
  const routeDescription = readParam(params.description);
  const routePrice = readParam(params.price);
  const routeImage = readParam(params.imageUrl);
  const routeCategory = readParam(params.category);
  const routeModelSlug = readParam(params.modelSlug);

  useEffect(() => {
    let isMounted = true;

    if (!productId) {
      return () => {
        isMounted = false;
      };
    }

    const loadProduct = async () => {
      setIsLoading(true);

      try {
        const response = await fetchProduct(productId);

        if (isMounted) {
          setProduct(response);
        }
      } catch {
        if (isMounted) {
          setProduct(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const resolvedName = product?.name || routeName || 'Product Model';
  const resolvedDescription =
    product?.description || routeDescription || 'A ready-to-preview model for TryOnAR experiences.';
  const resolvedPrice = product ? formatPrice(product.price) : routePrice || 'Custom Quote';
  const resolvedImage = product?.imageUrl || routeImage || '';
  const resolvedCategory = product?.category || routeCategory || 'AR Ready';
  const resolvedModelSlug = product?.modelSlug || routeModelSlug || null;
  const isPlacementFlow = /decor|lamp|table|scene|sofa|furniture/i.test(
    `${resolvedCategory} ${resolvedName}`
  );
  const hostedBoothCategory = resolveHostedBoothCategory(resolvedCategory, resolvedName, resolvedModelSlug);

  const viewerUrl = useMemo(
    () =>
      buildViewerUrl({
        mode: isPlacementFlow ? 'placement' : hostedBoothCategory || 'tryon',
        category: hostedBoothCategory || resolvedCategory,
        product: resolvedName,
        model: resolvedModelSlug || undefined,
        target: isPlacementFlow ? resolvedName : undefined,
      }),
    [hostedBoothCategory, isPlacementFlow, resolvedCategory, resolvedModelSlug, resolvedName]
  );

  const handleOpenViewer = async () => {
    try {
      await openViewerUrl(viewerUrl);
    } catch (error) {
      Alert.alert(
        'Viewer unavailable',
        error instanceof Error ? error.message : 'The AR preview page could not be opened right now.'
      );
    }
  };

  const handleContinue = () => {
    if (hostedBoothCategory) {
      void handleOpenViewer();
      return;
    }

    router.push({
      pathname: (isPlacementFlow ? '/placement' : '/tryon') as any,
      params: {
        productId: productId || (product ? String(product.id) : ''),
        productName: resolvedName,
        category: resolvedCategory,
        imageUrl: resolvedImage,
        modelSlug: resolvedModelSlug || '',
      },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backBtn,
            { backgroundColor: theme.glassBg, borderColor: theme.glassBorder },
          ]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Product</Text>
        <View style={{ width: 42 }} />
      </View>

      <GlassCard style={styles.card}>
        <View style={[styles.preview, { backgroundColor: theme.tint }]}>
          {resolvedImage ? (
            <Image source={{ uri: resolvedImage }} style={styles.previewImage} resizeMode="cover" />
          ) : (
            <Ionicons name="cube-outline" size={48} color={accent} />
          )}

          <View
            style={[
              styles.categoryPill,
              { backgroundColor: theme.glassBg, borderColor: theme.glassBorder },
            ]}
          >
            <Text style={[styles.categoryText, { color: theme.text }]}>{resolvedCategory}</Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={accent} />
          </View>
        ) : null}

        <Text style={[styles.name, { color: theme.text }]}>{resolvedName}</Text>
        <Text style={[styles.price, { color: accent }]}>{resolvedPrice}</Text>
        <Text style={[styles.description, { color: theme.subText }]}>{resolvedDescription}</Text>

        <View style={styles.statRow}>
          <View style={[styles.statCard, { backgroundColor: theme.background }]}>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Mode</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {isPlacementFlow ? 'Placement' : 'Try-On'}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.background }]}>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Model</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {resolvedModelSlug || 'Ready'}
            </Text>
          </View>
        </View>
      </GlassCard>

      <TouchableOpacity style={[styles.button, { backgroundColor: accent }]} onPress={handleContinue}>
        <Text style={styles.buttonText}>
          {isPlacementFlow
            ? 'Detect & Place in AR'
            : hostedBoothCategory
              ? `Open ${hostedBoothCategory === 'glasses' ? 'Glasses' : 'Hat'} AR Booth`
              : 'Start Try-On Flow'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.secondaryButton,
          { borderColor: theme.glassBorder, backgroundColor: theme.card },
        ]}
        onPress={handleOpenViewer}
      >
        <Ionicons name="open-outline" size={18} color={theme.text} />
        <Text style={[styles.secondaryText, { color: theme.text }]}>Open Web Viewer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  card: { alignItems: 'flex-start', marginBottom: 24 },
  preview: {
    width: '100%',
    height: 240,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  previewImage: { width: '100%', height: '100%' },
  categoryPill: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  loadingWrap: { width: '100%', alignItems: 'center', marginBottom: 12 },
  name: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  price: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  description: { fontSize: 14, lineHeight: 21 },
  statRow: { width: '100%', flexDirection: 'row', gap: 12, marginTop: 20 },
  statCard: { flex: 1, borderRadius: 18, padding: 16 },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValue: { fontSize: 15, fontWeight: '800', marginTop: 6 },
  button: { borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  secondaryButton: {
    marginTop: 12,
    borderRadius: 16,
    paddingVertical: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  secondaryText: { fontSize: 15, fontWeight: '700', marginLeft: 8 },
});
