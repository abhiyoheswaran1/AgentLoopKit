# Document doctor risk-file heuristics

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
Doctor risk-file warnings are useful, but users need a public page that explains categories, examples, limits, and reviewer actions without implying secret scanning or risk scoring.

## Desired Outcome
The docs explain doctor risk-file categories, why they are warning-only, how env files are handled, and how agents should use the output in task contracts and handoffs.

## Constraints
- Docs-only change.
- Do not change doctor behavior or JSON shape.
- Do not claim security scanning, secret detection, or compliance.

## Non-Goals
- Do not add a policy engine, risk score, or scanner.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/doctor-risk-files.md
- docs/getting-started.md
- README.md

## Files or Areas Not to Touch
- src/core
- src/cli

## Acceptance Criteria
- A dedicated docs page lists risk-file categories and common examples.
- The docs explain env file path-only handling and warn that AgentLoopKit does not read env contents.
- README and getting-started docs link to the page.

## Verification Commands
- npx pnpm@10.12.1 check:links
- git diff --check
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove the risk-file docs page and revert navigation links.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
