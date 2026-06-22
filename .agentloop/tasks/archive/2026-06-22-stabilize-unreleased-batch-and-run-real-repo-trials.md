# Stabilize unreleased batch and run real repo trials

- Created date: 2026-06-22
- Task type: tests
- Status: done

## Problem Statement
Unreleased Evidence Map, resume-pack, Guard, context-budget, research-task, and doctor monorepo improvements need full stabilization, docs drift review, real-repo trials, and demo-ready README assets before any maintainer-approved release prep.

## Desired Outcome
The complete dirty unreleased batch has fresh maintenance, dogfood, ProjScan, AgentFlight, and real-repo trial evidence; small discovered issues are fixed with tests first; README and related docs showcase the real CLI value with demo visuals sourced from local output.

## Constraints
- Do not bump package versions, create tags, publish packages, publish releases, or touch release workflows.
- Keep fixes small and evidence-driven; avoid new dependencies unless absolutely necessary and justified.
- Treat visual README assets as truthful product evidence from local CLI output, not fake user feedback or external adoption proof.

## Non-Goals
- Do not implement the future explicit context command in this task.
- Do not change deferred release-channel tasks such as GitHub Marketplace, Scoop, or WinGet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- README.md
- docs/cli-reference.md
- docs/guard.md
- docs/evidence-map.md
- docs/research.md
- docs/superpowers/specs
- docs/superpowers/plans
- src
- tests
- scripts
- assets
- .agentloop/research
- .agentloop/reports
- .agentloop/runs
- .agentloop/handoffs

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- .github/workflows/publish.yml

## Acceptance Criteria
- Full maintenance and strict dogfood evidence is fresh against the complete dirty set.
- Real-repo trials cover monorepo, app repo, and library repo shapes with doctor, guard, resume-pack, review-context, and explain-diff.
- Any friction discovered in trials is either fixed with red-green tests or recorded as a bounded follow-up.
- README uses a demo GIF or committed visual fallback plus a token/context-budget screenshot or SVG sourced from real local CLI output.
- Public docs do not market AgentLoopKit as an AI coding assistant and do not present simulated persona work as real user feedback.

## Verification Commands
- npm run maintenance:check
- npm test -- tests/doctor.test.ts tests/project-detection.test.ts tests/guard.test.ts tests/resume-pack.test.ts tests/review-context.test.ts tests/evidence-map.test.ts tests/cli-explain-diff.test.ts tests/cli-docs-drift.test.ts
- npm run lint
- npm run typecheck
- npm run build
- git diff --check

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor
- npx --yes agentflight status

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Pre-existing dirty non-evidence files before task creation: 35 total; examples: `DECISIONS.md`, `README.md`, `ROADMAP.md`, `docs/cli-reference.md`, `src/cli/index.ts`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert only stabilization fixes, trial notes, and README visual assets introduced by this task. If a trial exposes a risky issue that cannot be fixed narrowly, leave the current unreleased feature code intact and record a follow-up instead of widening this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
