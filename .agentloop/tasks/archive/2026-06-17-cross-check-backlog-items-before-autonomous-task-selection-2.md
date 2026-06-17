# Cross-check backlog items before autonomous task selection

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
Backlog rows can remain marked do now after the work has been completed and archived, causing autonomous agents to waste time reselecting finished roadmap items.

## Desired Outcome
Autonomous dogfood guidance tells agents to check task archives and implementation evidence before turning backlog rows into new task contracts.

## Constraints
- Keep this as internal dogfood guidance and tests; do not create public claims about real user feedback.
- Preserve existing task lifecycle, backlog content, AgentFlight behavior, and ProjScan configuration.
- Keep release-channel work deferred; do not publish, tag, bump versions, or edit release workflows.

## Non-Goals
- Do not implement a backlog parser or new AgentLoopKit command.
- Do not rewrite or prune the historical backlog.
- Do not archive AgentFlight placeholder contracts or generated evidence.
- Do not change package metadata, dependencies, CI workflows, or public release docs.

## Assumptions
- Internal backlog rows can lag behind archived task contracts.
- Agents can cheaply cross-check backlog items with `agentloop task list`, `.agentloop/tasks/archive/`, and implementation evidence before creating a duplicate task.

## Likely Files or Areas
- `.agentloop/harness/autonomous-dogfooding.md`
- `tests/autonomous-dogfood.test.ts`
- `.agentloop/tasks/2026-06-17-cross-check-backlog-items-before-autonomous-task-selection-2.md`

## Files or Areas Not to Touch
- `package.json`
- `package-lock.json`
- `.github/workflows/`
- `ROADMAP.md`
- `docs/distribution-channels.md`
- release, Marketplace, GHCR, MCP Registry, npm, Scoop, or WinGet docs and workflows

## Acceptance Criteria
- Autonomous dogfood guidance says backlog rows are decision support, not proof that work is still open.
- Guidance tells agents to cross-check matching task archives and implementation evidence before creating a task from a backlog row.
- Guidance says completed/archived matching work should be treated as shipped local context, not re-opened by default.
- A regression test locks the guidance so future dogfood edits keep the archive/implementation cross-check.

## Verification Commands
- npm test -- tests/autonomous-dogfood.test.ts

## Post-Verification Gates
- npx --yes agentflight verify -- npm test -- tests/autonomous-dogfood.test.ts
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Low runtime risk; this changes internal guidance and test coverage only.
- Main risk is over-prescribing agent behavior; keep wording pragmatic and scoped to backlog-derived task selection.

## Rollback Notes
Revert the autonomous dogfood guidance paragraph, the regression test, and this task contract update.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
