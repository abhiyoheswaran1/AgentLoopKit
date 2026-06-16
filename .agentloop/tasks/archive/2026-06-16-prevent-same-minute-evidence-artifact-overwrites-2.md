# Prevent same-minute evidence artifact overwrites

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Default generated evidence artifacts for verify, ci-summary, and release-notes can reuse the same minute-based path and replace prior evidence when rerun quickly.

## Desired Outcome
Default generated verification, CI summary, and release-notes artifacts allocate a numeric suffix when the timestamp path already exists, while explicit output paths remain exact and keep existing safety checks.

## Constraints
- Preserve explicit output path behavior for `--out` and other caller-provided paths.
- Keep JSON output fields and artifact schemas backward-compatible except for safer default generated paths.
- Reuse existing artifact path safety helpers instead of adding a second path-allocation mechanism.

## Non-Goals
- Do not change badge output names; badges intentionally refresh stable SVG paths.
- Do not change artifact cleanup, stale-artifact retention, or run-ledger schema.
- Do not cut or publish a release in this task.

## Assumptions
- Timestamp-based artifacts should preserve evidence by default when rerun within the same minute.
- Existing artifact inventory patterns already accept numeric suffixes.

## Likely Files or Areas
- src/core/verification.ts
- src/core/ci-summary.ts
- src/core/release-notes.ts
- tests/verification.test.ts
- tests/ci-summary.test.ts
- tests/release-notes.test.ts
- docs/cli-reference.md
- CHANGELOG.md
- .agentloop/dogfood-log.md
- .agentloop/backlog.md

## Files or Areas Not to Touch
- package.json version
- release workflows
- npm/GitHub release metadata

## Acceptance Criteria
- Running `verify` twice with the same generated timestamp preserves the first verification report and writes the second to a suffixed path.
- Running `ci-summary --write` twice with the same generated timestamp preserves the first CI summary and writes the second to a suffixed path.
- Running `release-notes --write` twice with the same generated timestamp preserves the first release notes and writes the second to a suffixed path.
- Explicit output paths keep the existing exact-path behavior and safety checks.
- CLI docs and changelog mention default generated evidence paths avoid same-minute collisions.

## Verification Commands
- npm test -- tests/verification.test.ts tests/ci-summary.test.ts tests/release-notes.test.ts
- npm test -- tests/artifacts.test.ts tests/runs.test.ts tests/cli-docs-drift.test.ts
- npm run check:public-docs
- npm run typecheck
- npm run lint
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Artifact path behavior is a user-facing CLI contract. Keep changes limited to generated default paths and leave explicit user-supplied paths alone.

## Rollback Notes
Revert the artifact allocator usage changes and the same-minute artifact regression tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
