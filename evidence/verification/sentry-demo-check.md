# Sentry Demo Check

Timestamp (UTC): 2026-04-09T15:37:09Z
Backend URL: http://localhost:3001
Demo Name: demo-20260409-153709

## Backend Sentry Environment

```text
SENTRY_READY=yes
SENTRY_ENABLED=true
SENTRY_ENVIRONMENT=development
SENTRY_RELEASE=signal-lab@0.1.0
SENTRY_DSN_LEN=95
```

## Endpoint Call

POST /api/scenarios/sentry-demo

Response code: 202

```json
{"ok":true,"eventId":"7394ba8b8d9741c492aa0e05302a0c47","correlationId":"sentry-demo-1775749030111","flushed":true,"message":"Sentry demo event emitted. Search by eventId or correlationId in Sentry."}
```

## How To Verify In Sentry UI

1. Open project `signal-lab`.
2. Set time range to `Last 1 hour` (or 24h).
3. Remove `is:unresolved` filter if present.
4. Search by one of these values:
- event ID: `7394ba8b8d9741c492aa0e05302a0c47`
- correlation ID: `sentry-demo-1775749030111`
5. Open matched event/issue and take screenshot for proof.

## Notes

- This endpoint sets a unique fingerprint for each run to avoid issue grouping confusion.
- If event appears with delay, wait 10-30 seconds and refresh Sentry.
