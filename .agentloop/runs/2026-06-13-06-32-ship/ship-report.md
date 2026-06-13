# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-13-06-32`
- Review readiness score: `96`/100
- Task: `Treat ship runs as fresh handoff evidence` (`in-progress`) - `.agentloop/tasks/2026-06-13-treat-ship-runs-as-fresh-handoff-evidence.md`
- Verification: `pass` - `.agentloop/reports/2026-06-13-06-25-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-13-06-32-pr-summary.md`
- Gates: `warn`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `100`/100 (weight `15`) - `10 changed file(s).`
- `Verification evidence`: `100`/100 (weight `25`) - `Latest verification report passed.`
- `Evidence freshness`: `100`/100 (weight `15`) - `Verification evidence matches current task timing.`
- `Policy and gate compliance`: `70`/100 (weight `15`) - `Review gates passed with warnings.`
- `Handoff readiness`: `100`/100 (weight `10`) - `Reviewer handoff evidence exists.`
- `Risk flags`: `100`/100 (weight `5`) - `No risk-sensitive files detected.`

## Strengths

- Task contract has problem, outcome, acceptance criteria, verification commands, risk notes, and rollback notes.
- Verification evidence is passing.
- Reviewer handoff exists.

## Warnings

- Review gates have warnings.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`
- M `src/core/handoff-coverage.ts`
- M `tests/check-gates.test.ts`
- ?? `.agentloop/reports/2026-06-13-06-25-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-06-29-verify/`
- ?? `.agentloop/tasks/2026-06-13-treat-ship-runs-as-fresh-handoff-evidence.md`

## Diff Stat

```text
.agentloop/backlog.md        |  1 +
 .agentloop/dogfood-log.md    | 19 +++++++++++-
 CHANGELOG.md                 |  1 +
 docs/check-gates.md          |  2 +-
 docs/cli-reference.md        |  2 +-
 src/core/handoff-coverage.ts | 15 +++++++---
 tests/check-gates.test.ts    | 69 ++++++++++++++++++++++++++++++++++++++++++++
 7 files changed, 102 insertions(+), 7 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Treat ship runs as fresh handoff evidence`
- [`pass`] `Verification report`: `Overall status: pass`
- [`warn`] `Handoff summary`: `Latest handoff does not cover the current dirty files.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `11 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
