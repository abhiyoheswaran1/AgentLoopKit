# Run parallel unreleased-batch bug hunt

- Created date: 2026-06-24
- Task type: security-review
- Status: done

## Problem Statement
The unreleased batch is broad and touches Start, Context, Guard, Doctor, MCP, run-ledger, docs, and tests. Before more product work, run focused parallel review passes to catch bugs, security risks, performance regressions, and public-doc claim drift.

## Desired Outcome
Independent reviewers identify concrete issues in the unreleased batch; any valid important issues are fixed with tests and evidence before the task is closed.

## Constraints
- Do not release, tag, publish, or bump versions.
- Keep reviewers scoped to disjoint concerns and do not let them mutate files unless assigned a bounded fix.
- Treat simulated research/personas as internal decision support only, not public evidence.

## Non-Goals
- Do not refactor unrelated code or clean all existing AgentLoop evidence churn.
- Do not change release-channel tasks parked for maintainer approval.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core
- src/cli/commands
- src/mcp
- tests
- README.md
- docs

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Parallel review agents inspect CLI behavior, security/trust boundaries, performance/context-size behavior, and public docs/claims.
- Each valid important finding is either fixed with focused tests or explicitly documented as a lower-priority follow-up.
- Final verification includes focused tests for any fixes plus typecheck, build, lint, dogfood, ship, prepare-pr, and check-gates.

## Verification Commands
- npm run test:unit -- tests/doctor.test.ts tests/guard.test.ts tests/context-contract.test.ts tests/mcp-tools.test.ts tests/runs.test.ts
- npm run typecheck
- npm run build
- npm run dogfood
- npm run lint

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Parallel agents may report broad or speculative concerns; only fix concrete, reproducible issues.
- The worktree has a broad unreleased batch; preserve unrelated user work and existing task evidence.
- Pre-existing dirty non-evidence files before task creation: 73 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert only any focused fixes made during the bug-hunt task; keep prior unreleased batch intact.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
