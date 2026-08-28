# Cloudflare deployment — Твій Дім

Код магазину вже підготовлений для Cloudflare Pages Functions. Frontend відправляє замовлення на `POST /api/order`, а endpoint знаходиться у `functions/api/order.js`.

## 1. Підключити репозиторій

Створіть Cloudflare Pages project з GitHub-репозиторію `KDaniilK21/tviydim-store`.

- Framework preset: None
- Build command: залишити порожнім
- Build output directory: `.`
- Production branch: `main`

Після першого deploy перевірте головну, товар, кошик і checkout.

## 2. Створити D1

Створіть D1 database, наприклад `tviydim-orders`, і виконайте SQL з `schema.sql`.

У налаштуваннях Pages project додайте D1 binding:

- Variable name: `DB`
- Database: створена `tviydim-orders`

Після зміни binding зробіть новий deploy.

## 3. Telegram-сповіщення (рекомендовано)

У Cloudflare project Variables and Secrets додайте як secrets:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Не додавайте ці значення в GitHub.

D1 є основним сховищем. Telegram — додаткове миттєве сповіщення про нове замовлення.

## 4. Перевірка перед запуском

1. Відкрити магазин на телефоні.
2. Додати 2 різні товари.
3. Змінити кількість у кошику.
4. Перейти до checkout.
5. Ввести тестовий номер телефону та відділення.
6. Переконатися, що з'явився номер замовлення тільки після успішної відповіді `/api/order`.
7. Перевірити запис у D1 `orders` та `order_items`.
8. Якщо Telegram підключений — перевірити повідомлення.
9. Перевірити UTM-перехід, наприклад `?utm_source=youtube&utm_campaign=short_001`, і поле `utm_json` у D1.

## 5. Важливо

- Ціни повторно розраховуються на сервері; frontend не може підмінити суму замовлення.
- Банківські картки магазин не збирає.
- Якщо D1 і Telegram не налаштовані, API повертає помилку і checkout не показує фальшиве успішне замовлення.
- При зміні цін або складу каталогу оновлюйте одночасно `js/products.js` та серверний `CATALOG` у `functions/api/order.js`.
