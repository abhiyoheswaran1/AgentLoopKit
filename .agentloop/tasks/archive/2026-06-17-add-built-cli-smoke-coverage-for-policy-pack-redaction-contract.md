# Add built CLI smoke coverage for policy pack redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
The built smoke script proves policy-pack inventory exists, but does not exercise the packaged CLI path for policy packs --redact-paths even though docs and source tests advertise the flag as a public-output consistency option.

## Desired Outcome
The built CLI smoke flow checks policy packs --redact-paths in human and JSON modes, proves JSON output stays equivalent to default inventory output, and keeps policy-pack behavior unchanged.

## Constraints
- Use TDD: add the distribution-artifacts guard test first and watch it fail before changing the smoke script.
- Keep scope to smoke/test coverage and active task evidence; do not alter policy-pack command semantics unless a bug pass proves a real defect.
- Do not publish, tag, bump versions, or touch release-channel tasks.

## Non-Goals
- No remote policy packs, policy enforcement engine, dependency changes, release prep, GitHub Marketplace, Scoop, WinGet, npm publish, GitHub release, GHCR, or MCP registry work.
- No broad cleanup of existing AgentLoop or AgentFlight evidence.

## Assumptions
- Source-level policy-pack redaction behavior already exists and is covered in tests/policy-packs.test.ts; this task adds packaged/built smoke proof.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- .github/workflows

## Acceptance Criteria
- Focused distribution-artifacts test fails before the smoke script includes policy-pack redaction checks and passes after implementation.
- node scripts/smoke-cli.mjs logs Policy pack redaction smoke passed and fails if redacted JSON changes the policy-pack inventory payload.
- Bug pass inspects the implementation for brittle assertions, path leaks, and unintended release or dependency changes.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "policy pack redaction"
- npm test -- tests/distribution-artifacts.test.ts
- npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Smoke script growth can make failures noisy; keep assertions focused and command-local.
- The dirty worktree contains many unrelated evidence files; preserve them and avoid broad formatting.

## Rollback Notes
Revert the targeted changes in scripts/smoke-cli.mjs and tests/distribution-artifacts.test.ts, then remove this task evidence if needed.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
