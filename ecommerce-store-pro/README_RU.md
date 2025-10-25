# E-Commerce Store Pro

Полноценный демо-проект интернет-магазина в современном стиле «Dark / Neon Enclave». Приложение демонстрирует продакшн-подход к фронтенду и бэкенду, безопасную аутентификацию с ротацией refresh-токенов и удобную админ-панель для управления каталогом и заказами.

![Превью главной страницы](client/public/screens/home.png)
![Превью каталога](client/public/screens/catalog.png)

## ✨ Ключевые возможности

### Для покупателей
- Адаптивный SPA на React + Vite с плавными анимациями и стеклянными панелями.
- JWT-аутентификация, httpOnly куки и автоматическое продление access-токена.
- Каталог с поиском, фильтрами по категориям и ценам, пагинацией.
- Детальные карточки товаров с индикаторами наличия и эффектами наведения.
- Корзина с сохранением в localStorage (Redux Persist).
- Чекаут с валидацией формы доставки и созданием заказа в БД.
- Кабинет пользователя с историей заказов.
- Глобальные уведомления (toasts) об успехах и ошибках.

### Для администраторов
- Ролевой доступ, защищённые маршруты и middleware в Express.
- Управление заказами: список, изменение статусов (PENDING → DELIVERED).
- CRUD для товаров и категорий с поддержкой изображений.
- Демонстрационные аккаунты (админ + 2 пользователя) после сидирования.

## 🛠 Технологический стек

| Уровень | Технологии |
| --- | --- |
| Фронтенд | React 18, Vite 5, React Router 6, Redux Toolkit + Persist, Tailwind CSS, Framer Motion, React Hook Form, Zod |
| Бэкенд | Node.js 18, Express.js, Prisma ORM, PostgreSQL |
| Аутентификация | Bcrypt, JWT access/refresh с ротацией, httpOnly куки |
| Инфраструктура | ESLint, Prettier, concurrently, Nodemon |

## 📁 Структура репозитория

```
ecommerce-store-pro/
├── client/           # SPA на React
│   ├── src/components/  # Переиспользуемые компоненты
│   ├── src/pages/       # Страницы (Home, Catalog, Cart, Profile…)
│   ├── src/store/       # Redux slices (auth, cart, products, orders, ui)
│   ├── src/api/         # Настроенный Axios с перехватчиками
│   └── src/styles/      # Tailwind и вспомогательные стили
├── server/           # Express + Prisma
│   ├── src/routes/       # Маршруты `/api/v1/...`
│   ├── src/controllers/  # Логика домена
│   ├── src/middleware/   # auth, adminOnly, ошибки, логгирование
│   └── src/prisma/       # schema.prisma и seed.js
├── README.md / README_RU.md
├── .env.example
└── package.json        # npm workspaces и общие скрипты
```

## 🚀 Быстрый старт

```bash
# 1. Установка зависимостей (запустит postinstall для workspaces)
npm install

# 2. Подготовка БД
cd server
npx prisma migrate dev --name init
npm run prisma:seed

# 3. Запуск клиент+сервер из корня
cd ..
npm run dev:all
# API: http://localhost:4000/api/v1
# SPA: http://localhost:5173
```

> ℹ️ Для отдельного запуска используйте `npm run dev` в `/server` или `/client`.

### Переменные окружения

Скопируйте `.env.example` в `.env` (корень/сервисы). Важные параметры:

| Имя | Описание |
| --- | --- |
| `DATABASE_URL` | Строка подключения PostgreSQL |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Секреты для подписи JWT |
| `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | Время жизни токенов |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Учётные данные администратора из seed |
| `VITE_API_URL` | Базовый URL API для клиента |
| `COOKIE_DOMAIN` / `COOKIE_SECURE` | Настройки куков |

### Демонстрационные пользователи

| Роль | Email | Пароль |
| --- | --- | --- |
| Admin | `admin@example.com` | `ChangeMe123!` |
| User | `jane@example.com` | `Password123!` |
| User | `john@example.com` | `Password123!` |

## 📡 REST API

Все эндпоинты начинаются с `/api/v1`.

| Метод | Описание |
| --- | --- |
| `POST /auth/register` | Регистрация пользователя |
| `POST /auth/login` | Вход, выдача access/refresh токенов и установка куков |
| `POST /auth/logout` | Отзыв refresh-токена |
| `POST /auth/refresh` | Ротация refresh, новый access |
| `GET /products` | Каталог, поддержка `q`, `category`, `minPrice`, `maxPrice`, `page`, `limit` |
| `GET /products/:slug` | Карточка товара |
| `GET /products/categories` | Категории |
| `POST /orders` | Создание заказа (нужна авторизация) |
| `GET /orders/me` | История заказов текущего пользователя |
| `GET /orders/:id` | Просмотр конкретного заказа |
| `GET /admin/orders` | Просмотр заказов (админ) |
| `PATCH /admin/orders/:id` | Изменение статуса заказа |
| `POST /admin/products` | Создание товара |
| `PATCH /admin/products/:id` | Обновление товара |
| `DELETE /admin/products/:id` | Удаление товара |
| `POST /admin/categories` | Создание категории |
| `PATCH /admin/categories/:id` | Обновление категории |
| `DELETE /admin/categories/:id` | Удаление категории |

Все ответы:

```json
{
  "success": true,
  "message": "Сообщение",
  "data": {}
}
```

Ошибки валидации: `422` + `{ success: false, message, errors: [{ path, message }] }`.

## 📦 Деплой

### Frontend (GitHub Pages)
1. Установите `GITHUB_PAGES_BASE=/имя-репозитория/` при необходимости.
2. Обновите `VITE_API_URL` на адрес задеплоенного API.
3. Выполните `npm run deploy --prefix client` — сборка и публикация в ветку `gh-pages`.
4. Включите GitHub Pages для ветки `gh-pages`.

### Backend (Render/Railway)
1. Создайте базу PostgreSQL и настройте `DATABASE_URL`.
2. Build-команда: `npm install && npx prisma migrate deploy`.
3. Start-команда: `node src/server.js`.
4. Настройте секреты `JWT_*`, параметры куков и данные для сидирования в панели хостинга.
5. Запустите `npm run prisma:seed` один раз.
6. Обновите `VITE_API_URL` на адрес API перед деплоем фронтенда.

## 🧪 DX и качество

- `npm run lint` и `npm run format` — единый стиль кода.
- Общие конфиги ESLint + Prettier.
- `npm run dev:all` поднимает клиент и сервер через `concurrently`.
- Redux можно заменить на Zustand: логика централизована в `client/src/store/`.
- Рекомендуемые коммиты в формате Conventional Commits.

## 📄 Лицензия и контакты

Проект распространяется по лицензии MIT — можно использовать в портфолио и модифицировать.

**Контакты:** создайте issue на GitHub или напишите в [LinkedIn](https://www.linkedin.com/).
