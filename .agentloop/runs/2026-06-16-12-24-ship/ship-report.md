# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-16-12-24`
- Review readiness score: `92`/100
- Task: `Run post-verification gates explicitly from verify` (`in-progress`) - `.agentloop/tasks/2026-06-16-run-post-verification-gates-explicitly-from-verify.md`
- Verification: `pass` - `.agentloop/reports/2026-06-16-12-24-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-16-12-24-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `44 changed files is broad for one review.`
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
- M `AGENTLOOP.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/task-contracts.md`
- M `docs/verification-reports.md`
- M `src/cli/commands/verify.ts`
- M `src/core/verification.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/tasks/README.md`
- M `tests/verification.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-12-22-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-12-23-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-12-20-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-12-22-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-12-22-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-12-23-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-12-24-verification-report.md`
- ?? `.agentloop/research/interview-cycle-117.md`
- ?? `.agentloop/runs/2026-06-16-12-21-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-21-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-21-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-12-22-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-22-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-12-22-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-22-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-12-22-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-12-22-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-12-23-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-23-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-12-23-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-23-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-12-23-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-12-23-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-12-23-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-23-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-23-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-12-24-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-12-24-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-12-24-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-run-post-verification-gates-explicitly-from-verify.md`

## Diff Stat

```text
.agentloop/backlog.md             |   6 ++
 AGENTLOOP.md                      |   2 +-
 CHANGELOG.md                      |   1 +
 DECISIONS.md                      |   2 +
 README.md                         |   1 +
 docs/cli-reference.md             |   9 +-
 docs/task-contracts.md            |   2 +-
 docs/verification-reports.md      |   8 +-
 src/cli/commands/verify.ts        |  29 +++++-
 src/core/verification.ts          | 180 +++++++++++++++++++++++++++++++-----
 src/templates/harness/commands.md |   2 +-
 src/templates/root/AGENTLOOP.md   |   2 +-
 src/templates/tasks/README.md     |   2 +-
 tests/verification.test.ts        | 188 ++++++++++++++++++++++++++++++++++++++
 14 files changed, 397 insertions(+), 37 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Run post-verification gates explicitly from verify`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `45 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
