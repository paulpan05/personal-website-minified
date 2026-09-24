#!/usr/bin/env bash
# One-time remote D1 setup for blog full-text search.
#
# Prerequisites: `wrangler login` (interactive, run it first).
#
# What it does:
#   1. Creates the D1 database (or reuses it if it already exists)
#   2. Wires the real database_id into wrangler.jsonc
#   3. Applies migrations/0001_search.sql to the remote DB
#   4. Regenerates d1/seed.sql from src/content/posts/*.mdx and loads it
#   5. Verifies row counts
# Safe to re-run: migrations are tracked, seed uses INSERT OR REPLACE.
#
# After it succeeds: git add -A && git commit -m "..." && git push
# (the push triggers a green deploy — the binding will resolve).
set -euo pipefail
cd "$(dirname "$0")/.."

DB_NAME="personal-website-search"
PLACEHOLDER_ID="00000000-0000-0000-0000-000000000000"

echo "→ Ensuring D1 database '$DB_NAME' exists..."
CREATE_OUT=$(npx wrangler d1 create "$DB_NAME" 2>&1 || true)
echo "$CREATE_OUT" | tail -5
DB_ID=$(echo "$CREATE_OUT" | grep -oE 'database_id = "[0-9a-f-]+"' | head -1 | cut -d'"' -f2 || true)

if [ -z "${DB_ID:-}" ]; then
  echo "→ Database already exists; looking up its id..."
  DB_ID=$(npx wrangler d1 info "$DB_NAME" 2>/dev/null | grep -oE '[0-9a-f-]{36}' | head -1 || true)
fi
if [ -z "${DB_ID:-}" ]; then
  echo "ERROR: could not determine database_id. Run 'npx wrangler d1 info $DB_NAME' manually."
  exit 1
fi
echo "→ database_id: $DB_ID"

echo "→ Wiring id into wrangler.jsonc..."
if grep -q "$PLACEHOLDER_ID" wrangler.jsonc; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/$PLACEHOLDER_ID/$DB_ID/" wrangler.jsonc
  else
    sed -i "s/$PLACEHOLDER_ID/$DB_ID/" wrangler.jsonc
  fi
elif ! grep -q "$DB_ID" wrangler.jsonc; then
  echo "ERROR: wrangler.jsonc has neither the placeholder nor this id. Edit it manually."
  exit 1
fi

echo "→ Applying migrations to remote..."
npx wrangler d1 migrations apply DB --remote

echo "→ Regenerating + loading seed..."
node scripts/seed-search-db.mjs > d1/seed.sql
npx wrangler d1 execute DB --remote --file=d1/seed.sql

echo "→ Verifying..."
npx wrangler d1 execute DB --remote --command="SELECT count(*) AS posts FROM posts; SELECT count(*) AS fts_rows FROM posts_fts;"

echo ""
echo "Done. Ship it:"
echo "  git add -A && git commit -m \"Wire remote D1 search database\" && git push"
echo "Then prove prod reads D1:"
echo "  SEARCH_API_URL=https://paulpan.net npx playwright test tests/search-d1.spec.ts"
