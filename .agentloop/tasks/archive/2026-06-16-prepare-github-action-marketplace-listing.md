# Prepare GitHub Action Marketplace listing

- Created date: 2026-06-16
- Task type: docs
- Status: done

## Problem Statement
AgentLoopKit has a composite GitHub Action, but the Action metadata and docs are not yet polished for GitHub Marketplace discovery.

## Desired Outcome
Make the Action metadata Marketplace-ready and document safe Marketplace usage without adding token, posting, publishing, or network behavior to the CLI.

During verification, strict dogfood exposed that a freshly written handoff summary could still fail gates when no run ledger entry existed. The Action docs point users at `check-gates`, so this slice also needs gate coverage to accept the latest handoff Markdown when it lists the dirty files.

## Constraints
- Keep command, version, and install-mode inputs static and trusted in examples.
- Do not add GitHub API calls or PR comment posting to the Action wrapper.
- Do not cut a release in this task.

## Non-Goals
- Do not publish the Action to Marketplace in this task.
- Do not change CLI command semantics.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- action.yml
- docs/github-actions.md
- README.md
- package.json
- src/core/handoff-coverage.ts
- src/core/check-gates.ts
- src/core/status.ts
- src/core/maintainer-check.ts
- tests/github-action-runner.test.ts
- tests/check-gates.test.ts
- tests/status.test.ts
- tests/maintainer-check.test.ts
- tests/next.test.ts
- tests/package-scripts.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- action.yml includes Marketplace branding metadata.
- tests cover the Action metadata contract and safe wrapper inputs.
- docs/github-actions.md explains Marketplace usage and safe static command examples.
- README links to the GitHub Action docs without adding internal release chatter.
- check-gates, status, and maintainer-check treat the latest handoff Markdown as coverage when it lists the dirty files and no matching run entry exists.

## Verification Commands
- npm test -- tests/github-action-runner.test.ts
- npm test -- tests/check-gates.test.ts tests/status.test.ts tests/maintainer-check.test.ts tests/next.test.ts
- npm run check:public-docs
- npm run typecheck

## Post-Verification Gates
- npm run dogfood:strict
- npm run maintenance:check -- --json

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Marketplace copy could imply automation that the Action does not perform.

## Rollback Notes
Revert action.yml, docs, tests, and AgentLoop evidence for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
