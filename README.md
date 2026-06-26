# personal-page-rust

Personal website. **Rust/axum** backend + **Postgres**, **Next.js** frontend
(BFF — the browser only talks to Next, which reaches the backend internally).
Content (projects, setup configs) lives in the DB and is managed via `/admin`;
live file/repo content is pulled from GitHub.

```
Browser ──/──► nginx ──► :3000 Next (BFF) ──► backend:8080 ──► Postgres
                                  └──► api.github.com (live content)
```

## Dev

Everything runs in Docker; migrations apply automatically on start.

```bash
# bring up postgres + backend + frontend (hot-reload)
docker compose -f docker-compose.dev.yml up

#   frontend  http://localhost:3000
#   backend   http://localhost:8080
#   postgres  localhost:5432
```

Seed data (one-time, run from `backend/`, DB up). The seed files are off-repo —
copy the templates first:

```bash
cd backend
cp seeds/configs.json.example  seeds/configs.json
cp seeds/projects.json.example seeds/projects.json

cargo run --bin seed_users        # admin@example.com / secret-password (+ friend, user)
cargo run --bin seed_configs      # reads seeds/configs.json
cargo run --bin seed_projects     # reads seeds/projects.json
```

Then open `http://localhost:3000` and sign in at `/login` with
`admin@example.com` / `secret-password`.

## Prod

Deploy is automatic: **push to `master`** → a self-hosted GitHub Actions runner
backs up the DB, rebuilds, and restarts the stack (`docker-compose.yml`).

```bash
git push origin master            # triggers .github/workflows/deploy.yml
```

Secrets live on the server in `~/personal-page.env` (see `.env.example`), never
in the repo. Seed data lives off-repo too, at `SEEDS_DIR` (mounted at `/seeds`).

Seed once after the first deploy:

```bash
docker exec personal-page-backend seed_users --email you@example.com --password 'secret' --role admin
docker exec personal-page-backend seed_configs  --file /seeds/configs.json
docker exec personal-page-backend seed_projects --file /seeds/projects.json
```

DB backups are written before every deploy to `~/backups/db-<timestamp>.sql.gz`
(last 7 kept).

## Config

| Where | What |
|-------|------|
| `.env` / `~/personal-page.env` | DB, JWT, `BACKEND_URL`, `GITHUB_*`, `SEEDS_DIR` — see `.env.example` |
| `backend/seeds/*.json` | seed content (gitignored; `*.example` tracked) |
| `nginx.conf.example` | reverse proxy (`/` → `:3000`) |
