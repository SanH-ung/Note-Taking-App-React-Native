// screens/SettingsScreen.tsx
// Settings screen - stores preferences using AsyncStorage (Lecture 4A)
// Uses Switch component (Lecture 3B)

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';

const SETTINGS_KEY = 'APP_SETTINGS';

function SettingsScreen() {
  // Switch - Lecture 3B pattern
  const [autoSync, setAutoSync] = useState(false);
  const [showSyncBadge, setShowSyncBadge] = useState(true);

  // Load settings on mount - AsyncStorage (Lecture 4A)
  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((val) => {
      if (val) {
        const parsed = JSON.parse(val);
        setAutoSync(parsed.autoSync ?? false);
        setShowSyncBadge(parsed.showSyncBadge ?? true);
      }
    });
  }, []);

  const saveSettings = async () => {
    await AsyncStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ autoSync, showSyncBadge }),
    );
    ToastAndroid.show('Settings saved!', ToastAndroid.SHORT);
  };

  const clearAllNotes = async () => {
    await AsyncStorage.removeItem('NOTES');
    ToastAndroid.show('All notes cleared!', ToastAndroid.SHORT);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.card}>
        {/* Switch - Lecture 3B */}
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Auto Sync</Text>
            <Text style={styles.rowDesc}>Automatically sync notes when online</Text>
          </View>
          <Switch
            value={autoSync}
            onValueChange={setAutoSync}
            trackColor={{ false: '#d1d5db', true: '#4CAF50' }}
            thumbColor={autoSync ? '#fff' : '#f3f4f6'}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Show Sync Badge</Text>
            <Text style={styles.rowDesc}>Show pending sync count on Cloud tab</Text>
          </View>
          <Switch
            value={showSyncBadge}
            onValueChange={setShowSyncBadge}
            trackColor={{ false: '#d1d5db', true: '#4CAF50' }}
            thumbColor={showSyncBadge ? '#fff' : '#f3f4f6'}
          />
        </View>
      </View>

      {/* Storage info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Storage</Text>
        <Text style={styles.infoText}>Notes are stored locally using AsyncStorage.</Text>
        <Text style={styles.infoText}>Cloud sync uses REST API + WebSocket.</Text>
        <Text style={styles.infoText}>Server: http://10.0.2.2:5000</Text>
      </View>

      <CustomButton title="💾 Save Settings" onPress={saveSettings} />
      <CustomButton title="🗑 Clear All Local Notes" onPress={clearAllNotes} />

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 12 },
  header: { fontSize: 22, fontWeight: '700', color: '#1f2937', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowText: { flex: 1, marginRight: 12 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  rowDesc: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 4 },
  infoCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#15803d', marginBottom: 6 },
  infoText: { fontSize: 13, color: '#374151', marginBottom: 3 },
});

export default SettingsScreen;