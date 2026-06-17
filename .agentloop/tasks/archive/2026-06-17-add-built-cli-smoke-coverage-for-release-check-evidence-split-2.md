# Add built CLI smoke coverage for release-check evidence split

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Source tests now cover release-check changed-file evidence split, but the built CLI smoke script only proves release-check redaction. Packaged CLI behavior could regress without a cross-platform smoke assertion for git changedFileCount, nonEvidenceChangedFileCount, and agentLoopEvidenceChangedFileCount.

## Desired Outcome
The built CLI smoke script creates a local dirty release-check fixture with one ordinary file and one AgentLoop evidence file, then asserts human and JSON release-check output include the changed-file split.

## Constraints
- Coverage only. Do not change release-check readiness decisions, JSON field names beyond existing fields, package metadata, release files, workflows, dependencies, tags, publishing, or registry/channel behavior.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- action.yml
- .github/workflows

## Acceptance Criteria
- tests/distribution-artifacts.test.ts guards that scripts/smoke-cli.mjs covers release-check changed-file evidence split.
- scripts/smoke-cli.mjs asserts built release-check JSON has changedFileCount, nonEvidenceChangedFileCount, and agentLoopEvidenceChangedFileCount for the dirty fixture.
- scripts/smoke-cli.mjs asserts built human release-check output shows the non-evidence and AgentLoop evidence split.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t release-check

## Post-Verification Gates
- npm run dogfood

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Built smoke coverage is release-adjacent; keep it local, read-only, and independent of publishing or registry state.

## Rollback Notes
Revert the smoke script assertions and distribution guard test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
