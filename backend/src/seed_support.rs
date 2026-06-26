//! Shared helpers for the `seed_*` binaries. The crate has no lib target, so the
//! seeders pull this in with `#[path = "../seed_support.rs"] mod seed_support;`.
//! Each bin compiles its own copy and may use only part of it — hence the
//! module-level dead_code allow.
#![allow(dead_code)]

use std::fs;
use std::io::{self, IsTerminal, Write};

use sqlx::{AssertSqlSafe, PgPool};

const DEFAULT_DATABASE_URL: &str =
    "postgres://personal_page:personal_page@localhost:5432/personal_page";

/// Resolve DATABASE_URL: env var, then ./.env, then ../.env, then a local default.
pub fn database_url() -> String {
    std::env::var("DATABASE_URL")
        .ok()
        .or_else(|| database_url_from_env_file(".env"))
        .or_else(|| database_url_from_env_file("../.env"))
        .unwrap_or_else(|| DEFAULT_DATABASE_URL.to_string())
}

fn database_url_from_env_file(path: &str) -> Option<String> {
    let content = fs::read_to_string(path).ok()?;

    content.lines().find_map(|line| {
        let (key, value) = line.split_once('=')?;

        (key == "DATABASE_URL").then(|| value.trim().to_string())
    })
}

/// Connect to the database or panic with a clear message.
pub async fn connect() -> PgPool {
    PgPool::connect(&database_url())
        .await
        .expect("failed to connect to database")
}

/// Value following `--name`, if present (e.g. `--file path`).
pub fn flag(args: &[String], name: &str) -> Option<String> {
    args.iter()
        .position(|arg| arg == name)
        .and_then(|index| args.get(index + 1))
        .cloned()
}

/// Whether a boolean switch like `--clean` is present.
pub fn has_flag(args: &[String], name: &str) -> bool {
    args.iter().any(|arg| arg == name)
}

/// Delete rows from `table` whose `key_column` is no longer in the seed (`keep`).
/// Prints a warning listing them first and only deletes after confirmation: an
/// interactive y/N prompt, or `force` (`--yes`) for non-interactive use like
/// `docker exec ... --clean --yes`.
///
/// `table` and `key_column` are compile-time constants from the seed bins, never
/// user input, so formatting them into the query is safe (no SQL injection).
pub async fn clean_stale(
    db: &PgPool,
    table: &str,
    key_column: &str,
    keep: &[String],
    force: bool,
) -> Result<(), sqlx::Error> {
    // table/key_column are constants from the bins (not user input); AssertSqlSafe
    // acknowledges the dynamic string is safe. Values are still bound, never inlined.
    let existing: Vec<(String,)> =
        sqlx::query_as(AssertSqlSafe(format!("SELECT {key_column} FROM {table}")))
            .fetch_all(db)
            .await?;

    let stale: Vec<String> = existing
        .into_iter()
        .map(|(key,)| key)
        .filter(|key| !keep.iter().any(|kept| kept == key))
        .collect();

    if stale.is_empty() {
        println!("clean: {table} already matches the seed, nothing to prune.");
        return Ok(());
    }

    eprintln!(
        "⚠️  clean: {} row(s) in '{table}' are not in the seed and will be DELETED:",
        stale.len()
    );
    for key in &stale {
        eprintln!("      - {key}");
    }

    if !force && !confirm() {
        eprintln!("clean: aborted — nothing deleted. (pass --yes to confirm)");
        return Ok(());
    }

    let deleted = sqlx::query(AssertSqlSafe(format!(
        "DELETE FROM {table} WHERE {key_column} = ANY($1)"
    )))
    .bind(&stale)
    .execute(db)
    .await?
    .rows_affected();

    println!("clean: deleted {deleted} row(s) from {table}.");
    Ok(())
}

/// Interactive y/N confirmation. Refuses (returns false) without a TTY so a
/// non-interactive run can't delete anything unless `--yes` was passed.
fn confirm() -> bool {
    if !io::stdin().is_terminal() {
        eprintln!("clean: no TTY to confirm on; re-run with --yes to delete.");
        return false;
    }

    print!("Proceed with deletion? [y/N] ");
    io::stdout().flush().ok();

    let mut answer = String::new();
    if io::stdin().read_line(&mut answer).is_err() {
        return false;
    }

    matches!(answer.trim(), "y" | "Y" | "yes" | "Yes")
}
