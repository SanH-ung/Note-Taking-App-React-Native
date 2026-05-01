// server.js
// Express REST API + Socket.IO WebSocket
// Install: npm install express sqlite3 cors socket.io
// Run: node server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const DB_PATH = 'notes_server.sqlite';

app.use(express.json());
app.use(cors());

// Keep DB connection open (faster - no open/close per request)
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('DB error:', err.message);
  else console.log('Database connected.');
});

db.run(`CREATE TABLE IF NOT EXISTS notes (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  content    TEXT,
  isFavorite INTEGER DEFAULT 0,
  updatedAt  TEXT
)`);

// GET /api/notes
app.get('/api/notes', (req, res) => {
  db.all('SELECT * FROM notes ORDER BY updatedAt DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows.map(r => ({ ...r, isFavorite: !!r.isFavorite })));
  });
});

// GET /api/notes/:id
app.get('/api/notes/:id', (req, res) => {
  db.get('SELECT * FROM notes WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(row ? { ...row, isFavorite: !!row.isFavorite } : null);
  });
});

// POST /api/notes
app.post('/api/notes', (req, res) => {
  const { id, title, content, isFavorite, updatedAt } = req.body;
  db.run(
    'INSERT OR REPLACE INTO notes (id, title, content, isFavorite, updatedAt) VALUES (?,?,?,?,?)',
    [id, title, content, isFavorite ? 1 : 0, updatedAt || new Date().toISOString()],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      notes_ns.emit('server_send', { message: `Note synced: "${title}"` });
      res.status(201).json({ id, affected: this.changes });
    }
  );
});

// PUT /api/notes/:id
app.put('/api/notes/:id', (req, res) => {
  const { title, content, isFavorite, updatedAt } = req.body;
  db.run(
    'UPDATE notes SET title=?, content=?, isFavorite=?, updatedAt=? WHERE id=?',
    [title, content, isFavorite ? 1 : 0, updatedAt, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ id: req.params.id, affected: this.changes });
    }
  );
});

// DELETE /api/notes/:id
app.delete('/api/notes/:id', (req, res) => {
  db.run('DELETE FROM notes WHERE id=?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ id: req.params.id, affected: this.changes });
  });
});

// WebSocket - namespace /notes (Lecture 5B pattern)
const notes_ns = io.of('/notes');

notes_ns.on('connection', (socket) => {
  console.log('Client connected to /notes');

  socket.on('client_connected', (data) => {
    console.log('Client status:', data.connected);
    socket.emit('server_send', { message: 'Connected to NoteApp server!' });
  });

  socket.on('client_send', (data) => {
    console.log('Message from client:', data.message);
    socket.emit('server_send', { message: `Server received: ${data.message}` });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected from /notes');
  });
});

const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\nServer running on port ${PORT}`);
  console.log(`REST API : http://localhost:${PORT}/api/notes`);
  console.log(`Emulator : http://10.0.2.2:${PORT}/api/notes`);
});