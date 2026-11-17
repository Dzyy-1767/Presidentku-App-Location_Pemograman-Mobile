import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Header() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.headerContainer,
        { paddingTop: Math.max(insets.top, 16) + 6 },
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" translucent />
      <View style={styles.content}>
        <View style={styles.brandRow}>
          <View style={styles.crownWrapper}>
            <MaterialCommunityIcons name="crown" size={24} color="#FBBF24" />
          </View>
          <Text style={styles.brandTitle}>PRESIDENTKU</Text>
        </View>
        <Text style={styles.brandSubtitle}>Location Based Service System</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#0F172A',
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownWrapper: {
    marginRight: 8,
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    padding: 6,
    borderRadius: 12,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2.5,
  },
  brandSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginTop: 4,
  },
});
