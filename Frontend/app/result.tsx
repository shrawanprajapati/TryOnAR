import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import PageTransition from '../components/PageTransition';
import { useTheme } from '../context/ThemeContext';

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function ResultScreen() {
  const router = useRouter();
  const { theme, accent } = useTheme();
  const params = useLocalSearchParams();
  const imageUri = readParam(params.imageUri as string | string[] | undefined) || '';
  const category = readParam(params.category as string | string[] | undefined) || '';
  const mode = readParam(params.mode as string | string[] | undefined) as
    | 'tryon'
    | 'detect'
    | undefined;
  const details = readParam(params.details as string | string[] | undefined);
  const viewerUrl = readParam(params.viewerUrl as string | string[] | undefined);
  const confidence = readParam(params.confidence as string | string[] | undefined);
  const styleNote = readParam(params.styleNote as string | string[] | undefined);
  const productName = readParam(params.productName as string | string[] | undefined);
  const [isSaving, setIsSaving] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const screenTitle = mode === 'detect' ? 'Detection Result' : 'Your New Look';
  const badgeLabel = category || (mode === 'detect' ? 'Detected Object' : 'Try-On');
  const supportingText =
    details ||
    (mode === 'detect'
      ? 'Object recognized and ready for spatial placement.'
      : 'Preview ready. Save it or share it with your team.');
  const canExportImage = /^(file|content|ph|assets-library):/i.test(imageUri);
  const hasRenderableImage = Boolean(imageUri && !imageUri.startsWith('camera://'));
  const viewerLabel = mode === 'detect' ? 'Open Live Placement Viewer' : 'Open Live Try-On Viewer';

  const handleSave = async () => {
    if (!canExportImage) {
      Alert.alert('Preview only', 'Use a gallery image if you want to save the rendered result.');
      return;
    }

    setIsSaving(true);

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted' && imageUri) {
        await MediaLibrary.saveToLibraryAsync(imageUri);
        Alert.alert('Saved', 'Image saved to your gallery.');
      } else {
        Alert.alert('Permission Denied', 'We need permission to save photos.');
      }
    } catch {
      Alert.alert('Error', 'Could not save the image.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    if (!canExportImage) {
      Alert.alert('Preview only', 'Open the AR viewer to share the live preview link instead.');
      return;
    }

    try {
      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable && imageUri) {
        await Sharing.shareAsync(imageUri);
      } else {
        Alert.alert('Oops', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleOpenViewer = async () => {
    if (!viewerUrl) {
      Alert.alert('Viewer unavailable', 'No web viewer URL was attached to this result.');
      return;
    }

    try {
      await Linking.openURL(viewerUrl);
    } catch {
      Alert.alert('Viewer unavailable', 'The web viewer could not be opened.');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <PageTransition>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>{screenTitle}</Text>
        <View style={{ width: 28 }} />
      </View>

      <Animated.View
        style={[
          styles.imageCard,
          {
            backgroundColor: theme.card,
            shadowColor: theme.primary,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {hasRenderableImage ? (
          <Image source={{ uri: imageUri }} style={styles.resultImage} resizeMode="cover" />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: theme.tint }]}>
            <View style={[styles.placeholderOrb, { backgroundColor: accent }]}>
              <Ionicons
                name={mode === 'detect' ? 'scan-outline' : 'sparkles-outline'}
                size={42}
                color="#FFF"
              />
            </View>
            <Text style={[styles.placeholderTitle, { color: theme.text }]}>
              {mode === 'detect' ? 'Placement Preview Ready' : 'Try-On Preview Ready'}
            </Text>
            <Text style={[styles.placeholderSub, { color: theme.subText }]}>
              {mode === 'detect'
                ? 'The scene analysis is complete and ready in the viewer.'
                : 'Your fit analysis is ready in the viewer and summary below.'}
            </Text>
          </View>
        )}
        <View style={[styles.badge, { backgroundColor: theme.primary }]}>
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.summaryCard, { backgroundColor: theme.card, opacity: fadeAnim }]}>
        <Text style={[styles.summaryLabel, { color: theme.primary }]}>
          {mode === 'detect' ? 'Placement Insight' : 'Try-On Summary'}
        </Text>
        <Text style={[styles.summaryText, { color: theme.text }]}>{supportingText}</Text>

        {productName ? (
          <Text style={[styles.metaText, { color: theme.subText }]}>Product: {productName}</Text>
        ) : null}
        {confidence ? (
          <Text style={[styles.metaText, { color: theme.subText }]}>Confidence: {confidence}%</Text>
        ) : null}
        {styleNote ? (
          <Text style={[styles.metaText, { color: theme.subText }]}>Style note: {styleNote}</Text>
        ) : null}
      </Animated.View>

      <Animated.View style={[styles.actionRow, { opacity: fadeAnim }]}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.card }]} onPress={handleSave}>
          {isSaving ? (
            <ActivityIndicator color={theme.primary} />
          ) : (
            <>
              <Ionicons name="download-outline" size={24} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>Save</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.card }]} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={24} color={theme.primary} />
          <Text style={[styles.actionText, { color: theme.text }]}>Share</Text>
        </TouchableOpacity>
      </Animated.View>

      {viewerUrl ? (
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            style={[
              styles.viewerButton,
              { borderColor: theme.glassBorder, backgroundColor: theme.card },
            ]}
            onPress={handleOpenViewer}
          >
            <Ionicons name="open-outline" size={20} color={theme.primary} />
            <Text style={[styles.viewerText, { color: theme.text }]}>{viewerLabel}</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : null}

      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={[styles.mainButton, { backgroundColor: theme.primary }]}
          onPress={() => router.push((mode === 'detect' ? '/placement' : '/tryon') as any)}
        >
          <Text style={styles.mainButtonText}>
            {mode === 'detect' ? 'Scan Another Object' : 'Try Another Item'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
      </PageTransition>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 50, paddingBottom: 28 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  backButton: { padding: 5 },
  title: { fontSize: 24, fontWeight: 'bold' },
  imageCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginBottom: 20,
    minHeight: 320,
  },
  resultImage: { width: '100%', height: 320 },
  placeholder: { minHeight: 320, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  placeholderOrb: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
  placeholderTitle: { marginTop: 18, fontSize: 22, fontWeight: '800' },
  placeholderSub: { marginTop: 10, textAlign: 'center' },
  badge: { position: 'absolute', top: 15, right: 15, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  badgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  summaryCard: { borderRadius: 18, padding: 18, marginBottom: 18 },
  summaryLabel: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  summaryText: { fontSize: 15, lineHeight: 22 },
  metaText: { marginTop: 10, fontSize: 13, lineHeight: 18 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 15, marginHorizontal: 5, elevation: 2 },
  actionText: { marginLeft: 10, fontSize: 16, fontWeight: '600' },
  viewerButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewerText: { marginLeft: 10, fontSize: 15, fontWeight: '700' },
  mainButton: { padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  mainButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
