# Add dependency audit to dogfood gate

- Created date: 2026-06-13
- Task type: feature
- Status: done

## Problem Statement
The 0.29.0 release gate caught a high dependency advisory late. The repeatable dogfood gate should catch dependency audit drift before release prep.

## Desired Outcome
Dogfood strict and default modes include a safe read-only dependency audit step, with JSON summaries and docs reflecting the extra safety signal.

## Constraints
- None recorded yet.

## Non-Goals
- Do not publish, tag, release, or add dependency auto-updates.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/dogfood.mjs
- tests/dogfood-script.test.ts
- README.md
- docs/cli-reference.md
- AGENTS.md
- .agentloop/harness/commands.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Dogfood step plan includes dependency audit
- Dependency audit uses the pinned pnpm version without npm tokens or publish side effects
- Dogfood safety notes remain accurate
- Tests cover the new audit step and command safety

## Verification Commands
- npm test -- tests/dogfood-script.test.ts
- npx --yes pnpm@10.12.1 audit --audit-level high
- npm run check:public-docs
- npm run build

## Post-Verification Gates
- node scripts/dogfood.mjs --strict --json
- node dist/cli/index.js check-gates --strict --redact-paths
- node dist/cli/index.js maintainer-check --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Dependency audit touches package-manager behavior; keep it read-only and avoid npm token/env file access.

## Rollback Notes
Revert the dogfood step, test expectations, and docs/log updates if the audit proves too slow or noisy.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
