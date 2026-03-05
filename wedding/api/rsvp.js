import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
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
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    });
  } catch (err) {
    console.error('Telegram notification failed:', err.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { full_name, phone } = req.body;

  if (!full_name || !phone) {
    return res.status(400).json({ error: 'ФИО и телефон обязательны' });
  }

  const { data: existing } = await supabase
    .from('guests')
    .select('id')
    .eq('phone', phone.trim())
    .single();

  if (existing) {
    return res.status(409).json({ error: 'Гость с таким номером уже зарегистрирован' });
  }

  const { data, error } = await supabase
    .from('guests')
    .insert([{ full_name: full_name.trim(), phone: phone.trim() }])
    .select('id')
    .single();

  if (error) {
    return res.status(500).json({ error: 'Ошибка при сохранении данных' });
  }

  const { count } = await supabase
    .from('guests')
    .select('*', { count: 'exact', head: true });

  await sendTelegramNotification(full_name.trim(), phone.trim(), count);

  return res.status(200).json({ success: true, id: data.id });
}
