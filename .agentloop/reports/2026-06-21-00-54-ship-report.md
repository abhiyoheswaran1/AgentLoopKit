# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-21-00-54`
- Review readiness score: `92`/100
- Task: `Align generated task guidance with create-task warnings` (`in-progress`) - `.agentloop/tasks/2026-06-21-align-generated-task-guidance-with-create-task-warnings.md`
- Verification: `pass` - `.agentloop/reports/2026-06-21-00-50-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-21-00-54-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `32 non-evidence changed files is broad for one review; 102 AgentLoop evidence file(s) also present (134 total).`
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

- Large non-evidence change set; consider splitting before review.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/tasks/README.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/html-reports.md`
- M `docs/pr-summaries.md`
- M `docs/status.md`
- M `docs/task-contracts.md`
- M `src/cli/commands/create-task.ts`
- M `src/core/git.ts`
- M `src/core/html-report.ts`
- M `src/core/pr-summary.ts`
- M `src/core/ship.ts`
- M `src/core/status.ts`
- M `src/core/task-contract.ts`
- M `src/core/task-state.ts`
- M `src/templates/tasks/README.md`
- M `tests/create-task.test.ts`
- M `tests/html-report.test.ts`
- M `tests/init.test.ts`
- M `tests/next.test.ts`
- M `tests/pr-summary.test.ts`
- M `tests/ship.test.ts`
- M `tests/status.test.ts`
- ?? `.agentloop/research/interview-cycle-153.md`
- ?? `.agentloop/research/interview-cycle-154.md`
- ?? `.agentloop/research/interview-cycle-155.md`
- ?? `.agentloop/research/interview-cycle-156.md`
- ?? `.agentloop/research/interview-cycle-157.md`
- ?? `.agentloop/research/interview-cycle-158.md`
- AgentLoop evidence: `102` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
.agentloop/backlog.md           |  31 ++++
 .agentloop/tasks/README.md      |   6 +-
 CHANGELOG.md                    |   7 +-
 DECISIONS.md                    |  36 +++++
 README.md                       |   2 +
 docs/cli-reference.md           |  12 +-
 docs/html-reports.md            |   2 +
 docs/pr-summaries.md            |   2 +
 docs/status.md                  |   1 +
 docs/task-contracts.md          |   4 +
 src/cli/commands/create-task.ts | 101 +++++++++++--
 src/core/git.ts                 |  19 +++
 src/core/html-report.ts         |   4 +-
 src/core/pr-summary.ts          |  10 +-
 src/core/ship.ts                |   9 +-
 src/core/status.ts              |  18 ++-
 src/core/task-contract.ts       |  80 ++++++++++-
 src/core/task-state.ts          |  62 +-------
 src/templates/tasks/README.md   |   2 +
 tests/create-task.test.ts       | 312 ++++++++++++++++++++++++++++++++++++++++
 tests/html-report.test.ts       |  28 ++++
 tests/init.test.ts              |   3 +
 tests/next.test.ts              |   1 +
 tests/pr-summary.test.ts        |  38 +++++
 tests/ship.test.ts              |  21 +++
 tests/status.test.ts            |   2 +
 26 files changed, 720 insertions(+), 93 deletions(-)
.agentloop/research/interview-cycle-153.md | untracked
.agentloop/research/interview-cycle-154.md | untracked
.agentloop/research/interview-cycle-155.md | untracked
.agentloop/research/interview-cycle-156.md | untracked
.agentloop/research/interview-cycle-157.md | untracked
.agentloop/research/interview-cycle-158.md | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Align generated task guidance with create-task warnings`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `135 changed file(s) detected (32 non-evidence, 103 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
