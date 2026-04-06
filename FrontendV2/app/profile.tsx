import React, { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import PageTransition from '../components/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useProtectedRoute } from '../hooks/use-protected-route';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, accent } = useTheme();
  const { refreshProfile, signOut, user } = useAuth();
  const { isAuthenticated, isReady } = useProtectedRoute();

  const profileOptions = [
    { id: '1', title: 'Personal Details', icon: 'person-outline', route: '/account' },
    { id: '2', title: 'My Models', icon: 'cube-outline', route: '/models' },
    { id: '3', title: 'Snapshots', icon: 'images-outline', route: '/snapshots' },
    { id: '4', title: 'App Settings', icon: 'settings-outline', route: '/settings' },
    { id: '5', title: 'Help & Support', icon: 'help-circle-outline', route: '/support' },
  ];

  useFocusEffect(
    useCallback(() => {
      void refreshProfile().catch(() => {
        // The auth provider handles stale sessions separately.
      });
    }, [refreshProfile])
  );

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <PageTransition>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: theme.glassBg, borderColor: theme.glassBorder, borderWidth: 1 }]}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>My Profile</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.profileSection}>
          <View style={[styles.avatarContainer, { borderColor: accent, backgroundColor: theme.tint }]}>
            <Ionicons name="person" size={50} color={accent} />
          </View>
          <Text style={[styles.name, { color: theme.text }]}>{user?.name || 'AR Creator'}</Text>
          <Text style={{ color: theme.subText }}>{user?.email || 'No email connected'}</Text>
          <Text style={[styles.role, { color: accent }]}>{user?.role || 'AR Creator'}</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Workspace</Text>

        <GlassCard style={styles.menuContainer}>
          {profileOptions.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity style={styles.menuItem} onPress={() => router.push(item.route as any)}>
                <View style={[styles.menuIconBox, { backgroundColor: theme.glassBg }]}>
                  <Ionicons name={item.icon as any} size={22} color={accent} />
                </View>
                <Text style={[styles.menuText, { color: theme.text }]}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.subText} />
              </TouchableOpacity>

              {index < profileOptions.length - 1 ? (
                <View style={[styles.divider, { backgroundColor: theme.glassBorder }]} />
              ) : null}
            </React.Fragment>
          ))}
        </GlassCard>

        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: '#FF3B30', backgroundColor: theme.glassBg }]}
          onPress={() => void handleLogout()}
        >
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" style={{ marginRight: 10 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </PageTransition>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingBottom: 40,
  },
  stateScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    paddingTop: 60,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 5,
  },
  role: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 25,
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuContainer: {
    marginHorizontal: 20,
    paddingVertical: 5,
    paddingHorizontal: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingHorizontal: 20,
  },
  menuIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 20,
    borderWidth: 1,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
