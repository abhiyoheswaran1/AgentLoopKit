# Add dogfood JSON summary

- Created date: 2026-06-13
- Task type: feature
- Status: done

## Problem Statement

The repeatable AgentLoopKit dogfood gate streams useful human output, but agents and CI cannot consume a deterministic summary without scraping terminal text.

## Desired Outcome

The dogfood script can emit a local JSON summary with mode, step results, overall status, and safety notes while preserving default human output.

## Constraints

- Keep dogfood local-first and transparent.
- Do not publish, bump versions, create tags, or cut a release.
- Do not read .env files, token files, or credentials.
- Do not add cloud, telemetry, or API calls.

## Non-Goals

- Do not replace existing human dogfood output.
- Do not add a dashboard or frontend.
- Do not run release-check or npm-status as part of ordinary dogfood.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- scripts/dogfood.mjs
- tests/dogfood-script.test.ts
- README.md
- docs/cli-reference.md
- CHANGELOG.md

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- dogfood script supports --json.
- JSON output includes mode, overall status, step results, command text, exit codes, allowFailure, duration, and safety notes.
- Failure mode still emits a JSON summary when --json is used.
- Default human output remains unchanged.
- Vitest covers default, strict, JSON, and failing-step behavior.

## Verification Commands

- npm test -- tests/dogfood-script.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates

- npm run dogfood:strict
- agentloop ship --redact-paths

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Dogfood output is used by agents and CI, so JSON mode must not make existing human logs noisy or unstable.
- Step failures must preserve the non-zero exit behavior while still giving useful evidence.

## Rollback Notes

Revert the dogfood script and test changes; existing dogfood commands remain available.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
