# Marketplace Skill Connection Evidence

This file documents concrete linkage between selected marketplace skills and repository workflows.

Verified at (UTC): 2026-04-09T14:10:22Z

## Source of Truth

- Linkage map: `.cursor/settings.json` (`marketplaceSkills` array)
- Rationale: `.cursor/marketplace-skills.md`
- Verification command: `.cursor/commands/verify-marketplace.md`

## Skills and Runtime Purpose

1. next-best-practices

- Used to keep Next App Router structure and data flow consistent.

2. shadcn-ui

- Used for component-level UI conventions in `apps/frontend/components/ui`.

3. tailwind-design-system

- Used for design token consistency in Tailwind layers.

4. nestjs-best-practices

- Used for backend modular boundaries and exception behavior.

5. prisma-orm

- Used for schema/migration lifecycle discipline.

6. docker-expert

- Used for Compose diagnostics and service startup reliability.

## Capability Check Matrix

| Skill                  | Responsibility                                                        | Evidence paths                                                                                       | Result |
| ---------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------ |
| next-best-practices    | App Router architecture and layout/data-flow conventions              | `apps/frontend/app/layout.tsx`, `apps/frontend/app/page.tsx`, `.cursor/marketplace-skills.md`        | PASS   |
| shadcn-ui              | Reusable accessible UI components and consistent interaction patterns | `apps/frontend/components/ui/*`, `.cursor/marketplace-skills.md`                                     | PASS   |
| tailwind-design-system | Token/utility consistency and styling predictability                  | `apps/frontend/tailwind.config.ts`, `apps/frontend/app/globals.css`, `.cursor/marketplace-skills.md` | PASS   |
| nestjs-best-practices  | Controller/service/module boundaries and exception flow               | `apps/backend/src/main.ts`, `apps/backend/src/app.module.ts`, `.cursor/marketplace-skills.md`        | PASS   |
| prisma-orm             | Schema and migration discipline                                       | `prisma/schema.prisma`, `prisma/migrations/*`, `apps/backend/src/prisma/*`                           | PASS   |
| docker-expert          | Compose reliability, startup checks, and diagnostics                  | `docker-compose.yml`, `evidence/verification/startup-dx.md`                                          | PASS   |

## Verification Checklist

- [x] Six skills declared with explicit reason and enabled flag.
- [x] Command-level verification prompt exists.
- [x] Cross-reference to custom skills gap analysis exists.
- [x] Capability matrix recorded with evidence paths.

## Gap Closed by Custom Skills

Marketplace skills provide framework-level guidance. Custom skills enforce Signal Lab-specific contracts:

- observability metric names and labels
- scenario logging schema for Loki
- PRD orchestrator context/resume strategy
