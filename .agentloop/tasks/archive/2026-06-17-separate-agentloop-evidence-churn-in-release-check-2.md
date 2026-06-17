# Separate AgentLoop evidence churn in release-check

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
During long AgentLoopKit dogfood sessions, agentloop release-check still reports a flat changed-file count such as 3104 changed files. Other loop surfaces already split ordinary changed files from generated AgentLoop evidence, so release-check looks noisier than the real release review surface.

## Desired Outcome
release-check keeps its existing release-readiness decisions while showing non-evidence versus generated AgentLoop evidence counts in human and JSON output.

## Constraints
- Keep release-check read-only and local-only. Do not change release readiness rules, strict-mode thresholds, package metadata, changelog, tags, workflows, registry/channel behavior, dependencies, or publishing.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/release-check.ts
- tests/release-check.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- action.yml
- .github/workflows

## Acceptance Criteria
- Human release-check output shows dirty working tree totals as total, non-evidence, and AgentLoop evidence counts when evidence churn is present.
- JSON release-check output includes additive git changed-file breakdown fields while preserving changedFileCount.
- Clean-tree release-check output stays concise and does not add zero-count noise.

## Verification Commands
- npm test -- tests/release-check.test.ts

## Post-Verification Gates
- npm run dogfood

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- release-check is release-adjacent; keep this as reporting-only and do not change readiness decisions or publish guidance.

## Rollback Notes
Revert the release-check reporting helper changes, focused tests, and docs wording.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
