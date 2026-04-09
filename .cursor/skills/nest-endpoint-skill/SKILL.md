---
name: nest-endpoint-skill
description: "Use when scaffolding a new NestJS endpoint in this repo with DTO validation, Prisma persistence, observability instrumentation, and Swagger docs. Keywords: add endpoint, controller, service, dto"
---

# Nest Endpoint Skill

## When to Use

- Creating a new endpoint under `apps/backend/src`.
- Refactoring endpoint logic into service + DTO pattern.
- Aligning new routes with Signal Lab conventions.

## Implementation Pattern

1. Define DTO with `class-validator`.
2. Add service method with focused business logic.
3. Persist data through `PrismaService` only.
4. Add metrics and logs in service flow.
5. Document endpoint via Swagger decorators.
6. Keep response structure explicit and testable.

## File Touchpoints

- `apps/backend/src/<domain>/<domain>.controller.ts`
- `apps/backend/src/<domain>/<domain>.service.ts`
- `apps/backend/src/<domain>/dto/*.dto.ts`
- `apps/backend/src/app.module.ts` (if module wiring changes)

## Guardrails

- Do not bypass DTO validation.
- Do not add raw SQL.
- Do not return silent failures.

## Quick Definition of Done

- Route compiles and is reachable.
- DTO validation errors return predictable payload.
- Prometheus and logs reflect endpoint activity.
- Swagger shows the route.
