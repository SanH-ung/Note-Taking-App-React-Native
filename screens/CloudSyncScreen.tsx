// screens/CloudSyncScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  ToastAndroid,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import {
  fetchNotesFromAPI,
  syncNoteToAPI,
  createSocket,
} from '../services/api';
import { getNotes, updateNoteSyncStatus, saveNotes } from '../storage/noteStorage';
import { Note } from '../types/Note';

function CloudSyncScreen() {
  const [remoteNotes, setRemoteNotes] = useState<any[]>([]);
  const [cached, setCached] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [status, setStatus] = useState('Idle');
  const [loading, setLoading] = useState(false);
  const [socketStatus, setSocketStatus] = useState('Disconnected');
  const [log, setLog] = useState<string[]>([]);
  const socketRef = useRef<any>(null);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLog(prev => [`[${time}] ${msg}`, ...prev]);
  };

  // WebSocket setup (Lecture 5B)
  useEffect(() => {
    const socket = createSocket();
    if (!socket) {
      addLog('socket.io-client not available');
      return;
    }
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketStatus('Connected ✓');
      addLog('WebSocket connected to server');
      socket.emit('client_connected', { connected: true });
    });

    socket.on('error', () => {
      setSocketStatus('Error ✗');
      addLog('WebSocket connection error');
    });

    socket.on('disconnect', () => {
      setSocketStatus('Disconnected');
      addLog('WebSocket disconnected');
    });

    socket.on('server_send', (data: any) => {
      addLog(`Server: ${data.message || JSON.stringify(data)}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const refreshPending = async () => {
    const localNotes = await getNotes();
    setPendingCount(localNotes.filter((n) => n.syncStatus !== 'synced').length);
  };

  useEffect(() => {
    refreshPending();
  }, []);

  // GET - Pull from cloud (display only)
  const pullFromCloud = async () => {
    if (cached.length > 0) {
      setRemoteNotes(cached);
      setStatus('Showing cached data, refreshing...');
    }
    setLoading(true);
    addLog('GET /api/notes ...');
    try {
      const data = await fetchNotesFromAPI();
      setRemoteNotes(data);
      setCached(data);
      await refreshPending();
      setStatus(`Fetched ${data.length} notes from cloud.`);
      addLog(`Fetched ${data.length} notes from server`);
      ToastAndroid.show(`Fetched ${data.length} notes`, ToastAndroid.SHORT);
    } catch (error) {
      setStatus('Failed to fetch. Is the server running?');
      addLog('GET failed - server may be offline');
      Alert.alert('Connection Error', 'Cannot reach server.\nMake sure server.js is running.');
    } finally {
      setLoading(false);
    }
  };

  // POST - Upload pending local notes to server
  const syncPendingNotes = async () => {
    setLoading(true);
    setStatus('Syncing pending notes...');
    const localNotes = await getNotes();
    const pending = localNotes.filter((n) => n.syncStatus !== 'synced');

    if (pending.length === 0) {
      setStatus('No pending notes to sync.');
      addLog('Nothing to sync - all notes already synced');
      setLoading(false);
      return;
    }

    addLog(`Uploading ${pending.length} pending note(s)...`);
    let successCount = 0;

    for (const note of pending) {
      try {
        await syncNoteToAPI(note as Note);
        await updateNoteSyncStatus(note.id, 'synced');
        successCount++;
        addLog(`POST note: "${note.title}" - OK`);
      } catch (error) {
        await updateNoteSyncStatus(note.id, 'failed');
        addLog(`POST note: "${note.title}" - FAILED`);
      }
    }

    if (socketRef.current) {
      socketRef.current.emit('client_send', {
        message: `Synced ${successCount} notes from client`,
      });
    }

    await refreshPending();
    setStatus(`Sync done. ${successCount}/${pending.length} uploaded.`);
    addLog(`Sync complete: ${successCount}/${pending.length} succeeded`);
    setLoading(false);
  };

  // Pull + Import in one step (fixes state timing issue)
  const pullAndImport = async () => {
    setLoading(true);
    setStatus('Fetching and importing from cloud...');
    addLog('GET /api/notes ...');
    try {
      const data = await fetchNotesFromAPI();
      setRemoteNotes(data);
      setCached(data);

      const existing = await getNotes();
      const existingIds = new Set(existing.map((n) => n.id));
      const toImport: Note[] = data
        .filter((r: any) => !existingIds.has(r.id))
        .map((r: any) => ({
          id: r.id,
          title: r.title,
          content: r.content,
          isFavorite: r.isFavorite ?? false,
          updatedAt: r.updatedAt ?? new Date().toISOString(),
          syncStatus: 'synced' as const,
        }));

      await saveNotes([...existing, ...toImport]);
      await refreshPending();
      setStatus(`Imported ${toImport.length} note(s) from cloud.`);
      addLog(`Fetched ${data.length} notes, imported ${toImport.length} new`);
      ToastAndroid.show(`Imported ${toImport.length} notes`, ToastAndroid.SHORT);
    } catch (error) {
      setStatus('Failed. Is the server running?');
      addLog('Pull & Import failed - server may be offline');
      Alert.alert('Connection Error', 'Cannot reach server.\nMake sure server.js is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* WebSocket Status */}
      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>WebSocket:</Text>
        <Text style={[
          styles.statusValue,
          { color: socketStatus.includes('Connected') ? '#16a34a' : '#dc2626' },
        ]}>
          {socketStatus}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{remoteNotes.length}</Text>
          <Text style={styles.statLabel}>Cloud Notes</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: pendingCount > 0 ? '#f59e0b' : '#16a34a' }]}>
            {pendingCount}
          </Text>
          <Text style={styles.statLabel}>Pending Sync</Text>
        </View>
      </View>

      <Text style={styles.statusText}>Status: {status}</Text>
      {loading && <ActivityIndicator size="small" color="#4CAF50" style={{ marginBottom: 8 }} />}

      {/* Buttons */}
      <CustomButton title="📥 Pull Notes From Cloud (GET)" onPress={pullFromCloud} />
      <CustomButton title="📤 Sync Pending Notes (POST)" onPress={syncPendingNotes} />
      <CustomButton title="🔄 Pull & Import from Cloud" onPress={pullAndImport} />

      {/* Cloud Notes Preview */}
      {remoteNotes.length > 0 && (
        <View style={styles.previewBox}>
          <Text style={styles.previewTitle}>
            Cloud Notes Preview ({remoteNotes.length})
          </Text>
          {remoteNotes.slice(0, 5).map((item: any, index: number) => (
            <Text key={index} style={styles.previewItem}>• {item.title}</Text>
          ))}
          {remoteNotes.length > 5 && (
            <Text style={styles.previewMore}>
              ...and {remoteNotes.length - 5} more
            </Text>
          )}
        </View>
      )}

      {/* Activity Log */}
      <Text style={styles.logTitle}>Activity Log</Text>
      <View style={styles.logBox}>
        {log.length === 0 ? (
          <Text style={styles.logEmpty}>No activity yet.</Text>
        ) : (
          log.map((entry, i) => (
            <Text key={i} style={styles.logEntry}>{entry}</Text>
          ))
        )}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 12 },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  statusLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginRight: 8 },
  statusValue: { fontSize: 14, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    elevation: 1,
  },
  statNum: { fontSize: 28, fontWeight: '700', color: '#1f2937' },
  statLabel: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  statusText: { marginHorizontal: 4, marginBottom: 6, color: '#374151', fontSize: 13 },
  previewBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    elevation: 1,
  },
  previewTitle: { fontSize: 14, fontWeight: '700', color: '#1f2937', marginBottom: 6 },
  previewItem: { fontSize: 13, color: '#374151', paddingVertical: 2 },
  previewMore: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  logTitle: { fontSize: 14, fontWeight: '700', color: '#1f2937', marginTop: 12, marginBottom: 6 },
  logBox: {
    backgroundColor: '#1f2937',
    borderRadius: 10,
    padding: 12,
    minHeight: 100,
  },
  logEmpty: { color: '#6b7280', fontSize: 12 },
  logEntry: { color: '#86efac', fontSize: 11, marginBottom: 2, fontFamily: 'monospace' },
});

export default CloudSyncScreen;