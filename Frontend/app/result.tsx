import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { useTheme } from '../context/ThemeContext';

export default function ResultScreen() {
  const router = useRouter();
  const { theme } = useTheme(); // FIXED: Removed standalone 'primary'
  const { imageUri, category } = useLocalSearchParams<{ imageUri: string, category: string }>();
  
  const [isSaving, setIsSaving] = useState(false);
  
  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Trigger Animation on Load
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
      })
    ]).start();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        await MediaLibrary.saveToLibraryAsync(imageUri);
        Alert.alert('Success', 'Image saved to your gallery! 🎉');
      } else {
        Alert.alert('Permission Denied', 'We need permission to save photos.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not save the image.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(imageUri);
      } else {
        Alert.alert('Oops', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Your New Look</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Animated Image Card */}
      <Animated.View style={[
        styles.imageCard, 
        { backgroundColor: theme.card, shadowColor: theme.primary, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.resultImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={60} color={theme.subText} />
            <Text style={{ color: theme.subText, marginTop: 10 }}>No image provided</Text>
          </View>
        )}
        <View style={[styles.badge, { backgroundColor: theme.primary }]}>
          <Text style={styles.badgeText}>{category || 'Try-On'}</Text>
        </View>
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

      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity 
          style={[styles.mainButton, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/tryon' as any)}
        >
          <Text style={styles.mainButtonText}>Try Another Item</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  backButton: { padding: 5 },
  title: { fontSize: 24, fontWeight: 'bold' },
  imageCard: { flex: 1, borderRadius: 20, overflow: 'hidden', elevation: 10, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, marginBottom: 30 },
  resultImage: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: 15, right: 15, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  badgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 15, marginHorizontal: 5, elevation: 2 },
  actionText: { marginLeft: 10, fontSize: 16, fontWeight: '600' },
  mainButton: { padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  mainButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});