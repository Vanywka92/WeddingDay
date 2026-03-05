import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

const db = new Database(path.join(__dirname, 'guests.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS guests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(cors());
app.use(express.json());

app.post('/api/rsvp', (req, res) => {
  const { full_name, phone } = req.body;

  if (!full_name || !phone) {
    return res.status(400).json({ error: 'ФИО и телефон обязательны' });
  }

  const existing = db.prepare('SELECT id FROM guests WHERE phone = ?').get(phone);
  if (existing) {
    return res.status(409).json({ error: 'Гость с таким номером уже зарегистрирован' });
  }

  const stmt = db.prepare('INSERT INTO guests (full_name, phone) VALUES (?, ?)');
  const result = stmt.run(full_name.trim(), phone.trim());

  res.json({ success: true, id: result.lastInsertRowid });
});

app.get('/api/guests', (req, res) => {
  const guests = db.prepare('SELECT * FROM guests ORDER BY created_at DESC').all();
  res.json({ total: guests.length, guests });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
