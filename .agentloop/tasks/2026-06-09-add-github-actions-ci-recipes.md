# Add GitHub Actions CI recipes

- Created date: 2026-06-09
- Task type: docs
- Status: done

## Problem Statement
Users can run verify, handoff, and check-gates locally, but docs do not show how to wire those steps into GitHub Actions without overclaiming npm availability or silently mutating workflows.

## Desired Outcome
Add copy-pasteable GitHub Actions recipes for review-evidence gates and CI artifacts while keeping the product local-first and transparent.

## Constraints
- Do not add a workflow installer command
- Do not claim npm latest has 0.14.0 until registry proof exists
- Do not create workflows in user repos by default

## Non-Goals
- No new CLI command
- No SaaS, cloud backend, dashboard, or telemetry

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/github-actions.md
- README.md
- examples/github-actions/README.md
- src/templates/harness/commands.md

## Files or Areas Not to Touch
- src/cli
- src/core

## Acceptance Criteria
- GitHub Actions docs explain committed evidence and ephemeral artifact modes
- README links to CI recipes
- Example workflow is copy-pasteable and npm-status honest

## Verification Commands
- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 test
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove the CI recipe docs, examples, and generated harness guidance.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
