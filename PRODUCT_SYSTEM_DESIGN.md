# WholesaleLink MVP — Product Requirements & AI Agent Build Instructions

## 1. Purpose

Build a working MVP for **WholesaleLink**, a Ghana-focused B2B sourcing marketplace specifically tailored to connect **food vendors** (chop bars, restaurants, street food kitchens, event caterers, canteens) directly with **wholesalers and farmers of fresh farm produce** (vegetables, tomatoes, peppers, yams, plantains, cassava, leafy greens, grains, and artisanal oils) across Ghana.

This document is the source of truth for the AI coding agent. Follow it before making implementation decisions.

## 2. Source context and product framing

The platform is designed around the authentic operational workflows of Ghanaian food kitchens:
- **Target buyers (Food Vendors):** Chop bars (fufu, banku, ampesi), street food joints, high-volume restaurants, and caterers sourcing daily perishables and staples.
- **Target sellers (Farmers & Aggregators):** Local smallholder cooperatives and market produce aggregators (Techiman, Ada, Agbogbloshie, Suhum, Anloga, and Bono East).
- **Core problem hypothesis:** Daily 4:00 AM market sourcing is physically exhausting, prices are unstandardized and prone to middleman price gouging, and quality varies wildly.
- **Current workflow:** Kitchen notices low produce → travels to market at dawn → negotiates sack/crate prices → arranges taxi/keke transport → carries goods to kitchen → begins morning food prep.
- **Product solution:** Digital discovery of farm harvests with transparent crate/sack wholesale pricing, single-farmer checkout with early-morning kitchen delivery or depot pickup, and 1-click recurring reorders.

## 3. Product goal

Deliver a usable, demonstrable B2B marketplace that connects food vendor accounts and farm produce wholesaler/farmer accounts in one application with a clear sourcing workflow:

**Food Vendor:** browse fresh harvests → view farm & crop details → compare crate/sack prices & stock → create single-farmer produce order → select early-morning kitchen delivery or depot pickup → track order status → 1-click reorder.

**Farmer / Wholesaler:** create/manage farm depot profile → publish and manage fresh harvest listings (with crate/sack units, MOQs, available stock) → receive kitchen orders → update order status (`PENDING` → `CONFIRMED` → `PROCESSING` → `READY` → `COMPLETED`).

The MVP demonstrates this workflow with realistic Ghanaian farm produce data. Payments are settled directly on delivery/pickup (cash or Mobile Money). Direct fleet dispatch is coordinated with the farmer or depot.

## 4. Scope boundaries

### In scope
- Responsive web application.
- Role-based onboarding/sign-in for Retailer and Wholesaler.
- Retailer and wholesaler dashboards.
- Supplier directory and product catalogue.
- Search and basic filters.
- Product detail and supplier offer comparison.
- Cart/order creation.
- Order history and status tracking.
- Wholesaler order management.
- Product/offer management for wholesalers.
- Basic profile management.
- Seed/demo data.
- Loading, empty, error and success states.
- Backend validation, authentication and authorization.
- API documentation and local run instructions.

### Out of scope unless separately approved
- AI recommendations or chatbot.
- Real payment gateway integration.
- Delivery fleet/dispatch tracking.
- Live GPS or map integrations.
- Inventory/POS synchronization.
- Real-time chat.
- Multi-vendor checkout in one order.
- Reviews/ratings and complex supplier verification.
- Advanced analytics, forecasting or accounting.
- Mobile native app.
- SMS/WhatsApp notifications.
- Production-grade compliance or marketplace operations.

Do not imply that payment, delivery, supplier verification or availability are live integrations. Clearly label any MVP order/payment/delivery states as manually managed or demo workflow.

## 5. User roles and permissions

### Retailer
Can:
- Register/login as retailer.
- View and edit own business profile.
- Browse active products and suppliers.
- Search/filter products.
- View supplier details and offer information.
- Add products from one supplier to cart.
- Submit an order.
- View only their own orders.
- View order details/status.
- Reorder from a previous order where the products remain available.

Cannot:
- Manage supplier products.
- View other retailers' orders.
- Change wholesaler order statuses.

### Wholesaler
Can:
- Register/login as wholesaler.
- View and edit own business profile.
- Create, edit, activate/deactivate own products.
- Set unit, price, minimum order quantity, stock/availability and product description.
- View orders placed with their business.
- Update order status through allowed transitions.

Cannot:
- Edit another wholesaler's products/profile.
- View orders belonging to another wholesaler.
- Access retailer-only actions.

### Admin
For the MVP, do not build a separate admin dashboard unless needed. Use seed data and safe database access for demo setup. Do not expose admin privileges through public registration.

## 6. Key user journeys

### Journey A — Retailer sourcing
1. Retailer signs up/logs in.
2. Completes business profile.
3. Opens product catalogue.
4. Searches by product name/category and optionally filters by supplier/location.
5. Opens a product or offer to see supplier, price, unit, minimum order quantity, availability and indicative location.
6. Adds quantity to cart.
7. Confirms order details and submits.
8. Sees order confirmation and order status.
9. Returns to order history to track/reorder.

