import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import PageTransition from '../components/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useProtectedRoute } from '../hooks/use-protected-route';
import { buildViewerUrl, fetchWorkspaceOverview, type WorkspaceOverview } from '../lib/api';

function inferMode(title: string, subtitle: string) {
  return /room|place|scene|decor|lamp/i.test(`${title} ${subtitle}`) ? 'detect' : 'tryon';
}

export default function SnapshotsScreen() {
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
            setErrorMessage(error instanceof Error ? error.message : 'Could not load workspace snapshots.');
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
          <Text style={[styles.headerTitle, { color: theme.text }]}>Snapshots</Text>
          <View style={{ width: 42 }} />
        </View>

        {isLoading ? (
          <View style={styles.stateScreen}>
            <ActivityIndicator color={accent} />
            <Text style={[styles.stateText, { color: theme.subText }]}>Loading saved sessions...</Text>
          </View>
        ) : null}

        {!isLoading && errorMessage ? (
          <GlassCard style={styles.stateCard}>
            <Text style={[styles.cardText, { color: theme.text }]}>{errorMessage}</Text>
          </GlassCard>
        ) : null}

        {!isLoading && !errorMessage && workspace?.snapshots.map((item) => {
          const mode = inferMode(item.title, item.subtitle);
          const viewerUrl = buildViewerUrl({
            mode: mode === 'detect' ? 'placement' : 'tryon',
            target: item.title,
            category: item.subtitle,
          });

          return (
            <GlassCard key={item.id} style={styles.card}>
              <View style={styles.row}>
                <View style={[styles.iconWrap, { backgroundColor: theme.tint }]}> 
                  <Ionicons name={mode === 'detect' ? 'scan-outline' : 'sparkles-outline'} size={28} color={accent} />
                </View>
                <View style={styles.details}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.cardText, { color: theme.subText }]}>{item.subtitle}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.actionSecondary, { borderColor: theme.glassBorder }]}
                      onPress={() =>
                        router.push({
                          pathname: '/result' as any,
                          params: {
                            imageUri: '',
                            category: item.title,
                            mode,
                            details: item.subtitle,
                            viewerUrl,
                          },
                        })
                      }
                    >
                      <Text style={[styles.secondaryText, { color: theme.text }]}>Open Summary</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionPrimary, { backgroundColor: accent }]}
                      onPress={() =>
                        router.push({
                          pathname: mode === 'detect' ? '/placement' as any : '/tryon' as any,
                          params: {
                            category: item.title,
                            productName: item.subtitle,
                          },
                        })
                      }
                    >
                      <Text style={styles.primaryText}>Run Again</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </GlassCard>
          );
        })}
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
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  iconWrap: { width: 58, height: 58, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  details: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  cardText: { fontSize: 14, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  actionSecondary: { flex: 1, borderRadius: 12, borderWidth: 1, paddingVertical: 12, alignItems: 'center' },
  actionPrimary: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  secondaryText: { fontWeight: '700' },
  primaryText: { color: '#FFFFFF', fontWeight: '800' },
});
