# Document policy customization workflow

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
Policy status can show modified, missing, and extra policy files, but maintainers need clearer guidance for editing repo-local policies without treating AgentLoopKit as a compliance engine.

## Desired Outcome
Policy docs and generated harness guidance explain how to customize policy files, review drift, preserve local decisions, and avoid unsupported enforcement claims.

## Constraints
- Documentation-only change unless a test reveals a broken generated artifact.
- Do not add a policy engine, auto-migration, remote policy packs, compliance scoring, or enforcement behavior.

## Non-Goals
- Do not change policy status runtime behavior.
- Do not change package version or create a release.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/policies.md
- README.md
- docs/template-migrations.md
- src/templates/root/agentloop-directory-readme.md
- src/templates/root/AGENTLOOP.md
- src/templates/harness/commands.md
- src/templates/harness/review-checklist.md

## Files or Areas Not to Touch
- src/core
- src/cli

## Acceptance Criteria
- Docs include a concrete workflow for reviewing and editing local policy files.
- Docs explain how to interpret current, modified, missing, and extra statuses.
- Generated harness guidance tells agents to treat modified policies as repo decisions, not errors.

## Verification Commands
- git diff --check
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 check:links
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert this docs commit if the guidance confuses policy status with enforcement.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
