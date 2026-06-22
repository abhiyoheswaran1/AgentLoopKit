# Fix doctor monorepo subpackage detection

- Created date: 2026-06-21
- Task type: bugfix
- Status: done

## Problem Statement
AgentLoopKit doctor can report Monorepo: not detected when a repository has nested packages such as apps/web, functions, or firestore-tests with their own package.json files but lacks common root workspace marker files.

## Desired Outcome
doctor detects bounded nested package.json layouts as monorepo evidence and gives package-specific verification guidance without assuming a single root project.

## Constraints
- Do not release, tag, bump versions, publish packages, or change release workflows.
- Keep detection bounded and avoid broad scans of dependency or build output directories.

## Non-Goals
- Do not change AgentFlight warning behavior in this repo.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/doctor.ts
- tests/doctor.test.ts
- docs/cli-reference.md
- README.md

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- .github/workflows/publish.yml

## Acceptance Criteria
- doctor reports monorepo detected when nested package.json files exist under common app/function/test package folders.
- doctor output lists nested package.json markers with bounded examples.
- doctor guidance continues to warn that AgentLoopKit does not run workspace commands automatically.

## Verification Commands
- npm test -- tests/doctor.test.ts
- npm run lint
- npm run typecheck
- npm run build
- git diff --check

## Post-Verification Gates
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor
- npx --yes agentflight status

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Nested package detection touches doctor output and may affect onboarding guidance for non-monorepos.
- Pre-existing dirty non-evidence files before task creation: 32 total; examples: `DECISIONS.md`, `README.md`, `ROADMAP.md`, `docs/cli-reference.md`, `src/cli/index.ts`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert doctor detector/test/docs changes if nested package detection becomes noisy.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
