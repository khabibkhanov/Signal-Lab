# Cursor Hooks

This project provides two utility hooks:

1. `check-prisma-artifacts.sh`

- Trigger: after schema updates.
- Purpose: prevents schema drift without migration updates.

2. `check-endpoint-observability.sh`

- Trigger: after backend scenario endpoint edits.
- Purpose: ensures metrics + structured logs are still present.

## Suggested Wiring in Cursor

Add hook commands in `.cursor/settings.json` so they run after relevant file edits.

## Manual Run

```bash
bash .cursor/hooks/check-prisma-artifacts.sh
bash .cursor/hooks/check-endpoint-observability.sh
```
