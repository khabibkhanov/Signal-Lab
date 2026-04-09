# Error Handling Rule

## Scope

Defines backend and frontend error handling expectations.

## Backend

- Use typed NestJS exceptions for controlled errors.
- Keep global exception filter active.
- Log enough context for debugging, but never log secrets.
- Map expected scenario failures to explicit status values.

## Frontend

- Mutation errors must show actionable toast feedback.
- Keep UI responsive during failure states.
- Preserve run history visibility even when a mutation fails.

## Sentry

- Unhandled or system-level failures should be captured.
- Validation flow can add breadcrumbs for context.

## Done Criteria

- Error path tested at least once through UI.
- Error path traceable through logs and metrics.
