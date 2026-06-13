# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-13-08-54`
- Review readiness score: `95`/100
- Task: `Report nested untracked files precisely` (`done`) - `.agentloop/tasks/archive/2026-06-13-report-nested-untracked-files-precisely.md`
- Verification: `pass` - `.agentloop/reports/2026-06-13-08-45-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-13-08-54-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `90`/100 (weight `15`) - `90/100 task evidence present.`
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
- M `src/core/git.ts`
- M `src/core/status.ts`
- M `tests/git.test.ts`
- M `tests/next.test.ts`
- M `tests/status.test.ts`
- ?? `.agentloop/reports/2026-06-13-08-45-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-08-49-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-08-49-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-08-49-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-report-nested-untracked-files-precisely.md`

## Diff Stat

```text
.agentloop/backlog.md     |  1 +
 .agentloop/dogfood-log.md | 38 ++++++++++++++++++++++++++++++++++++++
 CHANGELOG.md              |  2 ++
 src/core/git.ts           |  5 ++++-
 src/core/status.ts        |  2 +-
 tests/git.test.ts         | 25 ++++++++++++++++++++++++-
 tests/next.test.ts        |  2 +-
 tests/status.test.ts      |  8 ++++++--
 8 files changed, 77 insertions(+), 6 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Report nested untracked files precisely`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `14 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
