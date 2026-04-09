#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

schema_changed="$(git diff --name-only -- prisma/schema.prisma || true)"
if [[ -z "$schema_changed" ]]; then
  exit 0
fi

migration_changed="$(git diff --name-only -- prisma/migrations || true)"
if [[ -z "$migration_changed" ]]; then
  echo "Hook failure: prisma/schema.prisma changed but no migration file was updated in prisma/migrations."
  echo "Run: npm --prefix apps/backend run prisma:migrate (or create migration) and commit migration SQL."
  exit 1
fi

echo "Prisma hook passed: schema and migrations changed together."
