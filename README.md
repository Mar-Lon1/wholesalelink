# WholesaleLink

> **Ghana B2B Fresh Farm Produce Marketplace**
> Connecting Ghanaian food vendors (chop bars, restaurants, street food kitchens, event caterers) directly with local farmers and fresh produce wholesalers across Ghana (Techiman, Ada, Agbogbloshie, Suhum, Anloga, and Bono East).

---

## 1. Overview & Problem Hypothesis

Commercial food kitchens in Ghana face severe operational hurdles when sourcing daily farm ingredients:
- **Exhausting 4:00 AM Market Runs:** Food vendors lose critical sleep and early-morning prep hours commuting to crowded central markets to negotiate with middleman aggregators.
- **Unpredictable Quality & Price Gauging:** No transparent reference for crate weights, tuber counts, or daily harvest prices.
- **Supply Disruptions:** Inconsistent supplies of staples like Navrongo tomatoes, Techiman pona yams, green Apem plantains, and fresh kontomire disrupt lunch service.

**WholesaleLink** delivers a direct, transparent B2B sourcing platform:
1. **Food Vendor (Chop Bar, Restaurant, Caterer):** Browse harvest catalogue & farm co-ops → compare crate/sack wholesale pricing and MOQs → single-supplier farm cart → checkout with early-morning kitchen delivery or market depot pickup → track order progression → reorder daily batches with 1 click.
2. **Farmer / Produce Wholesaler:** Maintain farm & depot profile → publish daily harvest listings with crate/sack units, MOQs & available inventory → receive kitchen orders → manage fulfillment (`PENDING` → `CONFIRMED` → `PROCESSING` → `READY` → `COMPLETED`).

> **Demo Workflow Note:** This platform demonstrates the end-to-end digital sourcing and ordering workflow using authentic Ghanaian produce data. Payments are arranged directly on delivery/pickup (cash or Mobile Money). Fleet dispatch is coordinated directly with the farmer or depot.

---

## 2. Architecture & Technology Stack

```
wholesalelink/
├── backend/                  # Node.js + Express REST API (Port 5001)
│   ├── prisma/               # Prisma schema (PostgreSQL)
│   ├── src/
│   │   ├── config/           # JWT, Prisma client
│   │   ├── db/               # Farm produce seed script
│   │   ├── middleware/       # Auth (cookie + Bearer), error handling, rate limiting
│   │   ├── modules/          # Auth, users, suppliers, products, orders
│   │   └── server.js         # Server entry point
│   ├── tests/                # Automated API & state machine tests (12 tests)
│   └── .env.example
├── frontend/                 # React 18 + Vite SPA (Port 5173)
│   ├── src/
│   │   ├── assets/           # Curated hero market & produce imagery
│   │   ├── components/       # Navbar, CartDrawer, CheckoutModal, ProductCard, OrderCard...
│   │   ├── context/          # AuthContext (session, login, register, logout)
│   │   ├── hooks/            # useCart, useAsync
│   │   ├── pages/            # Home, Catalogue, Detail, Suppliers, Orders, My Products...
│   │   └── services/         # Axios API client (withCredentials, interceptors)
│   └── .env.example
├── PRODUCT_SYSTEM_DESIGN.md  # Comprehensive product specification
└── README.md
```

- **Backend:** Express.js, Prisma ORM, PostgreSQL (Supabase Session Pooler), Zod validation, JWT (HttpOnly cookie + Bearer header support), Helmet, CORS, bcrypt.
- **Frontend:** React 18, Vite, React Router v7, Tailwind CSS, Lucide React icons, Axios.
- **Testing:** Node.js native test runner (`npm test`) with 12/12 passing integration tests.

---

## 3. Demo Credentials

The database is pre-seeded with authentic Ghanaian produce farmers and commercial food vendors:

