# Return JSON errors for invalid verify task paths

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
`agentloop verify --task <bad path> --json` currently produces a normal verification report with an unavailable task note. Other commands that accept explicit artifact paths now return structured `ARTIFACT_PATH_INVALID` errors in JSON mode, so automation has to special-case `verify`.

## Desired Outcome
agentloop verify --task <bad path> --json returns a structured artifact-path error instead of writing a normal verification report.

## Constraints
- Do not run task-defined commands from invalid task paths.
- Do not weaken path safety around .env files or paths outside .agentloop/tasks.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/verify.ts
- src/core/artifacts.ts
- tests/verification.test.ts
- README.md
- docs/verification-reports.md
- CHANGELOG.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Invalid verify task paths with --json exit non-zero and print ARTIFACT_PATH_INVALID JSON.
- Invalid verify task paths without --json keep the existing safe human-readable report behavior.

## Verification Commands
- npm test -- tests/verification.test.ts
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
Revert the verify command validation changes, focused tests, and public docs/changelog notes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
