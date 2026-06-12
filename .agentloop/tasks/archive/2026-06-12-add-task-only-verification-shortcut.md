# Add task-only verification shortcut

- Created date: 2026-06-12
- Task type: feature
- Status: done

## Problem Statement
Dogfooding focused task verification requires passing every --no-test, --no-lint, --no-typecheck, and --no-build flag before --task-commands will run only the task contract commands.

## Desired Outcome
Maintainers and agents can run reviewed task contract verification commands without also running configured repo commands by using one explicit shortcut.

## Constraints
- Do not execute task Markdown commands unless --task-commands is still explicitly present.
- Do not change default verify behavior.
- Do not remove existing --no-* skip flags.

## Non-Goals
- No policy engine for task commands.
- No shell parser redesign.

## Assumptions
- Maintainers will use this shortcut only for reviewed task contracts.
- Default `agentloop verify` behavior should stay broad and repo-configured.

## Likely Files or Areas
- `src/cli/commands/verify.ts`
- `src/core/verification.ts`
- `tests/verification.test.ts`
- `docs/cli-reference.md`
- `docs/verification-reports.md`
- `README.md`

## Files or Areas Not to Touch
- No release-channel docs beyond the patch release metadata.
- No shell parser or command execution redesign.

## Acceptance Criteria
- agentloop verify --task <path> --task-commands --only-task-commands runs only task commands and records configured commands as not run.
- agentloop verify --only-task-commands without --task-commands returns a clear JSON error and runs nothing.
- agentloop verify --only-task-commands without --task returns a clear JSON error and runs nothing.

## Verification Commands
- npm test -- tests/verification.test.ts
- npm run lint
- npm run typecheck
- npm run build
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Verification command selection affects CI and maintainer trust.

## Rollback Notes
Remove the --only-task-commands option and keep the existing --no-* flags.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
