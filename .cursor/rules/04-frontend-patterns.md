# Frontend Patterns Rule

## Scope

Governs component composition and state handling in Next.js frontend.

## Required

- Interactive pages use client components only where necessary.
- Forms use React Hook Form with schema-based validation.
- API mutations and run history fetching use TanStack Query.
- UI primitives come from `components/ui`.
- Status states use visual indicators (badge, text, disabled button states).

## UX Baseline

- Every mutation needs:
    - loading state
    - success/error user feedback
    - query invalidation or refresh
- Observability entry points must be visible from UI.

## Forbidden

- Hidden network calls without loading and error state.
- Direct inline styling that bypasses Tailwind design tokens.
