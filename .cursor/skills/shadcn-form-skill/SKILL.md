---
name: shadcn-form-skill
description: "Use when building or updating frontend forms with React Hook Form, schema validation, shadcn-style components, and TanStack Query mutation flow. Keywords: form, rhf, query mutation, shadcn"
---

# Shadcn Form Skill

## When to Use

- New form creation in Next.js pages.
- Existing form migration from uncontrolled inputs.
- Improving mutation UX with loading and toast feedback.

## Workflow

1. Define form schema and validation boundaries.
2. Wire `useForm` with resolver.
3. Render controls from `components/ui`.
4. Attach `useMutation` for submit behavior.
5. Invalidate related queries on success/error where needed.
6. Add user feedback (toasts + inline validation messages).

## Required UX States

- Initial ready state.
- Submitting state with disabled action.
- Success feedback.
- Error feedback.

## Form Contract

- Form field names match backend DTO fields where possible.
- Optional fields must degrade gracefully.
- Validation messages should be short and actionable.

## Done Checklist

- Form uses RHF.
- Submit path uses TanStack Query mutation.
- Components use shadcn-style primitives.
- Follow-up query refresh behavior is explicit.
