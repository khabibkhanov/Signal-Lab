# Proof Bundle Index

Capture Date (UTC): 2026-04-09T15:37:09Z
Captured By: khabibkhanov
Build/Commit: 90b586d
SENTRY_ENVIRONMENT: development

## Assets

- [x] evidence/proof/screenshots/01-ui-scenario-run.png
- [x] evidence/proof/screenshots/02-grafana-dashboard.png
- [x] evidence/proof/screenshots/03-loki-explore.png
- [x] evidence/proof/screenshots/04-sentry-system-error.png
- [x] evidence/proof/video/01-end-to-end-demo.mp4

## Sentry Demo Evidence

- Playbook: evidence/verification/sentry-check-playbook.md
- Demo output: evidence/verification/sentry-demo-check.md
- Latest event ID: 7394ba8b8d9741c492aa0e05302a0c47
- Latest correlation ID: sentry-demo-1775749030111

## Quick Notes

- Scenario types exercised: success, system_error, slow_request (optional)
- Metrics endpoint checked: /metrics
- Loki query used: {app="signal-lab"}
- Sentry event key or URL: 7394ba8b8d9741c492aa0e05302a0c47
