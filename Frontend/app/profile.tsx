import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, accent } = useTheme();

  // Streamlined profile options without orders or payments
  const profileOptions = [
    { id: '1', title: 'Personal Details', icon: 'person-outline', route: '/settings' },
    { id: '2', title: 'App Settings', icon: 'settings-outline', route: '/settings' },
    { id: '3', title: 'Help & Support', icon: 'help-circle-outline', route: '/settings' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={[styles.backBtn, { backgroundColor: theme.glassBg, borderColor: theme.glassBorder, borderWidth: 1 }]}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Profile</Text>
        <View style={{ width: 44 }} /> {/* Spacer to keep title centered */}
      </View>

      {/* Profile Info Section */}
      <View style={styles.profileSection}>
        <View style={[styles.avatarContainer, { borderColor: accent, backgroundColor: theme.tint }]}>
          <Ionicons name="person" size={50} color={accent} />
        </View>
        <Text style={[styles.name, { color: theme.text }]}>John Doe</Text>
        <Text style={{ color: theme.subText }}>john.doe@example.com</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>

      {/* Menu Options using GlassCard for perfect contrast */}
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
            
            {/* Divider between items */}
            {index < profileOptions.length - 1 && (
              <View style={[styles.divider, { backgroundColor: theme.glassBorder }]} />
            )}
          </React.Fragment>
        ))}
      </GlassCard>

      {/* Standalone Logout Button */}
      <TouchableOpacity 
        style={[styles.logoutBtn, { borderColor: '#FF3B30', backgroundColor: theme.glassBg }]} 
        onPress={() => router.replace('/login')}
      >
        <Ionicons name="log-out-outline" size={22} color="#FF3B30" style={{ marginRight: 10 }} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 25, 
    paddingTop: 60 
  },
  backBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    letterSpacing: 1 
  },
  profileSection: { 
    alignItems: 'center', 
    marginTop: 10, 
    marginBottom: 30 
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
    marginBottom: 5 
  },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginHorizontal: 25, 
    marginBottom: 15, 
    textTransform: 'uppercase', 
    letterSpacing: 1 
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
    paddingHorizontal: 20 
  },
  menuIconBox: { 
    width: 42, 
    height: 42, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  menuText: { 
    flex: 1, 
    fontSize: 16, 
    fontWeight: '600' 
  },
  divider: { 
    height: 1, 
    marginHorizontal: 20 
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
  }
});