| Role | Email | Password | Business Profile | Sourcing Focus |
| :--- | :--- | :--- | :--- | :--- |
| **Food Vendor** | `retailer1@demo.wl` | `Password123!` | Ama's Traditional Chop Bar (Madina, Accra) | Fufu, banku, and waakye kitchen serving 400+ patrons daily |
| **Food Vendor** | `retailer2@demo.wl` | `Password123!` | Bukom Street Food Kitchen & Grills (Osu, Accra) | High-volume tilapia, banku, and jollof kitchen |
| **Farmer / Hub** | `accrafreshproduce@demo.wl` | `Password123!` | Accra Fresh Produce & Farm Hub (Agbogbloshie & Ada) | Navrongo tomatoes, kpakpo shito, garden eggs, okra, shallots |
| **Farmer / Hub** | `techimanyam@demo.wl` | `Password123!` | Techiman Tuber & Yam Cooperative (Bono East) | Grade-A Pona white yams, white cassava for fufu, sweet potatoes |
| **Farmer / Hub** | `easternplantain@demo.wl` | `Password123!` | Eastern Plantain & Greens Co-op (Suhum & Asesewa) | Green Apem plantains, ripe Apantu, fresh Kontomire, palm nuts |
| **Farmer / Hub** | `agyeitrading@demo.wl` | `Password123!` | Agyei Grains & Artisanal Palm Oil Hub (Makola/Ashaiman) | Artisanal Zomi palm oil, Ghana rice, cowpeas, dried yellow maize |
| **Farmer / Hub** | `kponelivestock@demo.wl` | `Password123!` | Kpone & Amrahia Livestock, Poultry & Dairy Hub | Fresh broiler chicken, guinea fowls, goat cuts, beef, farm eggs, fresh cow milk |
| **Farmer / Hub** | `adaorchards@demo.wl` | `Password123!` | Ada & Nsawam Valley Fresh Orchards | Sugarloaf pineapples, sweet oranges, watermelons, ripe Solo pawpaw |

---

## 4. Local Setup & Quickstart

### Prerequisites
- Node.js (v18+)
- PostgreSQL database instance (local or hosted e.g. Supabase, Neon)

### 4.1 Backend Setup

1. Open a terminal in `backend/`:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables in `backend/.env`:
   ```env
   DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
   JWT_SECRET="wholesalelink-jwt-super-secret-key-32-chars-min"
   JWT_EXPIRES_IN="7d"
   COOKIE_SECRET="wholesalelink-cookie-super-secret-key-32-chars-min"
   PORT=5001
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:5173"
   ```

3. Run migrations and seed fresh produce data:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. Run automated test suite:
   ```bash
   npm test
   ```

5. Start backend development server:
   ```bash
   npm run dev
   # Backend runs on http://localhost:5001
   ```

### 4.2 Frontend Setup

1. Open a second terminal in `frontend/`:
   ```bash
   cd frontend
   npm install
   ```

2. Configure environment variables in `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5001
   ```

3. Start frontend development server:
   ```bash
   npm run dev
   # Vite server runs on http://localhost:5173
   ```

4. Linting and production build verification:
   ```bash
   npm run lint
   npm run build
   ```
   ```

---

## 5. API Reference (`/api/v1`)

### Health
- `GET /health` — Service health check (returns `{ status: 'ok', service: 'wholesalelink-api' }`)

### Authentication & Users
- `POST /api/v1/auth/register` — Register as Retailer or Wholesaler
- `POST /api/v1/auth/login` — Login with email/password (sets HttpOnly cookie)
- `POST /api/v1/auth/logout` — Clear session cookie
- `GET /api/v1/auth/me` — Get authenticated user details
- `GET /api/v1/users/me` — Get full user profile
- `PATCH /api/v1/users/me` — Update business profile details

### Suppliers & Catalogue
- `GET /api/v1/suppliers` — List active wholesalers (supports `?search=` and `?location=`)
- `GET /api/v1/suppliers/:id` — Supplier profile and active catalogue
- `GET /api/v1/products` — Marketplace search and filter (`?search=`, `?category=`, `?supplierId=`, `?sortBy=`, `?page=`)
- `GET /api/v1/products/:id` — Product details with supplier information

### Wholesaler Product Management
- `GET /api/v1/products/my/listings` — List own products (`WHOLESALER` role required)
- `POST /api/v1/products` — Create new product listing
- `PATCH /api/v1/products/:id` — Update listing (price, MOQ, stock, active status)
- `DELETE /api/v1/products/:id` — Soft-deactivate product listing

### Orders & Repeat Ordering
- `POST /api/v1/orders` — Create order (validates wholesaler, MOQ, stock, snapshot pricing)
- `GET /api/v1/orders` — List orders (scoped to authenticated user role)
- `GET /api/v1/orders/:id` — Order detail with snapshot items and contact info
- `PATCH /api/v1/orders/:id/status` — Move order through allowed status machine
- `POST /api/v1/orders/:id/reorder` — Re-validate catalogue stock & pricing and recreate order

---

## 6. Order State Machine

The order lifecycle follows strict server-side state transition rules:

```
[PENDING]
  ├──> [CONFIRMED]
  │       └──> [PROCESSING]
  │               └──> [READY]
  │                       └──> [COMPLETED]
  └──> [CANCELLED] (Wholesaler or Retailer while pending)
