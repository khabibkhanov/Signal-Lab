# Prisma Patterns Rule

## Scope

Covers schema, migration, and runtime data access practices.

## Required

- All schema changes happen in `prisma/schema.prisma`.
- Every schema change must be accompanied by a migration in `prisma/migrations`.
- Backend data access uses `PrismaService`.
- `ScenarioRun` remains the source of truth for scenario execution history.

## Forbidden

- Raw SQL for regular CRUD use cases.
- Ad-hoc database clients bypassing Prisma.
- Hidden schema drift without migration files committed.

## Checklist

1. Schema updated?
2. Migration added?
3. Runtime queries use `PrismaService`?
4. API and docs reflect new fields?
