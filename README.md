# AI-Solution

A full-stack marketing website for an AI software-services company, with a public
site and a complete admin dashboard for managing all of its content.

- **Backend** — [FastAPI](https://fastapi.tiangolo.com/) + SQLite (no external
  database, no migrations). Auto-creates and seeds its database on first run.
- **Frontend** — [React 19](https://react.dev/) + [Vite](https://vite.dev/) +
  [React Router 7](https://reactrouter.com/).

The frontend talks to the backend over a small REST API under `/api`. In
development Vite proxies `/api` to the backend, so there is no CORS to configure.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
  - [1. Backend setup](#1-backend-setup)
  - [2. Frontend setup](#2-frontend-setup)
- [Default admin login](#default-admin-login)
- [Configuration](#configuration)
- [Features](#features)
  - [Public website](#public-website)
  - [Chatbot](#chatbot)
- [Admin dashboard](#admin-dashboard)
- [API reference](#api-reference)
- [Resetting the data](#resetting-the-data)

---

## Tech stack

| Layer    | Technology |
|----------|------------|
| Backend  | Python 3.11+, FastAPI, Uvicorn, SQLite (stdlib), python-multipart |
| Auth     | PBKDF2-HMAC-SHA256 password hashing + stateless HMAC-signed tokens (no extra crypto deps) |
| Frontend | React 19, Vite, React Router 7 |
| Storage  | SQLite database file (`backend/data/app.db`) + local image uploads (`backend/uploads/`) |

---

## Prerequisites

- **Python** 3.11 or newer
- **Node.js** 18 or newer (Node 20+ recommended) and **npm**
- **Git**

---

## Project structure

```
ai_project/
├── backend/                  # FastAPI API
│   ├── app/
│   │   ├── main.py           # app factory, CORS, router mounting, startup seeding
│   │   ├── config.py         # env-overridable settings
│   │   ├── security.py       # PBKDF2 hashing + HMAC token auth
│   │   ├── storage.py        # thread-safe SQLite repository (auto-creates + seeds)
│   │   ├── seed.py           # dummy seed data
│   │   ├── schemas.py        # Pydantic request/response models
│   │   ├── faq.py            # chatbot FAQ + keyword matcher
│   │   └── routers/          # auth, collections, inquiries, settings,
│   │                         #   dashboard, chat, uploads
│   ├── data/                 # SQLite database (auto-created, git-ignored)
│   ├── uploads/              # uploaded images (auto-created, git-ignored)
│   └── requirements.txt
│
└── frontend/                 # React + Vite single-page app
    ├── src/
    │   ├── App.jsx           # routes (public + admin)
    │   ├── pages/            # public pages
    │   ├── pages/admin/      # admin dashboard pages
    │   ├── components/       # shared UI (Navbar, Footer, Chatbot, admin UI…)
    │   └── data/             # API client + in-memory store
    ├── vite.config.js        # dev server + /api proxy
    └── package.json
```

---

## Getting started

Run the **backend** and **frontend** in two separate terminals.

### 1. Backend setup

From the project root:

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv

# Activate it:
#   Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
#   Windows (cmd):
#     .\.venv\Scripts\activate.bat
#   macOS / Linux:
#     source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the dev server (auto-reloads on changes)
uvicorn app.main:app --reload
```

The backend is now running at:

- API base: <http://127.0.0.1:8000/api>
- Interactive API docs (Swagger UI): <http://127.0.0.1:8000/docs>

> On first launch the SQLite database is created at `backend/data/app.db` and
> seeded with sample content automatically — no migrations or manual setup needed.

### 2. Frontend setup

In a **second terminal**, from the project root:

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite dev server
npm run dev
```

The frontend is now running at <http://localhost:5173>.

- Public site: <http://localhost:5173/>
- Admin dashboard: <http://localhost:5173/admin>

Vite proxies all `/api` requests to the backend at `http://127.0.0.1:8000`, so
keep the backend running while you use the app.

**Other frontend commands:**

```bash
npm run build     # production build into dist/
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

---

## Default admin login

The default admin account is created on the backend's first run:

| Username | Password      |
|----------|---------------|
| `admin`  | `AiAdmin@2026` |

Sign in at <http://localhost:5173/admin>. You can change the username and
password later from **Admin → Settings**. (The defaults can also be overridden
with environment variables before first run — see [Configuration](#configuration).)

---

## Configuration

The backend reads optional environment variables (all prefixed `AI_`). Defaults
work out of the box for local development.

| Variable | Default | Purpose |
|----------|---------|---------|
| `AI_SECRET_KEY` | `dev-secret-change-me` | Token signing key — **change in production** |
| `AI_TOKEN_EXPIRE_MINUTES` | `720` | Admin session length (minutes) |
| `AI_ADMIN_USER` | `admin` | Default admin username (first run only) |
| `AI_ADMIN_PASSWORD` | `AiAdmin@2026` | Default admin password (first run only) |
| `AI_CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Allowed frontend origins |
| `AI_DB_PATH` | `backend/data/app.db` | SQLite database location |
| `AI_MAX_UPLOAD_MB` | `5` | Max image upload size (MB) |

**Frontend:** the API base URL defaults to `/api` (proxied in dev). For a
production deployment where the API lives elsewhere, set `VITE_API_URL` at build
time, e.g. `VITE_API_URL=https://api.example.com/api`.

> **Password policy:** new admin passwords must be at least 8 characters and
> include one uppercase letter, one lowercase letter, one number, and one special
> character.

---

## Features

### Public website

A polished, responsive marketing site (mobile menu included) with a theme that's
fully driven by the admin settings (logo, site name, brand colors, page banners).

| Page | Route | What it shows |
|------|-------|---------------|
| **Home** | `/` | Hero banner, highlights, and an overview of the company |
| **Services** | `/services` | The enterprise software services on offer |
| **Industries** | `/industries` | Industry-specific solutions / verticals |
| **Testimonials** | `/testimonials` | Client testimonials and success stories |
| **Articles** | `/articles` | Insight articles / blog posts with author, category and read time |
| **Gallery** | `/gallery` | Photo gallery of events, conferences and milestones |
| **Contact** | `/contact` | Contact form that submits an inquiry to the backend |

Other public-facing touches:

- **Live theming** — the navbar, footer and page heroes read brand colors, logo
  and copy from the backend settings, so admin changes appear instantly.
- **Per-page banners (heroes)** — each page's banner image, badge, heading,
  sub-text and text color are all admin-configurable.
- **Contact form** — submissions are stored as inquiries the admin can review and
  export.

### Chatbot

A floating chatbot is available on **every** page (public and admin):

- Answers common questions using a keyword-matching **FAQ** engine, with a
  sensible fallback reply when nothing matches.
- Lets visitors **book / submit an inquiry**, which is saved to the backend just
  like the contact form.

---

## Admin dashboard

Sign in at `/admin`. Everything below is protected by an admin token; the public
site can read content but only an authenticated admin can create, edit or delete.

| Section | Route | Capabilities |
|---------|-------|--------------|
| **Dashboard** | `/admin/dashboard` | At-a-glance analytics: counts of services, events, gallery photos, articles, testimonials and inquiries; inquiries this week; most recent inquiries; inquiries grouped by country (with charts) |
| **Inquiries** | `/admin/inquiries` | View all contact-form & chatbot inquiries (newest first), delete one, clear all, and **export to CSV** |
| **Services** | `/admin/services` | Full CRUD for the services shown on the public Services page |
| **Events** | `/admin/events` | Full CRUD for events |
| **Articles** | `/admin/articles` | Full CRUD for insight articles — title, category (with color), excerpt, author + author photo, date, read time |
| **Gallery** | `/admin/gallery` | Full CRUD for gallery photos, including image upload |
| **Testimonials** | `/admin/testimonials` | Full CRUD for client testimonials |
| **Banners** | `/admin/banners` | Per-page hero editor — set each page's banner image, badge label, heading, sub-text and text color, with a **live preview** |
| **Settings** | `/admin/settings` | Manage the admin account (change username / password) and global site controls (site name, text or uploaded-image logo, tagline, and primary / dark / accent brand colors) with a live logo preview |

**Admin highlights:**

- **Image uploads** — gallery photos, author avatars and page banners can be
  uploaded directly; files are stored on the server (`backend/uploads/`) and the
  document just keeps the resulting URL. Allowed types: JPG, PNG, WEBP, GIF (max
  5 MB by default).
- **Reusable resource manager** — content sections (services, events, articles,
  gallery, testimonials) share a consistent table + form UI for create / edit /
  delete.
- **Live updates** — saving settings, banners or content updates the in-memory
  store and re-renders the affected parts of the site immediately.
- **Responsive admin** — a collapsible sidebar / drawer makes the dashboard
  usable on mobile.

---

## API reference

All endpoints are mounted under `/api`. Reads on content collections and settings
are **public**; all writes and admin endpoints require a `Bearer` token obtained
from `/api/auth/login`.

| Method | Path | Auth | Purpose |
|--------|------|:----:|---------|
| GET    | `/api/health` | – | Health check |
| POST   | `/api/auth/login` | – | Login → `{ access_token, username }` |
| GET    | `/api/auth/me` | ✅ | Current admin user |
| PUT    | `/api/auth/credentials` | ✅ | Change username / password |
| GET    | `/api/services` · `/api/events` · `/api/photos` · `/api/blogs` · `/api/testimonials` | – | List items |
| POST   | `/api/{collection}` | ✅ | Create an item |
| PUT    | `/api/{collection}/{id}` | ✅ | Update an item |
| DELETE | `/api/{collection}/{id}` | ✅ | Delete an item |
| GET    | `/api/inquiries` | ✅ | List inquiries (newest first) |
| POST   | `/api/inquiries` | – | Submit an inquiry (contact form / chatbot) |
| GET    | `/api/inquiries/export.csv` | ✅ | Download inquiries as CSV |
| DELETE | `/api/inquiries/{id}` | ✅ | Delete one inquiry |
| DELETE | `/api/inquiries` | ✅ | Clear all inquiries |
| GET    | `/api/settings` | – | Get site settings |
| PUT    | `/api/settings` | ✅ | Update site settings (partial / deep-merged) |
| GET    | `/api/dashboard/stats` | ✅ | Counts, recent inquiries, by-country |
| GET    | `/api/chat/faq` | – | FAQ list |
| POST   | `/api/chat` | – | `{ message }` → `{ answer, matched }` |
| POST   | `/api/upload` | ✅ | Upload an image (multipart) → `{ url, filename }` |
| GET    | `/api/uploads/{filename}` | – | Serve an uploaded image |

> Note: the public **Articles** page is backed by the `blogs` collection and the
> public **Gallery** page by the `photos` collection.

Explore and try every endpoint interactively at <http://127.0.0.1:8000/docs>.

---

## Resetting the data

The database and default admin account are created only on first run. To wipe
everything and start fresh:

1. Stop the backend server.
2. Delete `backend/data/app.db`.
3. Start the backend again — it will recreate and re-seed the database.

(Optionally also clear `backend/uploads/` to remove uploaded images.)
