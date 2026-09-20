# personal-page-rust

Personal website. **Rust/axum** backend + **Postgres**, **Next.js** frontend
(BFF — the browser only talks to Next, which reaches the backend internally).
Content (projects, setup configs) lives in the DB and is managed via `/admin`;
live file/repo content is pulled from GitHub.

```
Browser ──/──► Caddy ──► frontend:3000 Next (BFF) ──► backend:8080 ──► Postgres
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

Re-running a seeder **upserts** (updates by slug, never deletes). To also remove
rows no longer in the seed file — e.g. a dropped config — add `--clean`; it lists
what it would delete and asks first (`seed_users` has no `--clean`):

```bash
cargo run --bin seed_configs -- --clean
```

Then open `http://localhost:3000` and sign in at `/login` with
`admin@example.com` / `secret-password`.

## Prod

Deploy is automatic: **push to `master`** → a self-hosted GitHub Actions runner
backs up the DB, rebuilds, and restarts the stack (`docker-compose.yml`).

```bash
git push origin master            # triggers .github/workflows/deploy.yml
```

Before the first Caddy deploy, add these values to `~/personal-page.env`:

```env
SITE_ADDRESS=luxxer23.de
WWW_ADDRESS=www.luxxer23.de
OLD_SITE_ADDRESS="freierfreier23.de, www.freierfreier23.de"
```

Then free ports 80/443 on the server before the deploy starts:

```bash
sudo systemctl disable --now nginx
```

Keep Nginx installed until Caddy is healthy. After deployment, verify the site
and `docker compose logs caddy`; only then remove the Nginx package if desired.

Secrets live on the server in `~/personal-page.env` (see `.env.example`), never
in the repo. Set `SITE_ADDRESS=luxxer23.de` — one canonical host, because it is
also the redirect target. `WWW_ADDRESS` and `OLD_SITE_ADDRESS` each take a
comma-separated list of hosts that redirect there; set `WWW_ADDRESS` only while
that DNS record exists. Caddy obtains and renews HTTPS certificates
automatically. Seed data lives off-repo
too, at `SEEDS_DIR` (mounted at `/seeds`).

Seed once after the first deploy:

```bash
docker exec personal-page-backend seed_users --email you@example.com --password 'secret' --role admin
docker exec personal-page-backend seed_configs  --file /seeds/configs.json
docker exec personal-page-backend seed_projects --file /seeds/projects.json
```

`--clean` works here too, but `docker exec` has no TTY for the prompt — pair it
with `--yes` to confirm non-interactively:

```bash
docker exec personal-page-backend seed_configs --file /seeds/configs.json --clean --yes
```

Private documents (CV / references) are served off-repo too — they are
gitignored and never deployed by CI. Put the PDFs in `DOCS_DIR` on the server
(mounted read-only at `/docs`), e.g. with rsync from your machine:

```bash
rsync -avz frontend/private/ you@server:~/personal-page-docs/
```

DB backups are written before every deploy to `~/backups/db-<timestamp>.sql.gz`
(last 7 kept).

## Config

| Where | What |
|-------|------|
| `.env` / `~/personal-page.env` | Caddy domain, DB, JWT, `BACKEND_URL`, `GITHUB_*`, `SEEDS_DIR`, `DOCS_DIR` — see `.env.example` |
| `backend/seeds/*.json` | seed content (gitignored; `*.example` tracked) |
| `frontend/private/*.pdf` | private docs for `/api/docs` (gitignored; mounted via `DOCS_DIR`) |
| `Caddyfile` | HTTPS reverse proxy (`/` → `frontend:3000`) |
