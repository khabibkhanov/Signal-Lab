# Example Orchestrator Run

## Command

`/run-prd prds/002_prd-observability-demo.md`

## Expected Context Artifacts

- `.execution/2026-04-09-10-00/context.json`
- phase statuses updated as execution progresses

## Example Task Breakdown

1. Add metrics endpoint and counters (`fast`)
2. Add structured scenario logs (`fast`)
3. Integrate Sentry exception capture (`fast`)
4. Provision Grafana dashboard (`default`)
5. Verify Loki ingestion flow (`default`)

## Example Resume

1. Interrupt during implementation.
2. Re-run `/run-prd ...`.
3. Orchestrator reads existing context.
4. Completed phases are skipped.
5. Current phase resumes and report includes retry history.
