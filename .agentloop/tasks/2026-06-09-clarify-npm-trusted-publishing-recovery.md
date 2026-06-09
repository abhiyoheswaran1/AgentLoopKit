# Clarify npm trusted publishing recovery

- Created date: 2026-06-09
- Task type: docs
- Status: proposed

## Problem Statement
GitHub release `v0.2.0` exists, but npm still reports `agentloopkit@0.1.1` as latest. The docs need an exact recovery path for npm trusted publishing and manual fallback without asking anyone to paste OTPs or tokens into chat.

## Desired Outcome
Make the publish recovery path clear enough that the package owner can configure npm trusted publishing, rerun the workflow, or run a local publish with browser authentication.

## Constraints
- Keep changes docs-only and repo-internal.
- Do not change `package.json`, runtime code, source tests, or generated package assets.
- Use official npm documentation as the source for trusted publishing requirements.
- Do not request or record OTPs, tokens, or credentials.

## Non-Goals
- No npm publish retry in this task.
- No new release tag.
- No package version bump.

## Assumptions
- npm-side trusted publisher configuration still requires package-owner action on npmjs.com.
- GitHub workflow syntax is already close to correct because it has `id-token: write`, Node 24, and npm upgrade.

## Likely Files or Areas
- `docs/npm-publishing.md`
- `docs/launch-checklist.md`
- `FINAL_HANDOFF.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`
- `.agentloop/research/`

## Files or Areas Not to Touch
- `src/`
- `package.json`
- `pnpm-lock.yaml`
- `dist/`
- `README.md`

## Acceptance Criteria
- Publishing docs name the exact npm trusted publisher fields.
- Docs explain the observed `0.2.0` state and safe retry order.
- Launch checklist reflects current GitHub labels and npm `0.2.0` status.
- Final handoff no longer suggests `0.2.0` is already on npm.
- Internal dogfood and research records capture the decision.

## Verification Commands
- `git diff --check`
- `npx pnpm@10.12.1 lint`
- `npx pnpm@10.12.1 typecheck`
- `npx pnpm@10.12.1 test`
- `npx pnpm@10.12.1 build`
- `npx projscan doctor --format markdown`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert this docs-only change. No runtime rollback is required.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
