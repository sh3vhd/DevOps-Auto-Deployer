# E-Commerce Store Pro

A production-style, full-stack e-commerce demo built as a portfolio-ready showcase. The project delivers a polished customer journey, secure authentication with refresh token rotation, and an admin control center for catalog and order management — all wrapped in a modern dark/neon UI.

![Homepage preview](client/public/screens/home.png)
![Catalog preview](client/public/screens/catalog.png)

## ✨ Features

### Customer experience
- Responsive Vite + React storefront with animated page transitions and glassmorphism styling.
- JWT authentication with automatic access token refresh and secure httpOnly cookies.
- Product catalog with search, category and price filters, plus paginated results.
- Product detail pages featuring availability badges, hero imagery, and animated CTAs.
- Persistent shopping cart stored via Redux Persist and localStorage.
- Checkout flow with validated shipping form and server-side order creation.
- Profile dashboard listing historical orders and statuses.
- Global toast notifications for feedback and errors.

### Admin workflow
- Role-based admin routing backed by Express middleware.
- Order overview with status updates (PENDING → DELIVERED) using Prisma transactions.
- Product and category CRUD with image URL support and live catalog snapshots.
- Seeded admin user plus sample customers for instant demo logins.

## 🛠 Tech stack

| Layer | Stack |
| --- | --- |
| Frontend | React 18, Vite 5, React Router 6, Redux Toolkit + Redux Persist, Tailwind CSS, Framer Motion, React Hook Form, Zod |
| Backend | Node.js 18, Express.js, Prisma ORM, PostgreSQL |
| Auth | Bcrypt password hashing, JWT access & refresh tokens with rotation, httpOnly cookies |
| Tooling | ESLint, Prettier, concurrently, Nodemon |

## 📁 Monorepo structure

```
ecommerce-store-pro/
├── client/           # React + Vite SPA
│   ├── src/components/  # Reusable UI (Button, Modal, Toast, etc.)
│   ├── src/pages/       # Routed views (Home, Catalog, Cart, Profile…)
│   ├── src/store/       # Redux Toolkit slices (auth, cart, products, orders, ui)
│   ├── src/api/         # Axios instance & interceptors with refresh handling
│   └── src/styles/      # Tailwind setup & glassmorphism helpers
├── server/           # Express API + Prisma layer
│   ├── src/routes/       # Versioned REST routes (/api/v1/...)
│   ├── src/controllers/  # Domain logic (auth, products, orders, admin)
│   ├── src/middleware/   # Auth, adminOnly, error, logging
│   └── src/prisma/       # schema.prisma, seed.js
├── README.md / README_RU.md
├── .env.example
└── package.json        # npm workspaces + shared scripts
```

## 🚀 Quick start

```bash
# 1. Install all dependencies (runs workspace postinstall)
npm install

# 2. Prepare the database
cd server
npx prisma migrate dev --name init
npm run prisma:seed

# 3. Start backend & frontend together from repo root
cd ..
npm run dev:all
# -> API: http://localhost:4000/api/v1
# -> SPA: http://localhost:5173
```

> ℹ️ Need individual dev servers? Use `npm run dev` inside `/server` or `/client`.

### Environment variables

Copy `.env.example` to `.env` in both the root (shared values) and service directories as needed.

Key variables:

| Name | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Secrets for issuing/verifying JWTs |
| `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | Token lifetimes (e.g., `15m`, `7d`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin credentials |
| `VITE_API_URL` | Client base URL for Axios (defaults to `http://localhost:4000/api/v1`) |
| `COOKIE_DOMAIN` / `COOKIE_SECURE` | Cookie scope & security options |

### Seeded demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@example.com` | `ChangeMe123!` |
| User | `jane@example.com` | `Password123!` |
| User | `john@example.com` | `Password123!` |

## 📡 API reference

All routes are prefixed with `/api/v1`.

| Method & Path | Description |
| --- | --- |
| `POST /auth/register` | Register new account. Body: `{ email, password }` |
| `POST /auth/login` | Login. Returns `{ user, accessToken, refreshToken }` + sets cookies |
| `POST /auth/logout` | Revoke refresh token (uses cookie or body) |
| `POST /auth/refresh` | Rotate refresh token & return fresh tokens |
| `GET /products` | List products with `q`, `category`, `minPrice`, `maxPrice`, `page`, `limit` |
| `GET /products/:slug` | Fetch product by slug |
| `GET /products/categories` | List categories |
| `POST /orders` | Create order (auth required). Body: `{ items: [{ productId, quantity }], shippingAddress }` |
| `GET /orders/me` | Get current user's orders |
| `GET /orders/:id` | Get a specific order for current user |
| `GET /admin/orders` | Admin-only order overview |
| `PATCH /admin/orders/:id` | Update order status |
| `POST /admin/products` | Create product (admin) |
| `PATCH /admin/products/:id` | Update product |
| `DELETE /admin/products/:id` | Delete product |
| `POST /admin/categories` | Create category |
| `PATCH /admin/categories/:id` | Update category |
| `DELETE /admin/categories/:id` | Delete category |

Responses follow the shape:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
```

Validation errors return `422` with `{ success: false, message, errors: [{ path, message }] }`.

## 📦 Deployment

### Frontend (GitHub Pages)

1. Set `GITHUB_PAGES_BASE=/your-repo-name/` (if deploying to a project page).
2. Update `VITE_API_URL` to point at your hosted backend.
3. Run `npm run deploy --prefix client` (or `cd client && npm run deploy`). This builds the app and publishes `dist/` using `gh-pages`.
4. Configure GitHub Pages to serve from the `gh-pages` branch.

### Backend (Render or Railway)

1. Provision a PostgreSQL database and set the `DATABASE_URL` environment variable.
2. Configure build command: `npm install && npx prisma migrate deploy` (Render) or use service-specific migrations.
3. Start command: `node src/server.js`.
4. Ensure `JWT_*` secrets, cookie settings, and seed credentials are configured in the hosting dashboard.
5. Run `npm run prisma:seed` once (via shell or deploy script) to populate sample data.
6. Update the frontend `.env` with the public API URL before redeploying the SPA.

## 🧪 Quality & DX

- `npm run lint` / `npm run format` at the repo root keep the codebase clean.
- ESLint + Prettier with shared config ensures consistent style.
- `npm run dev:all` uses `concurrently` for synchronized client/server dev loops.
- Redux store structure can be swapped to Zustand by replacing `client/src/store` with a Zustand store — API boundaries are encapsulated in the `store/` directory for easy experimentation.
- Conventional commits recommended (e.g., `feat: add product filters`).

## 📄 License & attribution

Released under the MIT License. You are free to fork, adapt, and showcase this project in your own portfolio.

**Contact:** Feel free to reach out via [GitHub Issues](https://github.com/) or connect on [LinkedIn](https://www.linkedin.com/).
