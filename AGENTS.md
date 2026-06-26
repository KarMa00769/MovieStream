# AGENTS.md — MovieStream

## Stack

- **Frontend:** React 19 + TypeScript + Vite 8 + React Router 7 + Bootstrap 5.3
- **Backend:** Django 4.x + DRF + SQLite + django-cors-headers
- **Infra:** Docker Compose (Node 20, Python 3.11)

## First-time setup

```bash
cp frontend/.env.example frontend/.env    # set VITE_OMDB_API_KEY
cp backend/.env.example backend/.env      # set DJANGO_SECRET_KEY (optional for dev)
docker compose up --build                 # starts both services
```

Open http://localhost:5173.

If the backend container doesn't auto-migrate, run:
```bash
docker compose exec backend python manage.py migrate
```

## Key commands

| Context | Command |
|---|---|
| Start everything | `docker compose up --build` |
| Frontend dev (native) | `npm run dev` (in `frontend/`) |
| Frontend build | `npm run build` (runs `tsc -b && vite build`) |
| Frontend lint | `npm run lint` (ESLint on `frontend/`) |
| Frontend typecheck | `tsc -b` (in `frontend/`) |
| Backend migrate | `docker compose exec backend python manage.py migrate` |
| Backend makemigrations | `docker compose exec backend python manage.py makemigrations` |
| Backend shell | `docker compose exec backend python manage.py shell` |
| Django admin | `docker compose exec backend python manage.py createsuperuser` |

## Architecture

- **No test suite** in either frontend or backend.
- **3 routes:** `/` (Home with OMDb search + curated rows), `/favorites` (localStorage), `/admin` (localStorage CRUD). `*` → 404 page.
- **ErrorBoundary** wraps the entire app tree.
- **API** at `http://localhost:8000/api/peliculas/` (DRF ModelViewSet). Health at `/health/`.
- **Favorites & Admin movies** persist in `localStorage` only — Admin is not connected to the Django API.
- **OMDb** integration requires `VITE_OMDB_API_KEY` in `frontend/.env`. All search/details flow through OMDb; the Django API is used for video uploads.
- **`legacy/`** contains an older pure HTML/CSS/JS Bootstrap version — not used by the React app.
- **Backend** has pagination (20/page), search/ordering filters, rate throttling (100 req/h anon), and `django-environ` for config.
- **Django admin** at `/admin/` — Movie model is registered via `movies/admin.py`.

## Configuration

- **Backend** uses `django-environ` — configure via `backend/.env` (see `.env.example`).
- **Frontend** uses Vite env vars — `VITE_OMDB_API_KEY` (required) and `VITE_API_URL` (optional, defaults to localhost:8000).
- **Docker Compose** provides dev defaults for all backend env vars.

## Docker

- Backend Dockerfile runs `migrate` on start (not `makemigrations`). Run `makemigrations` manually when changing models.
- Frontend dev server uses `--host` flag (configured in `vite.config.ts` `server.host: true`).
- Both services have `.dockerignore` files — build context excludes ephemeral files.
- Containers run as non-root user (backend) for security.
- `restart: unless-stopped` on both services.
- DB persists via bind mount `./backend:/app` (SQLite lives at `backend/db.sqlite3` on host).
