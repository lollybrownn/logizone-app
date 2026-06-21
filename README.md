# LogiZone WMS

A Warehouse Management System for tracking inbound items, zone placement, outbound validation, and reporting. Built with Express + PostgreSQL on the backend and React + Vite + Tailwind on the frontend.

This README covers both `backend/` and `frontend/` — clone or copy each into its own folder before following the steps below.

---

## 1. Prerequisites

- **Node.js** 18 or newer
- **PostgreSQL** 14 or newer, running locally (or accessible remotely)
- **npm** (comes with Node)

Check what you have:

```bash
node -v
psql --version
```

---

## 2. Backend setup

```bash
cd backend
npm install
```

### 2.1 Configure environment

Copy the example file and fill in your real values:

```bash
cp .env.example .env
```

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_NAME=logizone_db
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=8h
PORT=3000
```

- `DB_PASSWORD` — your local Postgres user's password.
- `JWT_SECRET` — **don't leave this as the placeholder.** Generate a real random value:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
  Paste the output in as `JWT_SECRET`. Anyone who knows this value can forge login tokens, so keep it out of git (already covered by `.gitignore`) and use a different value per environment.

### 2.2 Create the database and load the schema

```bash
createdb logizone_db
psql -d logizone_db -f src/database/schema.sql
```

`schema.sql` is safe to re-run against an existing database — it won't drop or duplicate tables.

### 2.3 (Optional) Seed sample data

```bash
psql -d logizone_db -f src/database/seeder.sql
```

This adds 6 users, 3 warehouse partners, 6 zones, and a batch of sample inbound/outbound items so you can explore the app immediately. Default password for every seeded user is **`password123`**:

| Username      | Role              | Status                                                   |
| ------------- | ----------------- | -------------------------------------------------------- |
| `admin_owner` | Owner             | Active                                                   |
| `budi_ops`    | Staff Operasional | Active                                                   |
| `sari_ops`    | Staff Operasional | Active                                                   |
| `deni_gudang` | Staff Gudang      | Active                                                   |
| `rina_gudang` | Staff Gudang      | Active                                                   |
| `tono_gudang` | Staff Gudang      | **Inactive** (for testing the deactivated-account block) |

If zone capacity numbers ever look wrong (e.g. a "violates check constraint" error when moving or validating items out), run the repair script:

```bash
psql -d logizone_db -f src/database/reconcile_capacity.sql
```

This recalculates each zone's filled capacity from the actual stored items — safe to run any time.

### 2.4 Run the server

```bash
npm run dev      # auto-restarts on file changes (nodemon)
# or
npm start        # plain node, no auto-restart
```

You should see:

```
Server running on port 3000
✅ Database connected successfully
```

If you see `❌ Database connection failed`, double-check `.env` matches your actual Postgres credentials and that Postgres is running.

API is now available at `http://localhost:3000/api`. Full endpoint list is in `ROUTES.md`.

---

## 3. Frontend setup

Open a **second terminal** (keep the backend running) and:

```bash
cd frontend
npm install
```

### 3.1 Configure environment

```bash
cp .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Only change this if your backend runs on a different host/port.

### 3.2 Run the dev server

```bash
npm run dev
```

Vite will print a local URL, typically:

```
➜  Local:   http://localhost:5173/
```

Open that in your browser. You'll land on the login page — use any of the seeded accounts above (password `password123`), or create your own via Manajemen Akun once logged in as Owner.

### 3.3 Build for production

```bash
npm run build
```

Output goes to `frontend/dist/`. Serve that folder with any static host, and make sure `VITE_API_BASE_URL` points at wherever your backend actually runs in that environment.

---

## 4. Running both together — quick reference

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Then visit the frontend URL in your browser. The frontend talks to the backend over HTTP using the URL in its `.env`.

---

## 5. Project structure

```
backend/
  server.js                 Entry point
  src/
    app.js                  Express app, mounts all routes under /api
    config/
      database.js           PostgreSQL connection pool
    database/
      schema.sql            Table definitions (safe to re-run)
      seeder.sql             Sample data
      reconcile_capacity.sql Repairs drifted zone capacity numbers
    middlewares/
      authMiddleware.js      JWT verification + role-based access guard
    models/                 One file per table, raw parameterized SQL
    controllers/            Request handlers + validation rules
    routes/                 One file per resource

frontend/
  src/
    main.jsx                Entry point
    App.jsx                 Routes + provider setup
    Auth/
      Login.jsx
    api/                    One file per backend resource (fetch wrappers)
    context/                Auth, Zone, and Toast state (React Context)
    components/
      common/                Shared UI: ProtectedRoute, Pagination, ToastContainer
      Sidebar.jsx
      ModalTambahBarang.jsx
    pages/
      Dashboard.jsx
      Inbound/               Pendataan Barang, Penentuan Lokasi
      Operasional/            Pencarian Barang, Monitoring Aging
      Outbound/                Validasi Outbound
      Owner/                    Laporan, Manajemen Zona, Gudang Induk, Manajemen Akun
```

---

## 6. Roles and access

Three roles, enforced on both frontend (route guarding + sidebar visibility) and backend (middleware):

| Role                  | Can access                                                                         |
| --------------------- | ---------------------------------------------------------------------------------- |
| **Owner**             | Everything, including Laporan, Manajemen Zona, Gudang Induk, Manajemen Akun        |
| **Staff Operasional** | Dashboard, Pendataan Barang, Pencarian Barang, Monitoring Aging                    |
| **Staff Gudang**      | Dashboard, Penentuan Lokasi, Pencarian Barang, Monitoring Aging, Validasi Outbound |

An account with `status = Inactive` cannot log in, regardless of role.

---

## 7. Troubleshooting

**`Cannot find module 'dotenv'` (or similar) on backend start**
Dependencies weren't installed, or `package.json` got reverted. Run `npm install` again inside `backend/`.

**`Cannot find module 'env'` or `'.env'`**
This means `src/app.js` has a typo — it should say exactly `require("dotenv").config()`, not `require("env")` or `require(".env")`.

**Database connection failed**
Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in `backend/.env` match your actual Postgres setup, and that Postgres is running (`pg_lsclusters` on Linux, or check Services on Windows).

**Login works but every other request returns 401**
Your `JWT_SECRET` likely changed since the token was issued (e.g. you edited `.env` mid-session). Log out and back in.

**"violates check constraint chk_kapasitas_terisi"**
Run `psql -d logizone_db -f src/database/reconcile_capacity.sql` (see section 2.3).

**Frontend shows a blank page or network errors**
Confirm the backend is actually running and `VITE_API_BASE_URL` in `frontend/.env` points to the right address.
