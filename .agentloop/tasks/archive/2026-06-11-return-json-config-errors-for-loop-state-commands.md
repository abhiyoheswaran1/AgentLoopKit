# Return JSON config errors for loop state commands

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
The loop-state commands are common automation entry points for agents and CI. When `agentloop.config.json` is invalid, `status --json`, `next --json`, and `check-gates --json` currently fall through to the global human stderr error path instead of returning parseable JSON.

## Desired Outcome
agentloop status --json, agentloop next --json, and agentloop check-gates --json return structured CONFIG_ERROR output when agentloop.config.json is invalid.

## Constraints
- Do not weaken config validation.
- Do not hide validation messages needed to fix the local config.
- Do not bump version or publish.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/status.ts
- src/cli/commands/next.ts
- src/cli/commands/check-gates.ts
- tests/status.test.ts
- tests/next.test.ts
- tests/check-gates.test.ts
- README.md
- CHANGELOG.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- status --json exits non-zero with CONFIG_ERROR JSON for invalid config.
- next --json exits non-zero with CONFIG_ERROR JSON for invalid config.
- check-gates --json exits non-zero with CONFIG_ERROR JSON for invalid config.
- Human output for invalid config remains stderr through the existing global error path.

## Verification Commands
- npm test -- tests/status.test.ts tests/next.test.ts tests/check-gates.test.ts
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- npm run build
- git diff --check
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the command-level config JSON handlers, focused tests, and docs/changelog notes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
