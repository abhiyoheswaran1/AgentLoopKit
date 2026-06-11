# Run extended 0.28.0 launch-hardening queue

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement

AgentLoopKit needs a deeper release-quality pass after the first 0.28.0 sprint so the future release has stronger command coverage, release checks, doctor guidance, action ergonomics, examples, and docs.

## Desired Outcome

main contains release-check, artifact inventory improvements, doctor guidance, docs drift tests, GitHub Action hardening, examples, and release-readiness evidence without a version bump or publish.

## Constraints

- Do not bump package.json version
- Do not publish npm, create GitHub releases, publish GHCR, or publish MCP Registry metadata
- Keep new commands read-only unless explicitly documented and requested
- Use Vitest for behavior coverage and TDD for production behavior changes

## Non-Goals

- No Homebrew, Scoop, WinGet, VS Code extension implementation, SaaS, dashboard, telemetry, login, billing, AI API, or cloud backend

## Assumptions

- None recorded yet.

## Likely Files or Areas

- None recorded yet.

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- agentloop release-check and --json provide deterministic pre-release readiness output without publishing
- agentloop artifacts supports useful filtering or recent evidence output while staying read-only and repo-local
- doctor output includes actionable next-step guidance for warnings
- CLI/help/docs drift tests catch missing command coverage
- GitHub Action has safer workflow ergonomics and tests
- At least one end-to-end example walkthrough documents init through gates and artifacts

## Verification Commands

- npm test
- npm run lint
- npm run typecheck
- npm run check:links
- npm run build
- npm run smoke:release
- node scripts/smoke-cli.mjs
- node dist/cli/index.js release-check --json
- node dist/cli/index.js artifacts --json
- npx --yes projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Touches release workflow, CI, CLI JSON contracts, and public documentation

## Rollback Notes

Revert the focused commits before preparing 0.28.0

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
