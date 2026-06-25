# Align Guard with missing task preflight

- Created date: 2026-06-24
- Task type: bugfix
- Status: done

## Problem Statement
When no active task is pinned, agentloop start reports needs-task but agentloop guard can still report pass/reviewable/fresh from previous evidence. That gives agents conflicting preflight guidance.

## Desired Outcome
Guard should treat missing active task scope as a blocking finding unless it is explicitly operating on a task-backed evidence context, matching Start's missing-task preflight behavior.

## Constraints
- Keep the change scoped to Guard/evidence-map task-state handling and focused tests.
- Do not weaken Guard's existing pass behavior when an active task and fresh verification evidence exist.

## Non-Goals
- Do not change release behavior, package version, or public publishing docs.
- Do not redesign Start output.

## Assumptions
- A missing active task should block implementation-oriented guard checks even when older verification and ship evidence exist.

## Likely Files or Areas
- src/core/guard.ts
- src/core/evidence-map.ts
- tests/guard.test.ts
- tests/agent-start.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- With no active task and previous verification evidence, agentloop guard reports a missing-task blocker instead of pass/reviewable.
- With an active task and fresh verification evidence, Guard still reports pass/reviewable.
- Focused Guard/Start tests, typecheck, build, dogfood, lint, ship, prepare-pr, and gates pass.

## Verification Commands
- npm run test:unit -- tests/guard.test.ts tests/agent-start.test.ts
- npm run typecheck
- npm run build
- npm run dogfood
- npm run lint

## Post-Verification Gates
- node dist/cli/index.js verify --task .agentloop/tasks/2026-06-24-align-guard-with-missing-task-preflight.md --task-commands --only-task-commands --progress --write-run --redact-paths
- node dist/cli/index.js ship --redact-paths
- node dist/cli/index.js prepare-pr --redact-paths
- node dist/cli/index.js check-gates --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Guard is a preflight gate for agents; false pass states can cause work to continue without task scope.
- Pre-existing dirty non-evidence files before task creation: 68 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert Guard missing-task finding changes and focused tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
