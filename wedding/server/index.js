import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Подключение к Supabase ---
// Данные гостей хранятся в облаке Supabase и переживают любые редеплои.
// SUPABASE_URL и SUPABASE_SERVICE_KEY задаются в переменных окружения (панель Timeweb / .env).
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

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
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Защита админки паролем (HTTP Basic Auth) ---
// Логин — любой (например admin), пароль берётся из переменной ADMIN_PASSWORD в .env
function adminAuth(req, res, next) {
  const password = process.env.ADMIN_PASSWORD;

  // Если пароль не задан в .env — админка закрыта полностью, чтобы данные не утекли.
  if (!password) {
    return res.status(503).send('Админка не настроена: задайте ADMIN_PASSWORD в .env');
  }

  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');

  if (scheme === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const pass = decoded.slice(decoded.indexOf(':') + 1);
    if (pass === password) return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="Wedding Admin", charset="UTF-8"');
  return res.status(401).send('Требуется авторизация');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

app.post('/api/rsvp', async (req, res) => {
  const { full_name, phone } = req.body;

  if (!full_name || !phone) {
    return res.status(400).json({ error: 'ФИО и телефон обязательны' });
  }

  const cleanName = full_name.trim();
  const cleanPhone = phone.trim();

  const { data: existing } = await supabase
    .from('guests')
    .select('id')
    .eq('phone', cleanPhone)
    .maybeSingle();

  if (existing) {
    return res.status(409).json({ error: 'Гость с таким номером уже зарегистрирован' });
  }

  const { data, error } = await supabase
    .from('guests')
    .insert([{ full_name: cleanName, phone: cleanPhone }])
    .select('id')
    .single();

  if (error) {
    console.error('Supabase insert failed:', error.message);
    return res.status(500).json({ error: 'Ошибка при сохранении данных' });
  }

  const { count } = await supabase
    .from('guests')
    .select('*', { count: 'exact', head: true });

  sendTelegramNotification(cleanName, cleanPhone, count);

  res.json({ success: true, id: data.id });
});

app.get('/api/guests', adminAuth, async (req, res) => {
  const { data: guests, error } = await supabase
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase select failed:', error.message);
    return res.status(500).json({ error: 'Ошибка при получении данных' });
  }

  res.json({ total: guests.length, guests });
});

// --- Страница-админка: список гостей в браузере (под паролем) ---
app.get('/admin', adminAuth, async (req, res) => {
  const { data: guests, error } = await supabase
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase select failed:', error.message);
    return res.status(500).send('Ошибка при получении данных');
  }

  const rows = guests
    .map(
      (g, i) => `
        <tr>
          <td class="num">${guests.length - i}</td>
          <td>${escapeHtml(g.full_name)}</td>
          <td><a href="tel:${escapeHtml(g.phone)}">${escapeHtml(g.phone)}</a></td>
          <td class="date">${escapeHtml(g.created_at)}</td>
        </tr>`
    )
    .join('');

  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Гости — админка</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, system-ui, "Segoe UI", Roboto, sans-serif;
           margin: 0; padding: 16px; background: #f5f5f7; color: #1c1c1e; }
    h1 { font-size: 20px; margin: 0 0 4px; }
    .count { color: #6b6b70; font-size: 14px; margin-bottom: 16px; }
    .wrap { background: #fff; border-radius: 12px; overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,.08); }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #ececef; }
    th { background: #fafafa; font-weight: 600; color: #6b6b70;
         font-size: 12px; text-transform: uppercase; letter-spacing: .03em; }
    tr:last-child td { border-bottom: none; }
    .num { color: #9b9ba0; width: 36px; }
    .date { color: #9b9ba0; white-space: nowrap; }
    a { color: #0a6cff; text-decoration: none; }
  </style>
</head>
<body>
  <h1>Список гостей</h1>
  <div class="count">Всего записалось: ${guests.length} чел.</div>
  <div class="wrap">
    <table>
      <thead>
        <tr><th>#</th><th>ФИО</th><th>Телефон</th><th>Когда</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
</body>
</html>`);
});

// --- Раздача собранного фронтенда (продакшен) ---
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA-фолбэк: любой не-API GET-запрос отдаёт index.html,
// чтобы клиентский роутинг React работал при прямом заходе по ссылке.
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

// Слушаем 0.0.0.0 (все интерфейсы), а не localhost — иначе health-check
// хостинга (Timeweb App Platform) не достучится до приложения снаружи.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
