FROM rust:1-slim-bookworm AS builder

WORKDIR /app

COPY Cargo.toml Cargo.lock ./
COPY src ./src

RUN cargo build --release

FROM debian:bookworm-slim AS runtime

WORKDIR /app

# The server plus the account seeder (cargo build --release builds all bins), so
# a fresh deployment can create its first admin via
# `docker exec <container> seed_users ...`.
COPY --from=builder /app/target/release/backend /usr/local/bin/backend
COPY --from=builder /app/target/release/seed_users /usr/local/bin/seed_users

CMD ["backend"]
