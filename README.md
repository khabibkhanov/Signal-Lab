# Signal Lab

Signal Lab is an observability playground where UI-triggered scenarios generate metrics, logs, and errors you can verify in Prometheus, Grafana, Loki, and Sentry.

## Stack

- Frontend: Next.js (App Router), shadcn-style UI components, Tailwind CSS, TanStack Query, React Hook Form
- Backend: NestJS (TypeScript strict)
- Data: PostgreSQL 16 + Prisma
- Observability: Prometheus, Grafana, Loki, Sentry
- Infra: Docker Compose (single-command startup)

## Repository Layout

```text
Signal-Lab/
├── apps/
│   ├── frontend/
│   └── backend/
├── prisma/
├── monitoring/
├── .cursor/
├── prds/
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Docker Desktop 4.x+ with Compose support
- Git

## Quick Start

```bash
cp .env.example .env
docker compose up -d --build
```

Wait until all containers are healthy/ready, then open:

- App: http://localhost:3000
- Backend Health: http://localhost:3001/api/health
- Swagger: http://localhost:3001/api/docs
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3100
- Grafana via app proxy: http://localhost:3000/grafana

## Core Commands

```bash
# Start
cp .env.example .env && docker compose up -d --build

# Health check
curl http://localhost:3001/api/health
curl http://localhost:3001/metrics | head -n 20

# Stop
docker compose down
```

## Sentry Production-Like Setup

Set these values in `.env` before running if you want real Sentry capture:

- `SENTRY_DSN=<your real DSN>`
- `SENTRY_ENABLED=true`
- `SENTRY_ENVIRONMENT=staging` or `production`
- `SENTRY_RELEASE=signal-lab@<version-or-commit>`
- `SENTRY_TRACES_SAMPLE_RATE=0.2` (recommended baseline)
- `SENTRY_PROFILES_SAMPLE_RATE=0.0` (enable only when profiling is needed)

If `SENTRY_DSN` is empty or `SENTRY_ENABLED=false`, backend continues working but Sentry capture is skipped.

## Scenario Types

- `success`: returns 200, creates completed run, logs info, increments metrics
- `validation_error`: returns 400, creates validation_error run, logs warn, increments metrics
- `system_error`: returns 500, creates error run, logs error, increments metrics, captures Sentry exception
- `slow_request`: adds artificial 2-5s delay, then success flow
- `teapot` (bonus): returns 418 with `{ "signal": 42, "message": "I'm a teapot" }`, stores metadata easter flag

## 5-Minute Observability Verification

1. Open http://localhost:3000 and run `success` once.
2. Run `system_error` once.
3. Verify metrics: http://localhost:3001/metrics and confirm `scenario_runs_total` changed.
4. Open Grafana: http://localhost:3100.
5. Open dashboard `Signal Lab Dashboard` and confirm all panels show data.
6. In Grafana Explore, select Loki and run query `{app="signal-lab"}`.
7. Verify a `system_error` exception appears in your Sentry project dashboard (requires real DSN in `.env`).

## 15-Minute Interviewer Walkthrough

1. Clone repo and run startup command from this README.
2. Verify API and UI health endpoints.
3. Trigger scenarios from UI and inspect Run History.
4. Confirm Prometheus metrics endpoint output.
5. Confirm Grafana dashboard and Loki logs.
6. Inspect `.cursor/` artifacts (rules, skills, commands, hooks, orchestrator).
7. Run orchestrator command flow using `prds/` input and verify `.execution/<timestamp>/context.json` behavior.

## Cursor AI Layer

See `.cursor/README.md` for full details.

Includes:

- 5 scoped rules (`.cursor/rules/`)
- 4 custom skills including orchestrator (`.cursor/skills/`)
- 4 reusable commands (`.cursor/commands/`)
- 2 hooks with safety checks (`.cursor/hooks/`)
- 6 marketplace skills rationale (`.cursor/marketplace-skills.md`)

## Orchestrator Skill

Primary file: `.cursor/skills/signal-lab-orchestrator/SKILL.md`

Supporting files:

- `.cursor/skills/signal-lab-orchestrator/COORDINATION.md`
- `.cursor/skills/signal-lab-orchestrator/EXAMPLE.md`

Expected runtime state location:

- `.execution/<timestamp>/context.json`

## Troubleshooting

- If backend cannot connect to database, verify `DATABASE_URL` in `.env`.
- If Grafana has no logs, check `promtail` and `backend` container logs.
- If Sentry is empty, verify `SENTRY_DSN` is a real DSN (not placeholder).
- If Prisma migration fails, run:

```bash
docker compose exec backend npm run prisma:migrate
```

## Optional Reset

```bash
docker compose down -v
docker compose up -d --build
```
