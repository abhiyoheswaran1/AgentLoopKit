# Add per-package monorepo verification guidance

- Created date: 2026-06-09
- Task type: docs
- Status: done

## Problem Statement

Doctor can detect monorepo markers, but generated harness docs do not explain how agents should handle root checks versus package-level checks.

## Desired Outcome

Generated AgentLoopKit guidance tells agents to record package-specific verification commands in task contracts, run root checks only when they cover the change, and avoid claiming full monorepo verification from a root-only check.

## Constraints

- Keep this guidance local-first and documentation-only.
- Do not add a workspace command runner.
- Do not add dependencies or change config schema.

## Non-Goals

- Implement package graph detection.
- Run package-manager commands automatically.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/templates/harness/commands.md
- src/templates/root/agentloop-directory-readme.md
- src/templates/tasks/README.md
- docs/getting-started.md

## Files or Areas Not to Touch

- package.json
- src/core/verification.ts

## Acceptance Criteria

- Generated .agentloop/harness/commands.md includes monorepo verification guidance.
- Generated .agentloop/README.md and tasks README tell users how to capture package-specific checks.
- Getting started docs explain root versus package verification without claiming orchestration support.

## Verification Commands

- npx pnpm@10.12.1 test tests/init.test.ts tests/template-renderer.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build
- npx projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the template and docs edits.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
