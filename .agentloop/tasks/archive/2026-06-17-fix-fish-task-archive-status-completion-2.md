# Fix fish task archive status completion

- Created date: 2026-06-17
- Task type: bugfix
- Status: done

## Problem Statement
Fish completion output advertises task archive --status values under a top-level archive subcommand predicate, so normal fish completion for agentloop task archive --status does not get the done-only value.

## Desired Outcome
Render fish completion rules that complete the done-only archive status for nested agentloop task archive --status and agentloopkit task archive --status while preserving existing completion behavior for other shells.

## Constraints
- Keep this as completion-only DX polish.
- Do not edit shell profile files or run shell install commands.
- Do not change task archive command semantics, package metadata, lockfiles, dependencies, or release files.

## Non-Goals
- No release, publish, version bump, Scoop, WinGet, Marketplace, shell profile mutation, or new completion engine.

## Assumptions
- The existing static completion renderer should stay dependency-free.

## Likely Files or Areas
- src/core/completions.ts
- tests/completion.test.ts
- tests/distribution-artifacts.test.ts
- scripts/smoke-cli.mjs

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- .github/workflows

## Acceptance Criteria
- Focused completion test fails before the fish archive predicate is corrected and passes after implementation.
- Fish completion output contains nested task/archive predicates for both agentloop and agentloopkit and no longer relies on a top-level archive predicate.
- Built smoke script exercises completion fish output for task archive --status done.

## Verification Commands
- npm test -- tests/completion.test.ts
- npm test -- tests/distribution-artifacts.test.ts -t "fish task archive"
- npx prettier --check src/core/completions.ts tests/completion.test.ts tests/distribution-artifacts.test.ts scripts/smoke-cli.mjs
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- npm run dogfood:strict
- npm run maintenance:check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Fish completion syntax is string-based; keep assertions focused on the emitted predicates and values.

## Rollback Notes
Revert the targeted changes in src/core/completions.ts, tests/completion.test.ts, tests/distribution-artifacts.test.ts, and scripts/smoke-cli.mjs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
