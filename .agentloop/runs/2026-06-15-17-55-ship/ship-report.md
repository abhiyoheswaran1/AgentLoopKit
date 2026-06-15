# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-15-17-55`
- Review readiness score: `96`/100
- Task: `Warn on placeholder task contracts` (`in-progress`) - `.agentloop/tasks/2026-06-15-warn-on-placeholder-task-contracts.md`
- Verification: `pass` - `.agentloop/reports/2026-06-15-17-52-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-15-17-55-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `12 changed files is reviewable but not small.`
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

- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/status.md`
- M `docs/task-contracts.md`
- M `src/cli/commands/task.ts`
- M `src/core/task-state.ts`
- M `tests/task-state.test.ts`
- ?? `.agentloop/reports/2026-06-15-17-52-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-17-55-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-17-55-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-17-55-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-15-warn-on-placeholder-task-contracts.md`

## Diff Stat

```text
CHANGELOG.md             |   1 +
 docs/cli-reference.md    |   2 +
 docs/status.md           |   4 +-
 docs/task-contracts.md   |   3 +-
 src/cli/commands/task.ts |   3 ++
 src/core/task-state.ts   |  78 +++++++++++++++++++++++++++++++++
 tests/task-state.test.ts | 111 +++++++++++++++++++++++++++++++++++++++++++++++
 7 files changed, 199 insertions(+), 3 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Warn on placeholder task contracts`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `13 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
