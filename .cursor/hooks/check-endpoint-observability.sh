#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
service_file="$repo_root/apps/backend/src/scenarios/scenarios.service.ts"

if [[ ! -f "$service_file" ]]; then
  exit 0
fi

if ! grep -q "recordScenarioRun" "$service_file"; then
  echo "Hook failure: scenarios.service.ts is missing Prometheus metric recording (recordScenarioRun)."
  exit 1
fi

if ! grep -q "loggingService" "$service_file"; then
  echo "Hook failure: scenarios.service.ts is missing structured logging calls."
  exit 1
fi

echo "Observability hook passed: scenario service contains metrics + logging calls."
