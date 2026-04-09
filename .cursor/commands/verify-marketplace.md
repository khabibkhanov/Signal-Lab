# /verify-marketplace

Validate that marketplace skills and custom skills are connected to practical workflows.

## Command Prompt

Audit `.cursor/settings.json`, `.cursor/marketplace-skills.md`, `.cursor/README.md`, and `evidence/marketplace/connection-evidence.md`.

Required checks:

1. Confirm exactly six marketplace skills are declared in `marketplaceSkills` with `enabled=true` and a non-empty `reason`.
2. Confirm each skill has at least one concrete repository responsibility in docs.
3. Confirm custom-skill gap coverage is documented (what marketplace does not cover).
4. Confirm evidence file cross-references exist and are not stale.

Output format:

| Check | Result (PASS/FAIL) | Evidence path | Notes |
| ----- | ------------------ | ------------- | ----- |

If any check fails, include a short remediation list.
