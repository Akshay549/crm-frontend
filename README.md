# EstateFlow CRM: Real Estate Lead Management System

A mini CRM for real estate sales teams. Capture leads, track them through the pipeline (New → Contacted → Site Visit → Closed), keep notes on every conversation, and see key sales metrics on a dashboard.

## Links

| | |
|---|---|
| **Live app** | https://crm-frontend-4jwh.vercel.app |
| **Frontend code** | https://github.com/Akshay549/crm-frontend |
| **Backend code** | https://github.com/Akshay549/crm-backend |
| **API base URL** | https://crm-backend-blush-one.vercel.app |

**Demo login:** `demo@estateflow.in` / `demo1234`

---

## Features

- **Login:** email and password, with a session stored in an httpOnly cookie.
- **Lead capture:** add a lead with name, phone, email, budget, location, property type and lead source.
- **Lead listing:** table with name, contact, budget, location, source and status. Search by name or phone, filter by source and status, sort by date or budget, and pagination.
- **Lead detail:** full lead information, status updates (New, Contacted, Site Visit, Closed) and notes.
- **Dashboard:** total leads, closed deals, conversion rate, leads by source, status distribution and recently added leads.
- **Validation and error handling** on both frontend and backend.

---

## Frontend

**Repo:** `crm-frontend`

**Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, React Hook Form, Zod, Axios, React Hot Toast, Recharts, Lucide icons

| Page | Route | Description |
|---|---|---|
| Login | `/login` | Email/password form with validation and server error messages |
| Dashboard | `/dashboard` | KPI cards, leads-by-source chart, status distribution, recent leads |
| Leads | `/leads` | Lead table with search, filters, sorting, pagination, and add/edit/delete |
| Lead details | `/leads/[id]` | Full lead info, status update and notes |

**How it talks to the backend:** a single Axios instance (`src/lib/axios.ts`) sends every request to `/api/*` on the frontend's own domain, and a Next.js rewrite (`next.config.ts`) forwards it to the backend. The session cookie is therefore first-party and works in every browser, including private windows and Safari. API calls live in `src/services/`, and a small helper (`src/lib/api-error.ts`) turns backend errors into messages for the forms.

---

## Backend

**Repo:** `crm-backend`

**Stack:** Node.js, Express 5, TypeScript, MongoDB with Mongoose, Zod, bcrypt, cookie-parser, CORS. Deployed on Vercel.

**Structure:**

```
src/
  app.ts          # Express app (exported)
  server.ts       # Local server start
  config/         # MongoDB connection
  models/         # Mongoose schemas (user, session, lead, note)
  validators/     # Zod schemas
  middleware/     # validate, auth, errorHandler
  controllers/    # Request handlers
  routes/         # Route definitions
  utils/          # AppError, seed script
api/index.ts      # Vercel serverless entry
```

### Endpoints

All responses use the same shape:

