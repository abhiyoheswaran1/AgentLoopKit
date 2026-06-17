# Add init CLI next-step guidance

- Created date: 2026-06-16
- Task type: feature
- Status: done

## Problem Statement
The generated first-run docs tell users to create a task, verify it, and hand off evidence, but the human init success output stops after doctor and create-task.

## Desired Outcome
agentloop init human output gives a concise post-init path through doctor, task creation, verification, and handoff without changing JSON output or generated file semantics.

## Constraints
- Keep JSON init output unchanged for automation.
- Keep init file writes, dry-run behavior, and local-only exclude behavior unchanged.
- Use concise CLI copy that stays command-focused.

## Non-Goals
- Do not add an interactive wizard or new init mode.
- Do not modify package metadata, release docs, publishing workflows, or distribution channels.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/init.ts
- tests/init.test.ts
- docs/getting-started.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Human non-dry init output includes doctor, create-task, verify, and handoff next steps.
- Human dry-run init output keeps the existing no-files-written behavior and does not imply verification can run before setup.
- init --json output remains parseable and unchanged in shape.

## Verification Commands
- npm test -- tests/init.test.ts
- npm run typecheck
- npm run lint
- npm run build
- npm test

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Init output is public CLI copy, so wording changes should stay stable and not overpromise automation.

## Rollback Notes
Revert the init output copy, tests, and docs added for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
