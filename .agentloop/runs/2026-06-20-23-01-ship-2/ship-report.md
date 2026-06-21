# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-20-23-01`
- Review readiness score: `96`/100
- Task: `Show untracked files in ship diff stat` (`in-progress`) - `.agentloop/tasks/2026-06-20-show-untracked-files-in-ship-diff-stat.md`
- Verification: `pass` - `.agentloop/reports/2026-06-20-22-54-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-20-23-01-pr-summary-2.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `13 non-evidence changed files is reviewable but not small; 27 AgentLoop evidence file(s) also present (40 total).`
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
- M `docs/task-contracts.md`
- M `src/cli/commands/create-task.ts`
- M `src/core/ship.ts`
- M `src/core/task-contract.ts`
- M `src/core/task-state.ts`
- M `tests/create-task.test.ts`
- M `tests/ship.test.ts`
- ?? `.agentloop/research/interview-cycle-153.md`
- ?? `.agentloop/research/interview-cycle-154.md`
- AgentLoop evidence: `27` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
.agentloop/backlog.md           |  12 ++++
 CHANGELOG.md                    |   3 +-
 DECISIONS.md                    |  12 ++++
 docs/cli-reference.md           |   2 +-
 docs/task-contracts.md          |   1 +
 src/cli/commands/create-task.ts |  61 +++++++++++++---
 src/core/ship.ts                |  20 +++++-
 src/core/task-contract.ts       |  80 +++++++++++++++++++--
 src/core/task-state.ts          |  62 +----------------
 tests/create-task.test.ts       | 151 ++++++++++++++++++++++++++++++++++++++++
 tests/ship.test.ts              |  21 ++++++
 11 files changed, 345 insertions(+), 80 deletions(-)
.agentloop/research/interview-cycle-153.md | untracked
.agentloop/research/interview-cycle-154.md | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Show untracked files in ship diff stat`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `41 changed file(s) detected (13 non-evidence, 28 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
