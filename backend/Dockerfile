FROM rust:1-slim-bookworm AS builder

WORKDIR /app

COPY Cargo.toml Cargo.lock ./
COPY src ./src

RUN cargo build --release

FROM debian:bookworm-slim AS runtime

WORKDIR /app

# The server plus the seed binaries (cargo build --release builds all bins), so
# prod can seed via `docker compose exec backend seed_configs`.
COPY --from=builder /app/target/release/backend /usr/local/bin/backend
COPY --from=builder /app/target/release/seed_users /usr/local/bin/seed_users
COPY --from=builder /app/target/release/seed_projects /usr/local/bin/seed_projects
COPY --from=builder /app/target/release/seed_configs /usr/local/bin/seed_configs

CMD ["backend"]