```

- Retailers may only cancel orders in `PENDING` status.
- Wholesalers may move orders forward or cancel if stock issues arise.
- Totals and snapshot pricing are calculated on the server and frozen into order items.

---

## 7. Live Server Deployment Guide (Render + Vercel)

The backend is configured for **Render** (as a Node.js Web Service) and the frontend is configured for **Vercel** (as a Vite SPA).

### Step 1: Push Repository to GitHub

1. If you haven't already created a GitHub repository, create a new repository on [github.com](https://github.com) named `wholesalelink`.
2. Connect your local repository and push:
```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/wholesalelink.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy Backend to Render

1. Sign in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository (`wholesalelink`).
4. Configure the Web Service settings:
   - **Name:** `wholesalelink-backend`
   - **Region:** Frankfurt (EU Central) or closest to your database
   - **Branch:** `main`
   - **Root Directory:** `backend` *(CRITICAL: ensure this is set to `backend`)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npx prisma generate`
   - **Start Command:** `npm start` (or `node src/server.js`)
   - **Instance Type:** `Free`
5. In the **Environment Variables** section, add:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production security & cookies |
| `PORT` | `10000` | (Render automatically sets this) |
| `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres` | Your Supabase connection string |
| `JWT_SECRET` | `wholesale-link-jwt-prod-secret-2026-secure-key` | Random 32+ character secret |
| `COOKIE_SECRET` | `wholesale-link-cookie-prod-secret-2026-secure-key` | Random 32+ character secret |
| `JWT_EXPIRES_IN` | `7d` | Token expiry duration |
| `FRONTEND_URL` | `https://wholesalelink.vercel.app` | (Update after deploying frontend on Vercel) |

6. Click **Create Web Service**. Render will install dependencies, generate the Prisma client, and start the API.
7. Once deployed, copy your Render URL: e.g. `https://wholesalelink-backend.onrender.com`.
8. Test health in your browser: `https://wholesalelink-backend.onrender.com/health` should return:
```json
{"status":"ok","timestamp":"...","service":"wholesalelink-api"}
```

---

### Step 3: Deploy Frontend to Vercel

1. Sign in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your `wholesalelink` GitHub repository.
4. Configure the Project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and select `frontend` *(CRITICAL: must be `frontend`)*
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)
5. Under **Environment Variables**, add:

| Key | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://wholesalelink-backend.onrender.com` *(Your Render backend URL from Step 2)* |

6. Click **Deploy**. Vercel will build the frontend and provide your production URL (e.g. `https://wholesalelink.vercel.app`).
7. Single-page routing is already pre-configured via `frontend/vercel.json` (`rewrites` to `/index.html`).

---

### Step 4: Final Linkage (Sync CORS)

1. Return to your Render Web Service dashboard → **Environment**.
2. Update `FRONTEND_URL` with your exact live Vercel domain (e.g. `https://wholesalelink.vercel.app`).
*(Note: WholesaleLink's backend CORS also automatically permits `*.vercel.app` domains out of the box).*
3. Open your Vercel URL in your browser and log in with any demo account (e.g. `buka@demo.wl` / `password123`)!