### Journey B — Wholesaler listing
1. Wholesaler signs up/logs in.
2. Completes business profile.
3. Adds product with required pricing and quantity fields.
4. Product appears in catalogue when active.
5. Wholesaler receives an order.
6. Reviews order and updates status.
7. Retailer sees status change.

### Journey C — Repeat ordering
1. Retailer opens a previous order.
2. Selects reorder.
3. System validates product availability and current price.
4. Cart/order is recreated using current product data.
5. Retailer confirms and submits.

## 7. Functional requirements

### Authentication
- Use secure password hashing.
- Use JWT-based authentication or another straightforward secure session strategy appropriate for separate frontend/backend hosting.
- Prefer HttpOnly cookies when properly configured for cross-origin deployment; if bearer tokens are used, avoid insecure long-term localStorage storage and document the security trade-off.
- Provide register, login, logout and current-user endpoints.
- Frontend route guards are for UX only; backend authorization is mandatory.
- Never return password hashes or secrets.

### Product catalogue
Product fields should include:
- id
- wholesalerId
- name
- category
- description
- unit (e.g. kg, bag, crate, piece, carton)
- price
- minimumOrderQuantity
- availableQuantity (or clearly defined availability field)
- active/status
- createdAt/updatedAt

Use a practical seed catalogue relevant to Ghanaian retailers. Include fresh produce and everyday goods, but do not limit the product concept to fresh produce: the documentation frames the audience as retailers sourcing everyday goods, while the fresh-produce challenge is an initial problem hypothesis.

### Supplier profile
Include:
- business name
- supplier type
- contact name (demo-safe)
- phone (demo-safe)
- location/area
- description
- active status

Do not fabricate real business endorsements or verified badges. Use clearly fictional demo suppliers.

### Search and filters
- Search product name and category.
- Filter by category.
- Filter by supplier/location if feasible.
- Sort by price or name if feasible.
- Search must operate on backend data, not only a hardcoded frontend array.

### Cart and ordering
- Cart/order must be associated with one wholesaler per order.
- Validate product ownership, active status, quantity, minimum order quantity and available quantity on the server.
- Calculate totals on the server; never trust client-supplied totals/prices.
- Snapshot product name, unit and price into order items so historical orders remain readable after catalogue changes.
- Create an order with a unique human-readable order reference.
- MVP order statuses: `pending`, `confirmed`, `processing`, `ready`, `completed`, `cancelled`.
- Define and enforce allowed status transitions.
- Payment status may be `unpaid`, `manual_pending`, or `paid` only if useful for demo. Do not claim actual payment processing.
- Delivery/pickup method can be captured as a simple field; do not build logistics.

### Order management
- Retailer sees own orders only.
- Wholesaler sees orders for own products/business only.
- Retailer cannot update supplier-side statuses.
- Wholesaler can move order through allowed statuses.
- Cancellation rules must be simple and documented; for example, retailer may cancel only while pending.
- Use clear timestamps and status labels.

### Dashboard
Retailer dashboard:
- Search/browse call to action.
- Recent orders.
- Pending order status.
- Reorder action.

Wholesaler dashboard:
- Product count.
- New/pending orders.
- Product management.
- Order management.

Avoid decorative metrics unsupported by actual backend data.

## 8. UX and visual design direction

Create a polished, modern, trustworthy B2B marketplace UI suitable for Ghanaian small retailers and wholesalers. Keep interfaces simple and mobile-first.

Use:
- React + Vite.
- Tailwind CSS.
- Lucide React icons.
- Clear typography and hierarchy.
- Consistent spacing, cards, buttons, inputs, badges and status colors.
- Accessible contrast and visible focus states.
- Responsive layouts for mobile, tablet and desktop.
- Friendly empty states and actionable error messages.

Do not:
- Use emoji as interface icons; use Lucide.
- Add gratuitous animations or glassmorphism that harms readability.
- Create dead buttons, fake links or nonfunctional controls.
- Use lorem ipsum.
- Show unsupported claims such as “verified supplier” or “best price”.
- Hide essential workflow actions behind decorative UI.

## 9. Architecture and repository structure

Create one root project folder with separate frontend and backend folders:

```text
wholesalelink/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/ or store/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── suppliers/
│   │   │   ├── products/
│   │   │   └── orders/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── app.js
│   ├── .env.example
│   └── package.json
├── README.md
└── PRODUCT_SYSTEM_DESIGN.md
```

Keep frontend and backend independently installable, runnable and deployable. Do not place frontend code in backend or vice versa.

## 10. Backend implementation

Use Express.js with modular routes/controllers/services and centralized error handling.

Recommended baseline:
- Express
- CORS configured for the deployed frontend origin(s)
- dotenv
- validation library (e.g. Zod or express-validator)
- password hashing library
- authentication middleware
- database adapter/ORM

Database:
- Select a persistent database suitable for separate hosting and deployment.
- If no database choice is provided, ask the user before implementing or recommend a PostgreSQL-compatible option and clearly state the choice.
- Do not use in-memory arrays as the actual persistence layer.
- Seed scripts may use demo data.
- Include migrations/schema setup instructions.

