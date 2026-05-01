// services/api.ts
// Cloud connectivity service
// REST API (Lecture 5A) + WebSocket via Socket.IO (Lecture 5B)
//
// npm install axios
// npm install --save socket.io-client --force

import axios from 'axios';
import { Note } from '../types/Note';

// 10.0.2.2 = localhost from Android emulator (Lecture 5B pattern)
const BASE_URL = 'http://10.0.2.2:5000';
const API_URL = `${BASE_URL}/api/notes`;

// ─── REST API (Lecture 5A) ──────────────────────────────────────────────────

// GET all notes from server
async function fetchNotesFromAPI(): Promise<any[]> {
  const response = await axios.get(API_URL);
  return response.data;
}

// POST a note to server
async function syncNoteToAPI(note: Note): Promise<any> {
  const payload = {
    id: note.id,
    title: note.title,
    content: note.content,
    isFavorite: note.isFavorite,
    updatedAt: note.updatedAt,
  };
  const response = await axios.post(API_URL, payload);
  return response.data;
}

// PUT - update a note on server
async function updateNoteOnAPI(note: Note): Promise<any> {
  const response = await axios.put(`${API_URL}/${note.id}`, {
    id: note.id,
    title: note.title,
    content: note.content,
    isFavorite: note.isFavorite,
    updatedAt: note.updatedAt,
  });
  return response.data;
}

// DELETE a note from server
async function deleteNoteFromAPI(id: string): Promise<any> {
  const response = await axios.delete(`${API_URL}/${id}`, {
    data: { id },
  });
  return response.data;
}

// ─── WebSocket (Lecture 5B) ─────────────────────────────────────────────────
// npm install --save socket.io-client --force
let io: any;
try {
  io = require('socket.io-client');
} catch (e) {
  console.warn('socket.io-client not installed');
}

export function createSocket() {
  if (!io) return null;
  const socket = io(`${BASE_URL}/notes`, {
    transports: ['websocket'],
  });
  return socket;
}

export { fetchNotesFromAPI, syncNoteToAPI, updateNoteOnAPI, deleteNoteFromAPI };