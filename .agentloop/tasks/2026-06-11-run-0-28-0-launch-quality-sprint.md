# Run 0.28.0 launch-quality sprint

- Created date: 2026-06-11
- Task type: feature
- Status: in-progress

## Problem Statement
AgentLoopKit main has useful unreleased 0.28.0 batch work, but the README, CI smoke coverage, artifact visibility, first-run guidance, and release-readiness evidence need one focused launch-quality pass before a future release.

## Desired Outcome
main contains a cleaner user-facing README, cross-platform smoke CI, a read-only artifact visibility command, improved generated onboarding guidance, and current 0.28.0 readiness docs, all verified without publishing or bumping the package version.

## Constraints
- Do not publish npm or create a GitHub release
- Do not bump package.json version
- Keep public docs user-facing and free of internal release chatter
- Use Vitest for automated behavior coverage
- Run projscan doctor during verification

## Non-Goals
- No Homebrew work
- No Scoop or WinGet manifests
- No VS Code extension implementation
- No SaaS, dashboard, telemetry, login, billing, or AI API

## Assumptions
- None recorded yet.

## Likely Files or Areas
- README.md
- docs/cli-reference.md
- .github/workflows/smoke.yml
- src/cli/commands
- src/core
- tests
- src/templates
- FINAL_HANDOFF.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- README explains AgentLoopKit clearly in 30 seconds and links deeper command reference docs
- Cross-platform smoke CI checks Ubuntu, macOS, and Windows CLI basics
- agentloop artifacts and agentloop artifacts --json show current local evidence without deleting or uploading anything
- Generated first-run guidance includes clearer next steps and current create-task risk examples
- 0.28.0 readiness docs are current without version bump or release

## Verification Commands
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 check:links
- npm run build
- npm run smoke:release
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- README is included on npm, so keep it user-facing
- New artifact command must not delete files or read outside repo-local evidence roots
- Cross-platform CI should stay lightweight and not publish artifacts

## Rollback Notes
Revert the sprint commits before the next 0.28.0 release if the docs or CLI changes confuse users

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
