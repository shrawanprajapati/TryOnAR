import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext'; // Dynamic Theme Hook

const ACCENT_PALETTE = ['#00E5FF', '#b388eb', '#FF2A5F', '#00FF87', '#FFD700', '#FF8F00']; // Blue, Purple, Pink, Green, Gold, Orange

export default function Settings() {
  const router = useRouter();
  const { isDark, setIsDark, accent, setAccent, theme } = useTheme(); // Read and Write Theme!

  // Reusable component for a settings row
  const SettingItem = ({ icon, label, children }: any) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLabelGroup}>
        <Ionicons name={icon} size={22} color={isDark ? accent : theme.subText} style={styles.icon} />
        <Text style={[styles.settingText, { color: theme.text }]}>{label}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 40 }} /> {/* Spacer to center the title */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* APPEARANCE SECTION */}
        <Text style={[styles.sectionTitle, { color: accent }]}>APPEARANCE</Text>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.subText + '10' }]}>
          
          <SettingItem icon="moon-outline" label="Dark Mode">
            <Switch 
              trackColor={{ false: "#d3d3d3", true: accent }}
              thumbColor={"#fff"}
              onValueChange={setIsDark}
              value={isDark}
            />
          </SettingItem>

          <View style={[styles.divider, { backgroundColor: theme.background + '80' }]} />

          <View style={styles.colorPaletteBlock}>
            <View style={styles.settingLabelGroup}>
              <Ionicons name="color-palette-outline" size={22} color={isDark ? accent : theme.subText} style={styles.icon} />
              <Text style={[styles.settingText, { color: theme.text }]}>Accent Color</Text>
            </View>
            
            <View style={styles.colorPaletteRow}>
              {ACCENT_PALETTE.map((color) => (
                <TouchableOpacity 
                  key={color} 
                  onPress={() => setAccent(color)}
                  style={[
                    styles.colorCircle, 
                    { backgroundColor: color, borderWidth: accent === color ? 3 : 0, borderColor: theme.text }
                  ]} 
                />
              ))}
            </View>
          </View>
        </View>

        {/* ACCOUNT SECTION */}
        <Text style={[styles.sectionTitle, { color: accent }]}>ACCOUNT</Text>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.subText + '10' }]}>
          <SettingItem icon="person-outline" label="Edit Profile">
            <Ionicons name="chevron-forward" size={18} color={theme.subText} />
          </SettingItem>
          <View style={[styles.divider, { backgroundColor: theme.background + '80' }]} />
          <SettingItem icon="lock-closed-outline" label="Change Password">
            <Ionicons name="chevron-forward" size={18} color={theme.subText} />
          </SettingItem>
        </View>

        {/* SUPPORT SECTION */}
        <Text style={[styles.sectionTitle, { color: accent }]}>SUPPORT</Text>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.subText + '10' }]}>
          <SettingItem icon="help-circle-outline" label="Help Center">
            <Ionicons name="chevron-forward" size={18} color={theme.subText} />
          </SettingItem>
          <View style={[styles.divider, { backgroundColor: theme.background + '80' }]} />
          <SettingItem icon="shield-checkmark-outline" label="Privacy Policy">
            <Ionicons name="chevron-forward" size={18} color={theme.subText} />
          </SettingItem>
        </View>

        {/* LOGOUT BUTTON */}
        <Pressable 
          style={({ pressed }) => [styles.logoutBtn, { backgroundColor: pressed ? '#dd3333' : '#ff4444' }]} 
          onPress={() => router.replace("/login")} // FUTURE: Sign out from Firebase
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        <Text style={styles.versionText}>TryOnAR v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(150,150,150,0.1)' },
  backBtn: { padding: 8, borderRadius: 20 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  
  sectionTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 1.5, marginTop: 30, marginBottom: 12, marginLeft: 10 },
  card: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, elevation: 8, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 15 },
  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 18 },
  divider: { height: 1, marginLeft: 50 },
  settingLabelGroup: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 15 },
  settingText: { fontSize: 16, fontWeight: '500' },
  
  colorPaletteBlock: { padding: 18, paddingBottom: 25 },
  colorPaletteRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginLeft: 35 },
  colorCircle: { width: 34, height: 34, borderRadius: 17, elevation: 5, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 },
  
  logoutBtn: { flexDirection: 'row', padding: 18, borderRadius: 20, alignItems: "center", justifyContent: 'center', marginTop: 40, elevation: 10, shadowColor: '#ff4444', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10 },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  versionText: { textAlign: 'center', color: '#888', fontSize: 11, marginTop: 25, letterSpacing: 1 },
});