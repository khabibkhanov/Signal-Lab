#!/usr/bin/env bash
set -euo pipefail

required=(
  "evidence/proof/screenshots/01-ui-scenario-run.png"
  "evidence/proof/screenshots/02-grafana-dashboard.png"
  "evidence/proof/screenshots/03-loki-explore.png"
  "evidence/proof/screenshots/04-sentry-system-error.png"
  "evidence/proof/video/01-end-to-end-demo.mp4"
  "evidence/proof/index.md"
)

missing=0

echo "Proof bundle check:"
for file in "${required[@]}"; do
  if [[ -f "$file" ]]; then
    echo "  [OK] $file"
  else
    echo "  [MISSING] $file"
    missing=1
  fi
done

if [[ $missing -ne 0 ]]; then
  echo ""
  echo "Proof bundle is incomplete."
  exit 1
fi

echo ""
echo "Proof bundle is complete."
