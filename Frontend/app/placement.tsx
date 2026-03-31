import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function PlacementScreen() {
  const { theme, accent } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: accent }]}> 
        <Text style={[styles.title, { color: theme.text }]}>Room Placement</Text>
        <Text style={[styles.body, { color: theme.subText }]}>This screen is ready for the next AR placement step.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { borderWidth: 1, borderRadius: 24, padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: '800' },
  body: { fontSize: 15, lineHeight: 22 },
});
