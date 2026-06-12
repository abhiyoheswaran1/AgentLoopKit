# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-13-51`
- Review readiness score: `92`/100
- Task: `Accept archived task evidence in gates` (`in-progress`) - `.agentloop/tasks/2026-06-12-accept-archived-task-evidence-in-gates.md`
- Verification: `pass` - `.agentloop/reports/2026-06-12-13-48-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-12-13-51-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `27 changed files is broad for one review.`
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

- Large change set; consider splitting before review.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `README.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`
- M `docs/status.md`
- M `docs/task-contracts.md`
- M `src/cli/commands/task.ts`
- M `src/core/check-gates.ts`
- M `src/core/task-state.ts`
- M `tests/check-gates.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-13-33-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-12-13-34-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-13-30-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-13-33-ship-report.md`
- ?? `.agentloop/reports/2026-06-12-13-46-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-13-48-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-13-31-verify/`
- ?? `.agentloop/runs/2026-06-12-13-33-ship/`
- ?? `.agentloop/runs/2026-06-12-13-48-verify/`
- ?? `.agentloop/runs/2026-06-12-13-51-verify/`
- ?? `.agentloop/tasks/2026-06-12-accept-archived-task-evidence-in-gates.md`
- ?? `.agentloop/tasks/archive/2026-06-12-add-bulk-task-archive-mode.md`
- ?? `tests/task-archive.test.ts`

## Diff Stat

```text
.agentloop/backlog.md          |   6 +++
 .agentloop/dogfood-log.md      |  55 ++++++++++++++++++++
 .agentloop/harness/commands.md |   1 +
 AGENTLOOP.md                   |   2 +-
 AGENTS.md                      |   1 +
 README.md                      |   7 +++
 docs/check-gates.md            |   2 +
 docs/cli-reference.md          |   4 +-
 docs/status.md                 |   4 +-
 docs/task-contracts.md         |   4 +-
 src/cli/commands/task.ts       | 113 +++++++++++++++++++++++++++++++++++++++--
 src/core/check-gates.ts        |  53 ++++++++++++++++---
 src/core/task-state.ts         |  76 +++++++++++++++++++++++++++
 tests/check-gates.test.ts      |  56 +++++++++++++++++++-
 14 files changed, 368 insertions(+), 16 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Accept archived task evidence in gates`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `28 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
