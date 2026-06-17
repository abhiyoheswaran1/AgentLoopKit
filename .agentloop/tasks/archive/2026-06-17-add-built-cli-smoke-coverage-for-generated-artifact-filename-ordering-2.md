# Add built CLI smoke coverage for generated artifact filename ordering

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Source tests cover filename-based ordering for generated AgentLoop artifacts when filesystem mtimes are stale, but the built CLI smoke path does not prove packaged status/artifacts behavior keeps using timestamped filenames instead of rewritten mtimes.

## Desired Outcome
The built CLI smoke script creates a separate temp AgentLoop repo with generated verification, handoff, and ship artifacts whose filenames and mtimes disagree, then verifies built status/artifacts JSON select the newer filename timestamp without mutating this repository.

## Constraints
- Keep changes scoped to built CLI smoke coverage and its guard test.
- Use only temp repos and local fixture files; do not scan broadly, query networks, or touch public release channels.
- Preserve JSON output shapes and runtime artifact-ordering semantics unless the bug pass finds a real defect.

## Non-Goals
- Do not change release, publishing, Marketplace, Scoop, WinGet, npm, GHCR, or MCP registry behavior.
- Do not add cleanup automation, retention policy, databases, or background mutation.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- .github/workflows
- CHANGELOG.md

## Acceptance Criteria
- A focused distribution-artifacts guard test fails before smoke coverage exists and passes after implementation.
- node scripts/smoke-cli.mjs creates a separate artifact-ordering smoke repo with older filename artifacts having newer mtimes and newer filename artifacts having older mtimes.
- Built status --json and artifacts --json report the newer timestamped verification, handoff, and ship artifacts by filename, not by filesystem mtime.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "generated artifact filename ordering"
- npm test -- tests/distribution-artifacts.test.ts
- npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts
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
- Artifact ordering affects review evidence selection; keep the smoke fixture isolated so it does not interfere with the main smoke flow.

## Rollback Notes
Revert scripts/smoke-cli.mjs and tests/distribution-artifacts.test.ts; no persistent artifact data or release metadata is expected.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
