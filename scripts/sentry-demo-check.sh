#!/usr/bin/env bash
set -euo pipefail

BACKEND_URL="${BACKEND_URL:-http://localhost:3001}"
STAMP_UTC="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
DEMO_NAME="demo-$(date -u +%Y%m%d-%H%M%S)"
OUT_FILE="evidence/verification/sentry-demo-check.md"

echo "[1/4] Backend health check"
curl -fsS "$BACKEND_URL/api/health" >/tmp/sentry-health.json

echo "[2/4] Backend Sentry env check"
ENV_SUMMARY="$(docker compose exec -T backend sh -lc '
if [ -n "$SENTRY_DSN" ] && [ "${SENTRY_ENABLED:-true}" != "false" ]; then
  echo "SENTRY_READY=yes"
else
  echo "SENTRY_READY=no"
fi
echo "SENTRY_ENABLED=${SENTRY_ENABLED:-unset}"
echo "SENTRY_ENVIRONMENT=${SENTRY_ENVIRONMENT:-unset}"
echo "SENTRY_RELEASE=${SENTRY_RELEASE:-unset}"
echo "SENTRY_DSN_LEN=${#SENTRY_DSN}"
')"
printf "%s\n" "$ENV_SUMMARY"

echo "[3/4] Emit unique Sentry demo event"
RAW_RESPONSE="$(curl -sS -w '\n%{http_code}' -X POST "$BACKEND_URL/api/scenarios/sentry-demo" -H 'content-type: application/json' -d "{\"name\":\"$DEMO_NAME\"}")"
HTTP_CODE="$(printf "%s" "$RAW_RESPONSE" | tail -n1)"
BODY="$(printf "%s" "$RAW_RESPONSE" | sed '$d')"

EVENT_ID="$(printf "%s" "$BODY" | node -e 'const fs=require("fs");const s=fs.readFileSync(0,"utf8");try{const o=JSON.parse(s);process.stdout.write(String(o.eventId||""));}catch{process.stdout.write("");}')"
CORRELATION_ID="$(printf "%s" "$BODY" | node -e 'const fs=require("fs");const s=fs.readFileSync(0,"utf8");try{const o=JSON.parse(s);process.stdout.write(String(o.correlationId||""));}catch{process.stdout.write("");}')"

printf "HTTP_CODE=%s\n" "$HTTP_CODE"
printf "EVENT_ID=%s\n" "$EVENT_ID"
printf "CORRELATION_ID=%s\n" "$CORRELATION_ID"

if [[ "$HTTP_CODE" != "202" ]]; then
  echo "Sentry demo endpoint failed: $BODY"
  exit 1
fi

if [[ -z "$EVENT_ID" ]]; then
  echo "No eventId returned by sentry-demo endpoint."
  exit 1
fi

echo "[4/4] Write verification artifact -> $OUT_FILE"
cat >"$OUT_FILE" <<EOF
# Sentry Demo Check

Timestamp (UTC): $STAMP_UTC
Backend URL: $BACKEND_URL
Demo Name: $DEMO_NAME

## Backend Sentry Environment

\`\`\`text
$ENV_SUMMARY
\`\`\`

## Endpoint Call

POST /api/scenarios/sentry-demo

Response code: $HTTP_CODE

\`\`\`json
$BODY
\`\`\`

## How To Verify In Sentry UI

1. Open project \`signal-lab\`.
2. Set time range to \`Last 1 hour\` (or 24h).
3. Remove \`is:unresolved\` filter if present.
4. Search by one of these values:
- event ID: \`$EVENT_ID\`
- correlation ID: \`$CORRELATION_ID\`
5. Open matched event/issue and take screenshot for proof.

## Notes

- This endpoint sets a unique fingerprint for each run to avoid issue grouping confusion.
- If event appears with delay, wait 10-30 seconds and refresh Sentry.
EOF

echo "Done. Verification file created: $OUT_FILE"
