# Proof Capture Guide

This folder stores the screenshot/video bundle used in final review.

## Required Files

Screenshots:

- `evidence/proof/screenshots/01-ui-scenario-run.png`
- `evidence/proof/screenshots/02-grafana-dashboard.png`
- `evidence/proof/screenshots/03-loki-explore.png`
- `evidence/proof/screenshots/04-sentry-system-error.png`

Video:

- `evidence/proof/video/01-end-to-end-demo.mp4`

Index:

- `evidence/proof/index.md`

## What Each Proof Must Show

1. UI scenario run

- Scenario selector and run button visible.
- Run history list with latest entry visible.

2. Grafana dashboard

- Dashboard title `Signal Lab Dashboard` visible.
- At least 3 panels with data.

3. Loki Explore

- Query includes `{app="signal-lab"}`.
- Result stream includes `scenarioType` label.

4. Sentry error

- `system_error` event or issue visible.
- Environment and timestamp visible.

5. End-to-end video (2-4 minutes)

- Trigger `success` and `system_error` from UI.
- Show `/metrics` briefly.
- Show Grafana dashboard panel updates.
- Show Loki filtered logs.
- Show Sentry issue/event.

## Capture Tips

- Use PNG for screenshots.
- Keep video at 720p or 1080p.
- Prefer MP4 (H.264).
- If file size is too large, compress before commit.
