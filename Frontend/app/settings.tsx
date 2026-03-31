import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';

const ACCENT_COLORS = ['#8A2BE2', '#FF3366', '#00C9A7', '#FF8C00', '#007AFF'];

export default function Settings() {
  const { isDark, toggleTheme, theme, accent, setAccent } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: theme.text }]}>Settings</Text>

      <GlassCard style={styles.section}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
          <Switch 
            value={isDark} 
            onValueChange={toggleTheme} 
            trackColor={{ false: theme.subText, true: accent }}
            thumbColor={'#FFF'}
          />
        </View>
      </GlassCard>

      <GlassCard style={styles.section}>
        <Text style={[styles.label, { color: theme.text, marginBottom: 15 }]}>Accent Color</Text>
        <View style={styles.colorRow}>
          {ACCENT_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setAccent(color)}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                accent === color && { borderWidth: 3, borderColor: theme.text }
              ]}
            />
          ))}
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  header: { fontSize: 32, fontWeight: 'bold', marginBottom: 30 },
  section: { marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 18, fontWeight: '500' },
  colorRow: { flexDirection: 'row', justifyContent: 'space-between' },
  colorCircle: { width: 40, height: 40, borderRadius: 20 },
});