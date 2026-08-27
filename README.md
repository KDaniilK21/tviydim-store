# Твій Дім — Store v1

Статичний mobile-first магазин для GitHub Pages / Cloudflare Pages.

## Що вже працює
- Головна сторінка
- Категорії та фільтрація
- 8 стартових товарів
- Сторінка товару
- Кошик через localStorage
- Оформлення замовлення у DEMO-режимі
- Збереження UTM-міток
- Адаптивний дизайн

## Важливо
Checkout зараз НЕ надсилає замовлення в реальну систему. Він формує демо-замовлення локально у браузері.
Наступний крок: Cloudflare Worker + endpoint `/api/order`, далі Telegram/Email або база D1.

## Структура
- index.html
- product.html
- cart.html
- checkout.html
- css/styles.css
- js/products.js
- js/common.js
- js/app.js
- js/product.js
- js/cart.js
- js/checkout.js
