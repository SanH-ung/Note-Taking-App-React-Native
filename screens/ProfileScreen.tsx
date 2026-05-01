// screens/ProfileScreen.tsx
// Profile screen - stores user info using AsyncStorage (Lecture 4A)
// Uses TextInput (Lecture 3A) and CustomInput/CustomButton

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const PROFILE_KEY = 'USER_PROFILE';

function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  // Load profile from AsyncStorage on mount (Lecture 4A pattern)
  useEffect(() => {
    AsyncStorage.getItem(PROFILE_KEY).then((val) => {
      if (val) {
        const parsed = JSON.parse(val);
        setName(parsed.name ?? '');
        setEmail(parsed.email ?? '');
        setBio(parsed.bio ?? '');
      }
    });
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      ToastAndroid.show('Name cannot be empty.', ToastAndroid.SHORT);
      return;
    }
    await AsyncStorage.setItem(
      PROFILE_KEY,
      JSON.stringify({ name: name.trim(), email: email.trim(), bio: bio.trim() }),
    );
    ToastAndroid.show('Profile saved!', ToastAndroid.SHORT);
  };

  const handleClear = async () => {
    await AsyncStorage.removeItem(PROFILE_KEY);
    setName('');
    setEmail('');
    setBio('');
    ToastAndroid.show('Profile cleared.', ToastAndroid.SHORT);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Avatar placeholder */}
      <View style={styles.avatarBox}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {name.trim() ? name.trim()[0].toUpperCase() : '?'}
          </Text>
        </View>
        <Text style={styles.avatarName}>{name || 'Your Name'}</Text>
        <Text style={styles.avatarEmail}>{email || 'your@email.com'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Edit Profile</Text>

      {/* CustomInput - reusing existing custom component */}
      <CustomInput
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
      />
      <CustomInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email Address"
      />
      <CustomInput
        value={bio}
        onChangeText={setBio}
        placeholder="Short bio..."
        multiline
      />

      {/* Info card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>📦 Stored using AsyncStorage</Text>
        <Text style={styles.infoText}>💾 Data persists after app close</Text>
      </View>

      <CustomButton title="💾 Save Profile" onPress={handleSave} />
      <CustomButton title="🗑 Clear Profile" onPress={handleClear} />
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 12 },
  avatarBox: { alignItems: 'center', paddingVertical: 24 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#fff' },
  avatarName: { fontSize: 18, fontWeight: '700', color: '#111827' },
  avatarEmail: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
    marginHorizontal: 12,
  },
  infoCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoText: { fontSize: 13, color: '#374151', marginBottom: 2 },
});

export default ProfileScreen;