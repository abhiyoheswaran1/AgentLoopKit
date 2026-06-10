# Add monorepo doctor awareness

- Created date: 2026-06-09
- Task type: feature
- Status: done

## Problem Statement

Doctor currently reports project type and scripts but does not tell users when AgentLoopKit is installed at a monorepo or workspace root.

## Desired Outcome

Doctor detects common monorepo markers and reports them in markdown and JSON without changing existing config schema.

## Constraints

- Do not add a new project type unless the config schema is intentionally changed.
- Keep detection local and file-name based; do not parse dependency graphs.
- Do not read environment file contents or run package manager commands.

## Non-Goals

- Do not add a dashboard or workspace task manager.
- Do not implement per-package verification routing yet.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/project-detection.ts
- src/core/doctor.ts
- tests/project-detection.test.ts
- tests/doctor.test.ts
- docs/

## Files or Areas Not to Touch

- package.json
- src/core/config.ts

## Acceptance Criteria

- pnpm-workspace.yaml, package.json workspaces, turbo.json, nx.json, lerna.json, and rush.json can be detected.
- agentloop doctor shows a monorepo check without failing the setup.
- doctor --json includes the monorepo check.

## Verification Commands

- npx pnpm@10.12.1 test tests/project-detection.test.ts tests/doctor.test.ts
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 test

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the monorepo detection commit; existing doctor behavior remains unchanged.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
