import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function sendTelegramNotification(full_name, phone, totalCount) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const text =
    `🎉 *Новый гость подтвердил участие!*\n\n` +
    `👤 *ФИО:* ${full_name}\n` +
    `📞 *Телефон:* ${phone}\n\n` +
    `👥 *Всего записалось:* ${totalCount} чел.`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        ...(process.env.TELEGRAM_THREAD_ID && {
          message_thread_id: Number(process.env.TELEGRAM_THREAD_ID),
        }),
      }),
    });
  } catch (err) {
    console.error('Telegram notification failed:', err.message);
  }
}

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

  const { total } = db.prepare('SELECT COUNT(*) as total FROM guests').get();
  sendTelegramNotification(full_name.trim(), phone.trim(), total);

  res.json({ success: true, id: result.lastInsertRowid });
});

app.get('/api/guests', (req, res) => {
  const guests = db.prepare('SELECT * FROM guests ORDER BY created_at DESC').all();
  res.json({ total: guests.length, guests });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
