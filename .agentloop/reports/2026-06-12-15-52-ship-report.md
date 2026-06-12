# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-15-52`
- Review readiness score: `92`/100
- Task: `Add post-verification task gates` (`done`) - `.agentloop/tasks/2026-06-12-add-post-verification-task-gates.md`
- Verification: `pass` - `.agentloop/reports/2026-06-12-15-42-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-12-15-52-pr-summary.md`
- Gates: `warn`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `16 changed files is reviewable but not small.`
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

- Medium-sized change set; check scope carefully.
- Review gates have warnings.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/commands.md`
- M `DECISIONS.md`
- M `docs/cli-reference.md`
- M `docs/verification-reports.md`
- M `src/cli/commands/create-task.ts`
- M `src/core/task-contract.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/tasks/README.md`
- M `tests/create-task.test.ts`
- M `tests/task-contract.test.ts`
- M `tests/verification.test.ts`
- ?? `.agentloop/reports/2026-06-12-15-42-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-15-44-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-post-verification-task-gates.md`

## Diff Stat

```text
.agentloop/backlog.md             |  2 +-
 .agentloop/dogfood-log.md         | 25 ++++++++++++++++++++++++
 .agentloop/harness/commands.md    |  2 ++
 DECISIONS.md                      |  6 ++++++
 docs/cli-reference.md             | 11 +++++++++--
 docs/verification-reports.md      |  2 ++
 src/cli/commands/create-task.ts   | 15 ++++++++++++++
 src/core/task-contract.ts         |  7 +++++++
 src/templates/harness/commands.md |  2 +-
 src/templates/tasks/README.md     |  5 ++++-
 tests/create-task.test.ts         |  8 ++++++++
 tests/task-contract.test.ts       |  3 +++
 tests/verification.test.ts        | 41 +++++++++++++++++++++++++++++++++++++++
 13 files changed, 124 insertions(+), 5 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Add post-verification task gates`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`warn`] `Task hygiene`: ``Task folder has 1 hygiene diagnostic. Run `agentloop task doctor` for cleanup details.``
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `17 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
