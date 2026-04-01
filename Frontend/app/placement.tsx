import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { detectObjectsFromSeed, type DetectedObject } from '../constants/objectDetection';
import { buildViewerUrl, runPlacementScan } from '../lib/api';

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function PlacementScreen() {
  const { theme, accent } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    productName?: string;
    category?: string;
  }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const productName = readParam(params.productName);
  const category = readParam(params.category);
  const initialSeed = productName || category || 'room';
  const starterObjects = detectObjectsFromSeed(initialSeed);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>(starterObjects);
  const [selectedObject, setSelectedObject] = useState<DetectedObject | null>(starterObjects[0] ?? null);
  const [resultDetails, setResultDetails] = useState(
    starterObjects[0]?.placementTip || 'Scene detected and ready for placement.'
  );
  const [viewerUrl, setViewerUrl] = useState(
    buildViewerUrl({
      mode: 'placement',
      target: starterObjects[0]?.name || 'scene',
      product: productName || undefined,
      category: category || undefined,
    })
  );

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [pulseAnim]);

  const openResult = (
    imageUri: string,
    object: DetectedObject | null,
    details?: string,
    nextViewerUrl?: string
  ) => {
    router.push({
      pathname: '/result' as any,
      params: {
        imageUri,
        category: object?.name ?? 'Detected Object',
        mode: 'detect',
        details: details || object?.placementTip || 'Scene detected and ready for placement.',
        viewerUrl:
          nextViewerUrl ||
          buildViewerUrl({
            mode: 'placement',
            target: object?.name || 'scene',
            product: productName || undefined,
            category: category || undefined,
          }),
        confidence: object ? String(object.confidence) : '',
        productName: productName || '',
      },
    });
  };

  const detectScene = async (seed: string, imageUri: string, openPreview = true) => {
    setIsScanning(true);

    try {
      const analysis = await runPlacementScan({
        seed,
        imageUri,
        productName: productName || undefined,
        category: category || undefined,
      });
      const nextObjects =
        analysis.candidates.length > 0 ? analysis.candidates : detectObjectsFromSeed(seed);
      const primaryObject = analysis.primaryObject || nextObjects[0] || null;

      setDetectedObjects(nextObjects);
      setSelectedObject(primaryObject);
      setResultDetails(analysis.details);
      setViewerUrl(analysis.viewerUrl);
      setIsScanning(false);
      setIsCameraOpen(false);

      if (openPreview) {
        openResult(imageUri, primaryObject, analysis.details, analysis.viewerUrl);
      }
    } catch {
      const nextObjects = detectObjectsFromSeed(seed);
      const primaryObject = nextObjects[0] ?? null;
      const fallbackDetails = primaryObject
        ? `Detected ${primaryObject.name} with ${primaryObject.confidence}% confidence. ${primaryObject.placementTip}`
        : 'Scene detected and ready for placement.';
      const fallbackViewerUrl = buildViewerUrl({
        mode: 'placement',
        target: primaryObject?.name || 'scene',
        product: productName || undefined,
        category: category || undefined,
      });

      setDetectedObjects(nextObjects);
      setSelectedObject(primaryObject);
      setResultDetails(fallbackDetails);
      setViewerUrl(fallbackViewerUrl);
      setIsScanning(false);
      setIsCameraOpen(false);

      if (openPreview) {
        openResult(imageUri, primaryObject, fallbackDetails, fallbackViewerUrl);
      }
    }
  };

  const handleOpenCamera = async () => {
    if (!permission?.granted) {
      const { status } = await requestPermission();

      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera access is required to detect objects.');
        return;
      }
    }

    setIsCameraOpen(true);
  };

  const handleOpenGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      await detectScene(asset.fileName ?? asset.uri, asset.uri);
    }
  };

  const handleRefreshSuggestions = async () => {
    await detectScene(initialSeed, 'camera://placement-refresh', false);
  };

  const handleOpenLiveViewer = async () => {
    try {
      await Linking.openURL(viewerUrl);
    } catch {
      Alert.alert('Viewer unavailable', 'The live placement viewer could not be opened.');
    }
  };

  if (isCameraOpen) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="back">
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <View style={styles.liveBadge}>
                <Ionicons name="scan-outline" size={16} color="#FFF" />
                <Text style={styles.liveBadgeText}>OBJECT SCAN</Text>
              </View>
              <TouchableOpacity onPress={() => setIsCameraOpen(false)}>
                <Ionicons name="close-circle" size={38} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.scanFrame}>
              <View style={[styles.scanCorner, styles.topLeft]} />
              <View style={[styles.scanCorner, styles.topRight]} />
              <View style={[styles.scanCorner, styles.bottomLeft]} />
              <View style={[styles.scanCorner, styles.bottomRight]} />
              <Text style={styles.scanText}>Center the object inside the frame</Text>
            </View>

            <TouchableOpacity
              style={[styles.captureButton, { borderColor: accent }]}
              onPress={() => detectScene(initialSeed, 'camera://placement-preview')}
            >
              <View style={[styles.captureInner, { backgroundColor: accent }]} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 10 }}>
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Detect & Place</Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>Scan an item, review detection, then place it in your space</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }], marginBottom: 30 }}>
          <TouchableOpacity style={[styles.aiCard, { backgroundColor: accent }]} onPress={handleOpenCamera}>
            <View style={styles.aiIconContainer}>
              <Ionicons name="scan-outline" size={32} color={theme.background} />
              <Ionicons
                name="sparkles"
                size={16}
                color="#FFF"
                style={{ position: 'absolute', top: -5, right: -5 }}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.aiTitle}>Detect by Camera</Text>
              <Text style={styles.aiSub}>Scan your room or object to auto-suggest placement items</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.secondaryButton, { borderColor: accent }]} onPress={handleOpenGallery}>
            <Ionicons name="images-outline" size={20} color={accent} />
            <Text style={[styles.secondaryButtonText, { color: accent }]}>Scan from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: theme.subText }]}
            onPress={handleRefreshSuggestions}
          >
            <Ionicons name="refresh-outline" size={20} color={theme.text} />
            <Text style={[styles.secondaryButtonText, { color: theme.text }]}>Refresh Suggestions</Text>
          </TouchableOpacity>
        </View>

        {productName ? (
          <View style={[styles.productBanner, { backgroundColor: theme.card }]}>
            <Ionicons name="cube-outline" size={18} color={accent} />
            <Text style={[styles.productBannerText, { color: theme.text }]}>Placement model ready for {productName}</Text>
          </View>
        ) : null}

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Detected Candidates</Text>

        {isScanning ? (
          <View style={[styles.loadingCard, { backgroundColor: theme.card }]}>
            <ActivityIndicator color={accent} />
            <Text style={[styles.loadingText, { color: theme.text }]}>Analyzing scene and estimating placement...</Text>
          </View>
        ) : null}

        <View style={styles.grid}>
          {detectedObjects.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemCard,
                { backgroundColor: theme.card },
                selectedObject?.id === item.id && { borderColor: accent, borderWidth: 2 },
              ]}
              onPress={() => setSelectedObject(item)}
            >
              <View style={[styles.iconBox, { backgroundColor: theme.background }]}>
                <Ionicons name={item.icon as any} size={30} color={accent} />
              </View>
              <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.itemSize, { color: theme.subText }]}>{item.confidence}% match</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedObject ? (
          <View style={[styles.detailsCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.detailsTitle, { color: theme.text }]}>{selectedObject.name}</Text>
            <Text style={[styles.detailsSummary, { color: theme.subText }]}>{selectedObject.summary}</Text>
            <Text style={[styles.tipLabel, { color: accent }]}>Placement tip</Text>
            <Text style={[styles.tipText, { color: theme.text }]}>{resultDetails || selectedObject.placementTip}</Text>
            <TouchableOpacity
              style={[styles.placeButton, { backgroundColor: accent }]}
              onPress={() =>
                openResult(
                  'camera://placement-preview',
                  selectedObject,
                  resultDetails || selectedObject.placementTip,
                  viewerUrl
                )
              }
            >
              <Text style={styles.placeButtonText}>Continue to Placement Preview</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.liveViewerButton, { borderColor: theme.glassBorder, backgroundColor: theme.background }]}
              onPress={() => void handleOpenLiveViewer()}
            >
              <Ionicons name="open-outline" size={18} color={theme.text} />
              <Text style={[styles.liveViewerText, { color: theme.text }]}>Open Live Placement Viewer</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 50 },
  title: { fontSize: 32, fontWeight: '900' },
  subtitle: { fontSize: 16, marginTop: 5 },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  aiIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  aiSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 24 },
  secondaryButton: {
    flex: 1,
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { marginLeft: 8, fontSize: 13, fontWeight: '700' },
  productBanner: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productBannerText: { marginLeft: 10, fontSize: 14, fontWeight: '700', flex: 1 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  loadingCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: { marginLeft: 12, fontSize: 14, fontWeight: '600', flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  itemCard: { width: '48%', padding: 20, borderRadius: 25, marginBottom: 15, alignItems: 'center' },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemName: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  itemSize: { fontSize: 12, marginTop: 5 },
  detailsCard: { borderRadius: 24, padding: 20, marginTop: 10, marginBottom: 30 },
  detailsTitle: { fontSize: 22, fontWeight: '800', marginBottom: 6 },
  detailsSummary: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  tipLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  tipText: { fontSize: 15, lineHeight: 22, marginBottom: 18 },
  placeButton: { borderRadius: 18, paddingVertical: 16, alignItems: 'center' },
  placeButtonText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  liveViewerButton: {
    marginTop: 12,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  liveViewerText: { marginLeft: 8, fontSize: 14, fontWeight: '700' },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  cameraOverlay: {
    flex: 1,
    padding: 28,
    paddingTop: 56,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.16)',
  },
  cameraHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.42)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  liveBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '800', marginLeft: 8, letterSpacing: 1 },
  scanFrame: {
    height: 320,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanCorner: { position: 'absolute', width: 42, height: 42, borderColor: '#FFF' },
  topLeft: { top: 18, left: 18, borderTopWidth: 4, borderLeftWidth: 4 },
  topRight: { top: 18, right: 18, borderTopWidth: 4, borderRightWidth: 4 },
  bottomLeft: { bottom: 18, left: 18, borderBottomWidth: 4, borderLeftWidth: 4 },
  bottomRight: { bottom: 18, right: 18, borderBottomWidth: 4, borderRightWidth: 4 },
  scanText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  captureButton: {
    alignSelf: 'center',
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  captureInner: { width: 58, height: 58, borderRadius: 29 },
});
