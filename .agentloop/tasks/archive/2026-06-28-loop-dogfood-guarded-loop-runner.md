# Loop: Dogfood guarded loop runner

- Created date: 2026-06-28
- Task type: feature
- Status: done

## Problem Statement
The repo needs a controlled local loop for this goal: Dogfood guarded loop runner

## Desired Outcome
AgentLoopKit records runner execution, loop iterations, readiness gates, and context-budget evidence while keeping the external runner bounded by local guardrails.

## Constraints
- Use compact context handles before broad reads.
- Run only the configured loop runner: npm run check:public-docs
- Record token receipts for each loop iteration.
- Do not publish packages, create tags, push commits, or run destructive git operations from the loop runner.

## Non-Goals
- Do not auto-merge, auto-publish, or execute any runner command other than the configured command.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- .agentloop/loops/2026-06-28-10-21-dogfood-guarded-loop-runner/loop.json
- .agentloop
- src
- tests
- docs

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Loop iterations record readiness and context-budget evidence.
- Loop stop conditions are visible before agent work continues.
- Configured runner output, exit code, and changed files are recorded per run.

## Verification Commands
- agentloop ready --strict

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Loop runner execution is opt-in, exact-command matched, non-shell, timeout bounded, and protected command families are blocked.

## Rollback Notes
Delete .agentloop/loops/2026-06-28-10-21-dogfood-guarded-loop-runner/loop.json and close this loop task if the loop is abandoned.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
