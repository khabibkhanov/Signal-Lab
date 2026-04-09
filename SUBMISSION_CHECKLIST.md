# Signal Lab — Submission Checklist

Заполни этот файл перед сдачей. Он поможет интервьюеру быстро проверить решение.

---

## Репозиторий

- **URL**: `https://github.com/khabibkhanov/Signal-Lab`
- **Ветка**: `main`
- **Время работы** (приблизительно): `3` часов

---

## Запуск

```bash
# Команда запуска:
cp .env.example .env && docker compose up -d --build

# Команда проверки:
curl http://localhost:3001/api/health && curl http://localhost:3001/metrics | head -n 20
cat evidence/verification/observability-smoke.md | head -n 40
cat evidence/verification/startup-dx.md | head -n 40
cat evidence/proof/index.md
bash scripts/check-proof-bundle.sh
bash scripts/sentry-demo-check.sh

# Команда остановки:
docker compose down

```

**Предусловия**: Docker Desktop 4.x+ (Compose), свободные порты 3000/3001/3100/9090/5432

Артефакт стартовой надёжности: `evidence/verification/startup-dx.md`

---

## Стек — подтверждение использования

| Технология           | Используется? | Где посмотреть                                                                              |
| -------------------- | :-----------: | ------------------------------------------------------------------------------------------- |
| Next.js (App Router) |       ☑       | `apps/frontend/app/layout.tsx`, `apps/frontend/app/page.tsx`                                |
| shadcn/ui            |       ☑       | `apps/frontend/components/ui/*`                                                             |
| Tailwind CSS         |       ☑       | `apps/frontend/tailwind.config.ts`, `apps/frontend/app/globals.css`                         |
| TanStack Query       |       ☑       | `apps/frontend/app/providers.tsx`, `apps/frontend/app/page.tsx`                             |
| React Hook Form      |       ☑       | `apps/frontend/app/page.tsx`                                                                |
| NestJS               |       ☑       | `apps/backend/src/main.ts`, `apps/backend/src/app.module.ts`                                |
| PostgreSQL           |       ☑       | `docker-compose.yml` (`postgres` service), `prisma/schema.prisma`                           |
| Prisma               |       ☑       | `apps/backend/src/prisma/*`, `prisma/schema.prisma`, `prisma/migrations/*`                  |
| Sentry               |       ☑       | `apps/backend/src/main.ts`, `apps/backend/src/scenarios/scenarios.service.ts`               |
| Prometheus           |       ☑       | `apps/backend/src/observability/metrics.service.ts`, `monitoring/prometheus/prometheus.yml` |
| Grafana              |       ☑       | `monitoring/grafana/*`, `docker-compose.yml` (`grafana` service)                            |
| Loki                 |       ☑       | `monitoring/loki/loki-config.yml`, `monitoring/promtail/promtail-config.yml`                |

---

## Observability Verification

Опиши, как интервьюер может проверить каждый сигнал:

| Сигнал            | Как воспроизвести                                                        | Где посмотреть результат                                                                         |
| ----------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Prometheus metric | В UI (`http://localhost:3000`) запустить `success`, затем `system_error` | `http://localhost:3001/metrics`, метрики `scenario_runs_total` и `scenario_run_duration_seconds` |
| Grafana dashboard | После запуска сценариев открыть Grafana                                  | `http://localhost:3100` → dashboard `Signal Lab Dashboard` (3+ панели)                           |
| Loki log          | В UI запустить любой сценарий, лучше `system_error` и `slow_request`     | Grafana Explore → Loki query `{app="signal-lab"}`                                                |
| Sentry exception  | В UI запустить `system_error`                                            | Sentry project dashboard (при валидном `SENTRY_DSN` в `.env`)                                    |

Артефакт проверки: `evidence/verification/observability-smoke.md`

Sentry demo playbook: `evidence/verification/sentry-check-playbook.md`
Sentry demo evidence: `evidence/verification/sentry-demo-check.md`

---

## Cursor AI Layer

### Custom Skills

| #   | Skill name          | Назначение                                                  |
| --- | ------------------- | ----------------------------------------------------------- |
| 1   | observability-skill | Добавляет и проверяет метрики, логи, Sentry-сигналы         |
| 2   | nest-endpoint-skill | Создаёт endpoint по шаблону NestJS + Prisma + observability |
| 3   | shadcn-form-skill   | Создаёт форму RHF + Query mutation + UI feedback            |

