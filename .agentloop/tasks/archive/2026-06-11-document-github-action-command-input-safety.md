# Document GitHub Action command input safety

- Created date: 2026-06-11
- Task type: docs
- Status: done

## Problem Statement
The composite GitHub Action accepts a command input that is passed to the shell. Workflow authors need a clear warning to keep that input static and trusted.

## Desired Outcome
Action metadata and CI docs explain that the command input must be a static trusted AgentLoopKit command, not untrusted PR or user-controlled text.

## Constraints
- Do not change runtime behavior or add dependencies in this iteration.
- Keep public docs concise and user-facing.

## Non-Goals
- Do not add a full command parser to the composite action.
- Do not cut a release or change package version.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- action.yml
- docs/github-actions.md
- examples/github-actions/README.md
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- action.yml warns that the command input must not contain untrusted PR/user input.
- GitHub Actions docs include the same safety guidance.
- Distribution artifact tests pin the safety wording.

## Verification Commands
- npm test -- distribution-artifacts
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
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
