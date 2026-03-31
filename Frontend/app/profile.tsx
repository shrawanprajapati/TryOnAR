import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext'; // Dynamic Theme Hook

export default function Profile() {
  const router = useRouter();
  const { theme, accent } = useTheme(); // Pull colors dynamically!
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // FUTURE FIREBASE FETCH GOES HERE
  useEffect(() => {
    // Simulating fetching data from Firebase Firestore
    setTimeout(() => {
      setUserData({ 
        name: "Shrawan Prajapati", 
        email: "shrawan@iiti.ac.in", 
        role: "AR Developer @IIT Indore",
        id: "TAR90001"
      });
      setLoading(false);
    }, 1200); // Fake 1.2 second loading time
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Profile</Text>
        <Pressable onPress={() => router.push("/settings")} style={styles.backBtn}>
          <Ionicons name="pencil-outline" size={20} color={accent} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={accent} />
          <Text style={{ color: theme.subText, marginTop: 10 }}>Fetching account...</Text>
        </View>
      ) : (
        <View style={styles.scrollContent}>

          {/* 1. LARGE PROFILE AVATAR BLOCK */}
          <View style={styles.avatarBlock}>
            <View style={[styles.avatarGlow, { backgroundColor: accent + '10', borderColor: accent + '20' }]}>
              {/* Profile Image - Placeholder is an initial 'S' */}
              <View style={[styles.avatarCircle, { backgroundColor: theme.card, borderColor: accent }]}>
                <Text style={[styles.avatarInitial, { color: accent }]}>S</Text>
              </View>
              {/* Verification Badge */}
              <View style={[styles.verifiedBadge, { backgroundColor: accent }]}>
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            </View>
            <Text style={[styles.userName, { color: theme.text }]}>{userData?.name}</Text>
            <Text style={[styles.userRole, { color: theme.subText }]}>{userData?.role}</Text>
          </View>

          {/* 2. USER INFORMATION CARD */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.subText + '10' }]}>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={18} color={theme.subText} style={styles.icon} />
              <View>
                <Text style={styles.label}>Email Address</Text>
                <Text style={[styles.value, { color: theme.text }]}>{userData?.email}</Text>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.background + '80' }]} />
            <View style={styles.infoRow}>
              <Ionicons name="key-outline" size={18} color={theme.subText} style={styles.icon} />
              <View>
                <Text style={styles.label}>Member ID</Text>
                <Text style={[styles.value, { color: theme.text }]}>{userData?.id}</Text>
              </View>
            </View>
          </View>

          {/* 3. PROFILE ACTIONS */}
          <View style={styles.actionGrid}>
            <View style={[styles.actionCard, { backgroundColor: theme.card }]}>
              <Ionicons name="heart-outline" size={24} color={accent} style={{ marginBottom: 10 }} />
              <Text style={[styles.actionLabel, { color: theme.text }]}>Favorites</Text>
              <Text style={[styles.actionValue, { color: accent }]}>12</Text>
            </View>
            <View style={[styles.actionCard, { backgroundColor: theme.card }]}>
              <Ionicons name="history" size={24} color={accent} style={{ marginBottom: 10 }} />
              <Text style={[styles.actionLabel, { color: theme.text }]}>Try-On History</Text>
              <Text style={[styles.actionValue, { color: accent }]}>45</Text>
            </View>
          </View>

        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(150,150,150,0.1)' },
  backBtn: { padding: 8, borderRadius: 20 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  
  avatarBlock: { alignItems: 'center', marginTop: 30, marginBottom: 30 },
  avatarGlow: { padding: 8, borderRadius: 100, borderWidth: 1, marginBottom: 20, position: 'relative' },
  avatarCircle: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15 },
  avatarInitial: { fontSize: 44, fontWeight: '800' },
  verifiedBadge: { position: 'absolute', right: 5, bottom: 5, width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  userName: { fontSize: 24, fontWeight: "bold", marginBottom: 6, letterSpacing: 0.5 },
  userRole: { fontSize: 13, fontWeight: '500', textAlign: 'center', paddingHorizontal: 10 },

  card: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, elevation: 10, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  icon: { marginRight: 20 },
  label: { color: '#888', fontSize: 12, marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '600' },
  divider: { height: 1, marginLeft: 60 },

  actionGrid: { flexDirection: 'row', gap: 15, marginTop: 25 },
  actionCard: { flex: 1, padding: 20, borderRadius: 20, alignItems: 'center', elevation: 5, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.05, shadowRadius: 10 },
  actionLabel: { fontSize: 12, fontWeight: '600', marginBottom: 5 },
  actionValue: { fontSize: 28, fontWeight: '800' },
});