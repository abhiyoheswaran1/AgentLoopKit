# Improve init output context

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
First-run init output shows file counts but not the target directory, detected project, or configured commands, so users have less context when running npx agentloopkit init in the wrong folder.

## Desired Outcome
agentloop init and init --dry-run report target/project/command context in human and JSON output without writing extra files.

## Constraints
- Keep output concise and user-facing
- Do not change npm version or release artifacts
- Keep JSON changes additive

## Non-Goals
- Do not add prompts or interactive setup
- Do not change generated harness templates beyond docs if needed

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/init.ts
- src/cli/commands/init.ts
- tests/init.test.ts
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- InitResult includes target directory, detected project metadata, and configured/missing command names
- CLI init output prints target/project/command context and dry-run no-write wording
- Tests cover the metadata and CLI JSON output

## Verification Commands
- pnpm test tests/init.test.ts
- pnpm typecheck
- pnpm test
- pnpm lint
- pnpm build
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the init metadata/output changes, the init tests, and the matching README/getting-started/changelog updates.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
