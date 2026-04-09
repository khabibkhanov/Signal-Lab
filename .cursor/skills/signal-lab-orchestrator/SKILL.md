---
name: signal-lab-orchestrator
description: "Use when executing a Signal Lab PRD via a phased, resumable pipeline with atomic tasks, fast/default model routing, and context-file persistence. Keywords: orchestrator, PRD execution, resume, decomposition"
---

# Signal Lab Orchestrator

## When to Use

- You are asked to implement a PRD in this repository end-to-end.
- Work must be resumable after interruption.
- You need context-economical execution with small models handling most tasks.

## Input

- `prdPath` or raw PRD text.
- Optional execution id for resume.

## Output

- Updated `.execution/<timestamp>/context.json`.
- Applied implementation changes.
- Final execution report including tasks, retries, and model usage.

## Mandatory Phases

1. PRD Analysis (`fast`)
2. Codebase Scan (`fast`)
3. Planning (`default`)
4. Decomposition (`default`)
5. Implementation (`fast` for 80%+, `default` for complex tasks)
6. Review (`fast`, readonly)
7. Report (`fast`)

## Context File Contract

Create or update `.execution/<timestamp>/context.json` using this schema:

```json
{
	"executionId": "2026-04-09-10-00",
	"prdPath": "prds/002_prd-observability-demo.md",
	"status": "in_progress",
	"currentPhase": "implementation",
	"phases": {
		"analysis": { "status": "completed", "result": "..." },
		"codebase": { "status": "completed", "result": "..." },
		"planning": { "status": "completed", "result": "..." },
		"decomposition": { "status": "completed", "result": "..." },
		"implementation": {
			"status": "in_progress",
			"completedTasks": 3,
			"totalTasks": 7
		},
		"review": { "status": "pending" },
		"report": { "status": "pending" }
	},
	"signal": 42,
	"tasks": []
}
```

## Task Decomposition Rules

- Each task must be 5-10 minutes.
- Each task must include:
    - `id`
    - `title`
    - `domain` (`database`, `backend`, `frontend`, `infra`, `docs`)
    - `complexity` (`low`, `medium`, `high`)
    - `model` (`fast`, `default`)
    - `dependencies`
    - `status`
- Fast model target coverage: >= 80% of tasks.

## Delegation Policy

The orchestrator coordinates; it does not perform implementation directly when decomposition is available.

For each task:

1. Build a focused prompt with exact file paths and acceptance criteria.
2. Delegate to appropriate implementer/reviewer subagent.
3. Record outcomes in `context.json`.

## Review Loop

For each domain:

1. Delegate readonly review.
2. If failed, send actionable feedback to implementer.
3. Retry up to 3 times.
4. Mark task `failed` if still unresolved, continue remaining tasks.

## Resume Logic

On rerun:

1. Read existing `context.json`.
2. Skip completed phases.
3. Continue from `currentPhase`.
4. Preserve failed-task records; do not erase historical attempts.

## Final Report Template

```text
Signal Lab PRD Execution — Complete

Tasks: <completed> completed, <failed> failed, <retries> retries
Duration: <estimated duration>
Model usage: <fastCount> fast, <defaultCount> default

Completed:
  ✓ ...

Failed:
  ✗ ...

Next steps:
  - ...
```

## Guardrails

- Never drop state updates between phases.
- Never classify all tasks as fast.
- Never block entire execution on one failed task.
- Keep the main chat concise; offload detail to task-specific delegates.
