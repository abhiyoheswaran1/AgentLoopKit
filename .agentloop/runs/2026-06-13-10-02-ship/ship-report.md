# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-13-10-02`
- Review readiness score: `96`/100
- Task: `Require task context for task command verification` (`done`) - `.agentloop/tasks/archive/2026-06-13-require-task-context-for-task-command-verification.md`
- Verification: `pass` - `.agentloop/reports/2026-06-13-09-56-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-13-10-02-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `21 changed files is reviewable but not small.`
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
- M `docs/verification-reports.md`
- M `src/cli/commands/verify.ts`
- M `tests/verification.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-09-59-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-09-56-verification-report.md`
- ?? `.agentloop/reports/2026-06-13-09-59-ship-report.md`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/score.json`
- ?? `.agentloop/runs/2026-06-13-09-59-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-13-09-59-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-09-59-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-09-59-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-require-task-context-for-task-command-verification.md`

## Diff Stat

```text
.agentloop/backlog.md        |   1 +
 .agentloop/dogfood-log.md    |  25 +++++++
 CHANGELOG.md                 |   1 +
 README.md                    |   4 +-
 docs/cli-reference.md        |   3 +-
 docs/verification-reports.md |   3 +-
 src/cli/commands/verify.ts   |  65 ++++++++++++----
 tests/verification.test.ts   | 175 ++++++++++++++++++++++++++++++++++++++++++-
 8 files changed, 255 insertions(+), 22 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Require task context for task command verification`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `22 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
