# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-16-03-59`
- Review readiness score: `96`/100
- Task: `Make create-task output Markdown-safe` (`in-progress`) - `.agentloop/tasks/2026-06-16-make-create-task-output-markdown-safe.md`
- Verification: `pass` - `.agentloop/reports/2026-06-16-03-56-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-16-03-59-pr-summary.md`
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
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `src/cli/commands/create-task.ts`
- M `tests/create-task.test.ts`
- ?? `.agentloop/reports/2026-06-16-03-56-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-03-58-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-03-58-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-03-58-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-make-create-task-output-markdown-safe.md`

## Diff Stat

```text
.agentloop/backlog.md           |  6 +++
 CHANGELOG.md                    |  1 +
 docs/cli-reference.md           |  2 +
 src/cli/commands/create-task.ts |  2 +-
 tests/create-task.test.ts       | 98 ++++++++++++++++++++++++++++++++++++++++-
 5 files changed, 107 insertions(+), 2 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Make create-task output Markdown-safe`
- [`pass`] `Verification report`: `Overall status: pass`
- [`warn`] `Handoff summary`: `Latest handoff does not cover the current dirty files.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `16 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
