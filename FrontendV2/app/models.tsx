import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import PageTransition from '../components/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useProtectedRoute } from '../hooks/use-protected-route';
import { fetchWorkspaceOverview, type WorkspaceOverview } from '../lib/api';

export default function ModelsScreen() {
  const router = useRouter();
  const { theme, accent } = useTheme();
  const { token } = useAuth();
  const { isAuthenticated, isReady } = useProtectedRoute();
  const [workspace, setWorkspace] = useState<WorkspaceOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadWorkspace = async () => {
        if (!token) {
          return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
          const response = await fetchWorkspaceOverview(token);

          if (isActive) {
            setWorkspace(response);
          }
        } catch (error) {
          if (isActive) {
            setErrorMessage(error instanceof Error ? error.message : 'Could not load workspace models.');
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      void loadWorkspace();

      return () => {
        isActive = false;
      };
    }, [token])
  );

  if (!isReady) {
    return (
      <View style={[styles.stateScreen, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={accent} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <PageTransition>
        <View style={styles.header}>
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: theme.glassBg, borderColor: theme.glassBorder }]} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>My Models</Text>
          <View style={{ width: 42 }} />
        </View>

        {isLoading ? (
          <View style={styles.stateScreen}>
            <ActivityIndicator color={accent} />
            <Text style={[styles.stateText, { color: theme.subText }]}>Loading backend models...</Text>
          </View>
        ) : null}

        {!isLoading && errorMessage ? (
          <GlassCard style={styles.stateCard}>
            <Text style={[styles.cardText, { color: theme.text }]}>{errorMessage}</Text>
          </GlassCard>
        ) : null}

        {!isLoading && !errorMessage && workspace?.models.map((item) => (
          <GlassCard key={item.id} style={styles.card}>
            <View style={styles.row}>
              <Image source={{ uri: item.imageUrl }} style={styles.preview} resizeMode="cover" />
              <View style={styles.details}>
                <Text style={[styles.category, { color: accent }]}>{(item.category || 'AR ready').toUpperCase()}</Text>
                <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.cardText, { color: theme.subText }]}>Model slug: {item.modelSlug || 'ready'}</Text>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: accent }]}
                  onPress={() =>
                    router.push({
                      pathname: '/product' as any,
                      params: {
                        productId: String(item.id),
                        name: item.title,
                        imageUrl: item.imageUrl,
                        category: item.category || '',
                        modelSlug: item.modelSlug || '',
                      },
                    })
                  }
                >
                  <Text style={styles.actionText}>Open Model</Text>
                </TouchableOpacity>
              </View>
            </View>
          </GlassCard>
        ))}
      </PageTransition>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  stateScreen: { alignItems: 'center', justifyContent: 'center', paddingVertical: 30 },
  stateText: { marginTop: 10, textAlign: 'center' },
  stateCard: { marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  card: { marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center' },
  preview: { width: 92, height: 110, borderRadius: 18, marginRight: 16 },
  details: { flex: 1 },
  category: { fontSize: 11, fontWeight: '800', letterSpacing: 1.1, marginBottom: 6 },
  cardTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  cardText: { fontSize: 14, lineHeight: 20 },
  actionButton: { alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginTop: 14 },
  actionText: { color: '#FFFFFF', fontWeight: '800' },
});
