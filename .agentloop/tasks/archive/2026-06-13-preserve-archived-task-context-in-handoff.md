# Preserve archived task context in handoff

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
After a task is archived, running agentloop handoff without --task can lose the completed task context and generate a handoff that says No task contract found.

## Desired Outcome
handoff reuses recent completed task context from local AgentLoop evidence when no active task exists, while explicit --task continues to take precedence.

## Constraints
- Keep fallback local and deterministic.
- Do not invent task context when no recent evidence references a task.

## Non-Goals
- Do not change task archive semantics.
- Do not add release automation or version changes.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/pr-summary.ts
- tests/handoff.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Plain handoff after archiving the completed task still includes that task title when latest evidence references the archived task.
- Plain handoff still says no task contract found when no task evidence exists.
- Explicit --task continues to override fallback task context.

## Verification Commands
- npm test -- tests/handoff.test.ts
- npm run typecheck
- npm run build
- git diff --check

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Over-eager fallback could attach an unrelated old task to a new handoff.

## Rollback Notes
Revert the handoff fallback and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
