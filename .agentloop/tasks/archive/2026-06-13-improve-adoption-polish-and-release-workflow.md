# Improve adoption polish and release workflow

- Created date: 2026-06-13
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit has the main acceptance-layer loop, but existing users and maintainers need clearer upgrade guidance, doctor suggestions, faster dev tests, MCP examples, public workflows, and a repeatable release gate before the next version.

## Desired Outcome
Implement the requested adoption-polish batch with tests, docs, bug pass, release-flow support, dogfood evidence, and a version cut only after the release gate passes.

## Constraints
- Keep the product local-first with no cloud backend, telemetry, postinstall scripts, AI API calls, or destructive automation.
- Keep upgrade-harness read-only and preserve user-edited harness files.
- Verify exact MCP client guidance against official docs before documenting exact paths; use generic guidance when official paths are unclear.

## Non-Goals
- Do not add another large core feature beyond the seven requested adoption-polish items.
- Do not publish until tests, docs checks, dogfood, and release gate pass.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/index.ts
- src/core/upgrade-harness.ts
- src/core/doctor.ts
- tests/upgrade-harness.test.ts
- tests/doctor.test.ts
- package.json
- docs
- examples

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- upgrade-harness supports a detailed suggestions/details mode with copyable guidance for stale harness files.
- doctor recommends upgrade-harness when current-loop guidance is missing or stale.
- normal development tests are split from full/release tests without weakening the release gate.
- docs/upgrading-existing-repos.md exists and explains safe older-repo upgrade workflows.
- MCP client setup docs are clearer and avoid unverified config path claims.
- A release-flow command or script runs the exact release gate we use.
- Public examples cover bugfix PR and dependency upgrade PR using task -> verify -> ship -> prepare-pr.

## Verification Commands
- npm run test:quick
- npm run lint
- npm run typecheck
- npm run build
- npm run check:public-docs
- npm run check:links
- npm test

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release docs or README could accidentally include internal-only status or unsupported channel claims.
- MCP setup docs can become inaccurate if they include unverified client-specific paths.

## Rollback Notes
Revert the adoption-polish commits and keep 0.30.0 as the latest stable release.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
