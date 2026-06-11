# Build local acceptance layer commands

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit has strong setup, task, verification, gate, and handoff primitives, but users still have to manually stitch them together before a PR. The product should feel like a local acceptance layer that tells users whether agent-generated code is reviewable, verifiable, and merge-ready.

## Desired Outcome
Add agentloop ship, review readiness scoring, prepare-pr output, GitHub-comment Markdown mode, a local run ledger, intent lookup, and maintainer-check where feasible. Keep everything deterministic, local-first, npm-ready, and non-destructive.

## Constraints
- Do not add cloud backend, login, telemetry, SaaS dashboard, desktop app, AI API calls, postinstall scripts, or destructive automation.
- Use deterministic evidence-based scoring and do not claim to measure code quality.
- Use TDD for each command or scoring behavior.
- Do not version bump, publish, or create a GitHub release in this batch.
- Keep commands useful in existing repos and safe around env files and paths.

## Non-Goals
- No Homebrew, MCP Registry, VS Code extension, hosted dashboard, or paid/team layer.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core
- src/cli/commands
- tests
- docs/cli-reference.md
- README.md
- examples

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop ship produces a deterministic review-readiness report with total score, dimensions, strengths, warnings, blockers, and next actions.
- agentloop ship writes a Markdown report under .agentloop/reports/ and supports JSON output.
- Review readiness score is 0-100, explainable, evidence-based, and explicitly not a code quality score.
- agentloop prepare-pr generates a PR title and body from active task, git changes, verification evidence, readiness report, gates, risks, and rollback notes.
- prepare-pr or ship can output GitHub Action-friendly PR comment Markdown without requiring a GitHub token inside the CLI.
- A local run ledger under .agentloop/runs/ records meaningful ship evidence if feasible.
- runs, show-run, intent, and maintainer-check are implemented if feasible within the product boundary.
- README, CLI reference, examples, final handoff, changelog, decisions, backlog, and dogfood log are updated for implemented behavior.

## Verification Commands
- npm test -- tests/readiness-score.test.ts tests/ship.test.ts tests/prepare-pr.test.ts tests/runs.test.ts tests/maintainer-check.test.ts
- git diff --check
- npm run lint
- npm run typecheck
- npm run check:links
- npx --yes projscan doctor --format markdown
- npx pnpm@10.12.1 audit --prod
- npm test
- npm run build
- node scripts/smoke-cli.mjs
- npm run smoke:release

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- This can sprawl into project management. Keep the core flow local, deterministic, evidence-based, and review-focused.

## Rollback Notes
Revert the new command modules, tests, docs, and ledger templates while keeping earlier AgentLoopKit primitives intact.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
