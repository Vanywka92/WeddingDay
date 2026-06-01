// Supabase Edge Function: уведомление в Telegram о новом госте.
//
// Зачем: сервер на Timeweb (РФ) не может достучаться до api.telegram.org —
// Telegram блокируется из российского дата-центра. Эта функция выполняется
// в регионе Supabase (EU), откуда Telegram доступен, и шлёт уведомление.
//
// Запускается через Database Webhook на INSERT в таблицу public.guests.
//
// Секреты функции (Edge Functions → notify-guest → Secrets):
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TELEGRAM_THREAD_ID (последний — необязателен)
// SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY доступны автоматически.

import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload?.record ?? {};
    const fullName = record.full_name ?? "—";
    const phone = record.phone ?? "—";

    // Считаем общее число гостей
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { count } = await supabase
      .from("guests")
      .select("*", { count: "exact", head: true });

    const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
    const threadId = Deno.env.get("TELEGRAM_THREAD_ID");

    if (!token || !chatId) {
      return new Response(
        JSON.stringify({ error: "TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не заданы" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const text =
      `🎉 *Новый гость подтвердил участие!*\n\n` +
      `👤 *ФИО:* ${fullName}\n` +
      `📞 *Телефон:* ${phone}\n\n` +
      `👥 *Всего записалось:* ${count} чел.`;

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        ...(threadId ? { message_thread_id: Number(threadId) } : {}),
      }),
    });

    const tgJson = await tgRes.json();
    return new Response(JSON.stringify({ ok: tgRes.ok, tg: tgJson }), {
      status: tgRes.ok ? 200 : 502,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
