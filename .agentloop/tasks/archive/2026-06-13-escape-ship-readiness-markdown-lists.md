# Escape ship readiness Markdown lists

- Created date: 2026-06-13
- Task type: security-review
- Status: done

## Problem Statement
ship reports and ship GitHub comments render readiness blockers, warnings, and next actions as raw Markdown list prose. Some readiness text can include file paths from the repository, so Markdown control characters in paths can change how public ship evidence renders.

## Desired Outcome
ship report and ship GitHub-comment readiness lists escape Markdown control characters while preserving existing inline-code formatting for task, verification, gate, and file evidence.

## Constraints
- Do not change release metadata, package version, tags, npm publishing, or GitHub releases.
- Reuse the existing Markdown prose escaping helper.
- Keep JSON data fields unchanged for scripts.

## Non-Goals
- Do not sanitize full arbitrary Markdown reports.
- Do not change readiness scoring decisions.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/ship.ts
- tests/ship.test.ts
- .agentloop/dogfood-log.md
- CHANGELOG.md

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml

## Acceptance Criteria
- A ship regression test proves risk warning prose with Markdown control characters is escaped in the ship report markdown.
- A ship GitHub comment regression test proves the same warning prose is escaped in comment Markdown.
- Existing ship tests continue to pass.

## Verification Commands
- npm test -- tests/ship.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- node dist/cli/index.js verify --task-commands --only-task-commands --write-run
- node dist/cli/index.js ship --redact-paths
- node dist/cli/index.js check-gates --redact-paths --strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Over-escaping could reduce readability of ship reports.
- Under-escaping could let public ship evidence display unintended checklist, heading, or link structure.

## Rollback Notes
Revert the ship renderer change, focused tests, and documentation/log entries.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
