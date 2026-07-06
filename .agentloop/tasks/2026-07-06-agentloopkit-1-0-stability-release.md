# AgentLoopKit 1.0 stability release

- Created date: 2026-07-06
- Task type: feature
- Status: in-progress

## Problem Statement
The full AgentLoopKit command surface (~40 commands) is uncommitted 0.x, so teams cannot safely build CI pipelines or shared agent workflows on it without risking breakage on any release. Nothing is guaranteed stable and nothing enforces that guarantee.

## Desired Outcome
The documented surface is a committed, CI-enforced public contract with SemVer guarantees, a pre-freeze consistency audit, an experimental escape hatch for future features, and a guaranteed 0.x to 1.0 upgrade path. Reviewers can answer "will v1.x break my pipeline?" with a hard no.

## Constraints
- No new commands, no new integrations, no scope expansion beyond ROADMAP.md Non-Goals.
- Node engine floor stays `>=20`.
- Contract-lock snapshots are the enforcement mechanism; changing one is a deliberate versioned act.
- Dogfood the build through AgentLoopKit + ProjScan + AgentFlight at latest versions.

## Non-Goals
- No hosted SaaS, LLM wrapper, telemetry, database, or IDE replacement.
- No feature work sneaked into the stability release.

## Assumptions
- The existing `publicCommands` list in tests/cli-docs-drift.test.ts is the authoritative current surface.
- Vitest `toMatchSnapshot` is the contract-lock primitive.

## Likely Files or Areas
- src/core/stable-surface.ts (new), tests/contract/** (new), docs/stability.md + docs/versioning.md (new).
- package.json scripts (contract:check, version bump), README.md, ROADMAP.md, CHANGELOG.md.
- Command sources under src/cli/commands/ only as the consistency audit requires.

## Files or Areas Not to Touch
- Existing published release tarballs and release-proof docs for shipped versions.
- Unrelated command behavior outside audit findings.

## Acceptance Criteria
- Every stable command has a contract-lock test (CLI help, config schema, MCP tools, --json shape).
- `contract:check` is wired into release-flow and green.
- Consistency audit is written and triaged; zero open fix-before-1.0 findings in the stable tier.
- docs/stability.md and docs/versioning.md are published and drift-tested.
- upgrade-harness migrates every historical template version in a test matrix.
- Version is 1.0.0 with matching CHANGELOG and ROADMAP entries.

## Verification Commands
- npm run typecheck
- npm run lint
- npm test
- npm run build

## Post-Verification Gates
- npm run contract:check
- npm run dogfood:strict

## Implementation Plan
Follow docs/superpowers/plans/2026-07-06-agentloopkit-1.0-stability.md task-by-task (Tasks 1-11) under subagent-driven development, dogfooding each through the Baseframe suite loop.

## Risk Notes
- Freezing the newest surfaces (loop*, baseframe/*) too early: mitigate via the consistency audit's hardest review and the defer-to-experimental escape hatch.
- Public API commitment is a protected area; changes after 1.0 are breaking.

## Rollback Notes
The release is additive (new tests, new docs, new script, version bump). Revert by dropping the tests/contract directory, the contract:check script wiring, the new docs, and restoring the prior version in package.json. No runtime behavior is removed.

## Handoff Requirements
- Summarize files changed across the 11 tasks.
- Include verification commands and results plus contract:check and dogfood:strict output.
- State any defer-to-experimental reclassifications honestly.
- Include risks, rollback notes, and reviewer checklist.
