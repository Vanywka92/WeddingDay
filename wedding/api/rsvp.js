import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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

  return res.status(200).json({ success: true, id: data.id });
}
