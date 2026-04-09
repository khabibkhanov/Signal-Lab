---
name: observability-skill
description: "Use when adding or updating backend flows that must emit Prometheus metrics, structured Loki logs, and Sentry signals. Keywords: observability, metrics, logging, sentry, /metrics, dashboard"
---

# Observability Skill

## When to Use

- Adding a new API endpoint that should be visible in Grafana.
- Modifying scenario status behavior.
- Debugging why a run is not visible in metrics or logs.
- Reviewing whether a feature is observability-ready.

## Workflow

1. Identify scenario and expected result states.
2. Add or update metric calls in `MetricsService` and service logic.
3. Emit structured JSON logs with stable keys.
4. Capture system-level exceptions in Sentry.
5. Validate:
    - `GET /metrics`
    - Loki query in Grafana Explore
    - Sentry event list

## Required Signal Contract

- Metric labels: `type`, `status` for scenario counters.
- Log fields: `scenarioType`, `scenarioId`, `duration`, `error`.
- Error scenarios:
    - `validation_error` => warn + metric + optional breadcrumb.
    - `system_error` => error + metric + exception capture.

## Anti-Patterns

- Logging plain text without JSON structure.
- New metrics with one-off naming that breaks dashboards.
- Throwing generic errors without logging context.

## Completion Checklist

- Endpoint emits metric increments.
- Endpoint writes Loki-readable JSON logs.
- Failure flow appears in Sentry when DSN is configured.
- Dashboard panels still render with updated labels.
