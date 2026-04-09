# Signal Lab Cursor AI Layer

## Contents

- `rules/` - stack guardrails and coding conventions
- `skills/` - reusable workflows for implementation
- `commands/` - fast entry points for common tasks
- `hooks/` - deterministic safety checks
- `marketplace-skills.md` - selected marketplace skill rationale

## Rules

1. `01-stack-constraints.md`

- Protects mandatory stack and bans drift.

2. `02-observability-conventions.md`

- Defines metric/log/sentry contract.

3. `03-prisma-patterns.md`

- Enforces schema + migration hygiene.

4. `04-frontend-patterns.md`

- Defines RHF + Query + UI behavior baseline.

5. `05-error-handling.md`

- Standardizes backend/frontend error paths.

## Custom Skills

1. `observability-skill`

- Adds/validates metrics, logs, and Sentry integration.

2. `nest-endpoint-skill`

- Scaffolds new backend endpoints with repo conventions.

3. `shadcn-form-skill`

- Builds robust frontend form flows.

4. `signal-lab-orchestrator`

- Multi-phase PRD execution with context persistence and resume.

## Commands

- `/add-endpoint`
- `/check-obs`
- `/health-check`
- `/run-prd`
- `/verify-marketplace`

## Hooks

- `check-prisma-artifacts.sh`: catches schema changes without migrations.
- `check-endpoint-observability.sh`: catches missing metric/log instrumentation.

## Why Custom Skills if Marketplace Exists

Marketplace skills provide broad framework advice, but custom skills capture this repository's operational contract, naming rules, and observability obligations so a new chat can continue work without re-briefing.

## Marketplace Connection Evidence

- Explicit linkage map: `.cursor/settings.json` (`marketplaceSkills` section)
- Rationale catalog: `.cursor/marketplace-skills.md`
- Verification runbook: `evidence/marketplace/connection-evidence.md`
