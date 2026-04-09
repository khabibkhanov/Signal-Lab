# Sentry Verification Playbook

Use this playbook when Sentry appears to show no new errors.

## Why This Happens

- Repeated `system_error` events are often grouped into one existing issue.
- If Sentry filter includes `is:unresolved`, resolved issues may be hidden.
- Time window may exclude the latest event.
- In development, the app now emits a unique correlation tag for each UI `system_error` trigger.

## Fast Reliable Check (Recommended)

Run:

```bash
bash scripts/sentry-demo-check.sh
```

This command:

1. Confirms backend health.
2. Confirms Sentry env is active in backend container.
3. Emits a unique demo exception through `POST /api/scenarios/sentry-demo`.
4. Saves an artifact to `evidence/verification/sentry-demo-check.md` with event ID and correlation ID.

## Manual Sentry UI Verification

1. Open Sentry project `signal-lab`.
2. Set time range to `Last 1 hour`.
3. Remove `is:unresolved` if present.
4. Search by event ID or correlation ID from `evidence/verification/sentry-demo-check.md`.
5. Confirm tags include:

- `environment: development`
- `service: signal-lab-backend`
- `scenario.type: sentry_demo`

## Real UI system_error Verification

1. In Signal Lab UI, run `system_error`.
2. Open Sentry and search for `scenario.type:system_error`.
3. Open the latest event and confirm `scenario.correlation_id` tag exists.
4. Run `system_error` again and confirm a new `scenario.correlation_id` appears.

## If Still Not Visible

1. Confirm `.env` contains real `SENTRY_DSN` and `SENTRY_ENABLED=true`.
2. Recreate backend container:

```bash
docker compose up -d --force-recreate backend
```

3. Run the check script again.
