import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/Note';

const KEY = "NOTES";

async function getNotes(): Promise<Note[]> {
  const data = await AsyncStorage.getItem(KEY);
  const parsed = data ? (JSON.parse(data) as Note[]) : [];
  return parsed.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

async function saveNotes(notes: Note[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(notes));
}

async function saveNote(title: string, content: string) {
  const notes = await getNotes();
  const now = new Date().toISOString();
  const newNote: Note = {
    id: Date.now().toString(),
    title: title.trim(),
    content: content.trim(),
    isFavorite: false,
    updatedAt: now,
    syncStatus: 'pending',
  };
  notes.push(newNote);
  await saveNotes(notes);
  return newNote;
}

async function updateNote(id: string, title: string, content: string) {
  const notes = await getNotes();
  const updated: Note[] = notes.map((n) =>
    n.id === id
      ? {
          ...n,
          title: title.trim(),
          content: content.trim(),
          updatedAt: new Date().toISOString(),
          syncStatus: 'pending' as const,
        }
      : n
  );
  await saveNotes(updated);
}

async function toggleFavorite(id: string) {
  const notes = await getNotes();
  const updated: Note[] = notes.map((n) =>
    n.id === id
      ? {
          ...n,
          isFavorite: !n.isFavorite,
          updatedAt: new Date().toISOString(),
          syncStatus: 'pending' as const,
        }
      : n
  );
  await saveNotes(updated);
}

async function deleteNote(id: string) {
  const notes = await getNotes();
  const filtered = notes.filter((n) => n.id !== id);
  await saveNotes(filtered);
}

async function getFavoriteNotes() {
  const notes = await getNotes();
  return notes.filter((note) => note.isFavorite);
}

async function updateNoteSyncStatus(id: string, syncStatus: Note['syncStatus']) {
  const notes = await getNotes();
  const updated = notes.map((n) =>
    n.id === id ? { ...n, syncStatus, updatedAt: new Date().toISOString() } : n
  );
  await saveNotes(updated);
}

export {
  getNotes,
  saveNote,
  updateNote,
  deleteNote,
  toggleFavorite,
  getFavoriteNotes,
  updateNoteSyncStatus,
  saveNotes,
};