### Commands

| #   | Command             | Что делает                                                |
| --- | ------------------- | --------------------------------------------------------- |
| 1   | /add-endpoint       | Добавляет новый backend endpoint по проектному шаблону    |
| 2   | /check-obs          | Проверяет observability-ready состояние изменений         |
| 3   | /run-prd            | Запускает PRD через orchestrator pipeline                 |
| 4   | /verify-marketplace | Проверяет связку marketplace skills с рабочими процессами |

### Hooks

| #   | Hook                            | Какую проблему решает                                       |
| --- | ------------------------------- | ----------------------------------------------------------- |
| 1   | check-prisma-artifacts.sh       | Ловит изменения schema без соответствующей migration        |
| 2   | check-endpoint-observability.sh | Ловит endpoint-правки без метрик и структурного логирования |

### Rules

| #   | Rule file                       | Что фиксирует                            |
| --- | ------------------------------- | ---------------------------------------- |
| 1   | 01-stack-constraints.md         | Стековые ограничения и запрет drift      |
| 2   | 02-observability-conventions.md | Именование метрик и структура логов      |
| 3   | 03-prisma-patterns.md           | Паттерны schema/migration/runtime Prisma |
| 4   | 04-frontend-patterns.md         | RHF + TanStack Query + shadcn UI паттерн |
| 5   | 05-error-handling.md            | Стандартизированный error flow           |

### Marketplace Skills

| #   | Skill                  | Зачем подключён                                   |
| --- | ---------------------- | ------------------------------------------------- |
| 1   | next-best-practices    | Best practices для App Router и структуры Next.js |
| 2   | shadcn-ui              | Консистентный UI слой на shadcn-паттернах         |
| 3   | tailwind-design-system | Стабильная токенизация и utility-driven стили     |
| 4   | nestjs-best-practices  | Правильные границы модулей/контроллеров/сервисов  |
| 5   | prisma-orm             | Безопасная эволюция схемы и миграций              |
| 6   | docker-expert          | Надёжная диагностика и поддержка compose-инфры    |

**Что закрыли custom skills, чего нет в marketplace:**

Custom skills закрывают Signal Lab-специфику: контракт метрик/логов по scenarioType, обязательный observability checklist для endpoint flow, и PRD-orchestrator с context.json + resume.

Доказательство связки: `evidence/marketplace/connection-evidence.md`

---

## Orchestrator

- **Путь к skill**: `.cursor/skills/signal-lab-orchestrator/SKILL.md`
- **Путь к context file** (пример): `evidence/orchestrator/prd-002-context.json`
- **Путь к execution report** (пример): `evidence/orchestrator/prd-002-report.md`
- **Сколько фаз**: `7`
- **Какие задачи для fast model**: анализ PRD, codebase scan, простые backend/frontend/database изменения, readonly review, report generation
- **Поддерживает resume**: да

---

## Скриншоты / видео

- [x] evidence/proof/screenshots/01-ui-scenario-run.png
- [x] evidence/proof/screenshots/02-grafana-dashboard.png
- [x] evidence/proof/screenshots/03-loki-explore.png
- [x] evidence/proof/screenshots/04-sentry-system-error.png
- [x] evidence/proof/video/01-end-to-end-demo.mp4
- [x] evidence/proof/index.md заполнен

Гайд по съёмке и требованиям: `evidence/proof/README.md`

(Приложи файлы или ссылки ниже)

---

## Что не успел и что сделал бы первым при +4 часах

1. Подключил бы реальный hosted Sentry DSN + алерты.
2. Добавил бы e2e smoke-тест на verification walkthrough.
3. Добавил бы второй Grafana dashboard с drill-down панелями по статусам.

---

## Вопросы для защиты (подготовься)

1. Почему именно такая декомпозиция skills?
2. Какие задачи подходят для малой модели и почему?
3. Какие marketplace skills подключил, а какие заменил custom — и почему?
4. Какие hooks реально снижают ошибки в повседневной работе?
5. Как orchestrator экономит контекст по сравнению с одним большим промптом?

Подготовка: orchestrator хранит фазовые результаты в `context.json`, пропускает completed этапы при resume, и делегирует атомарные задачи fast model (80%+) вместо длинного монолитного промпта в основном чате.
