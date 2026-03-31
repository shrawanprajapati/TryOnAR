import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AnimatedBackground from '../components/AnimatedBackground';

const { height, width } = Dimensions.get('window');

type Category = { id: string; name: string; icon: keyof typeof Ionicons.glyphMap; };

const categories: Category[] = [
  { id: '1', name: 'Eyewear', icon: 'glasses-outline' },
  { id: '2', name: 'Jackets', icon: 'shirt-outline' },
  { id: '3', name: 'Shirts', icon: 'shirt' },
  { id: '4', name: 'Shoes', icon: 'footsteps-outline' },
  { id: '5', name: 'Watches', icon: 'watch-outline' },
  { id: '6', name: 'Hats', icon: 'school-outline' },
  { id: '7', name: 'Makeup AR', icon: 'color-palette-outline' },
  { id: '8', name: 'Hair Styles', icon: 'cut-outline' },
  { id: '9', name: 'Tattoos', icon: 'rose-outline' },
  { id: '10', name: 'Jewelry', icon: 'diamond-outline' },
  { id: '11', name: 'Nails', icon: 'hand-left-outline' },
  { id: '12', name: 'AR Masks', icon: 'happy-outline' },
];

export default function TryOnScreen() {
  const { theme, accent } = useTheme();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fadeAnims = useRef(categories.map(() => new Animated.Value(0))).current;
  const translateYAnims = useRef(categories.map(() => new Animated.Value(20))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = categories.map((_, i) => {
      return Animated.parallel([
        Animated.timing(fadeAnims[i], { toValue: 1, duration: 400, delay: i * 50, useNativeDriver: true }),
        Animated.timing(translateYAnims[i], { toValue: 0, duration: 400, delay: i * 50, useNativeDriver: true })
      ]);
    });
    Animated.stagger(50, animations).start();
  }, []);

  useEffect(() => {
    if (isCameraOpen) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, { toValue: height * 0.6, duration: 2500, useNativeDriver: true }),
          Animated.timing(scanLineAnim, { toValue: 0, duration: 2500, useNativeDriver: true })
        ])
      ).start();
    }
  }, [isCameraOpen]);

  useEffect(() => {
    if (isProcessing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.95, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true })
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isProcessing]);

  const handleOpenCamera = async () => {
    if (!permission?.granted) {
      const { status } = await requestPermission();
      if (status !== 'granted') return Alert.alert('Permission needed', 'Camera access is required!');
    }
    setIsCameraOpen(true);
  };

  const handleOpenGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
    if (!result.canceled && result.assets.length > 0) processWithML(result.assets[0].uri);
  };

  const processWithML = (photoUri: string) => {
    setIsCameraOpen(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      router.push({ pathname: '/result' as any, params: { imageUri: photoUri, category: selectedCategory?.name || 'Item' } });
    }, 2500);
  };

  if (isCameraOpen) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="front">
          <Animated.View style={[styles.laserScanner, { backgroundColor: accent, shadowColor: accent, transform: [{ translateY: scanLineAnim }] }]} />
          <View style={styles.cameraOverlay}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <View style={styles.recordingPill}>
                <View style={[styles.redDot, { backgroundColor: accent }]} />
                <Text style={styles.recordingText}>LIVE AR</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsCameraOpen(false)}>
                <Ionicons name="close-circle" size={40} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.viewfinder}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <TouchableOpacity style={[styles.captureButton, { borderColor: accent }]} onPress={() => processWithML('dummy_uri')}>
              <View style={[styles.captureInner, { backgroundColor: accent }]} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <AnimatedBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 15, width: 40 }}>
            <Ionicons name="arrow-back" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Virtual Try-On</Text>
          <Text style={[styles.subtitle, { color: theme.subText }]}>Select a feature to explore</Text>
        </View>

        <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
          {categories.map((item, index) => (
            <Animated.View key={item.id} style={{ width: '31%', opacity: fadeAnims[index], transform: [{ translateY: translateYAnims[index] }] }}>
              <TouchableOpacity
                style={[
                  styles.card,
                  { backgroundColor: theme.card },
                  selectedCategory?.id === item.id && { borderColor: accent, borderWidth: 2, backgroundColor: theme.tint, transform: [{scale: 1.05}] }
                ]}
                onPress={() => setSelectedCategory(item)}
                activeOpacity={0.7}
              >
                <Ionicons name={item.icon} size={32} color={selectedCategory?.id === item.id ? accent : theme.text} />
                <Text style={[styles.cardText, { color: theme.text }, selectedCategory?.id === item.id && { color: accent, fontWeight: 'bold' }]} numberOfLines={1}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: theme.background }]}>
          {isProcessing ? (
            <Animated.View style={[styles.mainButton, { backgroundColor: accent, transform: [{ scale: pulseAnim }] }]}>
              <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.mainButtonText}>Applying Magic ML...</Text>
            </Animated.View>
          ) : (
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={[styles.halfButton, { backgroundColor: theme.card, borderColor: selectedCategory ? accent : theme.subText, borderWidth: 1, opacity: selectedCategory ? 1 : 0.5 }]} onPress={handleOpenGallery} disabled={!selectedCategory}>
                <Ionicons name="images" size={24} color={selectedCategory ? accent : theme.subText} style={{ marginBottom: 5 }} />
                <Text style={[styles.halfButtonText, { color: theme.text }]}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.halfButton, { backgroundColor: selectedCategory ? accent : theme.subText, opacity: selectedCategory ? 1 : 0.5 }]} onPress={handleOpenCamera} disabled={!selectedCategory}>
                <Ionicons name="camera" size={24} color="#fff" style={{ marginBottom: 5 }} />
                <Text style={[styles.halfButtonText, { color: '#fff' }]}>Live AR</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 50, zIndex: 10 },
  title: { fontSize: 32, fontWeight: '900' },
  subtitle: { fontSize: 16, marginTop: 5 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: '3.5%', padding: 15, paddingBottom: 150 },
  card: { paddingVertical: 20, paddingHorizontal: 5, borderRadius: 20, alignItems: 'center', marginBottom: 15, elevation: 4, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5 },
  cardText: { marginTop: 10, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: 40, borderTopLeftRadius: 35, borderTopRightRadius: 35, elevation: 20, shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 15 },
  actionButtonsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  halfButton: { width: '48%', padding: 18, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  halfButtonText: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  mainButton: { flexDirection: 'row', padding: 18, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  mainButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  laserScanner: { position: 'absolute', width: '100%', height: 3, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10, elevation: 10, zIndex: 5, top: '20%' },
  cameraOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'space-between', alignItems: 'center', padding: 30, paddingTop: 60, zIndex: 10 },
  recordingPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  redDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  recordingText: { color: '#FFF', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
  closeButton: { backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 25 },
  viewfinder: { width: 250, height: 350, position: 'relative', marginTop: -50 },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#FFF', borderWidth: 0 },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  captureButton: { width: 76, height: 76, borderRadius: 38, borderWidth: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 20, backgroundColor: 'rgba(0,0,0,0.3)' },
  captureInner: { width: 56, height: 56, borderRadius: 28 }
});