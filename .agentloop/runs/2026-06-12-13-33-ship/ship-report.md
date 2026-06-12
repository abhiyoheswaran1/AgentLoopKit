# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-13-33`
- Review readiness score: `96`/100
- Task: `Add bulk task archive mode` (`in-progress`) - `.agentloop/tasks/2026-06-12-add-bulk-task-archive-mode.md`
- Verification: `pass` - `.agentloop/reports/2026-06-12-13-30-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-12-13-34-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
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
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/status.md`
- M `docs/task-contracts.md`
- M `src/cli/commands/task.ts`
- M `src/core/task-state.ts`
- ?? `.agentloop/reports/2026-06-12-13-30-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-13-31-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-bulk-task-archive-mode.md`
- ?? `tests/task-archive.test.ts`

## Diff Stat

```text
.agentloop/backlog.md          |   4 ++
 .agentloop/dogfood-log.md      |  31 +++++++++++
 .agentloop/harness/commands.md |   1 +
 AGENTLOOP.md                   |   2 +-
 AGENTS.md                      |   1 +
 README.md                      |   7 +++
 docs/cli-reference.md          |   4 +-
 docs/status.md                 |   4 +-
 docs/task-contracts.md         |   4 +-
 src/cli/commands/task.ts       | 113 +++++++++++++++++++++++++++++++++++++++--
 src/core/task-state.ts         |  76 +++++++++++++++++++++++++++
 11 files changed, 239 insertions(+), 8 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Add bulk task archive mode`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `16 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
