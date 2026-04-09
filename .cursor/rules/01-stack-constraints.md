# Stack Constraints Rule

## Scope

This rule governs library choices and architecture-level stack consistency for the entire repository.

## Required

- Frontend must stay on Next.js App Router.
- UI components must prefer shadcn-style components in `components/ui`.
- Server state must use TanStack Query.
- Forms must use React Hook Form.
- Backend must use NestJS with Prisma + PostgreSQL.
- Observability stack remains Sentry + Prometheus + Grafana + Loki.

## Forbidden

- Do not introduce Redux, MobX, or SWR.
- Do not replace Prisma with another ORM.
- Do not replace PostgreSQL with SQLite in this repo.
- Do not bypass docker-compose workflow for core services.

## Decision Checklist

1. Does this change keep the mandatory stack untouched?
2. Does it reuse existing project patterns before adding new dependencies?
3. Is there a clear reason if a new package is introduced?
