# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-13-04-37`
- Review readiness score: `95`/100
- Task: `Broaden post-verification gate detection` (`proposed`) - `.agentloop/tasks/2026-06-13-broaden-post-verification-gate-detection.md`
- Verification: `pass` - `.agentloop/reports/2026-06-13-04-30-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-13-04-37-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `90`/100 (weight `15`) - `90/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `15 changed files is reviewable but not small.`
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
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/task-contracts.md`
- M `docs/verification-reports.md`
- M `src/core/post-verification-gates.ts`
- M `src/templates/tasks/README.md`
- M `tests/create-task.test.ts`
- M `tests/task-state.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-04-37-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-04-30-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-04-32-verify/`
- ?? `.agentloop/runs/2026-06-13-04-37-handoff/`
- ?? `.agentloop/tasks/2026-06-13-broaden-post-verification-gate-detection.md`

## Diff Stat

```text
.agentloop/backlog.md               |  1 +
 .agentloop/dogfood-log.md           | 19 +++++++++++++++++++
 CHANGELOG.md                        |  1 +
 docs/cli-reference.md               |  2 +-
 docs/task-contracts.md              |  2 +-
 docs/verification-reports.md        |  2 +-
 src/core/post-verification-gates.ts | 20 ++++++++++++++++++++
 src/templates/tasks/README.md       |  2 +-
 tests/create-task.test.ts           | 20 ++++++++++++++++----
 tests/task-state.test.ts            |  8 ++++++++
 10 files changed, 69 insertions(+), 8 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Broaden post-verification gate detection`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `15 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
