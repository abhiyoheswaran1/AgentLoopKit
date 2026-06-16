# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-16-07-55`
- Review readiness score: `92`/100
- Task: `Prevent same-minute evidence artifact overwrites` (`done`) - `.agentloop/tasks/archive/2026-06-16-prevent-same-minute-evidence-artifact-overwrites-2.md`
- Verification: `pass` - `.agentloop/reports/2026-06-16-07-54-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-16-07-55-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `42 changed files is broad for one review.`
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

- Large change set; consider splitting before review.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/ci-summary.md`
- M `docs/cli-reference.md`
- M `docs/release-notes.md`
- M `docs/verification-reports.md`
- M `src/core/ci-summary.ts`
- M `src/core/release-notes.ts`
- M `src/core/verification.ts`
- M `tests/ci-summary.test.ts`
- M `tests/release-notes.test.ts`
- M `tests/verification.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-07-48-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-07-49-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-07-50-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-07-47-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-07-49-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-07-54-verification-report.md`
- ?? `.agentloop/research/interview-cycle-113.md`
- ?? `.agentloop/runs/2026-06-16-07-47-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-47-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-47-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-07-48-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-48-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-07-48-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-48-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-07-49-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-49-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-07-49-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-49-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-07-49-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-07-49-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-07-50-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-50-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-07-50-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-50-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-07-55-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-07-55-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-07-55-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-16-prevent-same-minute-evidence-artifact-overwrites-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-prevent-same-minute-evidence-artifact-overwrites.md`

## Diff Stat

```text
.agentloop/backlog.md        |  6 +++++
 .agentloop/dogfood-log.md    | 54 ++++++++++++++++++++++++++++++++++++++++++++
 CHANGELOG.md                 |  1 +
 docs/ci-summary.md           |  2 ++
 docs/cli-reference.md        |  6 +++++
 docs/release-notes.md        |  2 ++
 docs/verification-reports.md |  2 ++
 src/core/ci-summary.ts       | 32 +++++++++++++-------------
 src/core/release-notes.ts    | 32 +++++++++++++-------------
 src/core/verification.ts     |  4 ++--
 tests/ci-summary.test.ts     | 43 +++++++++++++++++++++++++++++++++++
 tests/release-notes.test.ts  | 30 ++++++++++++++++++++++++
 tests/verification.test.ts   | 51 +++++++++++++++++++++++++++++++++++++++++
 13 files changed, 231 insertions(+), 34 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Prevent same-minute evidence artifact overwrites`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `43 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
