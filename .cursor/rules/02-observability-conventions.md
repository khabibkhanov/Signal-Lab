# Observability Conventions Rule

## Scope

Defines how metrics, logs, and Sentry captures are emitted for scenario flows.

## Required

- Every scenario execution must emit a metric update.
- Scenario logs must be structured JSON and include:
    - `scenarioType`
    - `scenarioId`
    - `duration`
    - `error` when applicable
- `system_error` scenarios must be captured by Sentry.
- Prometheus metric names must remain semantic and stable:
    - `scenario_runs_total`
    - `scenario_run_duration_seconds`
    - `http_requests_total`

## Naming

- Scenario status labels must be plain business values (`completed`, `error`, `validation_error`, etc.).
- Avoid one-off metric names that break dashboard queries.

## Verification

- After changes, verify `/metrics` output includes updated counters.
- Verify Loki query `{app="signal-lab"}` contains the new logs.
- Verify Sentry receives new `system_error` events.
