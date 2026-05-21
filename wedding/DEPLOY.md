# Деплой на Timeweb Cloud

Сайт переезжает с Vercel (блокируется в РФ) на российский хостинг.
Один Express-сервер отдаёт и фронтенд (`dist`), и API (`/api`).

Хостинг: **Timeweb Cloud → Облачный сервер**. На нём база гостей
(`server/guests.db`, SQLite) надёжно хранится на диске, а код менять не нужно.

## Что понадобится

- Аккаунт на [timeweb.cloud](https://timeweb.cloud)
- Токены Telegram-бота (для уведомлений о новых гостях)
- Зарегистрированный `.ru`-домен

## 1. Запушить актуальный код в GitHub

Файлы деплоя и доработки сервера должны попасть на сервер, поэтому сначала
закоммить и запушь их:

```bash
git add -A
git commit -m "Подготовка к деплою на Timeweb"
git push
```

## 2. Создать облачный сервер на Timeweb Cloud

1. Зайди на [timeweb.cloud](https://timeweb.cloud), зарегистрируйся / войди.
2. Раздел **«Облачные серверы»** → **«Создать»**.
3. Параметры:
   - **Локация:** Россия (Москва или Санкт-Петербург)
   - **ОС:** Ubuntu 24.04
   - **Конфигурация:** минимальный тариф (1 CPU, 1–2 ГБ RAM, ~15 ГБ NVMe) —
     для свадебного сайта хватит с запасом, ~200–300 ₽/мес
   - **Доступ:** добавь свой SSH-ключ или выбери вход по паролю root
4. Нажми **«Создать»**. Через минуту сервер получит **публичный IP-адрес** —
   запиши его.

## 3. Подключиться к серверу

В PowerShell на Windows (`ssh` уже встроен):

```powershell
ssh root@IP_АДРЕС
```

## 4. Установить окружение

```bash
# Node.js 20 + инструменты сборки (нужны для better-sqlite3 и sharp)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs build-essential python3 git
```

## 5. Загрузить и собрать проект

```bash
git clone https://github.com/Vanywka92/WeddingDay.git
cd WeddingDay/wedding

# Создай .env на основе шаблона и впиши токены Telegram
cp .env.example .env
nano .env        # сохранить: Ctrl+O, Enter; выйти: Ctrl+X

npm install
npm run build
```

Проверка: `curl http://localhost:3001/api/guests` — но сначала запусти сервер
(следующий шаг).

## 6. Запуск через PM2

```bash
sudo npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup        # выполни команду, которую выведет PM2
```

Проверка: `curl http://localhost:3001/api/guests` должен вернуть JSON.

## 7. HTTPS и домен

```bash
sudo apt install -y caddy
```

Скопируй `Caddyfile` из репозитория в `/etc/caddy/Caddyfile`, заменив
`your-domain.ru` на свой домен:

```bash
cp Caddyfile /etc/caddy/Caddyfile
nano /etc/caddy/Caddyfile     # вписать свой домен
sudo systemctl reload caddy
```

Затем подключи домен:
- Если домен зарегистрирован в Timeweb — панель домена → **DNS-записи** →
  измени **A-запись** (`@` и `www`) на IP сервера.
- Если у другого регистратора — то же самое в его панели.

Через несколько минут (обновление DNS) сайт откроется по `https://твой-домен.ru`
с автоматическим HTTPS-сертификатом.

## Обновление сайта в дальнейшем

```bash
cd WeddingDay/wedding
git pull
npm install
npm run build
pm2 restart wedding
```

## Примечания

- Данные гостей хранятся в `server/guests.db` (SQLite) — файл сохраняется на
  диске сервера и переживает перезапуски.
- Папка `api/` и `vercel.json` остались от Vercel и больше не используются.
- Telegram API в РФ доступен — уведомления о гостях работают.
- Если в панели Timeweb включён файрвол — открой порты **80** и **443**
  (и **22** для SSH).
