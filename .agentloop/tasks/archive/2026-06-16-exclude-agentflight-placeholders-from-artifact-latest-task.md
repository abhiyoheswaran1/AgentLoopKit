# Exclude AgentFlight placeholders from artifact latest task

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
agentloop artifacts --json separates AgentFlight placeholders into agentFlightPlaceholders but still reports an AgentFlight placeholder as tasks.latest, which makes ordinary task inventory look like placeholder work is the latest roadmap task.

## Desired Outcome
Artifact inventory task.latest is selected from ordinary task contracts only, while AgentFlight placeholders remain counted and reported under agentFlightPlaceholders.

## Constraints
- Do not delete, archive, mutate, or hide AgentFlight placeholder task files.
- Do not change task list, status, next, review-context, or fallback task selection behavior.
- Keep existing agentFlightPlaceholders JSON shape and human placeholder output intact.
- No release, version bump, tag, publish, registry calls, token reads, or network behavior.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/artifacts.ts
- tests/artifacts.test.ts
- docs/cli-reference.md
- docs/status.md

## Files or Areas Not to Touch
- package.json
- package-lock.json
- pnpm-lock.yaml

## Acceptance Criteria
- artifacts --json reports tasks.latest as the newest ordinary task when ordinary tasks and newer AgentFlight placeholders coexist.
- artifacts --json reports tasks.latest as null when only AgentFlight placeholders exist.
- agentFlightPlaceholders.count and agentFlightPlaceholders.latest still report preserved placeholders.
- Human artifacts output does not list a placeholder as the latest ordinary task.

## Verification Commands
- npm test -- tests/artifacts.test.ts
- npm run typecheck
- npm run lint
- npm test

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert artifact task latest selection, tests, and docs if scripts relied on placeholders appearing as ordinary latest tasks.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
