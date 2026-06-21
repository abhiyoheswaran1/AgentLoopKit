# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-20-22-38`
- Review readiness score: `100`/100
- Task: `Warn when created tasks keep review placeholders` (`in-progress`) - `.agentloop/tasks/2026-06-20-warn-when-created-tasks-keep-review-placeholders.md`
- Verification: `pass` - `.agentloop/reports/2026-06-20-22-32-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-20-22-38-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `100`/100 (weight `15`) - `9 non-evidence changed file(s); 6 AgentLoop evidence file(s) also present (15 total).`
- `Verification evidence`: `100`/100 (weight `25`) - `Latest verification report passed.`
- `Evidence freshness`: `100`/100 (weight `15`) - `Verification evidence matches current task timing.`
- `Policy and gate compliance`: `100`/100 (weight `15`) - `Review gates passed.`
- `Handoff readiness`: `100`/100 (weight `10`) - `Reviewer handoff evidence exists.`
- `Risk flags`: `100`/100 (weight `5`) - `No risk-sensitive files detected.`

## Strengths

- Task contract has problem, outcome, acceptance criteria, verification commands, risk notes, and rollback notes.
- Verification evidence is passing.
- Review gates pass.
- Reviewer handoff exists.

## Warnings

- No warnings recorded.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `docs/task-contracts.md`
- M `src/cli/commands/create-task.ts`
- M `src/core/task-contract.ts`
- M `src/core/task-state.ts`
- M `tests/create-task.test.ts`
- ?? `.agentloop/research/interview-cycle-153.md`
- AgentLoop evidence: `6` file(s) grouped under `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
.agentloop/backlog.md           |   6 ++
 CHANGELOG.md                    |   2 +-
 DECISIONS.md                    |   6 ++
 docs/task-contracts.md          |   1 +
 src/cli/commands/create-task.ts |  61 +++++++++++++---
 src/core/task-contract.ts       |  80 +++++++++++++++++++--
 src/core/task-state.ts          |  62 +----------------
 tests/create-task.test.ts       | 151 ++++++++++++++++++++++++++++++++++++++++
 8 files changed, 291 insertions(+), 78 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Warn when created tasks keep review placeholders`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `16 changed file(s) detected (9 non-evidence, 7 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