API conventions:
- Prefix routes with `/api/v1`.
- Use consistent JSON response shapes.
- Use appropriate HTTP status codes.
- Validate and sanitize request data.
- Paginate catalogue and order lists where reasonable.
- Add health endpoint such as `GET /health`.
- Avoid leaking stack traces or internal details in production.

Suggested endpoint groups:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET/PATCH /api/v1/users/me`
- `GET /api/v1/suppliers`
- `GET /api/v1/suppliers/:id`
- `GET /api/v1/products`
- `GET /api/v1/products/:id`
- `POST /api/v1/products` (wholesaler)
- `PATCH /api/v1/products/:id` (owner wholesaler)
- `DELETE` or deactivate product (owner wholesaler)
- `POST /api/v1/orders`
- `GET /api/v1/orders` (role-scoped)
- `GET /api/v1/orders/:id`
- `PATCH /api/v1/orders/:id/status` (authorized wholesaler)

## 11. Frontend implementation

- Use React with Vite.
- Use Tailwind CSS for styling.
- Use Lucide React for icons.
- Use React Router or another lightweight routing solution.
- Keep API calls in a centralized service layer.
- Use environment variable `VITE_API_BASE_URL` for the backend base URL.
- Do not hardcode production URLs throughout components.
- Use reusable components for forms, buttons, badges, product cards, order cards, loading states and errors.
- Keep business logic out of presentation components where practical.
- Add form validation and user feedback.
- Ensure refresh/deep links work on the frontend host through SPA fallback configuration.
- Include `.env.example` without secrets.

## 12. Deployment constraints

Frontend and backend will be hosted on different platforms.

Agent must:
- Configure backend CORS for the frontend origin.
- Support environment-based frontend API URL.
- Configure cookie credentials consistently if using cookie auth.
- Document environment variables required on both platforms.
- Ensure the backend listens on `process.env.PORT` and `0.0.0.0` where required.
- Include a production start command.
- Include health check endpoint.
- Explain database connection and migrations.
- Avoid relying on local filesystem persistence for uploads or database storage.
- Do not commit `.env` files, secrets, database credentials or JWT secrets.
- Document the frontend SPA rewrite/fallback requirement.
- Provide deployment steps for the chosen hosting providers without assuming provider-specific features that have not been selected.

## 13. Security and data integrity

- Enforce role permissions server-side on every protected endpoint.
- Validate all inputs.
- Hash passwords securely.
- Use environment secrets and fail safely if required secrets are missing.
- Configure CORS narrowly; do not use wildcard origins with credentials.
- Prevent users from reading or changing another user's data.
- Validate quantities, prices and order totals server-side.
- Use safe error messages.
- Add basic rate limiting to authentication endpoints.
- Do not expose secret values in logs or client bundles.
- Protect against common Express web risks with suitable security middleware.
- Treat frontend route protection as convenience, not security.

## 14. Quality and acceptance criteria

MVP is considered complete only when:

1. Root folder contains distinct `frontend/` and `backend/`.
2. Both projects install and run independently.
3. A retailer can register/login, browse products, search/filter, place an order and view their order.
4. A wholesaler can register/login, create/manage products and view/update orders.
5. Role restrictions are enforced by backend.
6. Order totals and product validation are performed by backend.
7. Seed/demo data allows the workflow to be demonstrated immediately.
8. Responsive layouts work on mobile and desktop.
9. Loading, empty, validation, success and error states are implemented.
10. API base URL and deployment origins are configurable through environment variables.
11. README includes setup, run, seed, test and deployment instructions.
12. No primary UI control is a dead button.
13. No AI, real payment or real delivery feature is represented as implemented unless actually integrated.
14. The implementation aligns with the source documentation and clearly preserves the validation gap.

## 15. Agent execution protocol

The AI agent must follow this sequence:

1. Read this file fully.
2. Inspect the repository before changing anything.
3. Summarize the product and identify assumptions.
4. Present a concise implementation plan and proposed database choice.
5. If the database or an essential product decision is unspecified, ask before proceeding.
6. Create the root folder and frontend/backend separation.
7. Implement backend foundation and database schema first.
8. Implement authentication and role-based authorization.
9. Implement product/supplier catalogue.
10. Implement cart/order creation and order status management.
11. Implement frontend journeys against the real API.
12. Add seed data and tests.
13. Run build, lint and tests; fix errors.
14. Review security, responsive behavior and dead controls.
15. Write README and deployment guide.
16. Report what is complete, what is not, and any assumptions.

Do not:
- Skip directly to UI mockups without functional backend integration.
- Replace API calls with hardcoded frontend data after backend exists.
- silently invent requirements.
- install unnecessary dependencies.
- rewrite unrelated existing code.
- claim completion without running relevant checks.
- stop at a plan or scaffold when the user asked for a working MVP.

## 16. Deliverables

- Working repository with `frontend/` and `backend/`.
- `PRODUCT_SYSTEM_DESIGN.md` (this document).
- `README.md`.
- Database schema/migrations and seed script.
- `.env.example` files for both projects.
- API documentation (README or OpenAPI).
- Tests for critical auth, product, order and authorization flows.
- Clear local and deployment instructions.
