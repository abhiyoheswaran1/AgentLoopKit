# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-16-28`
- Review readiness score: `95`/100
- Task: `Fix prepare-pr archived task evidence` (`done`) - `.agentloop/tasks/archive/2026-06-12-fix-prepare-pr-archived-task-evidence.md`
- Verification: `pass` - `.agentloop/reports/2026-06-12-16-24-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-12-16-28-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `90`/100 (weight `15`) - `90/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `17 changed files is reviewable but not small.`
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

- Medium-sized change set; check scope carefully.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `DECISIONS.md`
- M `src/core/prepare-pr.ts`
- M `src/core/ship.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/ship.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-16-26-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-12-16-26-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-16-08-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-16-24-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-16-26-ship-report.md`
- ?? `.agentloop/runs/2026-06-12-16-11-verify/`
- ?? `.agentloop/runs/2026-06-12-16-25-verify/`
- ?? `.agentloop/runs/2026-06-12-16-26-ship/`
- ?? `.agentloop/tasks/archive/2026-06-12-fix-prepare-pr-archived-task-evidence.md`
- ?? `.agentloop/tasks/archive/2026-06-12-fix-ship-archived-task-scoring.md`

## Diff Stat

```text
.agentloop/backlog.md     |  3 ++-
 .agentloop/dogfood-log.md | 36 ++++++++++++++++++++++++++++++++
 DECISIONS.md              | 12 +++++++++++
 src/core/prepare-pr.ts    |  6 +++---
 src/core/ship.ts          |  4 ++--
 tests/prepare-pr.test.ts  | 38 +++++++++++++++++++++++++++++++++-
 tests/ship.test.ts        | 52 ++++++++++++++++++++++++++++++++++++++++++++++-
 7 files changed, 143 insertions(+), 8 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Fix prepare-pr archived task evidence`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `18 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
