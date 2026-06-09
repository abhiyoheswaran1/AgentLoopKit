# Refresh README visuals for 0.6.0

- Created date: 2026-06-09
- Task type: docs
- Status: completed

## Problem Statement

README visuals exist but the terminal demo and screenshots should reflect the current 0.6.0 workflow before the next GitHub release.

## Desired Outcome

README shows polished current visuals generated with Playwright and VHS, with concise launch copy and honest npm status.

## Constraints

- Do not change CLI behavior for this docs iteration.
- Do not add cloud, telemetry, API, dashboard, postinstall, or LLM dependency.

## Non-Goals

- Do not publish to npm without successful registry authentication.
- Do not create a hosted marketing site.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- README.md
- docs/assets/readme/
- .agentloop/research/
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch

- src/cli/
- src/core/

## Acceptance Criteria

- README image links point to committed assets.
- VHS tape runs against the local current CLI, not stale npm latest.
- Playwright screenshots match current source claims and test counts.

## Verification Commands

- pnpm lint
- pnpm typecheck
- pnpm test
- pnpm build
- npx projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the README asset refresh commit and keep the previous 0.6.0 release candidate commit.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
