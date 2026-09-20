# personal-page-rust

Personal website. **Rust/axum** backend + **Postgres**, **Next.js** frontend
(BFF — the browser only talks to Next, which reaches the backend internally).
The curated lists (projects, setup configs) are static arrays in the frontend;
the DB holds accounts only, managed via `/admin`. Everything displayed — repo
metadata, READMEs, dotfiles — is pulled live from GitHub.

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

Seed the accounts (one-time, run from `backend/`, DB up):

```bash
cd backend
cargo run --bin seed_users        # admin@example.com / secret-password (+ friend, user)
```

The projects and the personal-setup entries are not seeded: they are static
lists in `frontend/features/projects/lib/projects.ts` and
`frontend/features/setup/lib/configs.ts`. Edit the array to add, reorder or
remove one.

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
automatically.

Seed the admin account once after the first deploy:

```bash
docker exec personal-page-backend seed_users --email you@example.com --password 'secret' --role admin
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
| `.env` / `~/personal-page.env` | Caddy domain, DB, JWT, `BACKEND_URL`, `GITHUB_*`, `DOCS_DIR` — see `.env.example` |
| `frontend/features/*/lib/{projects,configs}.ts` | the curated project + setup lists |
| `frontend/private/*.pdf` | private docs for `/api/docs` (gitignored; mounted via `DOCS_DIR`) |
| `Caddyfile` | HTTPS reverse proxy (`/` → `frontend:3000`) |
