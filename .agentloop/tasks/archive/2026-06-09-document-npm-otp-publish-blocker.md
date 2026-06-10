# Document npm OTP publish blocker

- Created date: 2026-06-09
- Task type: docs
- Status: done

## Problem Statement
Local npm publish for agentloopkit 0.3.0 passed prepublish checks but stopped at npm EOTP browser or one-time-password authentication.

## Desired Outcome
Release docs and final handoff state the exact 0.3.0 publish blocker and safe next paths without asking for tokens in chat.

## Constraints
- Do not include OTPs, auth IDs, tokens, or private npm log details.

## Non-Goals
- Do not publish to npm automatically from docs.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/npm-publishing.md
- FINAL_HANDOFF.md

## Files or Areas Not to Touch
- package.json
- src/cli/index.ts

## Acceptance Criteria
- docs/npm-publishing.md mentions the 0.3.0 EOTP local publish blocker.
- FINAL_HANDOFF.md lists the 0.3.0 publish attempt evidence and next action.

## Verification Commands
- git diff --check
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the docs-only update if it creates confusion after npm trusted publishing succeeds.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
