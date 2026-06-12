# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-19-23`
- Review readiness score: `96`/100
- Task: `Add config verification command suggestions` (`done`) - `.agentloop/tasks/archive/2026-06-12-add-config-verification-command-suggestions.md`
- Verification: `pass` - `.agentloop/reports/2026-06-12-19-17-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-12-19-23-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `13 changed files is reviewable but not small.`
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
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/task-contracts.md`
- M `src/cli/commands/create-task.ts`
- M `src/core/verification.ts`
- M `tests/create-task.test.ts`
- M `tests/verification.test.ts`
- ?? `.agentloop/reports/2026-06-12-19-17-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-19-20-verify/`
- ?? `.agentloop/tasks/archive/2026-06-12-add-config-verification-command-suggestions.md`

## Diff Stat

```text
.agentloop/backlog.md           |  1 +
 .agentloop/dogfood-log.md       | 29 +++++++++++++++++++
 CHANGELOG.md                    |  2 ++
 README.md                       |  4 ++-
 docs/cli-reference.md           |  5 ++++
 docs/task-contracts.md          |  3 ++
 src/cli/commands/create-task.ts | 37 +++++++++++++++++++++++-
 src/core/verification.ts        | 14 ++++++++-
 tests/create-task.test.ts       | 58 +++++++++++++++++++++++++++++++++++++
 tests/verification.test.ts      | 63 +++++++++++++++++++++++++++++++++++++++++
 10 files changed, 213 insertions(+), 3 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Add config verification command suggestions`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `14 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
