# Твій Дім — корисні рішення

Mobile-first storefront для органічного трафіку з YouTube Shorts / Reels / TikTok. Стек: статичний HTML/CSS/JS + Cloudflare Pages Functions + D1.

## Готово

- адаптивна головна сторінка з evergreen-позиціонуванням;
- топ-товари з коротких відео;
- категорії, пошук і сортування;
- окрема сторінка товару з галереєю, характеристиками, related products і мобільним CTA;
- кошик у `localStorage` з кількістю та підрахунком суми;
- UTM-збереження для атрибуції YouTube/соцмереж;
- checkout без реєстрації;
- валідація українського номера телефону;
- реальний `POST /api/order` через Cloudflare Pages Function;
- серверний перерахунок цін і кількості;
- D1 schema для замовлень та позицій;
- опційні Telegram-повідомлення;
- honeypot + мінімальний anti-bot timing check;
- branded favicon, базові SEO/OG metadata та Product JSON-LD.

## Ключові файли

- `index.html` — головна і каталог
- `product.html` — картка товару
- `cart.html` — кошик
- `checkout.html` — оформлення
- `css/styles.css` — базовий дизайн
- `css/final.css` — production polish
- `js/products.js` — каталог і роздрібні ціни
- `js/app.js` — фільтрація/пошук/сортування
- `js/common.js` — кошик та UTM
- `js/product.js` — галерея і карточка
- `js/cart.js` — кошик
- `js/checkout.js` — checkout client
- `functions/api/order.js` — server-side прийом замовлення
- `schema.sql` — D1 schema
- `CLOUDFLARE_SETUP.md` — інструкція запуску

## Важливо перед прийомом реальних замовлень

Frontend уже не створює фальшиві demo-замовлення. Успіх показується лише після відповіді `/api/order`.

Щоб endpoint реально приймав замовлення, потрібно підключити Cloudflare Pages і щонайменше один канал збереження: D1 (`DB`) або Telegram secrets. Рекомендовано використовувати D1 як основне сховище та Telegram як сповіщення.

При зміні ціни синхронно оновлюйте її у `js/products.js` та `CATALOG` в `functions/api/order.js`.
