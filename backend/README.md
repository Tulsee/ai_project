# AI-Solution — Backend (FastAPI)

A FastAPI backend for the AI-Solution website. It powers the public site
(services, events, photos, blogs, settings, chatbot FAQ) and the admin panel
(auth, inquiries, dashboard analytics, content management, settings).

Data is stored as JSON files under `backend/data/` (created on first run and
seeded with dummy data). Auth uses PBKDF2 password hashing + HMAC-signed tokens.
**No dependencies beyond `fastapi` and `uvicorn`** — everything else is the
Python standard library. Swap `app/storage.py` for a real database later without
touching the routers.

## Run

```bash
cd backend
# activate the venv (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# install deps (already installed if you followed setup)
pip install -r requirements.txt

# start the dev server
uvicorn app.main:app --reload
```

- API base: `http://127.0.0.1:8000/api`
- Interactive docs (Swagger): `http://127.0.0.1:8000/docs`
- Default admin login: **admin / admin123**

## Project layout

```
backend/
  app/
    main.py              # app factory, CORS, router mounting, startup seeding
    config.py            # env-overridable settings
    security.py          # PBKDF2 hashing + HMAC token auth dependency
    storage.py           # thread-safe JSON-file repository
    seed.py              # dummy seed data (mirrors the frontend)
    schemas.py           # Pydantic request/response models
    faq.py               # chatbot FAQ + keyword matcher
    routers/
      auth.py            # login, /me, change credentials
      collections.py     # generic CRUD: services, events, photos, blogs
      inquiries.py       # contact-form inquiries + CSV export
      settings.py        # site settings (logo, name, theme)
      dashboard.py       # admin analytics
      chat.py            # chatbot FAQ + answer matching
  data/                  # JSON data files (auto-created, git-ignored)
  requirements.txt
```

## API reference

Reads on content collections and settings are **public**; all writes and the
admin endpoints require a `Bearer` token from `/api/auth/login`.

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET    | `/api/health` | – | Health check |
| POST   | `/api/auth/login` | – | Login → `{ access_token, username }` |
| GET    | `/api/auth/me` | ✅ | Current admin user |
| PUT    | `/api/auth/credentials` | ✅ | Change username / password |
| GET    | `/api/services` `/api/events` `/api/photos` `/api/blogs` | – | List |
| POST   | `/api/{collection}` | ✅ | Create |
| PUT    | `/api/{collection}/{id}` | ✅ | Update |
| DELETE | `/api/{collection}/{id}` | ✅ | Delete |
| GET    | `/api/inquiries` | ✅ | List inquiries (newest first) |
| POST   | `/api/inquiries` | – | Submit inquiry (contact form / chatbot) |
| GET    | `/api/inquiries/export.csv` | ✅ | Download CSV |
| DELETE | `/api/inquiries/{id}` | ✅ | Delete one |
| DELETE | `/api/inquiries` | ✅ | Clear all |
| GET    | `/api/settings` | – | Get site settings |
| PUT    | `/api/settings` | ✅ | Update site settings (partial) |
| GET    | `/api/dashboard/stats` | ✅ | Counts, recent inquiries, by-country |
| GET    | `/api/chat/faq` | – | FAQ list |
| POST   | `/api/chat` | – | `{ message }` → `{ answer, matched }` |

## Configuration

Override via environment variables:

| Variable | Default |
|----------|---------|
| `AI_SECRET_KEY` | `dev-secret-change-me` |
| `AI_TOKEN_EXPIRE_MINUTES` | `720` |
| `AI_ADMIN_USER` / `AI_ADMIN_PASSWORD` | `admin` / `admin123` |
| `AI_CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` |

> The default admin account is created only on first run. To reset all data,
> stop the server and delete the `backend/data/` folder.
