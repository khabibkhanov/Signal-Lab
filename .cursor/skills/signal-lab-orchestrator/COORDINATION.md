# Orchestrator Coordination Playbook

## Phase Prompt Templates

### 1. PRD Analysis (fast)

- Extract requirements, constraints, acceptance checks, and penalties.
- Return structured bullet points and requirement IDs.

### 2. Codebase Scan (fast)

- Identify relevant files and missing pieces.
- Return implementation map grouped by domain.

### 3. Planning (default)

- Produce dependency-aware execution plan.
- Include critical path and fallback strategy.

### 4. Decomposition (default)

- Split plan into atomic tasks with dependencies.
- Attach model recommendations and complexity.

### 5. Implementation (fast/default)

- Delegate low-complexity tasks to fast model.
- Route high-risk architecture tasks to default model.

### 6. Review (fast readonly)

- Validate against acceptance criteria and rubric.
- Provide precise issue list with file references.

### 7. Report (fast)

- Summarize execution from context.json only.
- Include completion metrics and residual risks.

## Domain Mapping

- `database`: prisma schema, migrations, persistence checks
- `backend`: controller/service/filter/metrics/logging
- `frontend`: page UX, form flow, query behavior
- `infra`: docker-compose + monitoring provisioning
- `docs`: README, checklist, AI-layer docs
