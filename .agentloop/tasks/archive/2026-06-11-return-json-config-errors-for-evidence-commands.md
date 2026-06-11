# Return JSON config errors for evidence commands

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
Evidence commands produce JSON for agents and CI, but invalid `agentloop.config.json` still falls through to the global human stderr path. Automation should receive the same parseable `CONFIG_ERROR` shape that loop-state commands now return.

## Desired Outcome
Evidence-producing JSON commands return structured CONFIG_ERROR output when agentloop.config.json is invalid.

## Constraints
- Do not weaken config validation.
- Do not run verification, write reports, write badges, or write release notes when config is invalid.
- Do not bump version or publish.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/json-errors.ts
- src/cli/commands/verify.ts
- src/cli/commands/summarize.ts
- src/cli/commands/report.ts
- src/cli/commands/badge.ts
- src/cli/commands/ci-summary.ts
- src/cli/commands/release-notes.ts
- tests/verification.test.ts
- tests/handoff.test.ts
- tests/html-report.test.ts
- tests/badge.test.ts
- tests/ci-summary.test.ts
- tests/release-notes.test.ts
- README.md
- docs/verification-reports.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- verify --json exits non-zero with CONFIG_ERROR JSON for invalid config.
- summarize --json and handoff --json exit non-zero with CONFIG_ERROR JSON for invalid config.
- report --json, badge --json, ci-summary --json, and release-notes --json exit non-zero with CONFIG_ERROR JSON for invalid config.
- Human output for invalid config remains on the existing stderr path.

## Verification Commands
- npm test -- tests/verification.test.ts tests/handoff.test.ts tests/html-report.test.ts tests/badge.test.ts tests/ci-summary.test.ts tests/release-notes.test.ts
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
Revert the evidence-command config JSON handlers, focused tests, and docs/changelog notes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
