# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-20-23-23`
- Review readiness score: `96`/100
- Task: `Use untracked-aware diff stats in handoffs and reports` (`in-progress`) - `.agentloop/tasks/2026-06-20-use-untracked-aware-diff-stats-in-handoffs-and-reports.md`
- Verification: `pass` - `.agentloop/reports/2026-06-20-23-18-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-20-23-23-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `21 non-evidence changed files is reviewable but not small; 40 AgentLoop evidence file(s) also present (61 total).`
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

- Medium-sized non-evidence change set; check scope carefully.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `docs/cli-reference.md`
- M `docs/html-reports.md`
- M `docs/pr-summaries.md`
- M `docs/task-contracts.md`
- M `src/cli/commands/create-task.ts`
- M `src/core/git.ts`
- M `src/core/html-report.ts`
- M `src/core/pr-summary.ts`
- M `src/core/ship.ts`
- M `src/core/task-contract.ts`
- M `src/core/task-state.ts`
- M `tests/create-task.test.ts`
- M `tests/html-report.test.ts`
- M `tests/pr-summary.test.ts`
- M `tests/ship.test.ts`
- ?? `.agentloop/research/interview-cycle-153.md`
- ?? `.agentloop/research/interview-cycle-154.md`
- ?? `.agentloop/research/interview-cycle-155.md`
- AgentLoop evidence: `40` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
.agentloop/backlog.md           |  18 +++++
 CHANGELOG.md                    |   4 +-
 DECISIONS.md                    |  18 +++++
 docs/cli-reference.md           |   6 +-
 docs/html-reports.md            |   2 +
 docs/pr-summaries.md            |   2 +
 docs/task-contracts.md          |   1 +
 src/cli/commands/create-task.ts |  61 +++++++++++++---
 src/core/git.ts                 |  15 ++++
 src/core/html-report.ts         |   4 +-
 src/core/pr-summary.ts          |  10 ++-
 src/core/ship.ts                |   9 ++-
 src/core/task-contract.ts       |  80 +++++++++++++++++++--
 src/core/task-state.ts          |  62 +----------------
 tests/create-task.test.ts       | 151 ++++++++++++++++++++++++++++++++++++++++
 tests/html-report.test.ts       |  28 ++++++++
 tests/pr-summary.test.ts        |  38 ++++++++++
 tests/ship.test.ts              |  21 ++++++
 18 files changed, 444 insertions(+), 86 deletions(-)
.agentloop/research/interview-cycle-153.md | untracked
.agentloop/research/interview-cycle-154.md | untracked
.agentloop/research/interview-cycle-155.md | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Use untracked-aware diff stats in handoffs and reports`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `62 changed file(s) detected (21 non-evidence, 41 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
