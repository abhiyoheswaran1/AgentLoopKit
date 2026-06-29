# Loop: Dogfood autonomous loop scorecards guard fix

- Created date: 2026-06-28
- Task type: feature
- Status: done

## Problem Statement
The repo needs a controlled local loop for this goal: Dogfood autonomous loop scorecards guard fix

## Desired Outcome
AgentLoopKit records loop iterations, readiness gates, and context-budget evidence without executing a coding agent.

## Constraints
- Use compact context handles before broad reads.
- Keep external agent execution outside AgentLoopKit.
- Record token receipts for each loop iteration.
- Do not publish packages, create tags, push commits, or run destructive git operations from the loop runner.

## Non-Goals
- Do not auto-merge, auto-publish, or execute coding-agent commands.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- .agentloop/loops/2026-06-28-14-22-dogfood-autonomous-loop-scorecards-guard-fix/loop.json
- .agentloop
- src
- tests
- docs
- README.md
- CHANGELOG.md
- AGENTS.md
- AGENTLOOP.md
- DECISIONS.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Loop iterations record readiness and context-budget evidence.
- Loop stop conditions are visible before agent work continues.

## Verification Commands
- agentloop ready --strict

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Loop suggested commands are guidance only; AgentLoopKit does not run them.

## Rollback Notes
Delete .agentloop/loops/2026-06-28-14-22-dogfood-autonomous-loop-scorecards-guard-fix/loop.json and close this loop task if the loop is abandoned.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
