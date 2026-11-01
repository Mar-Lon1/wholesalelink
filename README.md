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

## 7. Deployment Instructions

Frontend and backend are built to be hosted on independent platforms (e.g. Render, Railway, Fly.io for backend; Vercel, Netlify, Cloudflare Pages for frontend).

### Backend Deployment (e.g., Render / Railway)
1. Set the root directory to `backend/`.
2. Build command: `npm install && npx prisma generate`
3. Start command: `node src/server.js`
4. Set environment variables:
   - `DATABASE_URL`: Hosted PostgreSQL connection string (with SSL mode)
   - `JWT_SECRET`: 64-character random string
   - `COOKIE_SECRET`: 64-character random string
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://your-frontend-domain.com`
   - `PORT`: Automatically assigned or `5000`

### Frontend Deployment (e.g., Vercel / Netlify / Cloudflare Pages)
1. Set the root directory to `frontend/`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variables:
   - `VITE_API_BASE_URL`: `https://your-backend-domain.com`
5. Configure SPA fallback rule:
   - Ensure all routes rewrite to `index.html` (e.g., in `vercel.json` or `_redirects` for Netlify).