```json
{ "success": true, "message": "Lead created successfully", "data": { } }
{ "success": false, "message": "Validation failed", "errors": [{ "field": "phone", "message": "Phone number must be 10 digits" }] }
```

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/login` | Log in, sets the session cookie | No |
| GET | `/auth/me` | Current user | Yes |
| POST | `/auth/logout` | Log out, clears the session (safe to call without a session) | No |
| GET | `/leads` | List leads. Query: `search`, `source`, `status`, `sort`, `page`, `limit` | Yes |
| POST | `/leads` | Create a lead | Yes |
| GET | `/leads/:id` | Get one lead | Yes |
| PATCH | `/leads/:id` | Update lead details | Yes |
| PATCH | `/leads/:id/status` | Update only the status | Yes |
| DELETE | `/leads/:id` | Delete a lead and its notes | Yes |
| GET | `/leads/:id/notes` | List notes of a lead | Yes |
| POST | `/leads/:id/notes` | Add a note | Yes |
| GET | `/dashboard/stats` | Dashboard metrics | Yes |

**Status codes:** `200` OK, `201` created, `400` validation error / invalid id, `401` not logged in or wrong credentials, `404` not found, `409` duplicate (phone already exists), `500` server error.

### Validation

The backend never trusts the frontend. Every request is validated with a Zod schema, and the Mongoose schema acts as a second layer.

| Field | Rule |
|---|---|
| `name` | Required, 2 to 50 characters |
| `phone` | Required, 10 digits, unique |
| `email` | Optional, valid email |
| `budget` | Required, number greater than 0 (rupees) |
| `location` | Required, 2 to 100 characters |
| `propertyType` | `1 BHK`, `2 BHK`, `3 BHK`, `4+ BHK`, `Plot`, `Commercial` |
| `source` | `Facebook`, `Google`, `Referral`, `Walk-in`, `Website`, `Other` |
| `status` | `New`, `Contacted`, `Site Visit`, `Closed` |

A global error handler converts Zod, Mongoose, duplicate-key, invalid-id and invalid-JSON errors into consistent JSON responses.

### Authentication

`POST /auth/login` checks the password (bcrypt), creates a random session ID, stores it in the `sessions` collection and sends it as an httpOnly cookie (7 days; MongoDB removes expired sessions automatically). Protected routes look up the session on every request.

---

## Run locally

**Prerequisites:** Node.js 20+, npm, and a MongoDB database (MongoDB Atlas free tier or a local server).

### 1. Backend

```bash
git clone https://github.com/Akshay549/crm-backend.git
cd crm-backend
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Description | Example |
|---|---|---|
| `MONGODB_CONNECTION_STRING` | MongoDB connection string with database name | `mongodb+srv://user:pass@cluster.mongodb.net/crm` |
| `EXPRESS_PORT` | API port | `5000` |
| `CLIENT_URL` | Frontend URL (CORS), must match exactly | `http://localhost:3000` |
| `NODE_ENV` | `development` or `production` | `development` |

Create the demo user and 12 sample leads (once), then start the API:

```bash
npm run seed:user
npm run seed:leads   # optional sample data
npm run dev
```

The API runs at `http://localhost:5000`.

### 2. Frontend

```bash
git clone https://github.com/Akshay549/crm-frontend.git
cd crm-frontend
npm install
cp .env.example .env.local
```

`.env.local`:

| Variable | Description | Example |
|---|---|---|
| `BACKEND_URL` | Backend address that `/api/*` is forwarded to (server side only) | `http://localhost:5000` |

```bash
npm run dev
```

Open **http://localhost:3000** and log in with `demo@estateflow.in` / `demo1234`. Use `localhost` consistently, not `127.0.0.1`.

### Scripts

| Backend | |
|---|---|
| `npm run dev` | Start with auto-reload |
| `npm run build` / `npm start` | Compile and run the build |
| `npm run seed:user` | Create the demo user |
| `npm run seed:leads` | Add 12 sample leads and notes (skips if leads exist) |

| Frontend | |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build and run |
| `npm run lint` | ESLint |

---

## Deployment (Vercel)

Both apps are deployed as separate Vercel projects.

- **Backend:** `vercel.json` routes all requests to `api/index.ts`, which runs the Express app. Environment variables: `MONGODB_CONNECTION_STRING`, `CLIENT_URL` (the frontend URL, without a trailing slash) and `NODE_ENV=production`. MongoDB Atlas must allow connections from Vercel (Network Access `0.0.0.0/0`).
- **Frontend:** environment variable `BACKEND_URL` set to the backend URL (for example `https://your-backend.vercel.app`). Redeploy the frontend after changing it, because it is read at build time.
- The browser only talks to the frontend domain (`/api/*` is rewritten to the backend), so the session cookie is first-party (`HttpOnly; Secure; SameSite=Lax`) and is not blocked as a third-party cookie.

---

## Assumptions

- One sales team; every logged-in user can see all leads.
- Phone numbers are 10-digit Indian numbers and are unique per lead.
- Budget is stored in rupees and displayed as ₹85 L or ₹1.3 Cr.
- Conversion rate = closed leads ÷ total leads × 100.
- There is no sign-up screen; users are created with the seed script.

---

**Author:** Akshay Akhade