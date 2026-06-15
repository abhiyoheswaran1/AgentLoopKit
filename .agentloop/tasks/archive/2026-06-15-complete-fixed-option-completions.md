# Complete fixed option completions

- Created date: 2026-06-15
- Task type: feature
- Status: done

## Problem Statement

Several existing commands accept fixed option values, but shell completions do not expose those values.

## Desired Outcome

Shell completions suggest artifact types, badge sources, the supported task archive status, and summarize/handoff formats where the CLI already has fixed values.

## Constraints

- Keep completion scripts deterministic and generated from existing CLI constants where practical.
- Do not change command semantics or add new flags.
- Keep shell output scripts read-only; completions must not edit shell profiles.

## Non-Goals

- Do not add dynamic filesystem-backed completion.
- Do not add installation helpers for shell profile files.
- Do not redesign the completion generator.

## Assumptions

- Artifact inventory types, badge source values, the done-only task archive status, task status transitions, and Markdown/JSON output formats are stable enough to expose as fixed completion values.
- Completion tests are the primary regression coverage for this focused CLI polish change.

## Likely Files or Areas

- `src/core/completions.ts`
- `tests/completion.test.ts`
- README and CLI documentation that describe generated completion coverage

## Files or Areas Not to Touch

- Release publishing workflows
- npm package metadata
- Runtime command execution, verification, or GitHub integration code

## Acceptance Criteria

- Completion tests cover artifacts --type values.
- Completion tests cover badge --source values.
- Completion tests cover the task archive --status done value.
- Completion tests cover summarize and handoff --format values.

## Verification Commands

- npm test -- tests/completion.test.ts
- npm test -- tests/completion.test.ts tests/cli-docs-drift.test.ts tests/artifacts.test.ts tests/badge.test.ts tests/handoff.test.ts tests/task-archive.test.ts

## Post-Verification Gates

- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the completion generator additions and matching completion tests. Existing CLI commands still accept the same values; only shell suggestion coverage would be removed.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
