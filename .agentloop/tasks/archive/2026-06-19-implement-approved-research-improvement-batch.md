# Implement approved research improvement batch

- Created date: 2026-06-19
- Task type: refactor
- Status: done

## Problem Statement
The latest internal research pass identified five non-release improvements: break the core circular import, improve direct AgentFlight placeholder recovery, simplify first-task onboarding, document the intentional prepublishOnly lifecycle-script boundary, and add a real-repo trial checklist for policy packs and GitHub metadata.

## Desired Outcome
AgentLoopKit is easier for engineers to maintain and adopt without changing release channels or cutting a version.

## Constraints
- Implement items in the approved order and run a focused bug pass after each item.
- Keep changes small, local-first, deterministic, and tied to existing CLI/docs patterns.
- Do not bump versions, create tags, publish packages, alter release workflows, or work on deferred Marketplace/Scoop/WinGet tasks.

## Non-Goals
- No release, version cut, registry publication, Marketplace work, Scoop or WinGet implementation, SaaS, telemetry, or new dependency.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/artifacts.ts
- src/core/runs.ts
- src/core/task-state.ts
- src/core
- tests
- README.md
- docs
- .agentloop/backlog.md
- DECISIONS.md
- ROADMAP.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- ProjScan no longer reports the artifacts/runs/task-state circular import.
- Direct AgentFlight placeholder task recovery is clearer in CLI output, docs, or generated guidance, with focused regression coverage when behavior changes.
- New users have a tighter first useful loop path from init to reviewed work.
- The prepublishOnly lifecycle-script warning is handled with an explicit maintainability/trust rationale rather than ignored.
- Policy-pack and GitHub metadata real-repo trial guidance exists without claiming real user feedback or expanding scope.
- Each item has a focused bug pass immediately after implementation, and any bugs found are fixed before proceeding.

## Verification Commands
- npx --yes projscan coupling --cycles-only
- npm test -- tests/artifacts.test.ts tests/runs.test.ts tests/task-state.test.ts tests/status.test.ts
- npm run typecheck
- npm run lint
- npm run build

## Post-Verification Gates
- npm run dogfood
- npm run maintenance:check
- npx --no-install agentloop ship --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Touches shared core modules used by status, artifacts, task state, and run ledger; preserve JSON shapes and CLI compatibility.
- Docs must not present simulated research as real feedback or make unsupported release-channel claims.

## Rollback Notes
Revert this task's source, test, docs, and AgentLoop evidence commits; no release artifacts or external systems are changed.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
