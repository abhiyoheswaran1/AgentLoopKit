# Build AgentLoop Guard live drift detection and context budget control

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit can explain work after the fact, but maintainers need a live local guard that catches scope drift, risky files, stale verification, proof debt, and wasteful context before review.

## Desired Outcome
Users can run agentloop guard as a one-shot or bounded watch command to classify current work, fail strict gates when local evidence is unsafe, explicitly write guard reports or baselines, and see context-budget guidance without hidden mutation or release work.

## Constraints
- Do not release, tag, bump versions, publish packages, or alter registry workflows.
- Keep Guard local-first, deterministic, and read-only by default; writes must be explicit.
- Avoid proxy-level prompt rewriting or opaque compression in this phase; prefer repo-aware context selection and evidence-backed token budget guidance.

## Non-Goals
- No npm, GitHub Release, GHCR, MCP Registry, Marketplace, package version, or lockfile changes.
- No transparent interception of agent prompts or provider traffic.

## Assumptions
- Existing dirty Evidence Map changes belong to the unreleased product direction and should be preserved.

## Likely Files or Areas
- src/core
- src/cli/index.ts
- src/cli/commands
- tests
- docs
- README.md
- DECISIONS.md
- ROADMAP.md
- .agentloop/product-panel.md
- .agentloop/user-personas.md
- .agentloop/backlog.md

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- .github/workflows/publish.yml
- .github/workflows/release.yml
- CHANGELOG.md

## Acceptance Criteria
- agentloop guard prints a one-shot local guard summary derived from the evidence map.
- agentloop guard --strict exits non-zero for blocked or needs-attention guard states and zero for pass states.
- agentloop guard --watch supports bounded iterations for tests and does not run indefinitely when --max-iterations is provided.
- agentloop guard can explicitly write a local report and baseline without hidden writes.
- Guard output includes context-budget findings that help users send smaller, better-scoped continuation and review context.
- Docs describe Guard and context-budget control as local engineering controls, not an AI coding assistant or hosted monitor.

## Verification Commands
- npm test -- tests/guard.test.ts
- npm run lint
- npm run typecheck
- npm run build
- npm run check:public-docs
- npm run check:links
- git diff --check

## Post-Verification Gates
- npm run maintenance:check
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor
- npx --yes agentflight status

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Guard reads git state, task contracts, verification reports, and optional baseline files; path handling must stay bounded to the repository.
- Watch mode can become noisy or expensive if it scans too broadly; keep it evidence-map based and bounded in tests.
- Token-budget claims must be estimates and must not promise real billing savings without measurement.
- Pre-existing dirty non-evidence files before task creation: 21 total; examples: `DECISIONS.md`, `README.md`, `ROADMAP.md`, `docs/cli-reference.md`, `src/cli/index.ts`. Confirm they belong to this task before implementation.

## Rollback Notes
Remove guard command registration, src/core guard module, guard tests, and docs if the feature needs to be backed out.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
