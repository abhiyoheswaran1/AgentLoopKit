# Add create-task risk note flags

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
Task contracts include a Risk Notes section, but non-interactive create-task does not accept risk-note input. Agents naturally try --risk during dogfooding and get an unsupported option error.

## Desired Outcome
create-task accepts repeatable --risk and --risk-note values and writes them into the Risk Notes section without changing the rest of the task contract format.

## Constraints
- Keep existing task contract headings and defaults
- Do not rename existing create-task flags
- No version bump or release

## Non-Goals
- No interactive prompt redesign
- No risk scoring or policy engine

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/task-contract.ts
- src/cli/index.ts
- tests/create-task.test.ts
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- create-task --risk writes a bullet under Risk Notes
- create-task --risk-note is accepted as an alias
- Repeated risk flags append instead of replacing earlier values
- create-task --help lists both risk flags

## Verification Commands
- npx pnpm@10.12.1 test tests/create-task.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 check:links
- npm run build
- npm run smoke:release
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the create-task risk flag parsing, task-contract input change, docs, and tests

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
